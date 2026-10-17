export type TextureKind = 'oak' | 'walnut' | 'marble' | 'granite' | 'quartz' | 'concrete' | 'butcher' | 'tile' | 'slate' | 'plaster';

export interface Finish {
  id: string;
  name: string;
  color: string; // base colour (also used as swatch)
  roughness: number;
  metalness?: number;
  texture?: TextureKind;
  /** Short note shown in the summary, e.g. "Procedural wood grain" */
  note?: string;
}

export type CabinetTarget = 'all' | 'base' | 'wall' | 'island';
export type ViewId = 'perspective' | 'front' | 'detail';

export interface KitchenConfig {
  base: string;
  wall: string;
  island: string;
  countertop: string;
  backsplash: string;
  hardware: string;
}

export type Product = 'kitchen' | 'tv' | 'wardrobe';
export type SceneId = 'linear' | 'lshape' | 'island' | 'tv' | 'wardrobe';

export interface ModelDef {
  id: SceneId;
  product: Product;
  name: string;
  tagline: string;
  /** Everything shipped today is a procedural prototype; flip to 'glb' once real assets exist. */
  source: 'procedural';
  status: 'Primary prototype' | 'Prototype layout' | 'Prototype';
  hasIsland: boolean;
}

export type CameraCommandInput =
  | { type: 'view'; view: ViewId }
  | { type: 'zoom'; factor: number };
export type CameraCommand = CameraCommandInput & { nonce: number };
