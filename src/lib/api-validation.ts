import { z } from 'zod';

// An empty value counts as missing, so `?imageUrl=` (a URL built from CMS data
// for a post with no cover image) falls back to the default instead of failing.
const emptyAsMissing = (v: unknown) => (v === '' ? undefined : v);

export const ogQuerySchema = z.object({
  template: z.preprocess(emptyAsMissing, z.string().default('blog-minimal-dark')),
  title: z.string().optional(),
  description: z.string().optional().default(''),
  author: z.string().optional().default(''),
  date: z.string().optional().default(''),
  category: z.string().optional().default(''),
  siteName: z.string().optional().default(''),
  bgColor: z.string().optional().default(''),
  accentColor: z.string().optional().default(''),
  textColor: z.string().optional().default(''),
  logoUrl: z.preprocess(emptyAsMissing, z.string().url().optional()),
  imageUrl: z.preprocess(emptyAsMissing, z.string().url().optional()),
  width: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : v),
    z.coerce.number().min(200).max(2400).optional()
  ),
  height: z.preprocess(
    (v) => (v === '' || v === undefined ? undefined : v),
    z.coerce.number().min(105).max(1260).optional()
  ),
});

export type OGQueryParams = z.infer<typeof ogQuerySchema>;

export const OG_DEFAULT_WIDTH = 1200;
export const OG_DEFAULT_HEIGHT = 630;
export const OG_MIN_WIDTH = 200;
export const OG_MAX_WIDTH = 2400;
export const OG_MIN_HEIGHT = 105;
export const OG_MAX_HEIGHT = 1260;

export type DimensionResolution =
  | { success: true; width: number; height: number }
  | { success: false; error: string };

/**
 * Resolves the final image dimensions preserving the fixed 1200:630 aspect ratio.
 * - If neither dimension is provided, defaults to 1200x630.
 * - If only width is provided, derives height to preserve 1200:630.
 * - If only height is provided, derives width to preserve 1200:630.
 * - If both are provided, validates that they match the 1200:630 ratio (returns error otherwise).
 */
export function resolveDimensions(
  width?: number,
  height?: number
): DimensionResolution {
  if (width !== undefined) width = Math.round(width);

  if (width !== undefined && (width < OG_MIN_WIDTH || width > OG_MAX_WIDTH)) {
    return {
      success: false,
      error: `Width must be between ${OG_MIN_WIDTH} and ${OG_MAX_WIDTH}`,
    };
  }

  if (height !== undefined && (height < OG_MIN_HEIGHT || height > OG_MAX_HEIGHT)) {
    return {
      success: false,
      error: `Height must be between ${OG_MIN_HEIGHT} and ${OG_MAX_HEIGHT}`,
    };
  }

  if (width === undefined && height === undefined) {
    return { success: true, width: OG_DEFAULT_WIDTH, height: OG_DEFAULT_HEIGHT };
  }

  if (width !== undefined && height === undefined) {
    const derivedHeight = Math.round((width * OG_DEFAULT_HEIGHT) / OG_DEFAULT_WIDTH);
    return { success: true, width, height: derivedHeight };
  }

  if (width === undefined && height !== undefined) {
    const derivedWidth = Math.round((height * OG_DEFAULT_WIDTH) / OG_DEFAULT_HEIGHT);
    if (derivedWidth < OG_MIN_WIDTH || derivedWidth > OG_MAX_WIDTH) {
      return {
        success: false,
        error: `Derived width (${derivedWidth}) must be between ${OG_MIN_WIDTH} and ${OG_MAX_WIDTH}`,
      };
    }
    return { success: true, width: derivedWidth, height };
  }

  // Both width and height are provided; check aspect ratio
  const expectedHeight = Math.round((width! * OG_DEFAULT_HEIGHT) / OG_DEFAULT_WIDTH);
  const expectedWidth = Math.round((height! * OG_DEFAULT_WIDTH) / OG_DEFAULT_HEIGHT);

  if (height === expectedHeight || width === expectedWidth) {
    return { success: true, width: width!, height: height! };
  }

  return {
    success: false,
    error: `Dimensions must match 1200:630 aspect ratio (got ${width}x${height})`,
  };
}

export const previewQuerySchema = z.object({
  url: z.string().url('A valid URL is required'),
});

export type PreviewQueryParams = z.infer<typeof previewQuerySchema>;

export function parseSearchParams(
  searchParams: URLSearchParams,
  schema: z.ZodSchema
): { success: true; data: any } | { success: false; error: string } {
  const raw: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    raw[key] = value;
  });

  const result = schema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
  return { success: false, error: errors };
}

const ogQuerySchemaKeys = new Set(Object.keys(ogQuerySchema.shape));

export function mergeOgParams(
  params: OGQueryParams,
  defaults: Record<string, string | number | boolean>,
  searchParams: URLSearchParams
): Record<string, string | number | boolean> {
  const merged: Record<string, string | number | boolean> = { ...defaults };

  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== '') {
      merged[key] = value as string | number | boolean;
    }
  }

  // Template-specific params (not part of the schema) override defaults when non-empty
  searchParams.forEach((value, key) => {
    if (!ogQuerySchemaKeys.has(key) && value !== '') {
      merged[key] = value;
    }
  });

  return merged;
}
