import type { Product } from './types';

/** Open the 3D studio from anywhere on the page (hero buttons, gallery, section cards). */
export const STUDIO_EVENT = 'ssa:open-studio';
export function openStudio(product: Product = 'kitchen') {
  window.dispatchEvent(new CustomEvent<Product>(STUDIO_EVENT, { detail: product }));
}
