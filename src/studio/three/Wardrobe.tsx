import { B, Handle, useMats } from './parts';
import { Room } from './Kitchen';
import { LAYOUTS, WR_ZB } from './layouts';

/**
 * Procedural wardrobe (prototype). Material slots:
 *   base = carcass / open unit, wall = main shutters, island = loft & accent shutters, hardware = handles.
 */
export default function Wardrobe() {
  const m = useMats();
  const z = WR_ZB;
  const D = 0.58, T = 0.018, PL = 0.1;
  const mainW = 2.8, openW = 0.4;
  const x0 = -(mainW + openW) / 2;
  const mainH = 1.95, loftH = 0.35;
  const doorW = mainW / 4;
  const topY = PL + mainH + loftH;

  return (
    <group>
      <Room {...LAYOUTS.wardrobe.room} />
      <group position={[0, 0, z]}>
        <B s={[mainW + openW - 0.01, PL, D - 0.06]} p={[0, PL / 2, (D - 0.06) / 2]} m={m.plinth} />
        {/* main body */}
        <B s={[mainW, mainH + loftH, D - 0.02]} p={[x0 + mainW / 2, PL + (mainH + loftH) / 2, (D - 0.02) / 2]} m={m.baseCarcass} />
        {Array.from({ length: 4 }, (_, i) => {
          const cx = x0 + doorW * i + doorW / 2;
          return (
            <group key={i}>
              <B s={[doorW - 0.004, mainH - 0.004, T]} p={[cx, PL + mainH / 2, D - T / 2]} m={m.wall} />
              <Handle len={0.5} vertical pos={[i % 2 === 0 ? cx + doorW / 2 - 0.05 : cx - doorW / 2 + 0.05, PL + mainH / 2, D]} />
              <B s={[doorW - 0.004, loftH - 0.004, T]} p={[cx, PL + mainH + loftH / 2, D - T / 2]} m={m.island} />
              <Handle len={0.14} pos={[cx, PL + mainH + 0.06, D]} />
            </group>
          );
        })}
        {/* open unit with lit shelves */}
        <group position={[x0 + mainW + openW / 2, 0, 0]}>
          <B s={[0.018, topY - PL, D]} p={[-openW / 2 + 0.009, PL + (topY - PL) / 2, D / 2]} m={m.base} />
          <B s={[0.018, topY - PL, D]} p={[openW / 2 - 0.009, PL + (topY - PL) / 2, D / 2]} m={m.base} />
          <B s={[openW, topY - PL, 0.012]} p={[0, PL + (topY - PL) / 2, 0.006]} m={m.baseCarcass} />
          {[PL + 0.01, 0.7, 1.15, 1.6, 2.05, topY - 0.009].map((y, i) => (
            <group key={i}>
              <B s={[openW, 0.018, D]} p={[0, y, D / 2]} m={m.base} />
              {i > 0 && i < 5 && <B s={[openW - 0.04, 0.006, 0.02]} p={[0, y - 0.012, D - 0.06]} m={m.led} cast={false} receive={false} />}
            </group>
          ))}
        </group>
        {/* top trim */}
        <B s={[mainW + openW + 0.02, 0.012, D + 0.01]} p={[0, topY + 0.006, D / 2]} m={m.hardware} cast={false} />
      </group>
    </group>
  );
}
