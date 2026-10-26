import type { APIRoute } from 'astro';
import {
  ogQuerySchema,
  parseSearchParams,
  mergeOgParams,
  resolveDimensions,
} from '@/lib/api-validation';
import { renderToPng } from '@/lib/og-engine';
import { getTemplate } from '@/templates/registry';
import { normalizeColorFields } from '@/templates/utils';

export const GET: APIRoute = async ({ request, locals }) => {
  const url = new URL(request.url);

  // The same URL always renders the same image, so repeats come from the edge
  // cache instead of the renderer. The Cloudflare adapter may expose a
  // persistent `caches.default` during `astro dev`, so disable it there to
  // avoid serving stale images after template changes.
  const cache = import.meta.env.DEV
    ? undefined
    : (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
  const cacheKey = new Request(url.toString());
  const cached = await cache?.match(cacheKey);
  if (cached) return cached;

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Cache-Control': 'public, max-age=86400',
  };

  // A failed render must not stick. The URL is whatever the caller put in their
  // og:image, so caching a 400/404/500 for a day would pin the broken image on
  // every client that fetched it. Success stays cacheable.
  const errorHeaders = { ...headers, 'Cache-Control': 'no-store' };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Parse and validate query params
  const parsed = parseSearchParams(url.searchParams, ogQuerySchema);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), {
      status: 400,
      headers: { ...errorHeaders, 'Content-Type': 'application/json' },
    });
  }

  const params = parsed.data;

  // Resolve and validate output dimensions (1200:630 aspect ratio)
  const dimensions = resolveDimensions(params.width, params.height);
  if (!dimensions.success) {
    return new Response(JSON.stringify({ error: dimensions.error }), {
      status: 400,
      headers: { ...errorHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Find template
  const template = getTemplate(params.template);
  if (!template) {
    return new Response(
      JSON.stringify({ error: `Template "${params.template}" not found` }),
      {
        status: 404,
        headers: { ...errorHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    // Merge template defaults with provided params. Schema params override
    // defaults when non-empty; template-specific query params override too,
    // and an optional text field sent empty stays empty.
    const mergedParams = mergeOgParams(params, template.defaults, url.searchParams, template.fields);
    const normalizedParams = normalizeColorFields(template, mergedParams);

    const element = template.render(normalizedParams);
    const png = await renderToPng(element, {
      width: 1200,
      height: 630,
      scaleDown: dimensions.width !== 1200 ? dimensions.width : undefined,
    });

    const response = new Response(png, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'image/png',
        'Content-Length': String(png.byteLength),
      },
    });
    if (cache) locals.cfContext?.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    console.error('OG generation error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to generate image' }),
      {
        status: 500,
        headers: { ...errorHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};
