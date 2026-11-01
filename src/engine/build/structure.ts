import * as THREE from 'three';
import { Acc } from '../geom';
import { L, W, WALL_T, MAT, LB, V, tex, type LayerRT } from './common';
import { textures } from '../geom';

// stem-wall centre line (stem outer face aligned with framing outer face)
const CX = L / 2 - 0.2102, CZ = W / 2 - 0.2102;
const STEM_TOP = 0.404;

/** Rectangular ring centred on (±cx, ±cz) lines with the given width. */
export function ring(a: Acc, cx: number, cz: number, w: number, y0: number, y1: number, sides: ('f' | 'b' | 'l' | 'r')[] = ['f', 'b', 'l', 'r']) {
  const h = y1 - y0, yc = (y0 + y1) / 2;
  if (sides.includes('f')) a.box(0, yc, cz, 2 * cx + w, h, w);
  if (sides.includes('b')) a.box(0, yc, -cz, 2 * cx + w, h, w);
  if (sides.includes('r')) a.box(cx, yc, 0, w, h, 2 * cz - w);
  if (sides.includes('l')) a.box(-cx, yc, 0, w, h, 2 * cz - w);
}
const SIDE_DIRS: { s: 'f' | 'b' | 'l' | 'r'; n: [number, number, number] }[] = [
  { s: 'f', n: [0, 0, 1] }, { s: 'b', n: [0, 0, -1] }, { s: 'r', n: [1, 0, 0] }, { s: 'l', n: [-1, 0, 0] },
];

export function buildFoundation(): LayerRT[] {
  const t = tex();
  const out: LayerRT[] = [];
  const single = (id: string, dir: THREE.Vector3, rank: number, scale: number, fill: (a: Acc, b: Acc) => void, spec: import('../geom').MatSpec, spec2?: import('../geom').MatSpec) => {
    const lb = new LB(id, 'explicit', rank, scale);
    const p = lb.part(dir);
    const a = new Acc(), b = new Acc();
    fill(a, b);
    lb.mesh(p, a, spec);
    if (spec2) lb.mesh(p, b, spec2);
    out.push(lb.finish());
  };
  const sided = (id: string, rank: number, scale: number, fill: (a: Acc, s: 'f' | 'b' | 'l' | 'r') => void, spec: import('../geom').MatSpec) => {
    const lb = new LB(id, 'explicit', rank, scale);
    for (const d of SIDE_DIRS) {
      const a = new Acc();
      fill(a, d.s);
      lb.mesh(lb.part(V(...d.n)), a, spec);
    }
    out.push(lb.finish());
  };
  sided('fnd-insulation', 3, 0.7, (a, s) => ring(a, CX + 0.1 + 0.004 + 0.0375, CZ + 0.1 + 0.004 + 0.0375, 0.075, -1.15, 0.4, [s]), { color: 0x59b4e8, rough: 0.6 });
  sided('fnd-damp', 2, 0.7, (a, s) => ring(a, CX + 0.102, CZ + 0.102, 0.004, -1.15, STEM_TOP, [s]), { color: 0x1c1d20, rough: 0.5 });
  single('fnd-stem', V(0, 1, 0), 0, 1, (a) => ring(a, CX, CZ, 0.2, -1.15, STEM_TOP), { ...MAT.concrete, map: t.concrete });
  single('fnd-footing', V(0, -1, 0), 1, 0.8, (a) => ring(a, CX, CZ, 0.6, -1.4, -1.15), { ...MAT.concrete, map: t.concrete });
  single('fnd-gravel', V(0, -1, 0), 2, 0.8, (a) => a.box(0, -1.5, 0, L + 1.8, 0.2, W + 1.8), { color: 0xa09d95, rough: 1, map: t.gravel });
  single('fnd-ground-vapor', V(0, 1, 0), 0.6, 0.8, (a) => a.box(0, 0.002, 0, 2 * (CX - 0.1) - 0.01, 0.004, 2 * (CZ - 0.1) - 0.01),
    { color: 0xd3e6f2, opacity: 0.6, rough: 0.3, side: THREE.DoubleSide });
  single('fnd-rebar', V(0, 1, 0), 1.2, 0.8, (a, anchors) => {
    for (const y of [-1.33, -1.23]) for (const off of [-0.18, 0.18]) ring(a, CX + off, CZ + off, 0.016, y - 0.008, y + 0.008);
    for (const y of [-0.6, 0.2]) ring(a, CX, CZ, 0.016, y - 0.008, y + 0.008);
    const bars = (x: number, z: number) => a.cyl(x, -0.475, z, 0.008, 1.65, 6);
    const bolts = (x: number, z: number) => {
      anchors.cyl(x, 0.225, z, 0.008, 0.46, 6).cyl(x, 0.446, z, 0.025, 0.004, 8).cyl(x, 0.453, z, 0.014, 0.012, 6);
    };
    for (let x = -CX; x <= CX + 0.01; x += 0.6) for (const z of [-CZ, CZ]) bars(x, z);
    for (let z = -CZ + 0.6; z < CZ - 0.01; z += 0.6) for (const x of [-CX, CX]) bars(x, z);
    for (let x = -CX + 0.3; x <= CX; x += 1.2) for (const z of [-CZ, CZ]) bolts(x, z);
    for (let z = -CZ + 0.9; z < CZ - 0.4; z += 1.2) for (const x of [-CX, CX]) bolts(x, z);
  }, { color: 0x8a5a3c, rough: 0.7, metal: 0.4 }, { color: 0xcfd4da, rough: 0.35, metal: 0.9 });
  return out;
}

export function buildFloor(): LayerRT[] {
  const t = tex();
  const out: LayerRT[] = [];
  const fl = (id: string, fill: (a: Acc, b: Acc) => void, spec: import('../geom').MatSpec, spec2?: import('../geom').MatSpec) => {
    const lb = new LB(id, 'floor');
    const p = lb.part(V(0, 1, 0));
    const a = new Acc(), b = new Acc();
    fill(a, b);
    lb.mesh(p, a, spec);
    if (spec2) lb.mesh(p, b, spec2);
    out.push(lb.finish());
  };
  const XI = L / 2 - WALL_T, ZI = W / 2 - WALL_T;
  fl('floor-finish', (a) => a.box(0, 0.7835, 0, 2 * XI, 0.013, 2 * ZI), { color: 0xffffff, rough: 0.55, map: textures.planks() });
  fl('floor-underlayment', (a) => a.box(0, 0.773, 0, 2 * XI, 0.008, 2 * ZI), { color: 0x7f8995, rough: 0.9 });
  fl('floor-subfloor', (a) => a.box(0, 0.7595, 0, 2 * (L / 2 - 0.1102), 0.019, 2 * (W / 2 - 0.1102)), { ...MAT.osb, map: t.osb });
  const jx = (k: number) => -5.8578 + (k * 11.7156) / 29;
  const bay = (11.7156 / 29);
  fl('floor-joists', (a) => {
    ring(a, L / 2 - 0.1102 - 0.016, W / 2 - 0.1102 - 0.016, 0.032, 0.45, 0.75);
    for (let k = 0; k < 30; k++) for (const [z0, z1] of [[-3.8578, -0.07], [0.07, 3.8578]]) {
      const zc = (z0 + z1) / 2, zl = z1 - z0, x = jx(k);
      a.box(x, 0.731, zc, 0.045, 0.038, zl).box(x, 0.6, zc, 0.0095, 0.224, zl).box(x, 0.469, zc, 0.045, 0.038, zl);
    }
    a.box(0, 0.6, 0, 11.7156, 0.3, 0.14);
    for (const x of [-4, 0, 4]) a.box(x, 0.225, 0, 0.14, 0.45, 0.14);
  }, { ...MAT.wood });
  fl('floor-insulation', (a) => {
    for (let k = 0; k < 29; k++) for (const [z0, z1] of [[-3.85, -0.075], [0.075, 3.85]])
      a.box((jx(k) + jx(k + 1)) / 2, 0.6, (z0 + z1) / 2, bay - 0.045 - 0.004, 0.222, z1 - z0);
  }, { ...MAT.pink });
  fl('floor-underside', (a) => a.box(0, 0.4485, 0, 2 * 5.74, 0.003, 2 * 3.74), { color: 0xe6eef2, opacity: 0.6, rough: 0.5, side: THREE.DoubleSide });
  fl('floor-sill', (a, b) => {
    ring(a, L / 2 - 0.1802, W / 2 - 0.1802, 0.14, 0.41, 0.448);
    ring(b, L / 2 - 0.1802, W / 2 - 0.1802, 0.14, STEM_TOP, 0.41);
  }, { ...MAT.pt }, { color: 0xe6d58a, rough: 1 });
  return out;
}
