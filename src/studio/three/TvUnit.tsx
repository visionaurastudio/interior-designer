import { B, useMats } from './parts';
import { Room } from './Kitchen';
import { LAYOUTS, TV_ZB } from './layouts';

/**
 * Procedural TV feature wall (prototype). Material slots:
 *   base = floating console, island = fluted side panels, countertop = stone back panel, hardware = trim.
 */
export default function TvUnit() {
  const m = useMats();
  const z = TV_ZB;
  const SIDE_W = 0.9, H = 2.7;
  const slatsPer = 9;
  const sides: number[] = [-1, 1];

  return (
    <group>
      <Room {...LAYOUTS.tv.room} />

      {/* fluted side panels */}
      {sides.map((s) => (
        <group key={s}>
          <B s={[SIDE_W, H, 0.03]} p={[s * (1.0 + SIDE_W / 2), H / 2, z + 0.015]} m={m.islandCarcass} />
          {Array.from({ length: slatsPer }, (_, i) => (
            <B key={i} s={[0.06, H, 0.03]} p={[s * (1.0 + 0.05 + i * 0.1), H / 2, z + 0.045]} m={m.island} />
          ))}
        </group>
      ))}

      {/* stone back panel */}
      <B s={[2.0, 2.3, 0.04]} p={[0, 0.4 + 1.15, z + 0.02]} m={m.countertop} />
      {/* trim lines between stone and slats */}
      {sides.map((s) => <B key={s} s={[0.016, H, 0.05]} p={[s * 1.0, H / 2, z + 0.03]} m={m.hardware} />)}
      <B s={[2.016, 0.016, 0.05]} p={[0, 2.7, z + 0.03]} m={m.hardware} cast={false} />

      {/* TV (fixed finish) */}
      <B s={[1.27, 0.74, 0.03]} p={[0, 1.55, z + 0.06]} m={m.blackMetal} />
      <B s={[1.23, 0.7, 0.012]} p={[0, 1.55, z + 0.082]} m={m.glass} cast={false} />

      {/* floating console */}
      <group position={[0, 0, z]}>
        <B s={[2.6, 0.38, 0.42]} p={[0, 0.41, 0.25]} m={m.baseCarcass} />
        {[-0.65, 0.65].map((x) => (
          <group key={x}>
            <B s={[1.28, 0.355, 0.018]} p={[x, 0.41, 0.46]} m={m.base} />
            <B s={[0.5, 0.012, 0.012]} p={[x, 0.55, 0.482]} m={m.hardware} cast={false} />
          </group>
        ))}
        <B s={[2.64, 0.012, 0.44]} p={[0, 0.606, 0.25]} m={m.hardware} cast={false} />
        <B s={[2.5, 0.008, 0.03]} p={[0, 0.215, 0.12]} m={m.led} cast={false} receive={false} />
      </group>
    </group>
  );
}
