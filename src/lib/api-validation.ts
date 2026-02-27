import { z } from 'zod';

export const ogQuerySchema = z.object({
  template: z.string().default('blog-minimal-dark'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  author: z.string().optional().default(''),
  date: z.string().optional().default(''),
  category: z.string().optional().default(''),
  siteName: z.string().optional().default(''),
  bgColor: z.string().optional().default(''),
  accentColor: z.string().optional().default(''),
  textColor: z.string().optional().default(''),
  logoUrl: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  width: z.coerce.number().min(200).max(2400).optional().default(1200),
  height: z.coerce.number().min(200).max(2400).optional().default(630),
});

export type OGQueryParams = z.infer<typeof ogQuerySchema>;

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
