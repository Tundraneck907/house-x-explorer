import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { buildHouse, type HouseModel } from './model';
import type { LayerRT } from './build/common';
import { layersOf, roofLayersFor, WALL_LAYERS, ASSEMBLY_BY_ID, LAYER_BY_ID } from '../data/catalog';
import { actions, cam, getState, subscribe, type State } from '../store';

type Vis = 'normal' | 'ghost' | 'hidden';
const FAMILY_SCALE = { roof: 1, wall: 0.6, floor: 0.7 } as const;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const VIEW_DIRS: Record<string, [number, number, number]> = {
  iso: [0.62, 0.42, 0.78], front: [0, 0.1, 1], right: [1, 0.1, 0], back: [0, 0.1, -1], left: [-1, 0.1, 0], top: [0.001, 1, 0.001],
};

export class Engine {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  house: HouseModel;
  private ghostMat = new THREE.MeshBasicMaterial({ color: 0x6aa9c9, transparent: true, opacity: 0.05, depthWrite: false });
  private plane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);
  private raycaster = new THREE.Raycaster();
  private el: HTMLElement;
  private ro: ResizeObserver;
  private dirty = true;
  private raf = 0;
  private last = performance.now();
  private tween: null | { t0: number; dur: number; p0: THREE.Vector3; p1: THREE.Vector3; c0: THREE.Vector3; c1: THREE.Vector3 } = null;
  private vis = new Map<string, Vis>();
  private normalMeshes: THREE.Mesh[] = [];
  private ghostMeshes: THREE.Mesh[] = [];
  private cur = new Map<THREE.Object3D, THREE.Vector3>();
  private target = new Map<THREE.Object3D, THREE.Vector3>();
  private prev: State | null = null;
  private unsub: () => void;
  private down: { x: number; y: number; t: number; multi: boolean } | null = null;
  private pointers = new Set<number>();
  private allMaterials = new Set<THREE.Material>();
  private lastCfg = '';
  private hoverRaf = 0;
  private hoverEvt: PointerEvent | null = null;
  private disposed = false;

  constructor(el: HTMLElement) {
    this.el = el;
    const r = (this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }));
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.toneMapping = THREE.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.0;
    r.localClippingEnabled = true;
    r.domElement.style.touchAction = 'none';
    r.domElement.style.display = 'block';
    el.appendChild(r.domElement);

    this.scene.background = new THREE.Color(0x12151a);
    this.scene.fog = new THREE.Fog(0x12151a, 60, 160);
    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;
    this.scene.add(new THREE.HemisphereLight(0xbcd4ff, 0x1c2026, 0.5));
    const sun = new THREE.DirectionalLight(0xfff0dc, 2.4);
    sun.position.set(14, 24, 13);
    sun.castShadow = true;
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
    const sc = sun.shadow.camera;
    sc.left = -17; sc.right = 17; sc.top = 17; sc.bottom = -17; sc.near = 1; sc.far = 80;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    this.scene.add(sun);
    const fill = new THREE.DirectionalLight(0x7fb4ff, 0.6);
    fill.position.set(-16, 9, -12);
    this.scene.add(fill);

    this.camera = new THREE.PerspectiveCamera(34, 1, 0.1, 400);
    this.controls = new OrbitControls(this.camera, r.domElement);
    const c = this.controls;
    c.enableDamping = true; c.dampingFactor = 0.09;
    c.screenSpacePanning = true;
    c.minDistance = 1.5; c.maxDistance = 90;
    c.maxPolarAngle = Math.PI * 0.499;
    c.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    c.mouseButtons = { LEFT: THREE.MOUSE.ROTATE, MIDDLE: THREE.MOUSE.DOLLY, RIGHT: THREE.MOUSE.PAN };
    c.listenToKeyEvents(window as unknown as HTMLElement);
    c.keyPanSpeed = 14;
    c.addEventListener('start', () => { this.tween = null; });
    c.addEventListener('change', () => { this.dirty = true; });

    this.house = buildHouse();
    this.scene.add(this.house.root);
    this.house.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => this.allMaterials.add(mm));
      if (m.isMesh) m.userData.baseMat ??= m.material;
    });
    this.allMaterials.add(this.ghostMat);
    this.allMaterials.forEach((m) => { m.userData.baseSide = (m as THREE.MeshStandardMaterial).side; (m as THREE.MeshStandardMaterial).clipShadows = true; });

    const d = r.domElement;
    d.addEventListener('pointerdown', this.onDown);
    d.addEventListener('pointerup', this.onUp);
    d.addEventListener('pointercancel', this.onCancel);
    d.addEventListener('pointermove', this.onMove);
    d.addEventListener('pointerleave', () => actions.setHover(null));
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(el);
    this.resize();

    cam.reset = () => this.flyToBox(this.houseBox(), 'iso', true);
    cam.view = (v) => this.flyToBox(this.currentBox(), v, true);
    cam.frame = () => this.flyToBox(this.currentBox(), null, true);

    this.sync(getState(), null);
    this.snapCamera(this.houseBox(), 'iso');
    this.unsub = subscribe(() => { const s = getState(); this.sync(s, this.prev); });
    this.loop();
    (window as unknown as { __engine: Engine }).__engine = this;
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.unsub();
    this.ro.disconnect();
    this.controls.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  // ---------- state -> scene ----------
  private setMembers(s: State): Set<string> {
    return new Set(s.assembly ? layersOf(s.assembly, s.roofConfig) : []);
  }

  private visOf(l: LayerRT, s: State, members: Set<string>): Vis {
    if (!l.active || s.hidden[l.id]) return 'hidden';
    if (s.solo) {
      if (l.id === s.solo) return 'normal';
      return s.ghost && members.has(l.id) ? 'ghost' : 'hidden';
    }
    if (s.assembly && s.isolate) return members.has(l.id) ? 'normal' : s.ghost ? 'ghost' : 'hidden';
    return 'normal';
  }

  private rankOf(l: LayerRT, s: State, members: Set<string>): number {
    if (l.family === 'explicit') return l.rank;
    const order = l.family === 'roof' ? roofLayersFor(s.roofConfig) : l.family === 'wall' ? WALL_LAYERS : ASSEMBLY_BY_ID.floor.layers;
    const m = order.filter((id) => members.has(id));
    const i = m.indexOf(l.id);
    return i < 0 ? 0 : m.length - 1 - i;
  }

  sync(s: State, prev: State | null) {
    this.prev = s;
    if (s.roofConfig !== this.lastCfg) {
      this.lastCfg = s.roofConfig;
      this.house.setRoofConfig(s.roofConfig);
    }
    const members = this.setMembers(s);
    this.normalMeshes = []; this.ghostMeshes = [];
    const selLayer = s.layer;
    for (const l of this.house.layers.values()) {
      const v = this.visOf(l, s, members);
      this.vis.set(l.id, v);
      l.group.visible = v !== 'hidden';
      const asmHL = !!s.assembly && !selLayer && s.isolate === false ? false : false;
      void asmHL;
      for (const m of l.meshes) {
        const base = m.userData.baseMat as THREE.MeshStandardMaterial;
        if (v === 'ghost') {
          m.material = this.ghostMat; m.castShadow = false;
          this.ghostMeshes.push(m);
        } else if (v === 'normal') {
          m.material = base;
          m.castShadow = base.opacity >= 1;
          this.normalMeshes.push(m);
          const hl = this.highlight(l.id, s, members);
          base.emissive.setHex(hl ? hl[0] : base.userData.baseEmissive ?? 0);
          base.emissiveIntensity = hl ? hl[1] : 1;
        }
      }
      // explode targets
      const exploding = s.exploded && !!s.assembly && members.has(l.id) && v !== 'hidden';
      const rank = exploding ? this.rankOf(l, s, members) : 0;
      const fam = l.family === 'explicit' ? l.scale : FAMILY_SCALE[l.family];
      for (const p of l.parts) {
        const t = this.target.get(p.obj) ?? new THREE.Vector3();
        t.copy(p.dir).multiplyScalar(rank * s.explodeDist * fam);
        this.target.set(p.obj, t);
        if (!this.cur.has(p.obj)) this.cur.set(p.obj, new THREE.Vector3());
      }
    }
    this.house.ground.visible = !(s.assembly && s.isolate);
    this.applySection(s);

    const camChanged = !prev || prev.assembly !== s.assembly || prev.exploded !== s.exploded || prev.isolate !== s.isolate
      || prev.roofConfig !== s.roofConfig || prev.solo !== s.solo || prev.explodeDist !== s.explodeDist && s.exploded
      || JSON.stringify(prev.hidden) !== JSON.stringify(s.hidden);
    const frameTrigger = !prev ? false : prev.assembly !== s.assembly || prev.exploded !== s.exploded
      || (prev.isolate !== s.isolate) || (prev.roofConfig !== s.roofConfig && s.assembly === 'roof');
    void camChanged;
    if (frameTrigger) this.flyToBox(this.currentBox(), null, true);
    this.dirty = true;
  }

  private highlight(id: string, s: State, members: Set<string>): [number, number] | null {
    if (s.layer === id) return [0x19b9f2, 0.7];
    if (s.hover === id) return [0x0f6a8c, 0.55];
    if (s.assembly && !s.layer && members.has(id) && s.isolate) return [0x0a3f58, 0.4];
    if (s.assembly && !s.layer && members.has(id) && !s.isolate) return [0x0d5878, 0.5];
    return null;
  }

  private applySection(s: State) {
    const sec = s.section;
    const on = sec.on;
    const n = new THREE.Vector3(sec.axis === 'x' ? 1 : 0, 0, sec.axis === 'z' ? 1 : 0);
    if (!sec.flip) n.negate();
    // keep points with n·p + c >= 0
    this.plane.normal.copy(n);
    this.plane.constant = sec.flip ? -sec.pos : sec.pos;
    const planes = on ? [this.plane] : [];
    this.allMaterials.forEach((m) => {
      const mm = m as THREE.MeshStandardMaterial;
      const had = mm.clippingPlanes?.length ?? 0;
      mm.clippingPlanes = planes;
      if (on) { if (mm.side === THREE.FrontSide) mm.side = THREE.DoubleSide; } else mm.side = m.userData.baseSide;
      if (had !== planes.length) mm.needsUpdate = true;
    });
  }

  // ---------- bounds / camera ----------
  private houseBox() {
    const b = new THREE.Box3();
    for (const l of this.house.layers.values()) if (l.active && !['fin-gutters','fnd-gravel','fnd-footing','fnd-rebar','fnd-ground-vapor'].includes(l.id)) for (const p of l.parts) b.union(p.restBox);
    return b;
  }

  currentBox(): THREE.Box3 {
    const s = getState();
    if (!s.assembly) return this.houseBox();
    const members = this.setMembers(s);
    const b = new THREE.Box3();
    const tmp = new THREE.Box3();
    for (const l of this.house.layers.values()) {
      const v = this.vis.get(l.id);
      if (!(v === 'normal' && members.has(l.id))) continue;
      for (const p of l.parts) {
        tmp.copy(p.restBox);
        const t = this.target.get(p.obj);
        if (t) tmp.translate(t);
        b.union(tmp);
      }
    }
    return b.isEmpty() ? this.houseBox() : b;
  }

  private viewFor(box: THREE.Box3, dirName: string | null) {
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 1);
    const vf = (this.camera.fov * Math.PI) / 180;
    const hf = 2 * Math.atan(Math.tan(vf / 2) * this.camera.aspect);
    const dist = (radius / Math.sin(Math.min(vf, hf) / 2)) * 1.15;
    const dir = dirName
      ? new THREE.Vector3(...VIEW_DIRS[dirName]).normalize()
      : this.camera.position.clone().sub(this.controls.target).normalize();
    return { center, pos: center.clone().add(dir.multiplyScalar(dist)) };
  }

  private snapCamera(box: THREE.Box3, dirName: string) {
    const v = this.viewFor(box, dirName);
    this.camera.position.copy(v.pos);
    this.controls.target.copy(v.center);
    this.controls.update();
  }

  flyToBox(box: THREE.Box3, dirName: string | null, animate: boolean) {
    const v = this.viewFor(box, dirName);
    if (!animate) { this.snapCamera(box, dirName ?? 'iso'); return; }
    this.tween = {
      t0: performance.now(), dur: 650, p0: this.camera.position.clone(), p1: v.pos,
      c0: this.controls.target.clone(), c1: v.center,
    };
    this.dirty = true;
  }

  private resize() {
    const w = Math.max(this.el.clientWidth, 1), h = Math.max(this.el.clientHeight, 1);
    this.renderer.setSize(w, h, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }

  // ---------- picking ----------
  pick(clientX: number, clientY: number): { id: string; ghost: boolean } | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const sec = getState().section.on;
    const test = (list: THREE.Mesh[]) => {
      for (const h of this.raycaster.intersectObjects(list, false)) {
        if (sec && this.plane.distanceToPoint(h.point) < 0) continue;
        return h.object.userData.layerId as string;
      }
      return null;
    };
    const a = test(this.normalMeshes);
    if (a) return { id: a, ghost: false };
    if (getState().ghost) {
      const g = test(this.ghostMeshes);
      if (g) return { id: g, ghost: true };
    }
    return null;
  }

  private onDown = (e: PointerEvent) => {
    this.pointers.add(e.pointerId);
    if (this.pointers.size > 1) { if (this.down) this.down.multi = true; return; }
    this.down = { x: e.clientX, y: e.clientY, t: performance.now(), multi: false };
  };
  private onCancel = (e: PointerEvent) => { this.pointers.delete(e.pointerId); this.down = null; };
  private onUp = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    const d = this.down;
    if (this.pointers.size === 0) this.down = null;
    if (!d || d.multi || e.button > 0) return;
    if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 8 || performance.now() - d.t > 600) return;
    this.tap(this.pick(e.clientX, e.clientY));
  };
  private onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || e.buttons) return;
    this.hoverEvt = e;
    if (this.hoverRaf) return;
    this.hoverRaf = requestAnimationFrame(() => {
      this.hoverRaf = 0;
      const ev = this.hoverEvt!;
      const h = this.pick(ev.clientX, ev.clientY);
      actions.setHover(h && !h.ghost ? h.id : null);
      this.renderer.domElement.style.cursor = h ? 'pointer' : 'grab';
    });
  };

  tap(hit: { id: string; ghost: boolean } | null) {
    const s = getState();
    if (!hit) { if (s.layer) actions.selectLayer(null); return; }
    const meta = LAYER_BY_ID[hit.id];
    if (!s.assembly) { actions.selectAssembly(meta.home); return; }
    const members = this.setMembers(s);
    if (hit.ghost || !members.has(hit.id)) { actions.selectAssembly(meta.home); return; }
    actions.selectLayer(s.layer === hit.id ? null : hit.id);
  }

  // ---------- loop ----------
  private loop = () => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    if (this.tween) {
      const k = Math.min((now - this.tween.t0) / this.tween.dur, 1), e = ease(k);
      this.camera.position.lerpVectors(this.tween.p0, this.tween.p1, e);
      this.controls.target.lerpVectors(this.tween.c0, this.tween.c1, e);
      if (k >= 1) this.tween = null;
      this.dirty = true;
    }
    // explode animation
    const a = 1 - Math.exp(-dt * 9);
    for (const l of this.house.layers.values()) {
      for (const p of l.parts) {
        const cur = this.cur.get(p.obj), t = this.target.get(p.obj);
        if (!cur || !t) continue;
        if (cur.distanceToSquared(t) > 1e-6) { cur.lerp(t, a); this.dirty = true; } else cur.copy(t);
        p.obj.position.copy(p.base).add(cur);
      }
    }
    if (this.controls.update()) this.dirty = true;
    if (this.dirty) { this.renderer.render(this.scene, this.camera); this.dirty = false; }
  };

  /** Test hook: current world offset of each part (used by automated tests). */
  debugOffsets(id: string) { return this.house.layers.get(id)!.parts.map((p) => p.obj.position.clone().sub(p.base).length()); }
}
