import * as THREE from 'three';
import type { Finish, KitchenConfig } from '../types';
import {
  backsplashFinish, cabinetFinish, countertopFinish, hardwareFinish,
} from '../data/finishes';
import { getTexture } from './textures';

export interface KitchenMaterials {
  // configurable
  base: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  island: THREE.MeshStandardMaterial;
  baseCarcass: THREE.MeshStandardMaterial;
  wallCarcass: THREE.MeshStandardMaterial;
  islandCarcass: THREE.MeshStandardMaterial;
  countertop: THREE.MeshPhysicalMaterial;
  backsplash: THREE.MeshStandardMaterial;
  hardware: THREE.MeshStandardMaterial;
  // fixed
  plinth: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  darkSteel: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  floor: THREE.MeshStandardMaterial;
  wallPaint: THREE.MeshStandardMaterial;
  stool: THREE.MeshStandardMaterial;
  blackMetal: THREE.MeshStandardMaterial;
  led: THREE.MeshBasicMaterial;
  bulb: THREE.MeshBasicMaterial;
  jar: THREE.MeshStandardMaterial;
}

const std = (p: THREE.MeshStandardMaterialParameters) => new THREE.MeshStandardMaterial(p);

export function createMaterials(aniso: number): KitchenMaterials {
  const floor = std({ color: '#ebe6db', roughness: 0.4, metalness: 0, map: getTexture('concrete', aniso) });
  floor.map!.repeat.set(1 / 1.6, 1 / 1.6);
  return {
    base: std({}), wall: std({}), island: std({}),
    baseCarcass: std({ roughness: 0.8 }), wallCarcass: std({ roughness: 0.8 }), islandCarcass: std({ roughness: 0.8 }),
    countertop: new THREE.MeshPhysicalMaterial({ clearcoat: 0.35, clearcoatRoughness: 0.18 }),
    backsplash: std({}),
    hardware: std({}),
    plinth: std({ color: '#1a1b1c', roughness: 0.8 }),
    steel: std({ color: '#c3c6c8', roughness: 0.3, metalness: 1 }),
    darkSteel: std({ color: '#6c6f72', roughness: 0.4, metalness: 1 }),
    glass: std({ color: '#0a0b0c', roughness: 0.08, metalness: 0.2 }),
    floor,
    wallPaint: std({ color: '#d6d0c3', roughness: 0.95 }),
    stool: std({ color: '#33281f', roughness: 0.7 }),
    blackMetal: std({ color: '#121212', roughness: 0.5, metalness: 0.6 }),
    led: new THREE.MeshBasicMaterial({ color: '#ffd9a1', toneMapped: false }),
    bulb: new THREE.MeshBasicMaterial({ color: '#ffe7bd', toneMapped: false }),
    jar: std({ color: '#cfc7b6', roughness: 0.6 }),
  };
}

function applyFinish(m: THREE.MeshStandardMaterial, f: Finish, aniso: number) {
  const map = f.texture ? getTexture(f.texture, aniso) : null;
  if (m.map !== map) { m.map = map; m.needsUpdate = true; }
  m.color.set(map ? '#ffffff' : f.color);
  m.roughness = f.roughness;
  m.metalness = f.metalness ?? 0;
}

function applyCarcass(m: THREE.MeshStandardMaterial, f: Finish) {
  m.color.set(f.color).multiplyScalar(0.55);
}

/** Pushes the typed configuration onto the real GPU materials. */
export function applyConfig(m: KitchenMaterials, c: KitchenConfig, aniso: number) {
  const b = cabinetFinish(c.base), w = cabinetFinish(c.wall), i = cabinetFinish(c.island);
  applyFinish(m.base, b, aniso); applyCarcass(m.baseCarcass, b);
  applyFinish(m.wall, w, aniso); applyCarcass(m.wallCarcass, w);
  applyFinish(m.island, i, aniso); applyCarcass(m.islandCarcass, i);
  applyFinish(m.countertop, countertopFinish(c.countertop), aniso);
  applyFinish(m.backsplash, backsplashFinish(c.backsplash), aniso);
  applyFinish(m.hardware, hardwareFinish(c.hardware), aniso);
}

export function disposeMaterials(m: KitchenMaterials) {
  Object.values(m).forEach((mat) => mat.dispose());
}
