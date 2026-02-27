import type { APIRoute } from 'astro';
import { ogQuerySchema, parseSearchParams } from '@/lib/api-validation';
import { renderToPng } from '@/lib/og-engine';
import { getTemplate } from '@/templates/registry';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

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
    const mergedParams = { ...template.defaults };
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        mergedParams[key] = value;
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

    return new Response(png, {
      status: 200,
      headers: {
        ...headers,
        'Content-Type': 'image/png',
        'Content-Length': String(png.length),
      },
    });
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
