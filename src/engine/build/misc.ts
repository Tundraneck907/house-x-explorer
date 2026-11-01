import * as THREE from 'three';
import { Acc, type MatSpec } from '../geom';
import { L, W, Y0, Y_PLATE, OH, RAKE, TH, SIN, COS, TAN, WALL_T, OPS, WALLS, MAT, LB, V, type LayerRT, updateRest } from './common';
import { PARTITIONS, PH, yTopAt, wallLen } from './walls';
import { YE, ZE, uMax, apexY } from './roof';

const wv = (i: number) => V(...(WALLS[i].pos as unknown as [number, number, number]));
const wn = (i: number) => V(...(WALLS[i].n as unknown as [number, number, number]));

/** Box expressed in slope-local coordinates (x ridge, u up-slope from eave, h along normal), placed in world space. */
export function slopeBox(a: Acc, sgn: 1 | -1, x0: number, x1: number, u0: number, u1: number, h0: number, h1: number) {
  const xm = (x0 + x1) / 2, um = (u0 + u1) / 2, hm = (h0 + h1) / 2;
  a.box(xm, YE + hm * COS + um * SIN, sgn * (ZE + hm * SIN - um * COS), x1 - x0, h1 - h0, u1 - u0, sgn * TH, 0, 0);
}
const rotX = (a: Acc, sgn: number) => sgn * TH;
void rotX;

const roofPoint = (sgn: 1 | -1, x: number, u: number, h: number) =>
  V(x, YE + h * COS + u * SIN, sgn * (ZE + h * SIN - u * COS));

export function buildOpenings(): LayerRT[] {
  const out: LayerRT[] = [];
  const ZC = -0.14, FD = 0.09, FT = 0.045;
  const unit = (id: string, rank: number, kind: 'window' | 'door', fill: (a: Acc, b: Acc, o: (typeof OPS)[number]) => void, s1: MatSpec, s2?: MatSpec) => {
    const lb = new LB(id, 'explicit', rank, 0.8);
    for (const o of OPS) {
      if (o.kind !== kind) continue;
      const p = lb.part(wn(o.wall), wv(o.wall), WALLS[o.wall].ry);
      const a = new Acc(), b = new Acc();
      fill(a, b, o);
      lb.mesh(p, a, s1);
      if (s2) lb.mesh(p, b, s2);
    }
    return lb;
  };
  out.push(unit('open-window-frames', 2, 'window', (a, _b, o) => {
    const yo = Y0 + o.sill;
    a.box(o.x - o.w / 2 + FT / 2, yo + o.h / 2, ZC, FT, o.h, FD).box(o.x + o.w / 2 - FT / 2, yo + o.h / 2, ZC, FT, o.h, FD);
    a.box(o.x, yo + FT / 2, ZC, o.w - 2 * FT, FT, FD).box(o.x, yo + o.h - FT / 2, ZC, o.w - 2 * FT, FT, FD);
    if (o.w > 1.4) a.box(o.x, yo + o.h / 2, ZC, 0.04, o.h - 2 * FT, FD * 0.8);
    a.box(o.x, yo - 0.012, ZC + 0.05, o.w + 0.06, 0.024, 0.08);
  }, { color: 0x3a3f46, rough: 0.5 }).finish());
  out.push(unit('open-glazing', 1, 'window', (a, _b, o) => {
    const yo = Y0 + o.sill;
    for (const dz of [-0.018, 0, 0.018]) a.box(o.x, yo + o.h / 2, ZC + dz, o.w - 2 * FT + 0.012, o.h - 2 * FT + 0.012, 0.006);
  }, { color: 0x9fd8f0, opacity: 0.28, rough: 0.05, metal: 0.1 }).finish());
  out.push(unit('open-flashing', 0, 'window', (a, b, o) => {
    const yo = Y0 + o.sill, rwid = o.w + 0.05;
    a.box(o.x, yo - 0.008, ZC - 0.01, o.w + 0.12, 0.006, 0.17);
    const zt = -0.1;
    a.box(o.x - rwid / 2 - 0.035, yo + o.h / 2, zt, 0.07, o.h + 0.14, 0.004).box(o.x + rwid / 2 + 0.035, yo + o.h / 2, zt, 0.07, o.h + 0.14, 0.004);
    a.box(o.x, yo + o.h + 0.035, zt, rwid + 0.14, 0.07, 0.004);
    b.box(o.x - o.w / 2 - 0.012, yo + o.h / 2, ZC, 0.024, o.h, FD * 0.9).box(o.x + o.w / 2 + 0.012, yo + o.h / 2, ZC, 0.024, o.h, FD * 0.9);
    b.box(o.x, yo + o.h + 0.012, ZC, o.w + 0.05, 0.024, FD * 0.9);
  }, { color: 0xff7a1a, rough: 0.4 }, { color: 0xf2d24a, rough: 1 }).finish());
  out.push(unit('open-ext-doors', 1.5, 'door', (a, b, o) => {
    const zc = -0.15;
    a.box(o.x - o.w / 2 + 0.02, Y0 + o.h / 2, zc, 0.04, o.h, 0.11).box(o.x + o.w / 2 - 0.02, Y0 + o.h / 2, zc, 0.04, o.h, 0.11).box(o.x, Y0 + o.h - 0.02, zc, o.w, 0.04, 0.11);
    a.box(o.x, Y0 + 0.015, zc - 0.01, o.w, 0.03, 0.2);
    const sw = o.w - 0.08, sh = o.h - 0.07;
    b.box(o.x, Y0 + 0.03 + sh / 2, zc, sw, sh, 0.045);
    for (const py of [0.3, 0.72]) b.box(o.x, Y0 + 0.03 + sh * py + (py > 0.5 ? 0.22 : 0.12), zc + 0.025, sw * 0.62, sh * 0.34, 0.008);
    a.cyl(o.x + sw / 2 - 0.08, Y0 + 1.0, zc + 0.045, 0.012, 0.06, 8, Math.PI / 2).box(o.x + sw / 2 - 0.08, Y0 + 1.0, zc + 0.075, 0.2, 0.025, 0.02);
  }, { color: 0xb9a07a, rough: 0.35, metal: 0.7 }, { color: 0x7b3a2e, rough: 0.55 }).finish());
  {
    const lb = new LB('open-int-doors', 'explicit', 1.5, 0.8);
    for (const p of PARTITIONS) for (const o of p.ops) {
      const part = lb.part(V(...p.n), V(p.cx, 0, p.cz), p.ry);
      const a = new Acc(), b = new Acc();
      const w = o.w, h = o.h;
      a.box(o.x - w / 2 + 0.02, Y0 + h / 2, 0, 0.025, h, 0.115).box(o.x + w / 2 - 0.02, Y0 + h / 2, 0, 0.025, h, 0.115).box(o.x, Y0 + h - 0.0125, 0, w, 0.025, 0.115);
      b.box(o.x, Y0 + 0.012 + (h - 0.05) / 2, 0, w - 0.06, h - 0.05, 0.04);
      a.cyl(o.x + w / 2 - 0.1, Y0 + 0.95, 0.045, 0.025, 0.03, 10, Math.PI / 2);
      lb.mesh(part, a, { color: 0xc9b99a, rough: 0.4, metal: 0.6 });
      lb.mesh(part, b, { color: 0xe3dfd5, rough: 0.7 });
    }
    out.push(lb.finish());
  }
  return out;
}

export function buildFinishes(): LayerRT[] {
  const out: LayerRT[] = [];
  const yT = Y_PLATE - OH * TAN; // underside of rafter tail
  const XE = L / 2 + RAKE;
  const WHITE: MatSpec = { ...MAT.trim };
  const DARK: MatSpec = { color: 0x2c3036, rough: 0.45, metal: 0.5 };

  // ---- trim ----
  {
    const lb = new LB('fin-trim', 'explicit', 1);
    WALLS.forEach((w, i) => {
      const a = new Acc();
      for (const o of OPS.filter((q) => q.wall === i)) {
        const yo = Y0 + o.sill, ow = o.w + 0.04, tz = 0.02, tw = 0.09;
        const top = yo + o.h + 0.02;
        const yb = o.kind === 'window' ? yo - 0.02 : Y0 - 0.02;
        a.box(o.x - ow / 2 - tw / 2, (yb + top + tw) / 2, tz / 2, tw, top + tw - yb, tz).box(o.x + ow / 2 + tw / 2, (yb + top + tw) / 2, tz / 2, tw, top + tw - yb, tz);
        a.box(o.x, top + tw / 2, tz / 2, ow + 2 * tw, tw, tz);
        if (o.kind === 'window') a.box(o.x, yb - 0.02, 0.025, ow + 2 * tw, 0.04, 0.05);
      }
      if (i < 2) for (const sx of [-1, 1]) a.box(sx * (L / 2 - 0.045), (0.43 + Y_PLATE) / 2, 0.02, 0.09, Y_PLATE - 0.43, 0.04);
      lb.mesh(lb.part(wn(i), wv(i), w.ry), a, WHITE);
    });
    out.push(lb.finish());
  }
  // ---- soffit / fascia / drip edge / rake ----
  {
    const lb = new LB('fin-soffit-fascia', 'explicit', 2);
    for (const sg of [1, -1] as const) {
      const p = lb.part(V(0, 0, sg));
      const a = new Acc(), v = new Acc(), d = new Acc();
      a.box(0, yT - 0.005, sg * (W / 2 + (OH - 0.02) / 2), 2 * XE - 0.04, 0.01, OH - 0.02);
      a.box(0, yT + 0.12, sg * (ZE - 0.0125), 2 * XE - 0.04, 0.32, 0.025);
      v.box(0, yT - 0.0105, sg * (W / 2 + 0.25), 2 * XE - 0.5, 0.002, 0.07);
      d.box(0, YE + 0.004, sg * (ZE - 0.035), 2 * XE, 0.003, 0.09, sg * TH, 0, 0);
      lb.mesh(p, a, WHITE); lb.mesh(p, v, { color: 0x1a1c1f, rough: 0.9 }); lb.mesh(p, d, DARK);
    }
    for (const sx of [1, -1]) {
      const p = lb.part(V(sx, 0, 0));
      // rake board: 25 mm thick on the gable edge, one per slope
      const a2 = new Acc();
      for (const sg of [1, -1] as const) {
        const x0 = sx > 0 ? XE - 0.025 : -XE, x1 = x0 + 0.025;
        slopeBox(a2, sg, x0, x1, 0, uMax(-0.15), -0.32, 0.02);
      }
      lb.mesh(p, a2, WHITE);
    }
    out.push(lb.finish());
  }
  // ---- gutters + downspouts ----
  {
    const lb = new LB('fin-gutters', 'explicit', 2);
    for (const sg of [1, -1] as const) {
      const p = lb.part(V(0, 0, sg));
      const a = new Acc();
      const g = new THREE.CylinderGeometry(0.07, 0.07, L + 0.5, 14, 1, true, Math.PI, Math.PI);
      g.rotateZ(Math.PI / 2);
      g.translate(0, yT + 0.2, sg * (ZE + 0.075));
      a.add(g);
      for (let x = -L / 2; x <= L / 2 + 0.01; x += 0.9) a.box(x, yT + 0.17, sg * (ZE + 0.03), 0.02, 0.1, 0.07);
      const ds = sg > 0 ? -L / 2 + 0.35 : L / 2 - 0.35, zw = sg * (W / 2 + 0.05), zg = sg * (ZE + 0.075);
      a.box(ds, yT + 0.1 - 0.11, zg, 0.075, 0.22, 0.1);
      a.box(ds, yT - 0.12, (zw + zg) / 2, 0.075, 0.1, Math.abs(zg - zw) + 0.1);
      a.box(ds, (yT - 0.12 + 0.5) / 2, zw, 0.075, yT - 0.62, 0.1);
      a.box(ds, 0.46, zw + sg * 0.15, 0.075, 0.1, 0.4);
      lb.mesh(p, a, { ...DARK, side: THREE.DoubleSide });
    }
    out.push(lb.finish());
  }
  // ---- ridge vent (dynamic height) ----
  {
    const lb = new LB('fin-ridge-vent', 'explicit', 2);
    const p = lb.part(V(0, 1, 0));
    const vent = new Acc(), cap = new Acc();
    for (const sg of [1, -1] as const) {
      slopeBox(vent, sg, -XE + 0.1, XE - 0.1, uMax(0) - 0.2, uMax(0) + 0.03, 0.0, 0.03);
      slopeBox(cap, sg, -XE + 0.08, XE - 0.08, uMax(0.04) - 0.22, uMax(0.04) + 0.05, 0.03, 0.05);
    }
    lb.mesh(p, vent, { color: 0x1c1e21, rough: 0.8 });
    lb.mesh(p, cap, { ...MAT.metalRoof });
    lb.rt.onConfig = (hTop) => {
      const dy = hTop / COS;
      const pr = lb.rt.parts[0];
      pr.base.y = dy; pr.obj.position.y = dy;
    };
    out.push(lb.finish());
  }
  // ---- vent terminals ----
  {
    const lb = new LB('fin-vent-terminals', 'explicit', 2);
    const p1 = lb.part(V(0, 1, 0));
    const pipe = new Acc(), boot = new Acc();
    const pt = roofPoint(-1, -2.5, 1.8, 0);
    pipe.cyl(pt.x, pt.y + 0.27, pt.z, 0.045, 0.54, 10).cyl(pt.x, pt.y + 0.55, pt.z, 0.052, 0.03, 10);
    boot.cyl(pt.x, pt.y + 0.04, pt.z, 0.09, 0.08, 10, 0, 0, 0, 0.05).box(pt.x, pt.y + 0.002, pt.z, 0.3, 0.004, 0.3, -TH, 0, 0);
    lb.mesh(p1, pipe, { color: 0xeceae4, rough: 0.5 });
    lb.mesh(p1, boot, { color: 0x15171a, rough: 0.6 });
    const p2 = lb.part(wn(1), wv(1), WALLS[1].ry);
    const hood = new Acc(), louv = new Acc();
    for (const [x, w, h] of [[0.9, 0.28, 0.2], [1.7, 0.28, 0.2], [4.6, 0.2, 0.16]]) {
      hood.box(x, 2.05, 0.06, w, h, 0.12);
      for (let k = -2; k <= 2; k++) louv.box(x, 2.05 + k * h * 0.17, 0.122, w * 0.8, 0.012, 0.01);
    }
    lb.mesh(p2, hood, { color: 0xc9cdd2, rough: 0.45, metal: 0.4 });
    lb.mesh(p2, louv, { color: 0x1b1d20, rough: 0.8 });
    lb.rt.onConfig = (hTop) => {
      const dy = hTop / COS;
      const pr = lb.rt.parts[0];
      pr.base.y = dy; pr.obj.position.y = dy;
    };
    out.push(lb.finish());
  }
  // ---- snow guards (metal roofs only) ----
  {
    const lb = new LB('fin-snow-guards', 'explicit', 1);
    const p = lb.part(V(0, 1, 0));
    const clamp = new Acc(), bar = new Acc();
    const u = 1.15;
    for (const sg of [1, -1] as const) {
      for (let x = -XE + 0.35; x < XE - 0.3; x += 0.8) {
        slopeBox(clamp, sg, x - 0.03, x + 0.03, u - 0.03, u + 0.03, 0.0, 0.058);
      }
      slopeBox(bar, sg, -XE + 0.3, XE - 0.3, u - 0.008, u + 0.008, 0.05, 0.062);
    }
    lb.mesh(p, clamp, { color: 0xc9ced4, rough: 0.4, metal: 0.85 });
    lb.mesh(p, bar, { ...DARK });
    lb.rt.onConfig = (hTop, cfg) => {
      lb.rt.active = cfg === 'standing-seam' || cfg === 'exposed-fastener';
      const dy = (hTop - 0.04) / COS - 0.0;
      const pr = lb.rt.parts[0];
      pr.base.y = dy; pr.obj.position.y = dy;
    };
    out.push(lb.finish());
  }
  void apexY; void updateRest;
  return out;
}

export function buildSystems(): LayerRT[] {
  const out: LayerRT[] = [];
  // ---- air-sealing details ----
  {
    const lb = new LB('air-seal-details', 'explicit', 0);
    const ZT = -0.2546, TT = 0.003;
    WALLS.forEach((w, i) => {
      const a = new Acc();
      const len = wallLen(i, 0.2532, 0.0127);
      for (const o of OPS.filter((q) => q.wall === i)) {
        const r = o.w + 0.05, yo = Y0 + o.sill, rh = o.h + 0.03;
        a.box(o.x - r / 2 - 0.06, yo + rh / 2, ZT, 0.05, rh + 0.12, TT).box(o.x + r / 2 + 0.06, yo + rh / 2, ZT, 0.05, rh + 0.12, TT);
        a.box(o.x, yo + rh + 0.06, ZT, r + 0.22, 0.05, TT);
        if (o.sill > 0.001) a.box(o.x, yo - 0.06, ZT, r + 0.22, 0.05, TT);
      }
      a.box(0, Y0 + 0.05, ZT, len, 0.05, TT);
      if (i < 2) a.box(0, Y_PLATE - 0.09, ZT, len, 0.05, TT);
      else for (const sg of [-1, 1]) {
        const hx = len / 2, yA = yTopAt(i, 0) - 0.09, yB = yTopAt(i, sg * hx) - 0.09;
        a.box(sg * hx / 2, (yA + yB) / 2, ZT, Math.hypot(hx, yB - yA), 0.05, TT, 0, 0, Math.atan((yB - yA) / (sg * hx)));
      }
      lb.mesh(lb.part(wn(i), wv(i), w.ry), a, { color: 0xff7a1a, rough: 0.5, emissive: 0x401a00 });
    });
    out.push(lb.finish());
  }
  // ---- HRV ----
  {
    const lb = new LB('vent-hrv', 'explicit', 3, 0.8);
    const p = lb.part(V(0, 1, 0));
    const unit = new Acc(), duct = new Acc(), reg = new Acc();
    const ux = -1.3, uz = -3.4, zWall = -(W / 2 - WALL_T);
    unit.box(ux, 0.79 + 0.3, uz, 0.8, 0.6, 0.5);
    for (const [hx] of [[-0.9], [-1.7]]) {
      duct.cyl(hx, 1.9, uz, 0.065, 1.2, 12);
      duct.cyl(hx, 2.05, (uz + zWall - 0.06) / 2, 0.065, Math.abs(uz - zWall) + 0.12, 12, Math.PI / 2);
    }
    duct.cyl(-3.3, 2.3, uz - 0.2, 0.065, 3.6, 12, 0, 0, Math.PI / 2);
    duct.cyl(-1.9, 2.3 - 0.2, uz - 0.2, 0.065, 0.4, 12);
    duct.cyl(-3.3, 2.1 - 0.0, uz - 0.2, 0.065, 0.4, 12);
    duct.cyl(-1.3, 1.45, uz, 0.065, 0.3, 12);
    for (const x of [-2.6, -4.6]) reg.box(x, 2.12, uz - 0.2, 0.3, 0.02, 0.2);
    lb.mesh(p, unit, { color: 0xe07b2a, rough: 0.5 });
    lb.mesh(p, duct, { color: 0xb4bac1, rough: 0.35, metal: 0.7 });
    lb.mesh(p, reg, { color: 0xf0f0ee, rough: 0.5 });
    out.push(lb.finish());
  }
  return out;
}
void PH;
