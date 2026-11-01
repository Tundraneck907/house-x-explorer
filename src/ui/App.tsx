import { useEffect, useRef } from 'react';
import { Engine } from '../engine/Engine';
import { actions, cam, set, useStore, getState } from '../store';
import { LeftPanel } from './LeftPanel';
import { RightPanel } from './RightPanel';
import { Toolbar } from './Toolbar';
import { IPanel } from './icons';

function Viewport() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const e = new Engine(ref.current!);
    set({ ready: true });
    return () => e.dispose();
  }, []);
  return <div className="viewport-canvas" ref={ref} data-testid="viewport" />;
}

function Toast() {
  const t = useStore((s) => s.toast);
  return t ? <div className="toast">{t}</div> : null;
}

function Hud() {
  const asm = useStore((s) => s.assembly);
  const layer = useStore((s) => s.layer);
  const exploded = useStore((s) => s.exploded);
  return (
    <div className="hud">
      <span className="hud-tag">{asm ? 'ASSEMBLY' : 'WHOLE HOUSE'}</span>
      {exploded && <span className="hud-tag hot">EXPLODED</span>}
      {layer && <span className="hud-tag hot">LAYER</span>}
    </div>
  );
}

export default function App() {
  const infoOpen = useStore((s) => s.infoOpen);
  const leftOpen = useStore((s) => s.leftOpen);
  const tab = useStore((s) => s.mobileTab);
  const layer = useStore((s) => s.layer);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      if (k === 'e') actions.toggleExplode();
      else if (k === 'i') actions.toggleIsolate();
      else if (k === 'a') actions.showAll();
      else if (k === 'r') cam.reset();
      else if (k === 'escape') { if (getState().layer) actions.selectLayer(null); else if (getState().assembly) actions.showAll(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  return (
    <div className={`app ${leftOpen ? '' : 'no-left'} ${infoOpen ? '' : 'no-info'} tab-${tab ?? 'none'}`}>
      <header className="topbar">
        <div className="brand"><span className="logo" />HOUSE-X<span className="sub">Interactive Building Systems Lab</span></div>
        <div className="top-actions">
          <button className="icon-btn desk" title="Toggle assemblies panel" onClick={() => set({ leftOpen: !leftOpen })}><IPanel /></button>
          <button className="icon-btn desk flip" title="Toggle information panel" onClick={() => set({ infoOpen: !infoOpen })}><IPanel /></button>
        </div>
      </header>
      <aside className="left"><LeftPanel /></aside>
      <main className="center">
        <Viewport />
        <Hud />
        <Toast />
        <Toolbar />
      </main>
      <aside className="right"><RightPanel /></aside>
      <nav className="tabs">
        <button className={tab === 'assemblies' ? 'on' : ''} onClick={() => set({ mobileTab: tab === 'assemblies' ? null : 'assemblies' })}>Assemblies</button>
        <button className={tab === 'info' ? 'on' : ''} onClick={() => set({ mobileTab: tab === 'info' ? null : 'info' })}>
          Info{layer ? ' •' : ''}
        </button>
      </nav>
    </div>
  );
}
