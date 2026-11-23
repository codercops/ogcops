import type { APIRoute } from 'astro';
import { previewQuerySchema, parseSearchParams } from '@/lib/api-validation';
import { fetchMetaTags } from '@/lib/meta-fetcher';
import { analyzeMeta } from '@/lib/meta-analyzer';
import { resolvePlatformPreviews } from '@/lib/platform-specs';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);

  // Error answers are not cached: a site that timed out should get a fresh
  // try on the next check, not the same 502 for five minutes.
  const headers = (cacheControl: string) => ({
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
    'Cache-Control': cacheControl,
  });

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: headers('public, max-age=300') });
  }

  const parsed = parseSearchParams(url.searchParams, previewQuerySchema);
  if (!parsed.success) {
    return new Response(JSON.stringify({ error: parsed.error }), { status: 400, headers: headers('no-store') });
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
      { status: 200, headers: headers('public, max-age=300') }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch URL';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: headers('no-store') }
    );
  }
};
