import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CameraCommand, CameraCommandInput, KitchenConfig, Product, SceneId } from './types';
import { MODELS, PRODUCT_DEFAULTS } from './data/finishes';
import Viewport from './components/Viewport';
import Panel, { PRODUCT_LABEL, summaryRows } from './components/Panel';
import { lockScroll, scrollToId } from '../hooks/useLenis';
import { sendEnquiryDraft } from '../enquiry';
import './studio.css';

const PROJECT_TYPE: Record<Product, string> = { kitchen: 'Modular Kitchen', tv: 'TV Unit', wardrobe: 'Wardrobe / Bedroom' };

/** Fullscreen 3D studio. Lazy-loaded; locks page scrolling while open and restores it on close. */
export default function Studio({ initial, onClose }: { initial: Product; onClose: () => void }) {
  const [product, setProduct] = useState<Product>(initial);
  const [kitchenModel, setKitchenModel] = useState<SceneId>('island');
  const [configs, setConfigs] = useState<Record<Product, KitchenConfig>>(PRODUCT_DEFAULTS);
  const [command, setCommand] = useState<CameraCommand | null>(null);
  const nonce = useRef(0);
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const sceneId: SceneId = product === 'kitchen' ? kitchenModel : product;
  const model = MODELS.find((m) => m.id === sceneId)!;
  const config = configs[product];

  const send = useCallback((c: CameraCommandInput) => setCommand({ ...c, nonce: ++nonce.current }), []);

  useEffect(() => {
    opener.current = document.activeElement;
    lockScroll(true);
    root.current?.querySelector<HTMLElement>('.vclose')?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && root.current) {
        const f = Array.from(root.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href]')).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      lockScroll(false);
      (opener.current as HTMLElement | null)?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  const summary = useMemo(() => {
    const rows = summaryRows(product, config, model.hasIsland).map((r) => `${r.label}: ${r.finish.name}`);
    return [
      `3D configuration (design prototype, not a final quote)`,
      `Product: ${PRODUCT_LABEL[product]}${product === 'kitchen' ? `, ${model.name} layout` : ''}`,
      ...rows,
    ].join('\n');
  }, [product, config, model]);

  const toEnquiry = () => {
    sendEnquiryDraft({ projectType: PROJECT_TYPE[product], message: summary });
    onClose();
    setTimeout(() => scrollToId('enquiry'), 450);
  };

  return (
    <div className="studio" ref={root} role="dialog" aria-modal="true" aria-label="3D studio" data-lenis-prevent>
      <div className="app">
        <Viewport model={model} config={config} command={command} onCommand={send} onClose={onClose} />
        <Panel
          product={product}
          model={model}
          config={config}
          onProduct={(p) => setProduct(p)}
          onModel={setKitchenModel}
          onConfig={(patch) => setConfigs((c) => ({ ...c, [product]: { ...c[product], ...patch } }))}
          onReset={() => { setConfigs((c) => ({ ...c, [product]: PRODUCT_DEFAULTS[product] })); send({ type: 'view', view: 'perspective' }); }}
          onEnquiry={toEnquiry}
        />
      </div>
    </div>
  );
}
