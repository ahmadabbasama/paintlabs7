import { Painting, ProductVariant } from '../types';

const CATEGORY_MAP: Record<string, string> = {
  bike: 'bikes',
  bikes: 'bikes',
  car: 'cars',
  cars: 'cars',
  cityscape: 'cityscapes',
  cityscapes: 'cityscapes',
  spacescape: 'spacescapes',
  spacescapes: 'spacescapes',
  quote: 'quotes',
  quotes: 'quotes',
  abstract: 'abstract',
  landscape: 'landscapes',
  landscapes: 'landscapes',
  seascape: 'landscapes',
  seascapes: 'landscapes',
  nature: 'landscapes',
  'seascapes & nature': 'landscapes',
  'seascapes and nature': 'landscapes',
  botanical: 'botanicals',
  botanicals: 'botanicals',
  poster: 'posters',
  posters: 'posters',
};

export function normalizeProductCategory(rawCategory?: string | null): string {
  const cleaned = String(rawCategory ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
  return CATEGORY_MAP[cleaned] || cleaned || 'abstract';
}

function buildDefaultPaintingVariants(idKey: string): ProductVariant[] {
  return [
    {
      id: `v-lrg-${idKey}`,
      name: '12 × 12 in Canvas (Large)',
      size: '12 × 12 in',
      frame: 'Deep Stretched Canvas',
      priceDelta: 0,
      inStock: true,
    },
    {
      id: `v-sml-${idKey}`,
      name: '6 × 6 in Canvas (Small)',
      size: '6 × 6 in',
      frame: 'Compact Gallery Wrap',
      priceDelta: -100,
      inStock: true,
    },
    {
      id: `v-frm-${idKey}`,
      name: 'Photo Frame Edition (9.5 × 13.5 in)',
      size: '9.5 × 13.5 in',
      frame: 'Black Glass Framed Canvas',
      priceDelta: 300,
      inStock: true,
    },
  ];
}

export function mapSupabaseProductToPainting(row: Record<string, any>, index = 0): Painting | null {
  if (!row) return null;

  const title = String(row.title ?? row.name ?? '').trim();
  if (!title) return null;

  const category = normalizeProductCategory(row.category);
  const isPoster = category === 'posters';

  const parsedPrice = Number(row.price ?? row.base_price ?? row.basePrice);
  const basePrice = Number.isFinite(parsedPrice) && parsedPrice > 0 ? parsedPrice : isPoster ? 80 : 400;

  const rawId = row.id != null ? String(row.id) : `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`;
  const id = `sb-${rawId}`;

  const createdYear = row.created_at ? new Date(row.created_at).getFullYear() : NaN;
  const year = Number.isFinite(createdYear) && createdYear > 2000 ? createdYear : new Date().getFullYear();

  const subtitle =
    row.subtitle != null && String(row.subtitle).trim() !== ''
      ? String(row.subtitle).trim()
      : isPoster
        ? 'Printed Poster (A4)'
        : `${category.charAt(0).toUpperCase() + category.slice(1)} Original`;

  const description =
    row.description != null && String(row.description).trim() !== ''
      ? String(row.description).trim()
      : isPoster
        ? `${title} — high-resolution studio print.`
        : `Authentic hand-painted ${category} artwork on heavyweight stretched canvas.`;

  const dimensions =
    row.dimensions != null && String(row.dimensions).trim() !== ''
      ? String(row.dimensions).trim()
      : isPoster
        ? 'A4 (21 × 29.7 cm)'
        : '12 × 12 in (30 × 30 cm)';

  const image = String(row.image_url ?? row.image ?? '').trim();

  return {
    id,
    name: title,
    subtitle,
    category,
    medium:
      row.medium != null && String(row.medium).trim() !== ''
        ? String(row.medium).trim()
        : isPoster
          ? 'Printed Poster (A4)'
          : 'Hand-Painted Acrylic & Texture on Stretched Canvas',
    year,
    basePrice,
    currency: 'PKR',
    image,
    tag:
      row.tag != null && String(row.tag).trim() !== ''
        ? String(row.tag).trim()
        : isPoster
          ? 'New Poster'
          : 'New Original',
    description,
    dimensions,
    surface:
      row.surface != null && String(row.surface).trim() !== ''
        ? String(row.surface).trim()
        : isPoster
          ? 'Printed Poster'
          : 'Heavyweight Stretched Canvas',
    inStockCount: typeof row.in_stock_count === 'number' ? row.in_stock_count : isPoster ? 10 : 3,
    leadTime:
      row.lead_time != null && String(row.lead_time).trim() !== ''
        ? String(row.lead_time).trim()
        : 'Delivered across GIKI within 2–3 days',
    rating: typeof row.rating === 'number' ? row.rating : 5,
    reviewCount: 0,
    variants: isPoster ? [] : buildDefaultPaintingVariants(rawId),
    reviews: [],
    colorFamily: undefined,
    showInForYou: row.show_in_for_you === true,
  };
}
