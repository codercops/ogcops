import type { APIRoute } from 'astro';
import { z } from 'zod';
import { getProvider } from '@/lib/ai/providers';
import { fetchMetaTags } from '@/lib/meta-fetcher';
import { buildAutofillPrompt, parseAutofillResponse } from '@/lib/ai/autofill';
import { getTemplate } from '@/templates/registry';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const autofillSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'google', 'groq', 'openrouter']),
  apiKey: z.string().min(1),
  model: z.string().min(1),
  url: z.string().url('A valid URL is required'),
});

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

  const parsed = autofillSchema.safeParse(body);
  if (!parsed.success) {
    const errors = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    return new Response(
      JSON.stringify({ error: errors }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { provider: providerId, apiKey, model, url } = parsed.data;
  const provider = getProvider(providerId);
  if (!provider) {
    return new Response(
      JSON.stringify({ error: `Unknown provider: ${providerId}` }),
      { status: 400, headers: CORS_HEADERS }
    );
  }

  try {
    // Step 1: Fetch the URL and extract content
    let pageContent: {
      title?: string;
      description?: string;
      headings?: string[];
      bodyText?: string;
      ogTags?: Record<string, string>;
      themeColor?: string;
    };

    try {
      const meta = await fetchMetaTags(url);
      pageContent = {
        title: meta.ogTitle || meta.title,
        description: meta.ogDescription || meta.description,
        ogTags: meta as Record<string, string>,
        themeColor: meta.themeColor,
      };
    } catch {
      return new Response(
        JSON.stringify({ error: 'Could not fetch the URL' }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    // Step 2: Build prompt and call AI
    const { prompt, systemPrompt } = buildAutofillPrompt(pageContent);
    const { url: aiUrl, body: aiBody } = provider.bodyFormatter({
      model,
      prompt,
      systemPrompt,
      maxTokens: 500,
      temperature: 0.5,
    });

    const fetchUrl = providerId === 'google' ? `${aiUrl}?key=${apiKey}` : aiUrl;
    const headers = provider.headerBuilder(apiKey);

    const aiResponse = await fetch(fetchUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(aiBody),
      signal: AbortSignal.timeout(30000),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 401 || aiResponse.status === 403) {
        return new Response(
          JSON.stringify({ error: 'Invalid API key' }),
          { status: 401, headers: CORS_HEADERS }
        );
      }
      return new Response(
        JSON.stringify({ error: `AI provider error (${aiResponse.status})` }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    const aiData = await aiResponse.json();
    const aiResult = provider.responseParser(aiData);

    // Step 3: Parse the autofill result
    const autofill = parseAutofillResponse(aiResult.content);
    if (!autofill) {
      return new Response(
        JSON.stringify({ error: 'Could not parse AI response' }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    // Validate template exists
    const template = getTemplate(autofill.templateId);
    if (!template) {
      // Fallback to first template in the suggested category
      autofill.templateId = 'blog-minimal-dark';
    }

    return new Response(JSON.stringify(autofill), {
      status: 200,
      headers: CORS_HEADERS,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Autofill failed';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 502, headers: CORS_HEADERS }
    );
  }
};
