import { createContext, useContext } from 'react';
import type * as THREE from 'three';
import type { KitchenMaterials } from './materials';
import { boxGeo, cylGeo, ringGeo, sphereGeo } from './geometry';

export const MatContext = createContext<KitchenMaterials>(null as unknown as KitchenMaterials);
export const useMats = () => useContext(MatContext);

type V3 = [number, number, number];

// ---- real-world dimensions (metres) ------------------------------------------
export const D = 0.6;            // base cabinet depth
export const PLINTH = 0.12;
export const BASE_H = 0.74;      // fronts + carcass above the plinth
export const COUNTER_Y = 0.9;    // finished worktop height
export const COUNTER_T = 0.04;
export const WALL_Y = 1.45;      // underside of wall cabinets
export const WALL_H = 0.72;
export const WALL_D = 0.35;
export const TALL_H = 2.3;
const T = 0.018;                 // front thickness
const GAP = 0.004;

export function B({ s, p, m, cast = true, receive = true }: { s: V3; p: V3; m: THREE.Material; cast?: boolean; receive?: boolean }) {
  return <mesh geometry={boxGeo(...s)} material={m} position={p} castShadow={cast} receiveShadow={receive} />;
}

/** Bar handle with two stand-offs. Vertical (along y) or horizontal (along x). */
export function Handle({ len, pos, vertical }: { len: number; pos: V3; vertical?: boolean }) {
  const { hardware } = useMats();
  const off = len / 2 - 0.035;
  return (
    <group position={pos}>
      <mesh geometry={cylGeo(0.006, 0.006, len, 12)} material={hardware} rotation-z={vertical ? 0 : Math.PI / 2} position={[0, 0, 0.024]} castShadow />
      {[-off, off].map((o) => (
        <mesh key={o} geometry={cylGeo(0.004, 0.004, 0.024, 8)} material={hardware} rotation-x={Math.PI / 2} position={vertical ? [0, o, 0.012] : [o, 0, 0.012]} />
      ))}
    </group>
  );
}

type FrontMat = { front: THREE.Material; carcass: THREE.Material };

/** Door fronts across width w, between y0 and y0+h. Origin = module left edge, front plane at z=zf. */
function Doors({ w, y0, h, zf, fm, handleY, handleLen = 0.22 }: { w: number; y0: number; h: number; zf: number; fm: FrontMat; handleY: number; handleLen?: number }) {
  const n = w > 0.65 ? 2 : 1;
  const dw = (w - GAP * (n + 1)) / n;
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = GAP + i * (dw + GAP) + dw / 2;
        // handle sits on the edge that meets the neighbouring door (or the free edge for a single door)
        const hx = n === 2 ? (i === 0 ? x + dw / 2 - 0.035 : x - dw / 2 + 0.035) : x + dw / 2 - 0.035;
        return (
          <group key={i}>
            <B s={[dw, h - GAP, T]} p={[x, y0 + h / 2, zf - T / 2]} m={fm.front} />
            <Handle len={handleLen} vertical pos={[hx, handleY, zf]} />
          </group>
        );
      })}
    </>
  );
}

function Drawers({ w, y0, zf, fm, count = 3 }: { w: number; y0: number; zf: number; fm: FrontMat; count?: number }) {
  const total = BASE_H;
  const hs = count === 3 ? [0.2, 0.2, total - 0.4] : [total / count];
  let top = y0 + total;
  const bar = Math.max(0.2, Math.min(w - 0.16, 0.7));
  return (
    <>
      {hs.map((h, i) => {
        const hh = h - GAP;
        const yc = top - h / 2;
        const y = yc;
        top -= h;
        return (
          <group key={i}>
            <B s={[w - GAP * 2, hh, T]} p={[w / 2, y, zf - T / 2]} m={fm.front} />
            <Handle len={bar} pos={[w / 2, y + hh / 2 - 0.04, zf]} />
          </group>
        );
      })}
    </>
  );
}

export type ModType = 'drawers' | 'doors' | 'sink' | 'hob' | 'tall' | 'fridge';

export function BaseModule({ w, t, kind }: { w: number; t: ModType; kind: 'base' | 'island' }) {
  const m = useMats();
  const fm: FrontMat = kind === 'base' ? { front: m.base, carcass: m.baseCarcass } : { front: m.island, carcass: m.islandCarcass };
  const zf = D;

  if (t === 'tall') {
    const upper = 1.0;
    const lower = TALL_H - PLINTH - upper;
    return (
      <group>
        <B s={[w - 0.01, PLINTH, D - 0.07]} p={[w / 2, PLINTH / 2, (D - 0.07) / 2]} m={m.plinth} />
        <B s={[w - 0.004, TALL_H - PLINTH, D - 0.02]} p={[w / 2, PLINTH + (TALL_H - PLINTH) / 2, (D - 0.02) / 2]} m={fm.carcass} />
        <Doors w={w} y0={PLINTH} h={lower} zf={zf} fm={fm} handleY={PLINTH + lower - 0.2} handleLen={0.3} />
        <Doors w={w} y0={PLINTH + lower} h={upper} zf={zf} fm={fm} handleY={PLINTH + lower + 0.2} handleLen={0.22} />
      </group>
    );
  }

  if (t === 'fridge') {
    const fw = w - 0.03;
    return (
      <group>
        <B s={[0.02, TALL_H, D]} p={[0.01, TALL_H / 2, D / 2]} m={fm.front} />
        <B s={[0.02, TALL_H, D]} p={[w - 0.01, TALL_H / 2, D / 2]} m={fm.front} />
        <B s={[w - 0.004, 0.46, D - 0.02]} p={[w / 2, TALL_H - 0.23, (D - 0.02) / 2]} m={fm.carcass} />
        <B s={[w - 0.04, 0.44, T]} p={[w / 2, TALL_H - 0.23, zf - T / 2]} m={fm.front} />
        {/* appliance (fixed stainless finish) */}
        <B s={[fw, 1.82, 0.66]} p={[w / 2, 0.02 + 0.91, 0.34]} m={m.steel} />
        <B s={[fw, 0.006, 0.01]} p={[w / 2, 0.02 + 0.55, 0.675]} m={m.glass} />
        <Handle len={0.7} vertical pos={[w / 2 - fw / 2 + 0.05, 1.45, 0.67]} />
        <Handle len={0.5} vertical pos={[w / 2 - fw / 2 + 0.05, 0.38, 0.67]} />
      </group>
    );
  }

  const hasHob = t === 'hob';
  const hasSink = t === 'sink';
  return (
    <group>
      <B s={[w - 0.01, PLINTH, D - 0.07]} p={[w / 2, PLINTH / 2, (D - 0.07) / 2]} m={m.plinth} />
      <B s={[w - 0.004, BASE_H, D - 0.02]} p={[w / 2, PLINTH + BASE_H / 2, (D - 0.02) / 2]} m={fm.carcass} />
      {t === 'drawers' || hasHob ? (
        <Drawers w={w} y0={PLINTH} zf={zf} fm={fm} />
      ) : (
        <Doors w={w} y0={PLINTH} h={BASE_H} zf={zf} fm={fm} handleY={PLINTH + BASE_H - 0.18} />
      )}
      {hasSink && <Sink w={w} />}
      {hasHob && <Hob w={w} />}
    </group>
  );
}

function Sink({ w }: { w: number }) {
  const m = useMats();
  const y = COUNTER_Y + COUNTER_T / 2 + 0.002;
  return (
    <group position={[w / 2, y, 0.3]}>
      <B s={[0.78, 0.004, 0.46]} p={[0, 0, 0]} m={m.steel} cast={false} />
      <B s={[0.7, 0.006, 0.38]} p={[0, 0.001, 0]} m={m.darkSteel} cast={false} />
      <mesh geometry={ringGeo(0.0, 0.012)} material={m.glass} rotation-x={-Math.PI / 2} position={[0, 0.005, 0.1]} />
      {/* tap */}
      <mesh geometry={cylGeo(0.016, 0.018, 0.3, 14)} material={m.steel} position={[0, 0.15, -0.26]} castShadow />
      <mesh geometry={cylGeo(0.009, 0.009, 0.2, 12)} material={m.steel} rotation-x={Math.PI / 2} position={[0, 0.3, -0.16]} castShadow />
      <mesh geometry={cylGeo(0.011, 0.011, 0.06, 12)} material={m.steel} position={[0, 0.27, -0.06]} />
    </group>
  );
}

function Hob({ w }: { w: number }) {
  const m = useMats();
  const y = COUNTER_Y + COUNTER_T / 2 + 0.002;
  const hw = Math.min(0.6, w - 0.1);
  const rx = hw / 4;
  return (
    <group position={[w / 2, y, 0.31]}>
      <B s={[hw, 0.006, 0.5]} p={[0, 0, 0]} m={m.glass} cast={false} />
      {[-rx, rx].flatMap((x) => [-0.1, 0.1].map((z) => (
        <mesh key={`${x}${z}`} geometry={ringGeo(0.055, 0.06)} material={m.darkSteel} rotation-x={-Math.PI / 2} position={[x, 0.0035, z]} />
      )))}
    </group>
  );
}

export type WallType = 'wall' | 'hood' | 'shelf' | 'gap';

export function WallModule({ w, t }: { w: number; t: WallType }) {
  const m = useMats();
  const fm = { front: m.wall, carcass: m.wallCarcass };
  if (t === 'gap') return null;
  const zf = WALL_D;
  const y0 = WALL_Y;

  if (t === 'hood') {
    return (
      <group>
        <B s={[w, 0.14, 0.5]} p={[w / 2, y0 + 0.2, 0.25]} m={m.steel} />
        <B s={[0.32, 0.8, 0.3]} p={[w / 2, y0 + 0.67, 0.15]} m={m.steel} />
        <B s={[w - 0.1, 0.01, 0.4]} p={[w / 2, y0 + 0.125, 0.26]} m={m.glass} cast={false} />
      </group>
    );
  }

  if (t === 'shelf') {
    return (
      <group>
        <B s={[0.03, WALL_H, WALL_D]} p={[0.015, y0 + WALL_H / 2, WALL_D / 2]} m={fm.front} />
        <B s={[0.03, WALL_H, WALL_D]} p={[w - 0.015, y0 + WALL_H / 2, WALL_D / 2]} m={fm.front} />
        {[0.02, WALL_H / 2, WALL_H - 0.02].map((dy, i) => (
          <B key={i} s={[w, 0.03, WALL_D]} p={[w / 2, y0 + dy, WALL_D / 2]} m={fm.front} />
        ))}
        {[0.2, 0.36, 0.5, 0.64, 0.72].filter((x) => x < w - 0.1).map((x, i) => (
          <mesh key={i} geometry={cylGeo(0.05, 0.05, 0.16 + (i % 2) * 0.06, 16)} material={m.jar} position={[x + 0.08, y0 + WALL_H / 2 + 0.015 + 0.09, 0.17]} castShadow />
        ))}
        {[0.22, 0.4, 0.58].filter((x) => x < w - 0.1).map((x, i) => (
          <mesh key={i} geometry={sphereGeo(0.07)} material={m.darkSteel} position={[x + 0.07, y0 + 0.02 + 0.015 + 0.07, 0.17]} castShadow />
        ))}
        <B s={[w, 0.008, 0.03]} p={[w / 2, y0 - 0.004, WALL_D - 0.06]} m={m.led} cast={false} receive={false} />
      </group>
    );
  }

  return (
    <group>
      <B s={[w - 0.004, WALL_H, WALL_D - 0.02]} p={[w / 2, y0 + WALL_H / 2, (WALL_D - 0.02) / 2]} m={fm.carcass} />
      <Doors w={w} y0={y0} h={WALL_H} zf={zf} fm={fm} handleY={y0 + 0.16} handleLen={0.18} />
      <B s={[w, 0.008, 0.03]} p={[w / 2, y0 - 0.004, WALL_D - 0.06]} m={m.led} cast={false} receive={false} />
    </group>
  );
}

export interface ModSpec { t: ModType; w: number }
export interface WallSpec { t: WallType; w: number }

export interface RunProps {
  mods: ModSpec[];
  walls: WallSpec[];
  position: V3;
  rotationY?: number;
  /** shorten the final worktop/backsplash segment (used where two runs meet in a corner) */
  trimEnd?: number;
}

/** One straight run of base modules, worktop, backsplash and wall units. Local +x runs along the wall, +z towards the room. */
export function Run({ mods, walls, position, rotationY = 0, trimEnd = 0 }: RunProps) {
  const m = useMats();
  // continuous worktop/backsplash segments are broken by full-height units
  const segs: [number, number][] = [];
  let x = 0, start: number | null = null;
  mods.forEach((md) => {
    if (md.t === 'tall' || md.t === 'fridge') {
      if (start !== null) { segs.push([start, x]); start = null; }
    } else if (start === null) start = x;
    x += md.w;
  });
  if (start !== null) segs.push([start, x - trimEnd]);

  let mx = 0;
  let wx = 0;
  return (
    <group position={position} rotation-y={rotationY}>
      {mods.map((md, i) => {
        const el = (
          <group key={i} position={[mx, 0, 0]}>
            <BaseModule w={md.w} t={md.t} kind="base" />
          </group>
        );
        mx += md.w;
        return el;
      })}
      {segs.map(([a, b], i) => (
        <group key={i}>
          <B s={[b - a, COUNTER_T, 0.62]} p={[(a + b) / 2, COUNTER_Y - COUNTER_T / 2, 0.31]} m={m.countertop} />
          <B s={[b - a, WALL_Y - COUNTER_Y, 0.012]} p={[(a + b) / 2, (WALL_Y + COUNTER_Y) / 2, 0.006]} m={m.backsplash} cast={false} />
        </group>
      ))}
      {walls.map((wd, i) => {
        const el = (
          <group key={i} position={[wx, 0, 0]}>
            <WallModule w={wd.w} t={wd.t} />
          </group>
        );
        wx += wd.w;
        return el;
      })}
    </group>
  );
}
