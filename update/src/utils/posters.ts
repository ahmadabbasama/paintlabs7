import { Painting, ProductVariant } from '../types';

export const POSTER_CATEGORY = 'posters';

// Posters have one fixed price and no size / colour options, so they use this single
// stand-in variant (price change 0) wherever the cart expects a variant.
export const POSTER_VARIANT: ProductVariant = {
  id: 'poster-fixed',
  name: 'Poster',
  size: '',
  frame: 'Poster Print',
  priceDelta: 0,
  inStock: true,
};

export function isPosterPainting(painting?: Pick<Painting, 'category'> | null): boolean {
  return !!painting && String(painting.category).toLowerCase() === POSTER_CATEGORY;
}
