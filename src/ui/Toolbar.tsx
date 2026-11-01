import { useState } from 'react';
import { actions, cam, useStore } from '../store';
import { IAll, ICamera, IExplode, ICollapse, IGhost, IIsolate, IReset, ISection, IView } from './icons';

const VIEWS = ['iso', 'front', 'right', 'back', 'left', 'top'];

export function Toolbar() {
  const exploded = useStore((s) => s.exploded);
  const asm = useStore((s) => s.assembly);
  const isolate = useStore((s) => s.isolate);
  const ghost = useStore((s) => s.ghost);
  const dist = useStore((s) => s.explodeDist);
  const sec = useStore((s) => s.section);
  const [menu, setMenu] = useState<null | 'view' | 'section'>(null);
  const toggle = (m: 'view' | 'section') => setMenu(menu === m ? null : m);

  return (
    <div className="toolbar-wrap">
      {menu === 'view' && (
        <div className="pop">
          {VIEWS.map((v) => <button key={v} className="chip" onClick={() => { cam.view(v); setMenu(null); }}>{v === 'iso' ? 'Isometric' : v[0].toUpperCase() + v.slice(1)}</button>)}
        </div>
      )}
      {menu === 'section' && (
        <div className="pop col">
          <label className="row"><span>Section cut</span>
            <button className={`chip ${sec.on ? 'on' : ''}`} onClick={() => actions.setSection({ on: !sec.on })}>{sec.on ? 'On' : 'Off'}</button></label>
          <div className="row">
            <button className={`chip ${sec.axis === 'x' ? 'on' : ''}`} onClick={() => actions.setSection({ axis: 'x', pos: 0, on: true })}>Profile (cut X)</button>
            <button className={`chip ${sec.axis === 'z' ? 'on' : ''}`} onClick={() => actions.setSection({ axis: 'z', pos: 0, on: true })}>Plan (cut Z)</button>
            <button className="chip" onClick={() => actions.setSection({ flip: !sec.flip })}>Flip side</button>
          </div>
          <input type="range" min={-7} max={7} step={0.05} value={sec.pos} aria-label="Section position"
            onChange={(e) => actions.setSection({ pos: +e.target.value, on: true })} />
        </div>
      )}
      <div className="toolbar" role="toolbar">
        <button className={`tb ${exploded ? 'on' : ''}`} data-testid="explode" onClick={actions.toggleExplode} title="Explode / collapse layers (E)">
          {exploded ? <ICollapse /> : <IExplode />}<span>{exploded ? 'Collapse' : 'Explode'}</span>
        </button>
        {exploded && (
          <label className="tb slider" title="Explosion distance">
            <span>Spread</span>
            <input type="range" min={0.1} max={1.3} step={0.01} value={dist} onChange={(e) => actions.setExplodeDist(+e.target.value)} />
          </label>
        )}
        <button className={`tb ${asm && isolate ? 'on' : ''}`} data-testid="isolate" onClick={actions.toggleIsolate} title="Isolate selected assembly (I)"><IIsolate /><span>Isolate</span></button>
        <button className={`tb ${ghost ? 'on' : ''}`} onClick={actions.toggleGhost} title="Show faint context of hidden assemblies"><IGhost /><span>Context</span></button>
        <button className="tb" data-testid="show-all" onClick={actions.showAll} title="Show whole house (A)"><IAll /><span>Show all</span></button>
        <button className="tb" onClick={actions.resetAssembly} title="Restore hidden layers and reassemble"><IReset /><span>Reset asm.</span></button>
        <button className="tb" data-testid="reset-camera" onClick={cam.reset} title="Reset camera (R)"><ICamera /><span>Reset cam</span></button>
        <button className={`tb ${menu === 'view' ? 'on' : ''}`} onClick={() => toggle('view')}><IView /><span>Views</span></button>
        <button className={`tb ${sec.on || menu === 'section' ? 'on' : ''}`} onClick={() => toggle('section')}><ISection /><span>Section</span></button>
      </div>
    </div>
  );
}
