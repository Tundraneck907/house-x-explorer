import { useSyncExternalStore } from 'react';
import type { AssemblyId, RoofConfigId } from './data/types';
import { layersOf } from './data/catalog';

export type Axis = 'x' | 'z';
export interface State {
  assembly: AssemblyId | null;
  layer: string | null;
  isolate: boolean;
  ghost: boolean;
  exploded: boolean;
  explodeDist: number;
  hidden: Record<string, boolean>;
  solo: string | null;
  roofConfig: RoofConfigId;
  section: { on: boolean; axis: Axis; pos: number; flip: boolean };
  infoOpen: boolean;
  leftOpen: boolean;
  mobileTab: 'assemblies' | 'info' | null;
  hover: string | null;
  toast: string | null;
  ready: boolean;
}

const initial: State = {
  assembly: null, layer: null, isolate: true, ghost: true, exploded: false, explodeDist: 0.45,
  hidden: {}, solo: null, roofConfig: 'standing-seam',
  section: { on: false, axis: 'x', pos: 0, flip: false },
  infoOpen: true, leftOpen: true, mobileTab: null, hover: null, toast: null, ready: false,
};

let state = initial;
const listeners = new Set<() => void>();
export const getState = () => state;
export const subscribe = (fn: () => void) => { listeners.add(fn); return () => listeners.delete(fn); };
export const set = (patch: Partial<State>) => { state = { ...state, ...patch }; listeners.forEach((l) => l()); };
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(state));
}

// camera hooks installed by the engine
export const cam = { reset: () => {}, view: (_v: string) => {}, frame: () => {} };

let toastTimer: ReturnType<typeof setTimeout> | undefined;
export const toast = (msg: string) => {
  set({ toast: msg });
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => set({ toast: null }), 2200);
};

export const actions = {
  selectAssembly(id: AssemblyId) {
    set({ assembly: id, layer: null, solo: null, isolate: true, exploded: false, mobileTab: state.mobileTab === null ? null : 'assemblies' });
  },
  selectLayer(id: string | null) {
    set({ layer: id, ...(id ? { infoOpen: true, mobileTab: 'info' as const } : {}) });
  },
  toggleExplode() {
    if (!state.assembly) set({ assembly: 'roof', layer: null, solo: null, isolate: true });
    set({ exploded: !state.exploded });
  },
  setExplodeDist: (d: number) => set({ explodeDist: d }),
  toggleIsolate() {
    if (!state.assembly) return toast('Select an assembly first');
    set({ isolate: !state.isolate, solo: null });
  },
  toggleGhost: () => set({ ghost: !state.ghost }),
  showAll() {
    set({ assembly: null, layer: null, solo: null, exploded: false, hidden: {}, isolate: true });
    cam.reset();
  },
  collapse: () => set({ exploded: false }),
  resetAssembly() {
    if (!state.assembly) return;
    const ids = layersOf(state.assembly, state.roofConfig);
    const hidden = { ...state.hidden };
    ids.forEach((i) => delete hidden[i]);
    set({ hidden, solo: null, layer: null, exploded: false });
  },
  toggleHidden(id: string) {
    const hidden = { ...state.hidden };
    if (hidden[id]) delete hidden[id]; else hidden[id] = true;
    set({ hidden, solo: state.solo === id ? null : state.solo });
  },
  toggleSolo(id: string) {
    if (!state.assembly) return;
    set({ solo: state.solo === id ? null : id, layer: id });
  },
  setRoofConfig: (c: RoofConfigId) => set({ roofConfig: c, solo: null }),
  setSection: (p: Partial<State['section']>) => set({ section: { ...state.section, ...p } }),
  setHover: (id: string | null) => { if (state.hover !== id) set({ hover: id }); },
};
