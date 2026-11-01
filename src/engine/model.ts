import * as THREE from 'three';
import { buildRoof, layoutRoof } from './build/roof';
import { buildWalls, buildInterior } from './build/walls';
import { buildFoundation, buildFloor } from './build/structure';
import { buildOpenings, buildFinishes, buildSystems } from './build/misc';
import { updateRest, type LayerRT } from './build/common';
import { LAYERS } from '../data/catalog';
import type { RoofConfigId } from '../data/types';

export interface HouseModel {
  root: THREE.Group;
  ground: THREE.Object3D;
  layers: Map<string, LayerRT>;
  setRoofConfig(cfg: RoofConfigId): void;
}

export function buildHouse(): HouseModel {
  const root = new THREE.Group();
  const layers = new Map<string, LayerRT>();
  for (const l of [...buildRoof(), ...buildWalls(), ...buildInterior(), ...buildFoundation(), ...buildFloor(), ...buildOpenings(), ...buildFinishes(), ...buildSystems()]) {
    if (layers.has(l.id)) throw new Error('duplicate layer ' + l.id);
    layers.set(l.id, l);
    root.add(l.group);
  }
  for (const m of LAYERS) if (!layers.has(m.id)) throw new Error('catalog layer has no geometry: ' + m.id);

  const ground = new THREE.Group();
  const disc = new THREE.Mesh(new THREE.CircleGeometry(70, 64), new THREE.MeshStandardMaterial({ color: 0x161a1f, roughness: 1, envMapIntensity: 0.15 }));
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = -0.004;
  disc.receiveShadow = true;
  const grid = new THREE.GridHelper(60, 60, 0x2f5a70, 0x232c35);
  grid.position.y = -0.002;
  (grid.material as THREE.Material).transparent = true;
  (grid.material as THREE.Material).opacity = 0.55;
  ground.add(disc, grid);
  ground.userData.ground = true;
  root.add(ground);

  const setRoofConfig = (cfg: RoofConfigId) => {
    layoutRoof(layers, cfg);
    layers.forEach((l) => l.parts.forEach(updateRest));
  };
  return { root, ground, layers, setRoofConfig };
}
