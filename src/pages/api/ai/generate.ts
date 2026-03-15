import type { APIRoute } from 'astro';
import { aiGenerateSchema } from '@/lib/ai/validation';
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
      JSON.stringify({ error: 'Invalid JSON body' }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const parsed = aiGenerateSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    return new Response(
      JSON.stringify({ error: errors }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { provider: providerId, apiKey, model, prompt, systemPrompt, maxTokens, temperature } = parsed.data;
  const provider = getProvider(providerId);
  if (!provider) {
    return new Response(
      JSON.stringify({ error: `Unknown provider: ${providerId}` }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    const { url, body: requestBody } = provider.bodyFormatter({
      model,
      prompt,
      systemPrompt,
      maxTokens,
      temperature,
    });

    // Google passes API key as query param
    const fetchUrl = providerId === 'google' ? `${url}?key=${apiKey}` : url;
    const headers = provider.headerBuilder(apiKey);

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key' }),
          { status: 401, headers: CORS_HEADERS }
        );
      }
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limited by provider' }),
          { status: 429, headers: CORS_HEADERS }
        );
      }

      let errorMessage = `Provider error (${response.status})`;
      try {
        const errBody = await response.json();
        errorMessage = errBody.error?.message ?? errBody.error ?? errorMessage;
      } catch {
        // use default error message
      }
      return new Response(
        JSON.stringify({ error: errorMessage }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const data = await response.json();
    const result = provider.responseParser(data);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Generation failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: CORS_HEADERS }
    );
  }
};
