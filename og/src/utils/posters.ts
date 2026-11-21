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

// Paper finishes for posters. The customer must choose one; nothing is pre-selected.
//   base Rs. 70 / 80  -> Plain paper keeps the base price, Glossy paper is Rs. 100
//   base Rs. 100      -> Plain paper keeps Rs. 100,        Glossy paper is Rs. 150
export function getPosterFinishOptions(painting: Pick<Painting, 'basePrice'>): ProductVariant[] {
  const base = painting.basePrice;
  const glossyPrice = base >= 100 ? base + 50 : 100;
  return [
    {
      id: 'poster-plain',
      name: 'Plain paper',
      size: 'Plain paper',
      frame: 'uncoated paper',
      priceDelta: 0,
      inStock: true,
    },
    {
      id: 'poster-glossy',
      name: 'Glossy paper',
      size: 'Glossy paper',
      frame: 'paper coated with a smooth, shiny finish',
      priceDelta: glossyPrice - base,
      inStock: true,
    },
  ];
}
