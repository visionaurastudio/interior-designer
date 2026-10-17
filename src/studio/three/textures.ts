import * as THREE from 'three';
import type { TextureKind } from '../types';

/**
 * Procedural, tileable textures drawn to small canvases at runtime.
 * They are stand-ins for photographed material scans (see ASSETS.md) and cost no network requests.
 * Each texture's UVs are in metres; `repeat` is set from the tile's real-world size.
 */

function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
function makeNoise(seed: number, size = 256) {
  const r = rng(seed);
  const g = new Float32Array(size * size);
  for (let i = 0; i < g.length; i++) g[i] = r();
  const md = (n: number, m: number) => ((n % m) + m) % m;
  // lattice wraps every (px, py) cells so the result tiles seamlessly across the canvas
  return (x: number, y: number, px: number, py: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    const at = (ix: number, iy: number) => g[md(iy, py) * size + md(ix, px)];
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}
type Noise = (x: number, y: number, px: number, py: number) => number;

const S = 512;
const wrapNoise = (seed: number): Noise => makeNoise(seed);

const hex = (c: string) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a: number[], b: number[], t: number) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function paint(fn: (u: number, v: number, x: number, y: number) => number[], post?: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++)
    for (let x = 0; x < S; x++) {
      const rgb = fn(x / S, y / S, x, y);
      const i = (y * S + x) * 4;
      img.data[i] = rgb[0]; img.data[i + 1] = rgb[1]; img.data[i + 2] = rgb[2]; img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  post?.(ctx);
  return c;
}

/** Noise sampled with integer frequency (fx, fy) across the tile → seamless. */
const tn = (n: Noise, u: number, v: number, fx: number, fy: number, oct = 1) => {
  let val = 0, a = 0.5, t = 0, mx = fx, my = fy;
  for (let i = 0; i < oct; i++) { val += n(u * mx, v * my, mx, my) * a; t += a; a *= 0.5; mx *= 2; my *= 2; }
  return val / t;
};

function wood(light: string, dark: string, seed: number, planks = false) {
  const n = wrapNoise(seed);
  const l = hex(light), d = hex(dark);
  return paint((u, v, x) => {
    const warp = tn(n, u, v, 2, 1, 3);
    const rings = Math.sin(u * Math.PI * 2 * 6 + warp * 10 + tn(n, u, v, 4, 2, 2) * 3);
    const fine = tn(n, u, v, 14, 1, 2);
    let t = 0.5 + rings * 0.2 + (fine - 0.5) * 0.4;
    if (planks) t += Math.floor(u * 4) % 2 ? 0.05 : -0.04;
    const c = mix(d, l, clamp01(t));
    if (planks && x % (S / 4) < 2) return [c[0] * 0.55, c[1] * 0.55, c[2] * 0.55];
    return c;
  });
}

function marble(base: string, vein: string, seed: number) {
  const n = wrapNoise(seed);
  const b = hex(base), v2 = hex(vein);
  return paint((u, v) => {
    const w = tn(n, u, v, 2, 2, 5);
    const w2 = tn(n, u, v, 3, 3, 3);
    const l1 = Math.abs(Math.sin((u + v * 1) * Math.PI * 2 * 2 + w * 7));
    const l2 = Math.abs(Math.sin((v - u * 2) * Math.PI * 2 * 1 + w2 * 6));
    const vein1 = Math.pow(1 - l1, 30) * 0.7;
    const vein2 = Math.pow(1 - l2, 40) * 0.5;
    return mix(b, v2, clamp01(vein1 + vein2 + (w - 0.5) * 0.22 + (w2 - 0.5) * 0.12));
  });
}

function speckle(base: string, dark: string, lightC: string, seed: number, density: number) {
  const r = rng(seed);
  const n = wrapNoise(seed + 3);
  const b = hex(base), d = hex(dark), l = hex(lightC);
  return paint((u, v) => {
    let c = mix(b, d, (tn(n, u, v, 6, 6, 3) - 0.5) * 0.5 + 0.25);
    const q = r();
    if (q < density) c = mix(c, l, 0.4 + r() * 0.5);
    else if (q > 1 - density * 0.8) c = mix(c, d, 0.5 + r() * 0.4);
    return c;
  });
}

function concrete(base: string, seed: number) {
  const n = wrapNoise(seed);
  const b = hex(base);
  return paint((u, v) => {
    const t = tn(n, u, v, 6, 6, 5) * 0.8 + tn(n, u, v, 64, 64, 1) * 0.2;
    const k = 0.78 + t * 0.4;
    return [b[0] * k, b[1] * k, b[2] * k];
  });
}

function tile() {
  const n = wrapNoise(11);
  const cols = 4, rows = 8;
  return paint((u, v) => {
    const tw = 1 / cols, th = 1 / rows;
    const row = Math.floor(v / th);
    const xo = (u + (row % 2 ? tw / 2 : 0)) % tw;
    const yo = v % th;
    const edge = Math.min(xo / tw, 1 - xo / tw, yo / th, 1 - yo / th) * Math.min(tw, th) * S;
    const val = 232 + (tn(n, u, v, 8, 8, 2) - 0.5) * 8;
    const g = edge < 2.2 ? 0.8 : edge < 3.4 ? 0.93 : 1;
    return [val * g, val * g - 1, val * g - 4];
  });
}

function slate() {
  const n = wrapNoise(23);
  return paint((u, v) => {
    const k = 0.7 + tn(n, u, v, 8, 3, 4) * 0.7;
    return [44 * k, 48 * k, 49 * k];
  });
}

function plaster() {
  const n = wrapNoise(31);
  const b = hex('#cbbba2');
  return paint((u, v) => {
    const k = 0.9 + tn(n, u, v, 5, 5, 4) * 0.2 + (tn(n, u, v, 128, 128, 1) - 0.5) * 0.04;
    return [b[0] * k, b[1] * k, b[2] * k];
  });
}

const BUILDERS: Record<TextureKind, { make: () => HTMLCanvasElement; size: number }> = {
  oak: { make: () => wood('#d9b583', '#b88b57', 5), size: 0.9 },
  walnut: { make: () => wood('#80563a', '#4a2f1f', 9), size: 0.9 },
  butcher: { make: () => wood('#d5ac78', '#b3834f', 15, true), size: 0.8 },
  marble: { make: () => marble('#f1efea', '#868a91', 7), size: 1.6 },
  granite: { make: () => speckle('#202123', '#121213', '#7d8085', 13, 0.012), size: 0.8 },
  quartz: { make: () => speckle('#dcd9d1', '#bdb9ae', '#ffffff', 17, 0.02), size: 0.8 },
  concrete: { make: () => concrete('#8c8d8a', 19), size: 1.2 },
  tile: { make: tile, size: 0.5 },
  slate: { make: slate, size: 1.0 },
  plaster: { make: plaster, size: 1.4 },
};

const cache = new Map<TextureKind, THREE.CanvasTexture>();

export function getTexture(kind: TextureKind, anisotropy = 8) {
  let tex = cache.get(kind);
  if (!tex) {
    const b = BUILDERS[kind];
    tex = new THREE.CanvasTexture(b.make());
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = anisotropy;
    tex.repeat.set(1 / b.size, 1 / b.size);
    cache.set(kind, tex);
  }
  return tex;
}

export function disposeTextures() {
  cache.forEach((t) => t.dispose());
  cache.clear();
}
