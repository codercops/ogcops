import { afterEach, describe, it, expect, vi } from 'vitest';
import { previewQuerySchema } from '@/lib/api-validation';

describe('Preview API Validation', () => {
  it('should validate a valid URL', () => {
    const result = previewQuerySchema.safeParse({
      url: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing URL', () => {
    const result = previewQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject invalid URL', () => {
    const result = previewQuerySchema.safeParse({
      url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });

  it.each(['http://example.com', 'https://example.com', 'HTTPS://example.com'])(
    'accepts %s',
    (url) => {
      expect(previewQuerySchema.safeParse({ url }).success).toBe(true);
    }
  );

  it.each([
    'ftp://example.com',
    'file:///etc/passwd',
    'data:text/html,<title>hi</title>',
    'javascript:alert(1)',
    'mailto:a@b.com',
  ])('rejects the %s scheme with a specific message', (url) => {
    const result = previewQuerySchema.safeParse({ url });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Only http and https URLs are supported');
    }
  });

  it.each([{}, { url: undefined }, { url: '' }, { url: 'example.com' }, { url: 'not-a-url' }])(
    'reports %o as "A valid URL is required"',
    (input) => {
      const result = previewQuerySchema.safeParse(input);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('A valid URL is required');
      }
    }
  );
});

// fetchMetaTags is mocked so no real page is fetched; the rest of the route
// (analyzeMeta, resolvePlatformPreviews) runs for real on minimal tags.
vi.mock('@/lib/meta-fetcher', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/meta-fetcher')>();
  return {
    ...actual,
    fetchMetaTags: vi.fn(),
  };
});

const { GET } = await import('@/pages/api/preview');
const { POST } = await import('@/pages/api/ai/autofill');
const { fetchMetaTags, parseMetaTags } = await import('@/lib/meta-fetcher');

const BASE = 'http://localhost:4321/api/preview';

function makeContext(url: string) {
  return { request: new Request(url) } as Parameters<NonNullable<typeof GET>>[0];
}

function stubMeta() {
  vi.mocked(fetchMetaTags).mockImplementation(async (url: string) =>
    parseMetaTags('<html><head><title>Example</title></head></html>', url)
  );
}

describe('GET /api/preview', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it.each(['', '?url=', '?url=example.com'])('rejects %s with 400, no-store', async (query) => {
    const res = await GET(makeContext(`${BASE}${query}`));

    expect(res.status).toBe(400);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual({ error: 'url: A valid URL is required' });
    expect(fetchMetaTags).not.toHaveBeenCalled();
  });

  it.each(['ftp://example.com', 'file:///etc/passwd', 'data:text/html,x', 'javascript:alert(1)', 'mailto:a@b.com'])(
    'rejects the %s scheme with 400, no-store',
    async (bad) => {
      const res = await GET(makeContext(`${BASE}?url=${encodeURIComponent(bad)}`));

      expect(res.status).toBe(400);
      expect(res.headers.get('cache-control')).toBe('no-store');
      const body = await res.json();
      expect(body.error).toBe('url: Only http and https URLs are supported');
      expect(fetchMetaTags).not.toHaveBeenCalled();
    }
  );

  it.each(['http://example.com', 'https://example.com', 'HTTPS://example.com'])(
    'accepts %s and caches the 200 for five minutes',
    async (good) => {
      stubMeta();
      const res = await GET(makeContext(`${BASE}?url=${encodeURIComponent(good)}`));

      expect(res.status).toBe(200);
      expect(res.headers.get('cache-control')).toBe('public, max-age=300');
      expect(fetchMetaTags).toHaveBeenCalledWith(expect.stringMatching(/^https?:\/\//i));
    }
  );

  it('answers 502 with no-store when the page cannot be fetched', async () => {
    vi.mocked(fetchMetaTags).mockRejectedValue(new Error('Failed to fetch URL: 404 Not Found'));

    const res = await GET(makeContext(`${BASE}?url=${encodeURIComponent('https://down.example')}`));

    expect(res.status).toBe(502);
    expect(res.headers.get('cache-control')).toBe('no-store');
    expect(await res.json()).toEqual({ error: 'Failed to fetch URL: 404 Not Found' });
  });
});

describe('POST /api/ai/autofill url validation', () => {
  function post(body: unknown) {
    const request = new Request('http://localhost:4321/api/ai/autofill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return POST({ request } as Parameters<NonNullable<typeof POST>>[0]);
  }

  const fields = { provider: 'openai', apiKey: 'sk-test', model: 'gpt-4o-mini' };

  it.each(['ftp://example.com', 'file:///etc/passwd', 'data:text/html,x', 'javascript:alert(1)', 'mailto:a@b.com'])(
    'rejects the %s scheme with a 400',
    async (bad) => {
      const res = await post({ ...fields, url: bad });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body.error).toContain('Only http and https URLs are supported');
    }
  );

  it('rejects an unparseable url with "A valid URL is required"', async () => {
    const res = await post({ ...fields, url: 'not-a-url' });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('A valid URL is required');
  });
});
