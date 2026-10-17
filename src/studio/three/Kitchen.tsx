import { B, BaseModule, Run, useMats, COUNTER_T, COUNTER_Y } from './parts';
import { LAYOUTS } from './layouts';
import type { SceneId } from '../types';
import TvUnit from './TvUnit';
import Wardrobe from './Wardrobe';
import { cylGeo, planeGeo, ringGeo, sphereGeo } from './geometry';

export function Room({ w, d, zBack }: { w: number; d: number; zBack: number }) {
  const m = useMats();
  const h = 3.1;
  const zc = zBack + d / 2;
  return (
    <group>
      <mesh geometry={planeGeo(w, d)} material={m.floor} rotation-x={-Math.PI / 2} position={[0, 0, zc]} receiveShadow />
      {/* walls render from the inside only, so the room opens up when orbiting round the outside */}
      <mesh geometry={planeGeo(w, h)} material={m.wallPaint} position={[0, h / 2, zBack]} receiveShadow />
      <mesh geometry={planeGeo(d, h)} material={m.wallPaint} rotation-y={Math.PI / 2} position={[-w / 2, h / 2, zc]} receiveShadow />
      <mesh geometry={planeGeo(d, h)} material={m.wallPaint} rotation-y={-Math.PI / 2} position={[w / 2, h / 2, zc]} receiveShadow />
    </group>
  );
}

function Stool({ x, z }: { x: number; z: number }) {
  const m = useMats();
  return (
    <group position={[x, 0, z]}>
      <mesh geometry={cylGeo(0.18, 0.17, 0.06, 28)} material={m.stool} position={[0, 0.67, 0]} castShadow receiveShadow />
      {[[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.1], [0.1, 0.1]].map(([a, b], i) => (
        <mesh key={i} geometry={cylGeo(0.012, 0.012, 0.64, 8)} material={m.blackMetal} position={[a, 0.32, b]} castShadow />
      ))}
      <mesh geometry={ringGeo(0.135, 0.15)} material={m.blackMetal} rotation-x={-Math.PI / 2} position={[0, 0.25, 0]} />
    </group>
  );
}

function Pendant({ x }: { x: number }) {
  const m = useMats();
  return (
    <group position={[x, 0, 0.15]}>
      <mesh geometry={cylGeo(0.003, 0.003, 1.0, 6)} material={m.blackMetal} position={[0, 2.4, 0]} />
      <mesh geometry={cylGeo(0.05, 0.19, 0.22, 28, true)} material={m.hardware} position={[0, 1.89, 0]} castShadow>
      </mesh>
      <mesh geometry={sphereGeo(0.05)} material={m.bulb} position={[0, 1.82, 0]} />
      <pointLight position={[0, 1.7, 0]} intensity={5} distance={4} decay={2} color="#ffd9a8" />
    </group>
  );
}

function IslandBlock() {
  const m = useMats();
  const W = 2.58;
  const slats = Math.round(W / 0.1);
  const y = COUNTER_Y - COUNTER_T / 2;
  return (
    <group position={[0, 0, 0.9]}>
      {/* core */}
      <B s={[W - 0.02, 0.12, 0.84]} p={[0, 0.06, 0]} m={m.plinth} />
      <B s={[W, 0.74, 0.3]} p={[0, 0.12 + 0.37, 0.15]} m={m.islandCarcass} />
      {/* working side: storage modules facing the back run */}
      <group position={[W / 2, 0, 0.15]} rotation-y={Math.PI}>
        {([['drawers', 0], ['doors', 1], ['drawers', 2]] as const).map(([t, i]) => (
          <group key={i} position={[i * 0.86, 0, 0]}><BaseModule w={0.86} t={t} kind="island" /></group>
        ))}
      </group>
      {/* seating side: fluted panel */}
      <B s={[W, 0.74, 0.02]} p={[0, 0.12 + 0.37, 0.43]} m={m.islandCarcass} />
      {Array.from({ length: slats }, (_, i) => (
        <B key={i} s={[0.06, 0.74, 0.025]} p={[-W / 2 + 0.05 + i * 0.1, 0.12 + 0.37, 0.452]} m={m.island} />
      ))}
      {/* worktop with waterfall ends and seating overhang */}
      <B s={[W + 0.08, COUNTER_T, 1.2]} p={[0, y, 0.15]} m={m.countertop} />
      <B s={[0.04, COUNTER_Y - COUNTER_T, 0.9]} p={[-W / 2 - 0.02, (COUNTER_Y - COUNTER_T) / 2, 0]} m={m.countertop} />
      <B s={[0.04, COUNTER_Y - COUNTER_T, 0.9]} p={[W / 2 + 0.02, (COUNTER_Y - COUNTER_T) / 2, 0]} m={m.countertop} />
    </group>
  );
}

export default function Kitchen({ modelId }: { modelId: SceneId }) {
  if (modelId === 'tv') return <TvUnit />;
  if (modelId === 'wardrobe') return <Wardrobe />;
  return <KitchenScene modelId={modelId} />;
}

function KitchenScene({ modelId }: { modelId: SceneId }) {
  const L = LAYOUTS[modelId];
  const m = useMats();
  return (
    <group>
      <Room {...L.room} />
      {L.runs.map((r, i) => <Run key={`${modelId}-${i}`} {...r} />)}
      {L.island && (
        <>
          <IslandBlock />
          {[-0.75, 0, 0.75].map((x) => <Stool key={x} x={x} z={0.9 + 1.12} />)}
          {/* ceiling rail with pendants */}
          <B s={[2.2, 0.03, 0.03]} p={[0, 2.92, 1.05]} m={m.blackMetal} cast={false} receive={false} />
          {[-0.8, 0, 0.8].map((x) => <group key={x} position={[0, 0, 0.9]}><Pendant x={x} /></group>)}
        </>
      )}
    </group>
  );
}
