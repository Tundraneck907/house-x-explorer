import { useState, type ReactNode } from 'react';
import { ASSEMBLY_BY_ID, LAYER_BY_ID } from '../data/catalog';
import { ASSEMBLY_NOTES, INFO } from '../data/info';
import { actions, set, useStore } from '../store';
import { IClose } from './icons';

const Sec = ({ title, children, open = true, accent }: { title: string; children: ReactNode; open?: boolean; accent?: boolean }) => {
  const [o, setO] = useState(open);
  return (
    <section className={`sec ${accent ? 'accent' : ''}`}>
      <button className="sec-h" onClick={() => setO(!o)} aria-expanded={o}><span>{title}</span><i className={o ? 'up' : ''} /></button>
      {o && <div className="sec-b">{children}</div>}
    </section>
  );
};
const List = ({ items, ordered }: { items: string[]; ordered?: boolean }) => {
  const T = ordered ? 'ol' : 'ul';
  return <T className="bul">{items.map((t, i) => <li key={i}>{t}</li>)}</T>;
};

function LayerInfo({ id }: { id: string }) {
  const meta = LAYER_BY_ID[id];
  const info = INFO[id];
  const asm = ASSEMBLY_BY_ID[meta.home];
  return (
    <div className="info" key={id} data-testid="info-layer">
      <div className="crumb">{asm.letter} · {asm.name}</div>
      <h2>{meta.name}</h2>
      <p className="muted">{meta.summary}</p>
      {!info ? <p>No information entered for this layer yet.</p> : (
        <>
          <div className="facts">
            <div><span className="label">Typical thickness</span><b>{info.thickness}</b></div>
            <div><span className="label">Typical dimensions</span><b>{info.dimensions}</b></div>
          </div>
          <Sec title="Description"><p>{info.description}</p></Sec>
          <Sec title="Construction purpose"><p>{info.purpose}</p></Sec>
          <Sec title="Installation sequence"><List ordered items={info.installSequence} /></Sec>
          <Sec title="Fastening method"><p>{info.fastening}</p></Sec>
          <Sec title="Compatible materials"><List items={info.compatible} /></Sec>
          <Sec title="Common installation errors"><List items={info.commonErrors} /></Sec>
          <Sec title="Moisture considerations"><p>{info.moisture}</p></Sec>
          <Sec title="Thermal considerations"><p>{info.thermal}</p></Sec>
          <Sec title="Fairbanks / North Pole / Interior Alaska" accent><p>{info.coldClimate}</p></Sec>
          <Sec title="Code references" open={false}>
            {info.codeRefs.length === 0 ? <p className="muted">No specific reference listed.</p> : (
              <ul className="codes">
                {info.codeRefs.map((c, i) => (
                  <li key={i}><span className={`badge ${c.confidence.toLowerCase()}`}>{c.confidence}</span><b>{c.ref}</b><span>{c.note}</span></li>
                ))}
              </ul>
            )}
            <p className="muted small">Section numbers vary by code edition. Confirm the adopted code and local amendments with the building official.</p>
          </Sec>
        </>
      )}
      <p className="disclaimer">General guidance for learning, not project-specific engineering. Snow loads, structural sizing, soils and foundation design need a licensed professional.</p>
    </div>
  );
}

function AssemblyInfo({ id }: { id: keyof typeof ASSEMBLY_NOTES }) {
  const a = ASSEMBLY_BY_ID[id];
  const n = ASSEMBLY_NOTES[id];
  const ex = useStore((s) => s.exploded);
  return (
    <div className="info" data-testid="info-assembly">
      <div className="crumb">Assembly {a.letter}</div>
      <h2>{a.name}</h2>
      <p>{n.what}</p>
      <Sec title="Interior Alaska notes" accent><List items={n.cold} /></Sec>
      <p className="muted">{ex ? 'Tap a layer in the 3D view or the list to read its specification.' : 'Press Explode to separate the layers, then tap one to read its specification.'}</p>
      <p className="disclaimer">General guidance for learning, not project-specific engineering.</p>
    </div>
  );
}

export function RightPanel() {
  const layer = useStore((s) => s.layer);
  const asm = useStore((s) => s.assembly);
  return (
    <div className="panel-body">
      <div className="panel-title">
        {layer ? 'Material information' : asm ? 'Assembly overview' : 'Overview'}
        {layer && <button className="icon-btn" data-testid="close-info" title="Close material information" onClick={() => actions.selectLayer(null)}><IClose /></button>}
        {!layer && <button className="icon-btn mob" title="Collapse" onClick={() => set({ mobileTab: null })}><IClose /></button>}
      </div>
      {layer ? <LayerInfo id={layer} /> : asm ? <AssemblyInfo id={asm} /> : (
        <div className="info">
          <h2>HOUSE-X</h2>
          <p>An interactive 3D construction explorer for a cold-climate house. Tap the roof to start: it isolates the roofing assembly, then use Explode to pull its layers apart in 3D.</p>
          <List items={[
            'Select any of the eight assemblies (A–H).',
            'Explode separates real 3D layers; the Spread slider sets distance.',
            'Tap a layer to read thickness, installation, moisture and Interior Alaska notes.',
            'Switch roofing configurations without rebuilding the house.',
            'Use Section to cut the house open.',
          ]} />
          <p className="disclaimer">The model is illustrative. Thin layers are drawn thicker than reality so they can be seen. Not a design or code-compliance tool.</p>
        </div>
      )}
    </div>
  );
}
