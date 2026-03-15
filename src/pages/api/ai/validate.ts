import type { APIRoute } from 'astro';
import { aiValidateSchema } from '@/lib/ai/validation';
import { getProvider } from '@/lib/ai/providers';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export const POST: APIRoute = async ({ request }) => {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ valid: false, error: 'Invalid JSON body' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const parsed = aiValidateSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    return new Response(
      JSON.stringify({ valid: false, error: errors }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { provider: providerId, apiKey } = parsed.data;
  const provider = getProvider(providerId);
  if (!provider) {
    return new Response(
      JSON.stringify({ valid: false, error: `Unknown provider: ${providerId}` }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const validateReq = provider.validateRequest(apiKey);

    // For Anthropic, validation needs a minimal message body
    const fetchOptions: RequestInit = {
      method: validateReq.method,
      headers: validateReq.headers,
      signal: AbortSignal.timeout(10000),
    };

    if (providerId === 'anthropic') {
      fetchOptions.method = 'POST';
      fetchOptions.body = JSON.stringify({
        model: provider.models[0].id,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'hi' }],
      });
    }

    const response = await fetch(validateReq.url, fetchOptions);

    if (response.ok) {
      return new Response(
        JSON.stringify({ valid: true }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // 401/403 = invalid key, other errors = provider issue
    if (response.status === 401 || response.status === 403) {
      return new Response(
        JSON.stringify({ valid: false, error: 'Invalid API key' }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({ valid: false, error: `Provider returned ${response.status}` }),
      { status: 200, headers: CORS_HEADERS }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Validation failed';
    return new Response(
      JSON.stringify({ valid: false, error: message }),
      { status: 502, headers: CORS_HEADERS }
    );
  }
};
