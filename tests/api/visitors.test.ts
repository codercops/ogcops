import { afterEach, describe, expect, it, vi } from 'vitest';

// astro:env/server is a Vite virtual module, so it is mocked the same way
// tests/middleware.test.ts mocks astro:middleware.
const mocks = vi.hoisted(() => ({
  getSecret: vi.fn<(key: string) => string | undefined>(),
}));

vi.mock('astro:env/server', () => ({
  getSecret: mocks.getSecret,
}));

const { GET, POST } = await import('@/pages/api/visitors');

const context = {} as Parameters<NonNullable<typeof GET>>[0];

const URL_SECRET = 'UPSTASH_REDIS_REST_URL';
const TOKEN_SECRET = 'UPSTASH_REDIS_REST_TOKEN';

function setSecrets(url: string | undefined, token: string | undefined) {
  mocks.getSecret.mockImplementation((key: string) => {
    if (key === URL_SECRET) return url;
    if (key === TOKEN_SECRET) return token;
    return undefined;
  });
}

describe('/api/visitors without Upstash secrets', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    mocks.getSecret.mockReset();
  });

  it.each([
    ['neither', undefined, undefined],
    ['only the URL', 'https://example.upstash.io', undefined],
    ['only the token', undefined, 'token'],
  ])('GET answers 204 and calls no fetch when %s is set', async (_case, url, token) => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    setSecrets(url, token);

    const res = await GET(context);

    expect(res.status).toBe(204);
    expect(await res.text()).toBe('');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it.each([
    ['neither', undefined, undefined],
    ['only the URL', 'https://example.upstash.io', undefined],
    ['only the token', undefined, 'token'],
  ])('POST answers 204 and calls no fetch when %s is set', async (_case, url, token) => {
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    setSecrets(url, token);

    const res = await POST(context);

    expect(res.status).toBe(204);
    expect(await res.text()).toBe('');
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

describe('/api/visitors with Upstash secrets set', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    mocks.getSecret.mockReset();
  });

  it('GET returns the stored counts', async () => {
    setSecrets('https://example.upstash.io', 'token');
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify([{ result: '7' }, { result: '123' }]), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const res = await GET(context);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ today: 7, total: 123 });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.upstash.io/pipeline',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('POST increments and returns the counts', async () => {
    setSecrets('https://example.upstash.io', 'token');
    const fetchSpy = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ result: [7, 123] }), { status: 200 })
    );
    vi.stubGlobal('fetch', fetchSpy);

    const res = await POST(context);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ today: 7, total: 123 });
    expect(fetchSpy).toHaveBeenCalledWith(
      'https://example.upstash.io',
      expect.objectContaining({ method: 'POST' })
    );
  });

  it('POST stays a 500 when Upstash answers with an error', async () => {
    setSecrets('https://example.upstash.io', 'token');
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('upstream error', { status: 500 }))
    );

    const res = await POST(context);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ today: 0, total: 0 });
  });

  it('GET stays a 500 when the Upstash request throws', async () => {
    setSecrets('https://example.upstash.io', 'token');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')));

    const res = await GET(context);

    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ today: 0, total: 0 });
  });
});
