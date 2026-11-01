import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const unitBox = new THREE.BoxGeometry(1, 1, 1);
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();

const prep = (g: THREE.BufferGeometry) => {
  const out = g.index ? g.toNonIndexed() : g;
  for (const k of Object.keys(out.attributes)) if (!['position', 'normal', 'uv'].includes(k)) out.deleteAttribute(k);
  if (!out.attributes.uv) out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(out.attributes.position.count * 2), 2));
  return out;
};

/** Collects many primitives and merges them into one geometry (one draw call per layer/material). */
export class Acc {
  private geos: THREE.BufferGeometry[] = [];
  get empty() { return this.geos.length === 0; }

  /** Box centred at (cx,cy,cz) with size (sx,sy,sz); UVs are in metres so textures keep a physical scale. */
  box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, rx = 0, ry = 0, rz = 0) {
    if (sx <= 0 || sy <= 0 || sz <= 0) return this;
    const g = prep(unitBox.clone());
    const uv = g.attributes.uv as THREE.BufferAttribute;
    for (let i = 0; i < uv.count; i++) {
      const face = Math.floor(i / 4);
      const [a, b] = face < 2 ? [sz, sy] : face < 4 ? [sx, sz] : [sx, sy];
      uv.setXY(i, uv.getX(i) * a, uv.getY(i) * b);
    }
    _q.setFromEuler(_e.set(rx, ry, rz));
    _m.compose(_p.set(cx, cy, cz), _q, _s.set(sx, sy, sz));
    g.applyMatrix4(_m);
    this.geos.push(g);
    return this;
  }

  cyl(cx: number, cy: number, cz: number, radius: number, height: number, seg = 8, rx = 0, ry = 0, rz = 0, radiusTop?: number) {
    const g = prep(new THREE.CylinderGeometry(radiusTop ?? radius, radius, height, seg));
    _q.setFromEuler(_e.set(rx, ry, rz));
    _m.compose(_p.set(cx, cy, cz), _q, _s.set(1, 1, 1));
    g.applyMatrix4(_m);
    this.geos.push(g);
    return this;
  }

  /** Add any geometry with an optional transform. */
  add(geo: THREE.BufferGeometry, matrix?: THREE.Matrix4) {
    const g = prep(geo.clone());
    if (matrix) g.applyMatrix4(matrix);
    this.geos.push(g);
    return this;
  }

  /** Polygon (with optional holes) in the XY plane extruded along +Z by `depth`, then translated to z0. */
  poly(outline: [number, number][], holes: [number, number][][], depth: number, z0 = 0) {
    const shape = new THREE.Shape(outline.map(([x, y]) => new THREE.Vector2(x, y)));
    for (const h of holes) shape.holes.push(new THREE.Path(h.map(([x, y]) => new THREE.Vector2(x, y))));
    const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 1 });
    g.translate(0, 0, z0);
    return this.add(g);
  }

  build(): THREE.BufferGeometry | null {
    if (!this.geos.length) return null;
    const merged = mergeGeometries(this.geos, false);
    this.geos.forEach((g) => g.dispose());
    this.geos = [];
    merged.computeBoundingSphere();
    return merged;
  }
}

export interface MatSpec {
  color: number;
  rough?: number;
  metal?: number;
  opacity?: number;
  map?: THREE.Texture | null;
  bump?: THREE.Texture | null;
  emissive?: number;
  side?: THREE.Side;
}

export const makeMaterial = (s: MatSpec) => {
  const m = new THREE.MeshStandardMaterial({
    color: s.color,
    roughness: s.rough ?? 0.8,
    metalness: s.metal ?? 0,
    transparent: (s.opacity ?? 1) < 1,
    opacity: s.opacity ?? 1,
    map: s.map ?? null,
    bumpMap: s.bump ?? null,
    bumpScale: 1.5,
    side: s.side ?? THREE.FrontSide,
    emissive: s.emissive ?? 0x000000,
  });
  if (m.transparent) m.depthWrite = false;
  m.userData.baseEmissive = m.emissive.getHex();
  return m;
};

const canvasTex = (w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat: [number, number], srgb = true) => {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

let cache: Record<string, THREE.Texture> = {};
export const textures = {
  /** one 0.2 m lap-siding board per tile (UVs in metres) */
  siding() {
    return (cache.siding ??= canvasTex(32, 128, (g) => {
      const grd = g.createLinearGradient(0, 0, 0, 128);
      grd.addColorStop(0, '#ffffff'); grd.addColorStop(0.9, '#cfcfcf'); grd.addColorStop(1, '#6e6e6e');
      g.fillStyle = grd; g.fillRect(0, 0, 32, 128);
      g.fillStyle = '#3a3a3a'; g.fillRect(0, 124, 32, 4);
    }, [0.5, 5]));
  },
  siddingBump() {
    return (cache.sidingBump ??= canvasTex(32, 128, (g) => {
      g.fillStyle = '#bbb'; g.fillRect(0, 0, 32, 128);
      g.fillStyle = '#000'; g.fillRect(0, 120, 32, 8);
    }, [0.5, 5], false));
  },
  osb() {
    return (cache.osb ??= canvasTex(256, 256, (g) => {
      g.fillStyle = '#d8b878'; g.fillRect(0, 0, 256, 256);
      let seed = 7;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 420; i++) {
        const l = 30 + rnd() * 50, w = 6 + rnd() * 8, v = 150 + Math.floor(rnd() * 80);
        g.fillStyle = `rgb(${v},${Math.floor(v * 0.8)},${Math.floor(v * 0.5)})`;
        g.save(); g.translate(rnd() * 256, rnd() * 256); g.rotate((rnd() - 0.5) * 1.2);
        g.fillRect(-l / 2, -w / 2, l, w); g.restore();
      }
    }, [0.8, 0.8]));
  },
  shingle() {
    return (cache.shingle ??= canvasTex(256, 64, (g) => {
      g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 64);
      g.fillStyle = 'rgba(0,0,0,0.55)';
      for (let x = 0; x <= 256; x += 32) g.fillRect(x, 0, 2, 40);
      g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(0, 40, 256, 24);
    }, [1 / 1.0, 1 / 0.145]));
  },
  concrete() {
    return (cache.concrete ??= canvasTex(128, 128, (g) => {
      g.fillStyle = '#b8b8b4'; g.fillRect(0, 0, 128, 128);
      let seed = 3;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 900; i++) {
        const v = 150 + Math.floor(rnd() * 70);
        g.fillStyle = `rgb(${v},${v},${v - 4})`;
        g.fillRect(rnd() * 128, rnd() * 128, 2 + rnd() * 3, 2 + rnd() * 3);
      }
    }, [0.5, 0.5]));
  },
  planks() {
    return (cache.planks ??= canvasTex(256, 128, (g) => {
      let seed = 5;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let r = 0; r < 4; r++) {
        const v = 168 + Math.floor(rnd() * 28);
        g.fillStyle = `rgb(${v},${Math.floor(v * 0.72)},${Math.floor(v * 0.45)})`;
        g.fillRect(0, r * 32, 256, 32);
        for (let k = 0; k < 36; k++) { g.fillStyle = `rgba(90,50,20,${0.05 + rnd() * 0.08})`; g.fillRect(rnd() * 256, r * 32 + rnd() * 30, 20 + rnd() * 60, 1); }
        g.fillStyle = 'rgba(40,22,8,0.75)'; g.fillRect(0, r * 32, 256, 1.5);
        g.fillRect(rnd() * 256, r * 32, 1.5, 32);
      }
    }, [1 / 2, 1 / 0.72]));
  },
  gravel() {
    return (cache.gravel ??= canvasTex(128, 128, (g) => {
      g.fillStyle = '#7d7a74'; g.fillRect(0, 0, 128, 128);
      let seed = 11;
      const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (let i = 0; i < 700; i++) {
        const v = 90 + Math.floor(rnd() * 110);
        g.fillStyle = `rgb(${v},${v - 3},${v - 8})`;
        g.beginPath(); g.arc(rnd() * 128, rnd() * 128, 1.5 + rnd() * 3, 0, 7); g.fill();
      }
    }, [0.5, 0.5]));
  },
};
