import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET } from '@/pages/api/templates/[id]/thumbnail.png';

vi.mock('@/lib/og-engine', () => ({
  renderToPng: vi.fn(async () => new Uint8Array([137, 80, 78, 71])),
}));
vi.mock('@/templates/registry', () => ({
  getTemplate: () => ({
    defaults: { title: 'Thumbnail test' },
    render: () => null,
  }),
}));

function makeContext(url: string, id: string, locals: object = {}) {
  return {
    params: { id },
    url: new URL(url),
    locals,
  } as unknown as Parameters<typeof GET>[0];
}

describe('Template thumbnail API cache behavior', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('does not read or write the Cloudflare cache in development', async () => {
    const cache = {
      match: vi.fn().mockResolvedValue(undefined),
      put: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubEnv('DEV', true);
    vi.stubGlobal('caches', { default: cache });

    const res = await GET(
      makeContext(
        'http://localhost:4321/api/templates/blog-minimal-dark/thumbnail.png',
        'blog-minimal-dark'
      )
    );

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('image/png');
    expect(cache.match).not.toHaveBeenCalled();
    expect(cache.put).not.toHaveBeenCalled();
  }, 15000);

  it('looks up and caches a successful 200 response outside development', async () => {
    const cache = {
      match: vi.fn().mockResolvedValue(undefined),
      put: vi.fn().mockResolvedValue(undefined),
    };
    const waitUntil = vi.fn();
    vi.stubEnv('DEV', false);
    vi.stubGlobal('caches', { default: cache });

    const res = await GET(
      makeContext(
        'http://localhost:4321/api/templates/blog-minimal-light/thumbnail.png',
        'blog-minimal-light',
        { cfContext: { waitUntil } }
      )
    );

    expect(res.status).toBe(200);
    expect(cache.match).toHaveBeenCalledWith(expect.any(Request));
    expect(cache.put).toHaveBeenCalledOnce();
    expect(cache.put).toHaveBeenCalledWith(
      expect.any(Request),
      expect.objectContaining({ status: 200 })
    );
    expect(waitUntil).toHaveBeenCalledOnce();
  }, 15000);
});
