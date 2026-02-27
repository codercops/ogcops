import type { APIRoute } from 'astro';
import { previewQuerySchema, parseSearchParams } from '@/lib/api-validation';
import { fetchMetaTags } from '@/lib/meta-fetcher';
import { analyzeMeta } from '@/lib/meta-analyzer';
import { resolvePlatformPreviews } from '@/lib/platform-specs';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': 'public, max-age=300',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  const parsed = parseSearchParams(url.searchParams, previewQuerySchema);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400, headers });
  }

  const targetUrl = parsed.data.url;

  try {
    const meta = await fetchMetaTags(targetUrl);
    const analysis = analyzeMeta(meta);
    const platforms = resolvePlatformPreviews(meta, targetUrl);

    return new Response(
      JSON.stringify({
        url: targetUrl,
        meta,
        analysis,
        platforms,
      }),
      { status: 200, headers }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch URL';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers }
    );
  }
};
