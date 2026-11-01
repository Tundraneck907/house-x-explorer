import * as THREE from 'three';
import { Acc } from '../geom';
import { L, W, Y_PLATE, OH, RAKE, TH, SIN, COS, TAN, WALL_T, MAT, LB, V, tex, updateRest, type LayerRT } from './common';
import { roofLayersFor } from '../../data/catalog';
import type { RoofConfigId } from '../../data/types';

export const TS = 0.019; // sheathing
export const TV = 0.045; // vent channel
export const TR = 0.3; // rafter depth
const TVAP = 0.003, TAIR = 0.003, TCEIL = 0.0127;
const HU = -TS - TR; // rafter underside, relative to sheathing top plane
export const ZE = W / 2 + OH;
const uPlate = (OH + HU * SIN) / COS;
export const YE = Y_PLATE - HU * COS - uPlate * SIN;
export const uMax = (h: number) => (ZE + h * SIN) / COS;
export const uAtZ = (z: number, h: number) => (ZE + h * SIN - z) / COS;
export const apexY = (h: number) => YE + ZE * TAN + h / COS;
const X0 = -L / 2 - RAKE, X1 = L / 2 + RAKE;
const XI = L / 2 - WALL_T;

/** box in slope-local coords: x along ridge, y along roof normal (h), z = -u (up-slope) */
export const sl = (a: Acc, x0: number, x1: number, u0: number, u1: number, h0: number, h1: number) =>
  a.box((x0 + x1) / 2, (h0 + h1) / 2, -(u0 + u1) / 2, x1 - x0, h1 - h0, u1 - u0);

interface Item { acc?: Acc; geo?: THREE.BufferGeometry; spec: import('../geom').MatSpec }

export function addSlopes(lb: LB, part: THREE.Object3D, items: Item[], holderY = 0) {
  for (const it of items) {
    const geo = it.geo ?? it.acc!.build();
    if (!geo) continue;
    for (const sgn of [1, -1]) {
      const wrap = new THREE.Group();
      wrap.scale.z = sgn;
      const frame = new THREE.Group();
      frame.position.set(0, YE, ZE);
      frame.rotation.x = TH;
      const holder = new THREE.Group();
      holder.position.y = holderY;
      frame.add(holder);
      wrap.add(frame);
      part.add(wrap);
      lb.meshGeo(holder, geo, it.spec);
      lb.rt.holders.push(holder);
    }
  }
}

const seamXs = () => { const a: number[] = []; for (let x = X0 + 0.2; x < X1 - 0.1; x += 0.4) a.push(x); return a; };
const ribXs = () => { const a: number[] = []; for (let x = X0 + 0.15; x < X1 - 0.05; x += 0.3) a.push(x); return a; };
const rafterXs = () => Array.from({ length: 21 }, (_, k) => -L / 2 + 0.6 * k);

function zigzag(xs: number[], tp: number, hs: number, baseHalf: number, topHalf: number, u0: number, u1: number) {
  const o: [number, number][] = [[X0, 0]];
  o.push([X0, tp]);
  for (const x of xs) o.push([x - baseHalf, tp], [x - topHalf, hs], [x + topHalf, hs], [x + baseHalf, tp]);
  o.push([X1, tp], [X1, 0]);
  const a = new Acc();
  a.poly(o, [], u1 - u0, -u1);
  return a;
}

const part0 = (lb: LB) => lb.part(V(0, 1, 0));

export function buildRoof(): LayerRT[] {
  const t = tex();
  const out: LayerRT[] = [];
  const top = (id: string, items: () => Item[]) => {
    const lb = new LB(id, 'roof');
    addSlopes(lb, part0(lb), items());
    out.push(lb.finish());
    return lb;
  };
  const uTop = (h: number) => uMax(h) - 0.0;

  top('roof-ss-panels', () => [{ acc: zigzag(seamXs(), 0.004, 0.036, 0.016, 0.009, -0.03, uTop(0.02)), spec: { ...MAT.metalRoof } }]);
  top('roof-ef-panels', () => [{ acc: zigzag(ribXs(), 0.004, 0.032, 0.036, 0.016, -0.03, uTop(0.02)), spec: { ...MAT.metalRoof, rough: 0.45 } }]);
  top('roof-shingles', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.004), 0, 0.004);
    const e = 0.145;
    for (let k = 0, u = 0; u < uTop(0.008) - 0.02; k++, u += e) sl(a, X0, X1, u, Math.min(u + e, uTop(0.008)), 0.004, 0.009 + (k % 2) * 0.002);
    return [{ acc: a, spec: { color: 0x474a50, rough: 0.95, map: t.shingle } }];
  });
  top('roof-epdm', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.002), 0, 0.004);
    for (let x = X0 + 3; x < X1; x += 3) sl(a, x - 0.04, x + 0.04, 0.0, uTop(0.002), 0.004, 0.0055);
    return [{ acc: a, spec: { color: 0x1a1c1f, rough: 0.7 } }];
  });
  top('roof-mb-cap', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.003), 0, 0.005);
    for (let x = X0 + 1; x < X1; x += 1) sl(a, x - 0.04, x + 0.04, 0, uTop(0.003), 0.005, 0.0068);
    return [{ acc: a, spec: { color: 0x555a61, rough: 1 } }];
  });
  top('roof-mb-base', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.002), 0, 0.004);
    for (let x = X0 + 0.5; x < X1; x += 1) sl(a, x - 0.04, x + 0.04, 0, uTop(0.002), 0.004, 0.0055);
    return [{ acc: a, spec: { color: 0x25272a, rough: 0.6 } }];
  });

  top('roof-ss-clips', () => {
    const a = new Acc();
    for (const x of seamXs()) for (let u = 0.35; u < uTop(0.02) - 0.2; u += 0.75) {
      sl(a, x - 0.025, x + 0.025, u - 0.02, u + 0.02, 0, 0.003);
      sl(a, x - 0.003, x + 0.003, u - 0.02, u + 0.02, 0.003, 0.03);
      sl(a, x - 0.012, x + 0.012, u - 0.02, u + 0.02, 0.027, 0.03);
    }
    return [{ acc: a, spec: { color: 0xc9ced4, rough: 0.35, metal: 0.9 } }];
  });
  top('roof-ef-screws', () => {
    const metal = new Acc(), rubber = new Acc();
    for (const x of ribXs()) for (let u = 0.2; u < uTop(0.02) - 0.1; u += 0.6) {
      metal.cyl(x, 0.002, -u, 0.003, 0.07, 5);
      metal.cyl(x, 0.0375, -u, 0.011, 0.007, 6);
      rubber.cyl(x, 0.0335, -u, 0.015, 0.003, 8);
    }
    return [{ acc: metal, spec: { color: 0xb7bcc2, rough: 0.35, metal: 0.9 } }, { acc: rubber, spec: { color: 0x101113, rough: 0.7 } }];
  });
  top('roof-shingle-nails', () => {
    const a = new Acc();
    const e = 0.145;
    for (let k = 1; k < 34; k += 3) for (let x = X0 + 0.25; x < X1 - 0.2; x += 0.4)
      a.cyl(x, -0.008, -(k * e + 0.1), 0.0025, 0.04, 4).cyl(x, 0.011, -(k * e + 0.1), 0.0085, 0.003, 6);
    return [{ acc: a, spec: { color: 0xd1d5da, rough: 0.35, metal: 0.9 } }];
  });
  top('roof-epdm-adhesive', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.002), 0, 0.003);
    return [{ acc: a, spec: { color: 0xe3b84a, rough: 0.3, opacity: 0.85 } }];
  });
  top('roof-cover-board', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.006), 0, 0.0127);
    return [{ acc: a, spec: { color: 0x8c8e86, rough: 0.95 } }];
  });
  top('roof-underlayment', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uTop(0.0015), 0, 0.003);
    return [{ acc: a, spec: { color: 0x66707e, rough: 0.75 } }];
  });
  top('roof-ice-water', () => {
    const a = new Acc();
    sl(a, X0, X1, 0, uAtZ(W / 2 - 0.61, 0.002), 0, 0.004);
    return [{ acc: a, spec: { color: 0x15171b, rough: 0.3, metal: 0.1 } }];
  });

  // ---- deck and below ----
  {
    const lb = new LB('roof-sheathing', 'roof');
    const a = new Acc();
    sl(a, X0, X1, 0, uMax(-TS / 2), -TS, 0);
    addSlopes(lb, part0(lb), [{ acc: a, spec: { ...MAT.osb, map: t.osb } }]);
    out.push(lb.finish());
  }
  {
    const lb = new LB('roof-vent-channels', 'roof');
    const vol = new Acc(), plate = new Acc();
    const xs = rafterXs();
    const hm = -TS - TV / 2;
    const u0 = uAtZ(W / 2 - 0.04, hm), u1 = uMax(hm) - 0.18;
    for (let k = 0; k < xs.length - 1; k++) {
      const a = xs[k] + 0.0225 + 0.003, b = xs[k + 1] - 0.0225 - 0.003;
      sl(vol, a, b, u0, u1, -TV, 0);
      sl(plate, a, b, u0, u1, -TV - 0.002, -TV);
    }
    addSlopes(lb, part0(lb), [
      { acc: vol, spec: { color: 0x58c8ff, opacity: 0.32, rough: 0.2 } },
      { acc: plate, spec: { color: 0xd8eef8, rough: 0.5 } },
    ], -TS);
    out.push(lb.finish());
  }
  {
    const lb = new LB('roof-rafters', 'roof');
    const a = new Acc();
    const uE = (h: number) => uMax(h) - 0.03;
    for (const x of rafterXs()) {
      sl(a, x - 0.0225, x + 0.0225, 0, uE(-0.0225), -0.045, 0);
      sl(a, x - 0.0055, x + 0.0055, 0, uE(-0.15), -0.255, -0.045);
      sl(a, x - 0.0225, x + 0.0225, 0, uE(-0.2775), -TR, -0.255);
    }
    for (const sx of [-1, 1]) sl(a, sx * (L / 2 + RAKE - 0.019) - 0.019, sx * (L / 2 + RAKE - 0.019) + 0.019, 0, uE(-0.15), -TR, 0);
    const p = part0(lb);
    addSlopes(lb, p, [{ acc: a, spec: { ...MAT.wood } }], -TS);
    const ridge = new Acc();
    ridge.box(0, apexY(-TS) - 0.17, 0, L + 2 * RAKE - 0.05, 0.34, 0.045);
    lb.mesh(p, ridge, { ...MAT.woodDark });
    out.push(lb.finish());
  }
  {
    const lb = new LB('roof-insulation', 'roof');
    const a = new Acc();
    const xs = rafterXs();
    const hAbs = -TS - TV - (TR - TV) / 2;
    const u0 = uAtZ(W / 2 - 0.05, hAbs), u1 = uMax(hAbs) - 0.03;
    for (let k = 0; k < xs.length - 1; k++) sl(a, xs[k] + 0.0055 + 0.002, xs[k + 1] - 0.0055 - 0.002, u0, u1, -(TR - TV), 0);
    addSlopes(lb, part0(lb), [{ acc: a, spec: { ...MAT.pink } }], -TS - TV);
    out.push(lb.finish());
  }
  const inner = (id: string, thick: number, holderY: number, spec: import('../geom').MatSpec, tape = false) => {
    const lb = new LB(id, 'roof');
    const a = new Acc();
    const hm = holderY - thick / 2;
    sl(a, -XI, XI, uAtZ(W / 2 - WALL_T, hm), uMax(hm) - 0.02, -thick, 0);
    const items: Item[] = [{ acc: a, spec }];
    if (tape) {
      const tp = new Acc();
      for (let x = -XI + 1.2; x < XI - 0.5; x += 1.2) sl(tp, x - 0.03, x + 0.03, uAtZ(W / 2 - WALL_T, hm), uMax(hm) - 0.02, -thick - 0.0015, 0.0005);
      items.push({ acc: tp, spec: { color: 0xfff1b8, rough: 0.5 } });
    }
    addSlopes(lb, part0(lb), items, holderY);
    out.push(lb.finish());
  };
  inner('roof-vapor', TVAP, -TS - TR, { color: 0x6fdc9a, opacity: 0.55, rough: 0.4, side: THREE.DoubleSide });
  inner('roof-air', TAIR, -TS - TR - TVAP, { color: 0xffa24a, opacity: 0.55, rough: 0.4, side: THREE.DoubleSide }, true);
  inner('roof-ceiling', TCEIL, -TS - TR - TVAP - TAIR, { ...MAT.drywall });

  return out;
}

// ---- roof configuration relayout (moves layers; never rebuilds geometry) ----
const THICK: Record<string, number> = {
  'roof-ice-water': 0.004, 'roof-underlayment': 0.003, 'roof-ss-panels': 0.04, 'roof-ef-panels': 0.036,
  'roof-shingles': 0.011, 'roof-epdm': 0.004, 'roof-mb-cap': 0.005, 'roof-mb-base': 0.004,
  'roof-epdm-adhesive': 0.003, 'roof-cover-board': 0.0127,
};
const STACKS: Record<RoofConfigId, { id: string; through?: string }[]> = {
  'standing-seam': [{ id: 'roof-ice-water' }, { id: 'roof-underlayment' }, { id: 'roof-ss-panels', through: 'roof-ss-clips' }],
  'exposed-fastener': [{ id: 'roof-ice-water' }, { id: 'roof-underlayment' }, { id: 'roof-ef-panels', through: 'roof-ef-screws' }],
  shingles: [{ id: 'roof-ice-water' }, { id: 'roof-underlayment' }, { id: 'roof-shingles', through: 'roof-shingle-nails' }],
  epdm: [{ id: 'roof-cover-board' }, { id: 'roof-epdm-adhesive' }, { id: 'roof-epdm' }],
  'mod-bit': [{ id: 'roof-cover-board' }, { id: 'roof-mb-base' }, { id: 'roof-mb-cap' }],
};

export function layoutRoof(layers: Map<string, LayerRT>, cfg: RoofConfigId): number {
  const active = new Set(roofLayersFor(cfg));
  for (const l of layers.values()) if (l.family === 'roof') l.active = active.has(l.id);
  let h = 0;
  const setY = (id: string, y: number) => layers.get(id)!.holders.forEach((o) => (o.position.y = y));
  for (const s of STACKS[cfg]) {
    setY(s.id, h);
    if (s.through) setY(s.through, h);
    h += THICK[s.id];
  }
  // the ice barrier only covers the eave strip, but underlayment sits above it everywhere
  for (const l of layers.values()) l.onConfig?.(h, cfg);
  for (const l of layers.values()) if (l.family === 'roof') {
    l.group.updateMatrixWorld(true);
    l.parts.forEach(updateRest);
  }
  return h;
}
