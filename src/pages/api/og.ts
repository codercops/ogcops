import type { APIRoute } from 'astro';
import { ogQuerySchema, parseSearchParams } from '@/lib/api-validation';
import { renderToPng } from '@/lib/og-engine';
import { getTemplate } from '@/templates/registry';

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);

  // The same URL always renders the same image, so repeats come from the edge
  // cache instead of the renderer. The cache only exists on the custom domain
  // (not in `astro dev` or on workers.dev).
  const cache = (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
  const cacheKey = new Request(url.toString());
  const cached = await cache?.match(cacheKey);
  if (cached) return cached;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=86400',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Parse and validate query params
  const parsed = parseSearchParams(url.searchParams, ogQuerySchema);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  const params = parsed.data;

  // Find template
  const template = getTemplate(params.template);
  if (!template) {
    return new Response(
      JSON.stringify({ error: `Template "${params.template}" not found` }),
      {
        status: 404,
        headers: { ...headers, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Merge template defaults with provided params
    const mergedParams: Record<string, string | number | boolean> = { ...template.defaults };
    for (const [key, value] of Object.entries(params)) {
      if (value != null && value !== '') {
        mergedParams[key] = value as string | number | boolean;
      }
    }

    // Also pass through any extra query params (template-specific fields)
    url.searchParams.forEach((value, key) => {
      if (!(key in mergedParams) && value) {
        mergedParams[key] = value;
      }
    });

    const element = template.render(mergedParams);
    const png = await renderToPng(element, {
      width: params.width,
      height: params.height,
    });

    const response = new Response(png, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'image/png',
        'Content-Length': String(png.byteLength),
      },
    });
    if (cache) locals.runtime?.ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    console.error('OG generation error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image' }),
      {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' },
      }
    );
  }
};
