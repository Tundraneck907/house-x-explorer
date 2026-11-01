import { ASSEMBLIES, LAYER_BY_ID, ROOF_CONFIGS, layersOf } from '../data/catalog';
import { actions, useStore } from '../store';
import type { Engine } from '../engine/Engine';
import { IEye, ISolo } from './icons';

const swatch = (id: string) => {
  const e = (window as unknown as { __engine?: Engine }).__engine;
  const m = e?.house.layers.get(id)?.meshes[0]?.userData.baseMat as { color: { getHexString(): string } } | undefined;
  return m ? '#' + m.color.getHexString() : '#667';
};

function RoofConfig() {
  const cfg = useStore((s) => s.roofConfig);
  const c = ROOF_CONFIGS.find((r) => r.id === cfg)!;
  return (
    <div className="cfg">
      <div className="label">Roofing configuration</div>
      <div className="seg">
        {ROOF_CONFIGS.map((r) => (
          <button key={r.id} className={r.id === cfg ? 'on' : ''} data-testid={`cfg-${r.id}`} onClick={() => actions.setRoofConfig(r.id)}>{r.name}</button>
        ))}
      </div>
      <p className="muted small">{c.blurb}</p>
    </div>
  );
}

function Layers() {
  const asm = useStore((s) => s.assembly)!;
  const cfg = useStore((s) => s.roofConfig);
  const sel = useStore((s) => s.layer);
  const hidden = useStore((s) => s.hidden);
  const solo = useStore((s) => s.solo);
  useStore((s) => s.ready);
  const ids = layersOf(asm, cfg);
  return (
    <ol className="layers">
      {ids.map((id, i) => (
        <li key={id} className={`${sel === id ? 'sel' : ''} ${hidden[id] ? 'off' : ''}`} data-testid={`layer-${id}`}>
          <button className="row-main" onClick={() => actions.selectLayer(sel === id ? null : id)}>
            <span className="num">{i + 1}</span>
            <span className="sw" style={{ background: swatch(id) }} />
            <span className="nm">{LAYER_BY_ID[id].name}</span>
          </button>
          <button className={`mini ${solo === id ? 'on' : ''}`} title="Isolate this layer" onClick={() => actions.toggleSolo(id)}><ISolo /></button>
          <button className="mini" title={hidden[id] ? 'Show layer' : 'Hide layer'} data-testid={`hide-${id}`} onClick={() => actions.toggleHidden(id)}><IEye off={!!hidden[id]} /></button>
        </li>
      ))}
    </ol>
  );
}

export function LeftPanel() {
  const asm = useStore((s) => s.assembly);
  return (
    <div className="panel-body">
      <div className="panel-title">Assemblies <span className="muted">select to isolate</span></div>
      <ul className="asm-list">
        {ASSEMBLIES.map((a) => (
          <li key={a.id} className={asm === a.id ? 'open' : ''}>
            <button className="asm" data-testid={`asm-${a.id}`} onClick={() => (asm === a.id ? actions.showAll() : actions.selectAssembly(a.id))}>
              <span className="letter">{a.letter}</span>
              <span className="asm-name">{a.name}</span>
              <span className="count">{layersOf(a.id, 'standing-seam').length}</span>
            </button>
            {asm === a.id && (
              <div className="asm-body">
                <p className="muted small">{a.blurb}</p>
                {a.id === 'roof' && <RoofConfig />}
                <div className="label">Layers — outermost first</div>
                <Layers />
              </div>
            )}
          </li>
        ))}
      </ul>
      {!asm && <p className="hint">Tip: tap any part of the house in the 3D view, or pick an assembly above. Drag to rotate, pinch or scroll to zoom, two fingers or right-drag to pan.</p>}
    </div>
  );
}
