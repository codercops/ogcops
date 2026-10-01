import type { APIRoute } from 'astro';
import { renderToPng } from '@/lib/og-engine';
import { getTemplate } from '@/templates/registry';

// In-memory cache for thumbnails (defaults don't change at runtime)
const thumbnailCache = new Map<string, ArrayBuffer>();

export const GET: APIRoute = async ({ params, url, locals }) => {
  const { id } = params;

  // Thumbnails only change on deploy, so repeats come from the edge cache
  // instead of the renderer. The cache only exists on the custom domain
  // (not in `astro dev` or on workers.dev).
  const cache = (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
  const cacheKey = new Request(url.toString());
  const cached = await cache?.match(cacheKey);
  if (cached) return cached;

  const template = getTemplate(id!);
  if (!template) {
    return new Response(JSON.stringify({ error: 'Template not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    let png = thumbnailCache.get(id!);
    if (!png) {
      const element = template.render(template.defaults);
      // Render at full 1200x630 so satori lays out correctly, then scale down via resvg
      png = await renderToPng(element, { width: 1200, height: 630, scaleDown: 600 });
      thumbnailCache.set(id!, png);
    }

    const response = new Response(png, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=604800',
        'Access-Control-Allow-Origin': '*',
      },
    });
    if (cache) locals.cfContext?.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    console.error(`Thumbnail generation error for ${id}:`, err);
    return new Response(JSON.stringify({ error: 'Failed to generate thumbnail' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
