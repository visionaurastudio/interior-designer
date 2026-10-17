import type { SceneId, ViewId } from '../types';
import type { RunProps } from './parts';

type V3 = [number, number, number];
export interface CameraPose { position: V3; target: V3 }

export interface Layout {
  room: { w: number; d: number; zBack: number };
  runs: RunProps[];
  island: boolean;
  views: Record<ViewId, CameraPose>;
  /** distance limits for orbit zoom */
  limits: { min: number; max: number };
}

const ZB = -1.6; // back wall plane

/** Linear: one 4.5 m run on the back wall. */
const linear: Layout = {
  room: { w: 5.6, d: 5.4, zBack: ZB },
  island: false,
  runs: [{
    position: [-2.25, 0, ZB],
    mods: [
      { t: 'tall', w: 0.6 }, { t: 'drawers', w: 0.6 }, { t: 'sink', w: 0.9 },
      { t: 'drawers', w: 0.6 }, { t: 'hob', w: 0.9 }, { t: 'fridge', w: 0.9 },
    ],
    walls: [
      { t: 'gap', w: 0.6 }, { t: 'wall', w: 0.6 }, { t: 'wall', w: 0.9 },
      { t: 'wall', w: 0.6 }, { t: 'hood', w: 0.9 }, { t: 'gap', w: 0.9 },
    ],
  }],
  views: {
    perspective: { position: [4.2, 2.3, 6.2], target: [0, 1.0, -1.0] },
    front: { position: [0, 1.6, 7.4], target: [0, 1.1, -1.2] },
    detail: { position: [1.5, 1.45, 0.7], target: [-0.2, 1.05, -1.5] },
  },
  limits: { min: 1.3, max: 9.5 },
};

/** L-shape: 4.5 m back run + 2.4 m return along the left wall. */
const XW = -2.7;
const lshape: Layout = {
  room: { w: 5.4, d: 5.4, zBack: ZB },
  island: false,
  runs: [
    {
      position: [XW, 0, ZB],
      mods: [
        { t: 'doors', w: 0.9 }, { t: 'drawers', w: 0.6 }, { t: 'hob', w: 0.9 },
        { t: 'drawers', w: 0.6 }, { t: 'tall', w: 0.6 }, { t: 'fridge', w: 0.9 },
      ],
      walls: [
        { t: 'wall', w: 0.9 }, { t: 'wall', w: 0.6 }, { t: 'hood', w: 0.9 },
        { t: 'wall', w: 0.6 }, { t: 'gap', w: 0.6 }, { t: 'gap', w: 0.9 },
      ],
    },
    {
      // return along the left wall, running from the room towards the corner
      position: [XW, 0, ZB + 3.0],
      rotationY: Math.PI / 2,
      trimEnd: 0.02,
      mods: [{ t: 'drawers', w: 0.6 }, { t: 'sink', w: 0.9 }, { t: 'doors', w: 0.9 }],
      walls: [{ t: 'wall', w: 0.6 }, { t: 'shelf', w: 0.9 }, { t: 'wall', w: 0.9 }],
    },
  ],
  views: {
    perspective: { position: [3.8, 2.5, 6.8], target: [-0.9, 1.0, -0.5] },
    front: { position: [0, 1.6, 7.4], target: [-0.2, 1.1, -0.8] },
    detail: { position: [0.4, 1.5, 1.3], target: [-1.9, 1.0, -1.1] },
  },
  limits: { min: 1.3, max: 9.5 },
};

/** Island: 5.1 m run + 2.6 m island with seating. Primary demo model. */
const island: Layout = {
  room: { w: 6.2, d: 6.2, zBack: ZB },
  island: true,
  runs: [{
    position: [-2.55, 0, ZB],
    mods: [
      { t: 'tall', w: 0.6 }, { t: 'drawers', w: 0.6 }, { t: 'sink', w: 0.9 },
      { t: 'doors', w: 0.6 }, { t: 'hob', w: 0.9 }, { t: 'drawers', w: 0.6 }, { t: 'fridge', w: 0.9 },
    ],
    walls: [
      { t: 'gap', w: 0.6 }, { t: 'wall', w: 0.6 }, { t: 'shelf', w: 0.9 },
      { t: 'wall', w: 0.6 }, { t: 'hood', w: 0.9 }, { t: 'wall', w: 0.6 }, { t: 'gap', w: 0.9 },
    ],
  }],
  views: {
    perspective: { position: [5.0, 2.7, 8.2], target: [0, 0.95, -0.2] },
    front: { position: [0, 1.7, 9.2], target: [0, 1.05, -0.3] },
    detail: { position: [1.7, 1.5, 2.7], target: [-0.3, 1.0, -0.9] },
  },
  limits: { min: 1.4, max: 11 },
};

/** TV unit: feature wall on the back plane. */
export const TV_ZB = -1.3;
const tv: Layout = {
  room: { w: 4.8, d: 4.6, zBack: TV_ZB },
  runs: [],
  island: false,
  views: {
    perspective: { position: [3.9, 1.8, 5.2], target: [0, 1.2, TV_ZB + 0.2] },
    front: { position: [0, 1.5, 6.4], target: [0, 1.3, TV_ZB + 0.2] },
    detail: { position: [1.2, 1.0, 1.6], target: [0, 0.8, TV_ZB + 0.2] },
  },
  limits: { min: 1.2, max: 8 },
};

/** Wardrobe: against the back wall. */
export const WR_ZB = -1.2;
const wardrobe: Layout = {
  room: { w: 5.2, d: 4.4, zBack: WR_ZB },
  runs: [],
  island: false,
  views: {
    perspective: { position: [4.0, 2.0, 5.4], target: [0, 1.2, WR_ZB + 0.3] },
    front: { position: [0, 1.5, 6.8], target: [0, 1.2, WR_ZB + 0.3] },
    detail: { position: [1.4, 1.3, 1.8], target: [0.4, 1.2, WR_ZB + 0.3] },
  },
  limits: { min: 1.2, max: 8 },
};

export const LAYOUTS: Record<SceneId, Layout> = { linear, lshape, island, tv, wardrobe };
