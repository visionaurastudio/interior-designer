import { useState, type ReactElement } from 'react';
import type { CabinetTarget, Finish, KitchenConfig, ModelDef, Product, SceneId } from '../types';
import {
  BACKSPLASHES, CABINET_FINISHES, COUNTERTOPS, HARDWARE, KITCHEN_MODELS,
  backsplashFinish, cabinetFinish, countertopFinish, hardwareFinish,
} from '../data/finishes';
import Swatches from './Swatches';
import { BUSINESS } from '../../config';

const PLAN: Record<string, ReactElement> = {
  linear: <svg viewBox="0 0 48 32" aria-hidden="true"><rect x="4" y="4" width="40" height="7" /></svg>,
  lshape: <svg viewBox="0 0 48 32" aria-hidden="true"><path d="M4 4h40v7H11v17H4z" /></svg>,
  island: <svg viewBox="0 0 48 32" aria-hidden="true"><rect x="4" y="3" width="40" height="6" /><rect x="12" y="17" width="24" height="8" /></svg>,
};

export const PRODUCT_LABEL: Record<Product, string> = { kitchen: 'Modular kitchen', tv: 'TV unit', wardrobe: 'Wardrobe' };

interface Row { label: string; finish: Finish }

/** The summary rows for each product (also used to build the enquiry text). */
export function summaryRows(product: Product, config: KitchenConfig, hasIsland: boolean): Row[] {
  if (product === 'tv') return [
    { label: 'Console', finish: cabinetFinish(config.base) },
    { label: 'Fluted panels', finish: cabinetFinish(config.island) },
    { label: 'Back panel', finish: countertopFinish(config.countertop) },
    { label: 'Trim & handles', finish: hardwareFinish(config.hardware) },
  ];
  if (product === 'wardrobe') return [
    { label: 'Body', finish: cabinetFinish(config.base) },
    { label: 'Shutters', finish: cabinetFinish(config.wall) },
    { label: 'Loft & accent', finish: cabinetFinish(config.island) },
    { label: 'Handles & trim', finish: hardwareFinish(config.hardware) },
  ];
  return [
    { label: 'Base cabinets', finish: cabinetFinish(config.base) },
    { label: 'Wall cabinets', finish: cabinetFinish(config.wall) },
    ...(hasIsland ? [{ label: 'Island', finish: cabinetFinish(config.island) }] : []),
    { label: 'Countertop', finish: countertopFinish(config.countertop) },
    { label: 'Backsplash', finish: backsplashFinish(config.backsplash) },
    { label: 'Handles & hardware', finish: hardwareFinish(config.hardware) },
  ];
}

interface Props {
  product: Product;
  model: ModelDef;
  config: KitchenConfig;
  onProduct: (p: Product) => void;
  onModel: (id: SceneId) => void;
  onConfig: (patch: Partial<KitchenConfig>) => void;
  onReset: () => void;
  onEnquiry: () => void;
}

export default function Panel({ product, model, config, onProduct, onModel, onConfig, onReset, onEnquiry }: Props) {
  const [target, setTarget] = useState<CabinetTarget>('all');
  const targets: { id: CabinetTarget; label: string }[] = [
    { id: 'all', label: 'All' }, { id: 'base', label: 'Base' }, { id: 'wall', label: 'Wall' },
    ...(model.hasIsland ? [{ id: 'island' as const, label: 'Island' }] : []),
  ];
  const safeTarget = targets.some((t) => t.id === target) ? target : 'all';
  const setCabinet = (id: string) => {
    if (safeTarget === 'all') onConfig({ base: id, wall: id, ...(model.hasIsland ? { island: id } : {}) });
    else onConfig({ [safeTarget]: id });
  };
  const phone = BUSINESS.phone.replace(/\s+/g, '');
  const rows = summaryRows(product, config, model.hasIsland);

  return (
    <aside className="panel" aria-label="Customise your product">
      <section className="panel__sec panel__sec--first">
        <div className="ptabs" role="group" aria-label="Product">
          {(['kitchen', 'tv', 'wardrobe'] as Product[]).map((p) => (
            <button key={p} className={`ptab${p === product ? ' is-on' : ''}`} aria-pressed={p === product} onClick={() => onProduct(p)}>
              {PRODUCT_LABEL[p]}
            </button>
          ))}
        </div>
        <p className="panel__note">
          {model.tagline}. A procedural 3D prototype, not a model of an actual installation. Dressing tables and bathroom
          storage are not available in 3D yet.
        </p>
      </section>

      {product === 'kitchen' && (
        <>
          <section className="panel__sec">
            <h2 className="panel__h">Layout</h2>
            <div className="models" role="group" aria-label="Kitchen layout">
              {KITCHEN_MODELS.map((m) => (
                <button key={m.id} className={`model${m.id === model.id ? ' is-on' : ''}`} aria-pressed={m.id === model.id} onClick={() => onModel(m.id)}>
                  <span className="model__plan">{PLAN[m.id]}</span>
                  <span className="model__name">{m.name}</span>
                  <span className="model__tag">{m.id === 'island' ? 'Primary' : 'Prototype'}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel__sec">
            <div className="panel__row">
              <h2 className="panel__h">Cabinets</h2>
              <div className="seg" role="group" aria-label="Apply cabinet colour to">
                {targets.map((t) => (
                  <button key={t.id} className={`seg__b${safeTarget === t.id ? ' is-on' : ''}`} aria-pressed={safeTarget === t.id} onClick={() => setTarget(t.id)}>{t.label}</button>
                ))}
              </div>
            </div>
            <Swatches label="Cabinet finish" finishes={CABINET_FINISHES} value={safeTarget === 'all' ? '' : config[safeTarget]} onChange={setCabinet} />
            {safeTarget === 'all' && <p className="panel__note">Choosing a finish applies it to every cabinet group. Pick Base, Wall or Island to mix finishes.</p>}
          </section>
          <section className="panel__sec">
            <h2 className="panel__h">Countertop</h2>
            <Swatches label="Countertop" finishes={COUNTERTOPS} value={config.countertop} onChange={(id) => onConfig({ countertop: id })} size="sm" />
          </section>
          <section className="panel__sec">
            <h2 className="panel__h">Backsplash</h2>
            <Swatches label="Backsplash" finishes={BACKSPLASHES} value={config.backsplash} onChange={(id) => onConfig({ backsplash: id })} size="sm" />
          </section>
        </>
      )}

      {product === 'tv' && (
        <>
          <section className="panel__sec">
            <h2 className="panel__h">Console</h2>
            <Swatches label="Console finish" finishes={CABINET_FINISHES} value={config.base} onChange={(id) => onConfig({ base: id })} />
          </section>
          <section className="panel__sec">
            <h2 className="panel__h">Fluted side panels</h2>
            <Swatches label="Fluted panel finish" finishes={CABINET_FINISHES} value={config.island} onChange={(id) => onConfig({ island: id })} />
          </section>
          <section className="panel__sec">
            <h2 className="panel__h">Back panel</h2>
            <Swatches label="Back panel stone" finishes={COUNTERTOPS} value={config.countertop} onChange={(id) => onConfig({ countertop: id })} size="sm" />
          </section>
        </>
      )}

      {product === 'wardrobe' && (
        <>
          <section className="panel__sec">
            <h2 className="panel__h">Body &amp; open unit</h2>
            <Swatches label="Body finish" finishes={CABINET_FINISHES} value={config.base} onChange={(id) => onConfig({ base: id })} />
          </section>
          <section className="panel__sec">
            <h2 className="panel__h">Shutters</h2>
            <Swatches label="Shutter finish" finishes={CABINET_FINISHES} value={config.wall} onChange={(id) => onConfig({ wall: id })} />
          </section>
          <section className="panel__sec">
            <h2 className="panel__h">Loft &amp; accent</h2>
            <Swatches label="Loft and accent finish" finishes={CABINET_FINISHES} value={config.island} onChange={(id) => onConfig({ island: id })} />
          </section>
        </>
      )}

      <section className="panel__sec">
        <h2 className="panel__h">{product === 'kitchen' ? 'Handles & hardware' : 'Trim & handles'}</h2>
        <Swatches label="Hardware" finishes={HARDWARE} value={config.hardware} onChange={(id) => onConfig({ hardware: id })} size="sm" />
      </section>

      <section className="panel__sec panel__sum" aria-label="Selected configuration">
        <h2 className="panel__h">Your selection</h2>
        <dl>
          <div><dt>Product</dt><dd>{PRODUCT_LABEL[product]}{product === 'kitchen' ? `, ${model.name}` : ''}</dd></div>
          {rows.map(({ label, finish }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd><i style={{ background: finish.color }} aria-hidden="true" />{finish.name}{finish.note ? <small>{finish.note}</small> : null}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="panel__cta">
        <button className="sbtn sbtn--solid" onClick={onEnquiry}>Send this to my enquiry</button>
        {BUSINESS.phone && <a className="sbtn sbtn--ghost" href={`tel:${phone}`}>Call {BUSINESS.phone}</a>}
        <button className="sbtn sbtn--ghost" onClick={onReset}>Reset finishes &amp; view</button>
      </div>
    </aside>
  );
}
