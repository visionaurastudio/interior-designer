import { useEffect, useMemo, useRef, type ElementRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { CameraCommand, KitchenConfig, SceneId } from '../types';
import { MatContext } from './parts';
import { applyConfig, createMaterials, disposeMaterials } from './materials';
import { disposeGeometries } from './geometry';
import { disposeTextures } from './textures';
import { LAYOUTS } from './layouts';
import Kitchen from './Kitchen';

type OrbitControlsImpl = ElementRef<typeof OrbitControls>;

interface Props {
  modelId: SceneId;
  config: KitchenConfig;
  command: CameraCommand | null;
  onReady: () => void;
  onFatal: (message: string) => void;
}

/** Owns the GPU materials for the lifetime of the scene; updates them in place when the configuration changes. */
function MaterialProvider({ config, children }: { config: KitchenConfig; children: React.ReactNode }) {
  const gl = useThree((s) => s.gl);
  const invalidate = useThree((s) => s.invalidate);
  const aniso = Math.min(8, gl.capabilities.getMaxAnisotropy());
  const mats = useMemo(() => createMaterials(aniso), [aniso]);

  useEffect(() => {
    applyConfig(mats, config, aniso);
    invalidate();
  }, [mats, config, aniso, invalidate]);

  useEffect(() => () => {
    disposeMaterials(mats);
    disposeGeometries();
    disposeTextures();
  }, [mats]);

  return <MatContext.Provider value={mats}>{children}</MatContext.Provider>;
}

/** Smooth camera moves for view presets, zoom buttons and model changes. Never fights the user's own dragging. */
function CameraRig({ modelId, command, controls }: { modelId: SceneId; command: CameraCommand | null; controls: React.RefObject<OrbitControlsImpl | null> }) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const goal = useRef<{ pos: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const placed = useRef<SceneId | null>(null);
  const layout = LAYOUTS[modelId];

  // initial pose / new model: jump on first mount, glide afterwards
  useEffect(() => {
    const c = controls.current;
    const p = layout.views.perspective;
    const pos = new THREE.Vector3(...p.position), target = new THREE.Vector3(...p.target);
    if (placed.current === null && c) {
      camera.position.copy(pos);
      c.target.copy(target);
      c.update();
    } else {
      goal.current = { pos, target };
    }
    placed.current = modelId;
    invalidate();
  }, [modelId, layout, camera, controls, invalidate]);

  const last = useRef(0);
  useEffect(() => {
    if (!command || command.nonce === last.current) return;
    last.current = command.nonce;
    const c = controls.current;
    if (!c) return;
    if (command.type === 'view') {
      const v = layout.views[command.view];
      goal.current = { pos: new THREE.Vector3(...v.position), target: new THREE.Vector3(...v.target) };
    } else {
      const dir = camera.position.clone().sub(c.target);
      const dist = THREE.MathUtils.clamp(dir.length() * command.factor, layout.limits.min, layout.limits.max);
      goal.current = { pos: c.target.clone().add(dir.normalize().multiplyScalar(dist)), target: c.target.clone() };
    }
    invalidate();
  }, [command, layout, camera, controls, invalidate]);

  // user grabs the scene → stop any glide
  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const stop = () => { goal.current = null; };
    c.addEventListener('start', stop);
    return () => c.removeEventListener('start', stop);
  }, [controls]);

  useFrame((_, dt) => {
    const g = goal.current, c = controls.current;
    if (!g || !c) return;
    const k = 1 - Math.exp(-5.5 * Math.min(dt, 0.05));
    camera.position.lerp(g.pos, k);
    c.target.lerp(g.target, k);
    c.update();
    if (camera.position.distanceTo(g.pos) < 0.004 && c.target.distanceTo(g.target) < 0.004) {
      camera.position.copy(g.pos);
      c.target.copy(g.target);
      c.update();
      goal.current = null;
    }
    invalidate();
  });
  return null;
}

function ReadySignal({ onReady }: { onReady: () => void }) {
  useEffect(() => {
    let a = 0, b = 0;
    a = requestAnimationFrame(() => { b = requestAnimationFrame(onReady); });
    return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
  }, [onReady]);
  return null;
}

export default function Scene({ modelId, config, command, onReady, onFatal }: Props) {
  const controls = useRef<OrbitControlsImpl>(null);
  const layout = LAYOUTS[modelId];
  // lighter shadow map and pixel ratio on touch devices
  const touch = useMemo(() => window.matchMedia('(pointer: coarse)').matches, []);

  return (
    <Canvas
      frameloop="demand"
      shadows="percentage"
      dpr={[1, touch ? 1.5 : 1.75]}
      camera={{ fov: 36, near: 0.1, far: 60, position: layout.views.perspective.position }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 0.9;
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          onFatal('The graphics context was lost (the browser or device reclaimed GPU memory).');
        });
      }}
      aria-label="Interactive 3D kitchen. Drag to rotate, scroll or pinch to zoom."
    >
      <color attach="background" args={['#0d100f']} />
      <fog attach="fog" args={['#0d100f', 16, 34]} />

      <MaterialProvider config={config}>
        <Kitchen modelId={modelId} />
        <ContactShadows key={modelId} position={[0, 0.002, layout.room.zBack + layout.room.d / 2]} scale={[layout.room.w, layout.room.d]} opacity={0.5} blur={2.6} far={1.6} frames={1} resolution={1024} />
      </MaterialProvider>

      <hemisphereLight args={['#fff4e2', '#2a2a28', 0.35]} />
      <directionalLight
        position={[3.5, 6, 4]}
        intensity={2.0}
        color="#fff1dc"
        castShadow
        shadow-mapSize={touch ? [1024, 1024] : [2048, 2048]}
        shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5}
        shadow-camera-near={0.5} shadow-camera-far={22}
        shadow-bias={-0.0003} shadow-normalBias={0.03}
      />
      {/* studio reflections for stone, steel and brass — no network request */}
      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={3} position={[0, 6, 1]} rotation-x={Math.PI / 2} scale={[12, 8, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[6, 2, 0]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1} position={[-5, 2, 4]} rotation-y={Math.PI / 2.5} scale={[5, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} position={[0, 2, 8]} rotation-y={Math.PI} scale={[10, 4, 1]} />
      </Environment>

      <OrbitControls
        ref={controls}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        rotateSpeed={0.7}
        zoomSpeed={0.8}
        minDistance={layout.limits.min}
        maxDistance={layout.limits.max}
        minPolarAngle={0.35}
        maxPolarAngle={1.52}
        minAzimuthAngle={-1.25}
        maxAzimuthAngle={1.25}
      />
      <CameraRig modelId={modelId} command={command} controls={controls} />
      <ReadySignal onReady={onReady} />
    </Canvas>
  );
}
