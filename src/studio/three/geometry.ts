import * as THREE from 'three';

const cache = new Map<string, THREE.BufferGeometry>();
const key = (...n: (number | string)[]) => n.map((v) => (typeof v === 'number' ? v.toFixed(4) : v)).join('|');

/** Box whose UVs are in metres, so wood grain / stone veining keep a real-world scale on every panel. */
export function boxGeo(w: number, h: number, d: number) {
  const k = key('b', w, h, d);
  let g = cache.get(k);
  if (!g) {
    const b = new THREE.BoxGeometry(w, h, d);
    const uv = b.attributes.uv;
    // BoxGeometry face order: +x, -x, +y, -y, +z, -z (4 vertices each)
    const dims: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++)
      for (let i = 0; i < 4; i++) {
        const idx = f * 4 + i;
        uv.setXY(idx, uv.getX(idx) * dims[f][0], uv.getY(idx) * dims[f][1]);
      }
    uv.needsUpdate = true;
    g = b;
    cache.set(k, g);
  }
  return g;
}

export function cylGeo(rTop: number, rBottom: number, h: number, seg = 16, open = false) {
  const k = key('c', rTop, rBottom, h, seg, open ? 'o' : 'c');
  let g = cache.get(k);
  if (!g) { g = new THREE.CylinderGeometry(rTop, rBottom, h, seg, 1, open); cache.set(k, g); }
  return g;
}

export function ringGeo(inner: number, outer: number) {
  const k = key('r', inner, outer);
  let g = cache.get(k);
  if (!g) { g = new THREE.RingGeometry(inner, outer, 40); cache.set(k, g); }
  return g;
}

export function sphereGeo(r: number) {
  const k = key('s', r);
  let g = cache.get(k);
  if (!g) { g = new THREE.SphereGeometry(r, 20, 14); cache.set(k, g); }
  return g;
}

export function planeGeo(w: number, h: number) {
  const k = key('p', w, h);
  let g = cache.get(k);
  if (!g) {
    const p = new THREE.PlaneGeometry(w, h);
    const uv = p.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w, uv.getY(i) * h);
    g = p;
    cache.set(k, g);
  }
  return g;
}

export function disposeGeometries() {
  cache.forEach((g) => g.dispose());
  cache.clear();
}
