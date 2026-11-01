import * as THREE from 'three';
import { Acc, makeMaterial, textures, type MatSpec } from '../geom';
import { LAYER_BY_ID } from '../../data/catalog';
import type { LayerMeta } from '../../data/types';

// ---- global dimensions (metres) ----
export const L = 12;
export const W = 8;
export const HW = 2.6;
export const Y0 = 0.769; // top of subfloor = wall base
export const Y_PLATE = Y0 + HW;
export const OH = 0.5; // eave overhang
export const RAKE = 0.3; // gable overhang
export const TAN = 0.5; // 6:12
export const TH = Math.atan(TAN);
export const SIN = Math.sin(TH);
export const COS = Math.cos(TH);
export const WALL_T = 0.2659;

export const WL = {
  siding: { d: 0, t: 0.012 },
  furring: { d: 0.012, t: 0.019 },
  ci: { d: 0.031, t: 0.0635 },
  wrb: { d: 0.0945, t: 0.003 },
  sheath: { d: 0.0975, t: 0.0127 },
  studs: { d: 0.1102, t: 0.14 },
  vapor: { d: 0.2502, t: 0.003 },
  drywall: { d: 0.2532, t: 0.0127 },
};

export interface Op { wall: number; x: number; w: number; h: number; sill: number; kind: 'window' | 'door'; }
export const OPS: Op[] = [
  { wall: 0, x: -3.9, w: 1.8, h: 1.4, sill: 0.9, kind: 'window' },
  { wall: 0, x: 0.3, w: 0.95, h: 2.05, sill: 0, kind: 'door' },
  { wall: 0, x: 3.7, w: 1.5, h: 1.4, sill: 0.9, kind: 'window' },
  { wall: 1, x: -3.0, w: 1.5, h: 1.2, sill: 1.0, kind: 'window' },
  { wall: 1, x: -0.2, w: 0.8, h: 0.8, sill: 1.4, kind: 'window' },
  { wall: 1, x: 3.2, w: 0.95, h: 2.05, sill: 0, kind: 'door' },
  { wall: 2, x: -1.5, w: 1.2, h: 1.2, sill: 0.9, kind: 'window' },
  { wall: 2, x: 1.5, w: 1.2, h: 1.2, sill: 0.9, kind: 'window' },
  { wall: 3, x: 0, w: 1.8, h: 1.4, sill: 0.9, kind: 'window' },
];

export const WALLS = [
  { pos: [0, 0, W / 2], ry: 0, n: [0, 0, 1] },
  { pos: [0, 0, -W / 2], ry: Math.PI, n: [0, 0, -1] },
  { pos: [L / 2, 0, 0], ry: Math.PI / 2, n: [1, 0, 0] },
  { pos: [-L / 2, 0, 0], ry: -Math.PI / 2, n: [-1, 0, 0] },
] as const;

export interface PartRT {
  obj: THREE.Object3D;
  dir: THREE.Vector3;
  base: THREE.Vector3; // resting position
  restBox: THREE.Box3; // world box at rest
}

export type Family = 'roof' | 'wall' | 'floor' | 'explicit';

export interface LayerRT {
  id: string;
  meta: LayerMeta;
  group: THREE.Group;
  parts: PartRT[];
  meshes: THREE.Mesh[];
  family: Family;
  rank: number; // explicit rank
  scale: number; // explode-distance multiplier
  active: boolean; // available in current roof configuration
  holders: THREE.Object3D[]; // roof: per-slope holders used to restack
  onConfig?: (hTop: number, cfg: string) => void;
}

export const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const MAT = {
  siding: { color: 0xd9d2c4, rough: 0.85, map: null as THREE.Texture | null },
  trim: { color: 0xf0eee8, rough: 0.7 },
  metalRoof: { color: 0x3f454d, rough: 0.38, metal: 0.75 },
  wood: { color: 0xd9b27a, rough: 0.85 },
  woodDark: { color: 0xb78a52, rough: 0.9 },
  pt: { color: 0x9fb08a, rough: 0.9 },
  osb: { color: 0xe0c89a, rough: 0.95 },
  pink: { color: 0xf2a3bb, rough: 1 },
  wool: { color: 0xd8c25a, rough: 1 },
  drywall: { color: 0xf1efe9, rough: 0.95 },
  concrete: { color: 0xc6c6c1, rough: 0.95 },
  steel: { color: 0x9aa1a8, rough: 0.4, metal: 0.8 },
  black: { color: 0x17191c, rough: 0.5 },
};

export const spec = (s: MatSpec): MatSpec => s;

export function tex() {
  return {
    siding: textures.siding(), sidingBump: textures.siddingBump(), osb: textures.osb(),
    shingle: textures.shingle(), concrete: textures.concrete(), gravel: textures.gravel(),
  };
}

/** Builder for one selectable layer. Parts are the independently movable pieces when exploded. */
export class LB {
  rt: LayerRT;
  constructor(id: string, family: Family = 'explicit', rank = 0, scale = 1) {
    const meta = LAYER_BY_ID[id];
    if (!meta) throw new Error('unknown layer ' + id);
    const group = new THREE.Group();
    group.name = id;
    this.rt = { id, meta, group, parts: [], meshes: [], family, rank, scale, active: true, holders: [] };
  }
  part(dir: THREE.Vector3, pos?: THREE.Vector3, rotY = 0): THREE.Group {
    const g = new THREE.Group();
    if (pos) g.position.copy(pos);
    g.rotation.y = rotY;
    this.rt.group.add(g);
    this.rt.parts.push({ obj: g, dir: dir.clone().normalize(), base: g.position.clone(), restBox: new THREE.Box3() });
    return g;
  }
  mesh(parent: THREE.Object3D, acc: Acc, s: MatSpec, extra?: { cast?: boolean }) {
    const geo = acc.build();
    if (!geo) return null;
    return this.meshGeo(parent, geo, s, extra);
  }
  meshGeo(parent: THREE.Object3D, geo: THREE.BufferGeometry, s: MatSpec, extra?: { cast?: boolean }) {
    const mat = makeMaterial(s);
    const m = new THREE.Mesh(geo, mat);
    m.castShadow = extra?.cast ?? (s.opacity ?? 1) >= 1;
    m.receiveShadow = true;
    m.userData.layerId = this.rt.id;
    m.userData.baseMat = mat;
    parent.add(m);
    this.rt.meshes.push(m);
    return m;
  }
  finish(): LayerRT {
    this.rt.group.updateMatrixWorld(true);
    this.rt.parts.forEach(updateRest);
    return this.rt;
  }
}

const _off = new THREE.Vector3();
export function updateRest(p: PartRT) {
  p.obj.updateWorldMatrix(true, true);
  p.restBox.setFromObject(p.obj).translate(_off.copy(p.base).sub(p.obj.position));
}
