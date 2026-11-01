import * as THREE from 'three';
import { Acc } from '../geom';
import { L, W, Y0, Y_PLATE, TAN, COS, WL, WALL_T, OPS, WALLS, MAT, LB, V, tex, type Op, type LayerRT } from './common';

const PT = 0.038;
const rw = (o: { w: number }) => o.w + 0.05; // rough-opening width

type OpLite = Pick<Op, 'x' | 'w' | 'h' | 'sill'>;
export interface SlabOpts { len: number; yb: number; topPts: [number, number][]; ops: OpLite[]; pad?: number; }

/** Flat panel (siding, sheathing, drywall...) with openings cut out. Lies in local XY, thickness along z. */
export function slab(a: Acc, o: SlabOpts, z0: number, t: number) {
  const hx = o.len / 2, pad = o.pad ?? 0.02;
  const outline: [number, number][] = [[-hx, o.yb]];
  const holes: [number, number][][] = [];
  for (const p of [...o.ops].sort((m, n) => m.x - n.x)) {
    const x0 = p.x - p.w / 2 - pad, x1 = p.x + p.w / 2 + pad, yo = Y0 + p.sill - pad, yh = Y0 + p.sill + p.h + pad;
    if (yo <= o.yb + 1e-6) outline.push([x0, o.yb], [x0, yh], [x1, yh], [x1, o.yb]);
    else holes.push([[x0, yo], [x0, yh], [x1, yh], [x1, yo]]);
  }
  outline.push([hx, o.yb], ...o.topPts);
  a.poly(outline, holes, t, z0);
}

export const yTopAt = (idx: number, x: number) => (idx < 2 ? Y_PLATE : Y_PLATE + Math.max(0, W / 2 - Math.abs(x)) * TAN);
export const wallLen = (idx: number, d: number, t: number) => (idx < 2 ? L - 2 * d : W - 2 * d - 2 * t);
const topPtsFor = (idx: number, hx: number): [number, number][] =>
  idx < 2 ? [[hx, Y_PLATE], [-hx, Y_PLATE]] : [[hx, yTopAt(idx, hx)], [0, yTopAt(idx, 0)], [-hx, yTopAt(idx, -hx)]];

export function wallSlab(a: Acc, idx: number, d: number, t: number, yb: number) {
  const len = wallLen(idx, d, t);
  slab(a, { len, yb, topPts: topPtsFor(idx, len / 2), ops: OPS.filter((o) => o.wall === idx) }, -d - t, t);
}

interface FrameOpts {
  len: number; yb: number; yTop: (x: number) => number; zc: number; depth: number; sw: number;
  ops: OpLite[]; gable: boolean;
}
export function frameWall(o: FrameOpts) {
  const studs = new Acc(), ins = new Acc();
  const hx = o.len / 2, pt = PT, { zc, depth, sw } = o;
  const topLimit = (x: number) => o.yTop(x) - 2 * pt;
  const ops = [...o.ops].sort((a, b) => a.x - b.x);
  let cursor = -hx;
  for (const d of ops.filter((p) => p.sill <= 0.001)) {
    const a = d.x - rw(d) / 2, b = d.x + rw(d) / 2;
    if (a > cursor) studs.box((cursor + a) / 2, o.yb + pt / 2, zc, a - cursor, pt, depth);
    cursor = b;
  }
  if (cursor < hx) studs.box((cursor + hx) / 2, o.yb + pt / 2, zc, hx - cursor, pt, depth);
  if (!o.gable) {
    studs.box(0, o.yTop(0) - pt / 2, zc, o.len, pt, depth).box(0, o.yTop(0) - 1.5 * pt, zc, o.len, pt, depth);
  } else {
    for (const sg of [-1, 1]) {
      const xB = sg * hx, yA = o.yTop(0), yB = o.yTop(xB);
      const phi = Math.atan((yB - yA) / xB);
      studs.box(xB / 2, (yA + yB) / 2 - pt / COS, zc, Math.hypot(xB, yB - yA), 2 * pt, depth, 0, 0, phi);
    }
  }
  const zones = ops.map((p) => ({ lo: p.x - rw(p) / 2 - 2 * pt - 0.02, hi: p.x + rw(p) / 2 + 2 * pt + 0.02 }));
  const members: [number, number][] = [];
  const addStud = (x: number, yTopV: number, yBotV = o.yb + pt) => {
    studs.box(x, (yTopV + yBotV) / 2, zc, sw, yTopV - yBotV, depth);
    members.push([x - sw / 2, x + sw / 2]);
  };
  const xsReg: number[] = [];
  for (let x = -hx + sw / 2; x < hx - sw / 2 - 0.05; x += 0.4064) xsReg.push(x);
  xsReg.push(hx - sw / 2);
  for (const x of xsReg) if (!zones.some((z) => x > z.lo && x < z.hi)) addStud(x, topLimit(x));
  for (const p of ops) {
    const r = rw(p), yo = Y0 + p.sill, yHead = yo + p.h + 0.03;
    for (const sg of [-1, 1]) {
      addStud(p.x + sg * (r / 2 + pt + sw / 2), topLimit(p.x + sg * r / 2));
      addStud(p.x + sg * (r / 2 + sw / 2), yHead);
    }
    studs.box(p.x, yHead + 0.12, zc, r + 2 * pt, 0.24, depth);
    if (p.sill > 0.001) studs.box(p.x, yo - 0.005 - pt / 2, zc, r, pt, depth);
    for (const x of xsReg) if (Math.abs(x - p.x) < r / 2 - sw / 2) {
      studs.box(x, (yHead + 0.24 + topLimit(x)) / 2, zc, sw, topLimit(x) - yHead - 0.24, depth);
      if (p.sill > 0.001) studs.box(x, (o.yb + pt + yo - 0.005 - pt) / 2, zc, sw, yo - 0.005 - 2 * pt - o.yb, depth);
    }
    const bx0 = p.x - r / 2 - pt, bx1 = p.x + r / 2 + pt;
    const yt = Math.min(topLimit(bx0), topLimit(bx1));
    ins.box(p.x, (yHead + 0.24 + yt) / 2, zc, bx1 - bx0 - 0.004, yt - yHead - 0.244, depth - 0.006);
    if (p.sill > 0.001) ins.box(p.x, (o.yb + pt + yo - 0.005 - pt) / 2, zc, bx1 - bx0 - 0.004, yo - 0.005 - 2 * pt - o.yb - 0.004, depth - 0.006);
  }
  members.sort((a, b) => a[0] - b[0]);
  for (let i = 0; i < members.length - 1; i++) {
    const gx0 = members[i][1], gx1 = members[i + 1][0];
    if (gx1 - gx0 < 0.03) continue;
    const mid = (gx0 + gx1) / 2;
    if (ops.some((p) => mid > p.x - rw(p) / 2 - 2 * pt - 0.01 && mid < p.x + rw(p) / 2 + 2 * pt + 0.01)) continue;
    const yt = Math.min(topLimit(gx0), topLimit(gx1));
    ins.box(mid, (o.yb + pt + yt) / 2, zc, gx1 - gx0 - 0.004, yt - o.yb - pt - 0.004, depth - 0.006);
  }
  return { studs, ins };
}

export function buildWalls(): LayerRT[] {
  const t = tex();
  const out: LayerRT[] = [];
  const wallLayer = (id: string, build: (idx: number, a: Acc) => void, spec: import('../geom').MatSpec) => {
    const lb = new LB(id, 'wall');
    WALLS.forEach((w, idx) => {
      const p = lb.part(V(...(w.n as unknown as [number, number, number])), V(...(w.pos as unknown as [number, number, number])), w.ry);
      const a = new Acc();
      build(idx, a);
      lb.mesh(p, a, spec);
    });
    out.push(lb.finish());
  };
  const YB_EXT = 0.43;
  wallLayer('wall-siding', (i, a) => wallSlab(a, i, WL.siding.d, WL.siding.t, YB_EXT), { ...MAT.siding, map: t.siding, bump: t.sidingBump });
  wallLayer('wall-furring', (i, a) => {
    const d = WL.furring.d, tt = WL.furring.t, hx = wallLen(i, d, tt) / 2;
    const ops = OPS.filter((o) => o.wall === i);
    for (let x = -hx + 0.05; x < hx; x += 0.4064) {
      if (ops.some((o) => Math.abs(x - o.x) < o.w / 2 + 0.07)) continue;
      const ytop = yTopAt(i, x) - 0.02;
      a.box(x, (YB_EXT + ytop) / 2, -d - tt / 2, 0.038, ytop - YB_EXT, tt);
    }
  }, { ...MAT.wood });
  wallLayer('wall-ext-insulation', (i, a) => wallSlab(a, i, WL.ci.d, WL.ci.t, YB_EXT), { ...MAT.wool });
  wallLayer('wall-wrb', (i, a) => wallSlab(a, i, WL.wrb.d, WL.wrb.t, YB_EXT), { color: 0xe8ecef, rough: 0.6, opacity: 0.8 });
  wallLayer('wall-sheathing', (i, a) => wallSlab(a, i, WL.sheath.d, WL.sheath.t, YB_EXT), { ...MAT.osb, map: t.osb });
  {
    const lb = new LB('wall-studs', 'wall');
    const lb2 = new LB('wall-insulation', 'wall');
    WALLS.forEach((w, i) => {
      const f = frameWall({
        len: wallLen(i, WL.studs.d, WL.studs.t), yb: Y0, yTop: (x) => yTopAt(i, x), zc: -WL.studs.d - WL.studs.t / 2,
        depth: WL.studs.t, sw: PT, ops: OPS.filter((o) => o.wall === i), gable: i >= 2,
      });
      const pos = V(...(w.pos as unknown as [number, number, number]));
      const dir = V(...(w.n as unknown as [number, number, number]));
      lb.mesh(lb.part(dir, pos, w.ry), f.studs, { ...MAT.wood });
      lb2.mesh(lb2.part(dir, pos, w.ry), f.ins, { ...MAT.wool, rough: 1 });
    });
    out.push(lb.finish(), lb2.finish());
  }
  wallLayer('wall-vapor', (i, a) => wallSlab(a, i, WL.vapor.d, WL.vapor.t, Y0), { color: 0x6fdc9a, opacity: 0.55, rough: 0.4, side: THREE.DoubleSide });
  wallLayer('wall-drywall', (i, a) => wallSlab(a, i, WL.drywall.d, WL.drywall.t, Y0), { ...MAT.drywall });
  return out;
}

// ---------------- interior partitions ----------------
export const PH = 2.44;
export interface PartitionDef { cx: number; cz: number; ry: number; len: number; ops: OpLite[]; n: [number, number, number]; }
export const PARTITIONS: PartitionDef[] = (() => {
  const xA0 = -(L / 2 - WALL_T), xA1 = 1.9, zc = -0.6;
  const zB = W / 2 - WALL_T;
  const mid = (xA0 + xA1) / 2;
  return [
    { cx: mid, cz: zc, ry: 0, len: xA1 - xA0 - 0.057, n: [0, 0, 1],
      ops: [{ x: -3.8 - mid, w: 0.86, h: 2.04, sill: 0 }, { x: -0.8 - mid, w: 0.86, h: 2.04, sill: 0 }] },
    { cx: 1.9, cz: 0, ry: Math.PI / 2, len: 2 * zB, n: [1, 0, 0],
      ops: [{ x: 2.0, w: 0.86, h: 2.04, sill: 0 }, { x: -1.8, w: 0.86, h: 2.04, sill: 0 }] },
  ];
})();

export function buildInterior(): LayerRT[] {
  const out: LayerRT[] = [];
  const dwLayer = (id: string, rank: number, zA: number) => {
    const lb = new LB(id, 'explicit', rank);
    for (const p of PARTITIONS) {
      const a = new Acc();
      slab(a, { len: p.len, yb: Y0, topPts: [[p.len / 2, Y0 + PH], [-p.len / 2, Y0 + PH]], ops: p.ops }, zA, 0.0127);
      lb.mesh(lb.part(V(...p.n), V(p.cx, 0, p.cz), p.ry), a, { ...MAT.drywall });
    }
    out.push(lb.finish());
  };
  dwLayer('int-drywall-a', 3, 0.0445);
  const lb = new LB('int-framing', 'explicit', 2), lb2 = new LB('int-insulation', 'explicit', 1);
  for (const p of PARTITIONS) {
    const f = frameWall({ len: p.len, yb: Y0, yTop: () => Y0 + PH, zc: 0, depth: 0.089, sw: PT, ops: p.ops, gable: false });
    lb.mesh(lb.part(V(...p.n), V(p.cx, 0, p.cz), p.ry), f.studs, { ...MAT.wood });
    lb2.mesh(lb2.part(V(...p.n), V(p.cx, 0, p.cz), p.ry), f.ins, { color: 0xb8bcc4, rough: 1 });
  }
  out.push(lb.finish(), lb2.finish());
  dwLayer('int-drywall-b', 0, -0.0572);
  return out;
}
