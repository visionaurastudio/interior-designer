import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import type { CameraCommand, CameraCommandInput, KitchenConfig, ModelDef, ViewId } from '../types';
import ErrorBoundary from './ErrorBoundary';
import FlatPreview from './FlatPreview';
import { hasWebGL } from '../util';

const Scene = lazy(() => import('../three/Scene'));

const VIEWS: { id: ViewId; label: string }[] = [
  { id: 'perspective', label: 'Perspective' },
  { id: 'front', label: 'Front' },
  { id: 'detail', label: 'Close-up' },
];

function Loading({ label = 'Preparing your kitchen' }: { label?: string }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <p className="loading__brand">Shree Shiv Steel Art</p>
      <p className="loading__text">{label}</p>
      <span className="loading__bar" aria-hidden="true"><i /></span>
    </div>
  );
}

function Fallback({ message, config, onClose }: { message: string; config: KitchenConfig; onClose: () => void }) {
  return (
    <div className="fallback" role="alert">
      <FlatPreview config={config} />
      <div>
        <h2>3D view unavailable</h2>
        <p>{message}</p>
        <p>You can still choose finishes and send your selection with your enquiry.</p>
        <button className="sbtn sbtn--ghost" onClick={onClose}>Close studio</button>
      </div>
    </div>
  );
}

interface Props {
  model: ModelDef;
  config: KitchenConfig;
  command: CameraCommand | null;
  onCommand: (c: CameraCommandInput) => void;
  onClose: () => void;
}

export default function Viewport({ model, config, command, onCommand, onClose }: Props) {
  const [webgl] = useState(hasWebGL);
  const [ready, setReady] = useState(false);
  const [fatal, setFatal] = useState<string | null>(null);
  const [view, setView] = useState<ViewId | null>('perspective');
  const [hint, setHint] = useState(true);

  const onReady = useCallback(() => setReady(true), []);
  const onFatal = useCallback((m: string) => setFatal(m), []);

  // fade the hint out after the first interaction
  useEffect(() => {
    if (!hint) return;
    const off = () => setHint(false);
    window.addEventListener('wheel', off, { once: true, passive: true });
    const t = setTimeout(off, 9000);
    return () => { window.removeEventListener('wheel', off); clearTimeout(t); };
  }, [hint]);

  if (!webgl) return <section className="viewport"><Fallback message="Your browser or device does not support WebGL, which is needed to draw the 3D view." config={config} onClose={onClose} /></section>;

  return (
    <section
      className="viewport"
      aria-label="3D kitchen viewer"
      onPointerDown={() => { setView(null); setHint(false); }}
    >
      <ErrorBoundary fallback={(m) => <Fallback message={`The 3D scene could not start (${m}).`} config={config} onClose={onClose} />}>
        {fatal ? (
          <Fallback message={fatal} config={config} onClose={onClose} />
        ) : (
          <Suspense fallback={<Loading label="Loading 3D engine" />}>
            <Scene modelId={model.id} config={config} command={command} onReady={onReady} onFatal={onFatal} />
          </Suspense>
        )}
      </ErrorBoundary>

      {!ready && !fatal && <Loading />}

      <header className="viewport__tag" onPointerDown={(e) => e.stopPropagation()}>
        <p className="viewport__brand">Shree Shiv Steel Art <span>3D Studio</span></p>
        <p className="viewport__model">
          {model.name} <em>{model.status}</em>
        </p>
        <button className="vclose" onClick={onClose} aria-label="Close 3D studio">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M1 1l14 14M15 1L1 15" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
          <span>Close</span>
        </button>
      </header>

      {ready && !fatal && (
        <>
          <div className={`hint${hint ? '' : ' is-gone'}`} aria-hidden="true">Drag to rotate · Scroll or pinch to zoom</div>

          <div className="vc vc--views" role="group" aria-label="Camera views" onPointerDown={(e) => e.stopPropagation()}>
            {VIEWS.map((v) => (
              <button
                key={v.id}
                className={`vc__btn${view === v.id ? ' is-on' : ''}`}
                aria-pressed={view === v.id}
                onClick={() => { setView(v.id); onCommand({ type: 'view', view: v.id }); }}
              >
                {v.label}
              </button>
            ))}
          </div>

          <div className="vc vc--zoom" role="group" aria-label="Zoom and reset" onPointerDown={(e) => e.stopPropagation()}>
            <button className="vc__icon" aria-label="Zoom in" onClick={() => onCommand({ type: 'zoom', factor: 0.78 })}>+</button>
            <button className="vc__icon" aria-label="Zoom out" onClick={() => onCommand({ type: 'zoom', factor: 1.28 })}>−</button>
            <button
              className="vc__icon"
              aria-label="Reset view"
              title="Reset view"
              onClick={() => { setView('perspective'); onCommand({ type: 'view', view: 'perspective' }); }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M4 10a6 6 0 1 0 2-4.5M4 3v3.5h3.5" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}
