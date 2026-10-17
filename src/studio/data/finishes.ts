import type { Finish, KitchenConfig, ModelDef, Product } from '../types';

export const CABINET_FINISHES: Finish[] = [
  { id: 'warm-white', name: 'Warm white', color: '#ece6da', roughness: 0.55 },
  { id: 'ivory', name: 'Ivory', color: '#e2d6b8', roughness: 0.55 },
  { id: 'beige', name: 'Beige', color: '#c9b697', roughness: 0.58 },
  { id: 'light-grey', name: 'Light grey', color: '#b7b9b6', roughness: 0.55 },
  { id: 'charcoal', name: 'Charcoal', color: '#383b3c', roughness: 0.6 },
  { id: 'matte-black', name: 'Matte black', color: '#151617', roughness: 0.7 },
  { id: 'oak', name: 'Natural oak', color: '#c9a273', roughness: 0.6, texture: 'oak', note: 'procedural grain' },
  { id: 'walnut', name: 'Walnut brown', color: '#6b4630', roughness: 0.55, texture: 'walnut', note: 'procedural grain' },
  { id: 'green', name: 'Muted green', color: '#5b7262', roughness: 0.58 },
];

export const COUNTERTOPS: Finish[] = [
  { id: 'white-marble', name: 'White marble', color: '#ece9e4', roughness: 0.16, texture: 'marble', note: 'procedural veining' },
  { id: 'black-granite', name: 'Black granite', color: '#1b1c1e', roughness: 0.2, texture: 'granite', note: 'procedural speckle' },
  { id: 'light-quartz', name: 'Light quartz', color: '#d8d5cd', roughness: 0.25, texture: 'quartz', note: 'procedural speckle' },
  { id: 'concrete', name: 'Concrete grey', color: '#8a8b88', roughness: 0.62, texture: 'concrete', note: 'procedural texture' },
  { id: 'butcher-oak', name: 'Oak block', color: '#c9a273', roughness: 0.5, texture: 'butcher', note: 'procedural grain' },
];

export const BACKSPLASHES: Finish[] = [
  { id: 'tile-white', name: 'White gloss tile', color: '#e9e8e4', roughness: 0.12, texture: 'tile', note: 'procedural tile' },
  { id: 'marble', name: 'Marble', color: '#e3e0da', roughness: 0.2, texture: 'marble', note: 'procedural veining' },
  { id: 'slate', name: 'Dark slate', color: '#2e3132', roughness: 0.5, texture: 'slate', note: 'procedural texture' },
  { id: 'plaster', name: 'Warm plaster', color: '#cbbba2', roughness: 0.85, texture: 'plaster', note: 'procedural texture' },
];

export const HARDWARE: Finish[] = [
  { id: 'steel', name: 'Brushed steel', color: '#b9bcbe', roughness: 0.32, metalness: 1 },
  { id: 'black', name: 'Matte black', color: '#141414', roughness: 0.5, metalness: 0.3 },
  { id: 'brass', name: 'Brushed brass', color: '#b8915a', roughness: 0.35, metalness: 1 },
];

export const DEFAULT_CONFIG: KitchenConfig = {
  base: 'charcoal',
  wall: 'warm-white',
  island: 'oak',
  countertop: 'white-marble',
  backsplash: 'marble',
  hardware: 'brass',
};

/** Each product keeps its own configuration. TV and wardrobe reuse the same material slots (see Panel). */
export const PRODUCT_DEFAULTS: Record<Product, KitchenConfig> = {
  kitchen: DEFAULT_CONFIG,
  // base = console, island = fluted panels, countertop = back panel stone
  tv: { base: 'walnut', wall: 'warm-white', island: 'walnut', countertop: 'white-marble', backsplash: 'marble', hardware: 'brass' },
  // base = body, wall = shutters, island = loft & accent
  wardrobe: { base: 'warm-white', wall: 'light-grey', island: 'oak', countertop: 'white-marble', backsplash: 'marble', hardware: 'brass' },
};

export const MODELS: ModelDef[] = [
  { id: 'linear', product: 'kitchen', name: 'Linear', tagline: 'Single-wall run', source: 'procedural', status: 'Prototype layout', hasIsland: false },
  { id: 'lshape', product: 'kitchen', name: 'L-Shape', tagline: 'Corner layout', source: 'procedural', status: 'Prototype layout', hasIsland: false },
  { id: 'island', product: 'kitchen', name: 'Island', tagline: 'Run + island with seating', source: 'procedural', status: 'Primary prototype', hasIsland: true },
  { id: 'tv', product: 'tv', name: 'TV unit', tagline: 'Stone back panel, fluted side panels, floating console', source: 'procedural', status: 'Prototype', hasIsland: false },
  { id: 'wardrobe', product: 'wardrobe', name: 'Wardrobe', tagline: 'Four-door wardrobe with loft and open unit', source: 'procedural', status: 'Prototype', hasIsland: false },
];
export const KITCHEN_MODELS = MODELS.filter((m) => m.product === 'kitchen');

const byId = (list: Finish[]) => (id: string) => list.find((f) => f.id === id) ?? list[0];
export const cabinetFinish = byId(CABINET_FINISHES);
export const countertopFinish = byId(COUNTERTOPS);
export const backsplashFinish = byId(BACKSPLASHES);
export const hardwareFinish = byId(HARDWARE);
