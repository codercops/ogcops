import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import type { MetaTags } from '@/lib/meta-fetcher';

vi.mock('@/lib/meta-fetcher', () => ({
  fetchMetaTags: vi.fn(),
}));

const { POST } = await import('@/pages/api/ai/autofill');
const { fetchMetaTags } = await import('@/lib/meta-fetcher');

const VALID = {
  provider: 'openai',
  apiKey: 'sk-test',
  model: 'gpt-4o-mini',
  url: 'https://example.com',
};

const META: MetaTags = {
  title: 'Example',
  ogTitle: 'Example',
  description: 'An example page',
  ogDescription: 'An example page',
  themeColor: '#123456',
} as MetaTags;

const AI_JSON = JSON.stringify({
  templateId: 'blog-minimal-dark',
  fields: { title: 'Example', description: 'An example page' },
  colors: { bgColor: '#123456', accentColor: '#ffffff' },
});

function post(body: unknown, raw?: string) {
  const request = new Request('http://localhost:4321/api/ai/autofill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: raw ?? JSON.stringify(body),
  });
  return POST({ request } as Parameters<NonNullable<typeof POST>>[0]);
}

function openAiReply(content: string, status = 200) {
  return new Response(
    JSON.stringify({ choices: [{ message: { content } }] }),
    { status }
  );
}

describe('POST /api/ai/autofill', () => {
  beforeEach(() => {
    vi.mocked(fetchMetaTags).mockResolvedValue(META);
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetAllMocks();
  });

  it('returns 400 when the body is not JSON', async () => {
    const res = await post(null, 'this is not json {');

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: 'Invalid JSON body' });
  });

  it.each([
    [{ ...VALID, provider: 'not-a-provider' }, 'provider'],
    [{ ...VALID, apiKey: '' }, 'apiKey'],
    [{ ...VALID, url: 'not-a-url' }, 'url'],
    [{ provider: 'openai', apiKey: 'sk-test', model: 'gpt-4o-mini' }, 'url'],
    [{ url: 'https://example.com' }, 'provider'],
  ])('returns 400 naming the bad field (%j)', async (body, field) => {
    const res = await post(body);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toContain(`${field}:`);
    expect(fetchMetaTags).not.toHaveBeenCalled();
  });

  it('returns 502 and never calls the provider when the page fetch fails', async () => {
    vi.mocked(fetchMetaTags).mockRejectedValue(new Error('network down'));
    const fetchSpy = vi.mocked(fetch);

    const res = await post(VALID);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Could not fetch the URL' });
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it.each([401, 403])('maps a provider %i answer to 401 Invalid API key', async (status) => {
    vi.mocked(fetch).mockResolvedValue(new Response('denied', { status }));

    const res = await post(VALID);

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: 'Invalid API key' });
  });

  it('maps another provider error to 502 with the status', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response('oops', { status: 500 }));

    const res = await post(VALID);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'AI provider error (500)' });
  });

  it('returns 502 when the provider reply has no usable JSON', async () => {
    vi.mocked(fetch).mockResolvedValue(openAiReply('sorry, I cannot help with that'));

    const res = await post(VALID);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: 'Could not parse AI response' });
  });

  it('falls back to blog-minimal-dark when the AI picks an unknown template', async () => {
    vi.mocked(fetch).mockResolvedValue(
      openAiReply(
        JSON.stringify({ templateId: 'does-not-exist', fields: { title: 'Example' } })
      )
    );

    const res = await post(VALID);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.templateId).toBe('blog-minimal-dark');
    expect(json.fields).toEqual({ title: 'Example' });
  });

  it('returns 200 with templateId, fields and colors when everything works', async () => {
    vi.mocked(fetch).mockResolvedValue(openAiReply(AI_JSON));

    const res = await post(VALID);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.templateId).toBe('blog-minimal-dark');
    expect(json.fields).toEqual({ title: 'Example', description: 'An example page' });
    expect(json.colors).toEqual({ bgColor: '#123456', accentColor: '#ffffff' });
    expect(fetchMetaTags).toHaveBeenCalledWith('https://example.com');
  });

  it('sends the api key in the request URL for google', async () => {
    const fetchSpy = vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          candidates: [{ content: { parts: [{ text: AI_JSON }] } }],
          modelVersion: 'gemini-2.0-flash',
        }),
        { status: 200 }
      )
    );

    const res = await post({ ...VALID, provider: 'google', model: 'gemini-2.0-flash' });

    expect(res.status).toBe(200);
    const [calledUrl] = fetchSpy.mock.calls[0] as [string];
    expect(calledUrl).toContain('?key=sk-test');
    expect(calledUrl).toContain('gemini-2.0-flash:generateContent');
  });
});
