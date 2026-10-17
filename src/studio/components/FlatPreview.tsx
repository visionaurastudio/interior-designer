import type { KitchenConfig } from '../types';
import { backsplashFinish, cabinetFinish, countertopFinish, hardwareFinish } from '../data/finishes';

/** 2D elevation shown only when WebGL is unavailable, so the configuration still has a visual. */
export default function FlatPreview({ config }: { config: KitchenConfig }) {
  const base = cabinetFinish(config.base).color, wall = cabinetFinish(config.wall).color;
  const top = countertopFinish(config.countertop).color, splash = backsplashFinish(config.backsplash).color;
  const hw = hardwareFinish(config.hardware).color;
  return (
    <svg viewBox="0 0 400 240" role="img" aria-label="Flat elevation of the selected finishes" className="flat">
      <rect width="400" height="240" fill="#d6d0c3" />
      <rect x="20" y="120" width="360" height="40" fill={splash} />
      {[0, 1, 2, 3].map((i) => (<g key={i}><rect x={20 + i * 90} y="30" width="88" height="90" fill={wall} stroke="#0003" /><rect x={50 + i * 90} y="104" width="28" height="3" fill={hw} /></g>))}
      <rect x="14" y="160" width="372" height="8" fill={top} />
      {[0, 1, 2, 3].map((i) => (<g key={i}><rect x={20 + i * 90} y="168" width="88" height="56" fill={base} stroke="#0003" /><rect x={44 + i * 90} y="176" width="40" height="3" fill={hw} /></g>))}
      <rect x="20" y="224" width="360" height="8" fill="#1a1b1c" />
    </svg>
  );
}
