import { describe, it, expect, vi } from 'vitest';
import {
  ogQuerySchema,
  parseSearchParams,
  mergeOgParams,
  resolveDimensions,
} from '@/lib/api-validation';
import { getTemplate, getAllTemplates } from '@/templates/registry';
import { normalizeColorFields } from '@/templates/utils';

describe('OG API Validation', () => {
  it('should validate valid params', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Hello World',
      template: 'blog-minimal-dark',
    });
    expect(result.success).toBe(true);
  });

  it('should allow missing title (template defaults supply it)', () => {
    const result = ogQuerySchema.safeParse({
      template: 'blog-minimal-dark',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBeUndefined();
    }
  });

  it('should accept an explicitly empty title and treat it as not provided', () => {
    const result = ogQuerySchema.safeParse({
      title: '',
      template: 'blog-minimal-dark',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      // empty string passes through as-is; mergeOgParams skips empty values so
      // the template default title will be used at render time
      expect(result.data.title).toBe('');
    }
  });

  it('should use defaults for optional params', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Test',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.template).toBe('blog-minimal-dark');
      expect(result.data.width).toBeUndefined();
      expect(result.data.height).toBeUndefined();
    }
  });

  it('should coerce width and height to numbers', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Test',
      width: '800',
      height: '400',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.width).toBe(800);
      expect(result.data.height).toBe(400);
    }
  });

  it('should reject invalid dimensions', () => {
    expect(ogQuerySchema.safeParse({ title: 'Test', width: '50' }).success).toBe(false);
    expect(ogQuerySchema.safeParse({ title: 'Test', width: '199' }).success).toBe(false);
    expect(ogQuerySchema.safeParse({ title: 'Test', width: '2401' }).success).toBe(false);
    expect(ogQuerySchema.safeParse({ title: 'Test', height: '50' }).success).toBe(false);
    expect(ogQuerySchema.safeParse({ title: 'Test', height: '104' }).success).toBe(false);
    expect(ogQuerySchema.safeParse({ title: 'Test', height: '1261' }).success).toBe(false);
  });

  it('should accept boundary dimensions', () => {
    const minResult = ogQuerySchema.safeParse({
      title: 'Test',
      width: '200',
      height: '105',
    });
    expect(minResult.success).toBe(true);
    if (minResult.success) {
      expect(minResult.data.width).toBe(200);
      expect(minResult.data.height).toBe(105);
    }

    const maxResult = ogQuerySchema.safeParse({
      title: 'Test',
      width: '2400',
      height: '1260',
    });
    expect(maxResult.success).toBe(true);
    if (maxResult.success) {
      expect(maxResult.data.width).toBe(2400);
      expect(maxResult.data.height).toBe(1260);
    }
  });
});

describe('OG API Validation: empty values count as missing', () => {
  it('uses the default template for an empty template', () => {
    const result = ogQuerySchema.safeParse({ template: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.template).toBe('blog-minimal-dark');
  });

  it.each(['imageUrl', 'logoUrl'])('treats an empty %s as not provided', (key) => {
    const result = ogQuerySchema.safeParse({ title: 'Hi', [key]: '' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data[key as 'imageUrl' | 'logoUrl']).toBeUndefined();
  });

  it.each(['imageUrl', 'logoUrl'])('still accepts a real URL for %s', (key) => {
    const result = ogQuerySchema.safeParse({ [key]: 'https://example.com/cover.png' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data[key as 'imageUrl' | 'logoUrl']).toBe('https://example.com/cover.png');
  });

  it.each(['imageUrl', 'logoUrl'])('still rejects a %s that is not a URL', (key) => {
    const result = ogQuerySchema.safeParse({ [key]: 'not-a-url' });
    expect(result.success).toBe(false);
    if (!result.success) expect(result.error.issues[0].path).toEqual([key]);
  });

  it('keeps a template that is set', () => {
    const result = ogQuerySchema.safeParse({ template: 'blog-photo-overlay' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.template).toBe('blog-photo-overlay');
  });

  it('reads empty values from a query string the way the route does', () => {
    const parsed = parseSearchParams(
      new URLSearchParams('template=&imageUrl=&logoUrl=&title=Hi'),
      ogQuerySchema
    );
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.template).toBe('blog-minimal-dark');
      expect(parsed.data.imageUrl).toBeUndefined();
      expect(parsed.data.logoUrl).toBeUndefined();
      expect(parsed.data.title).toBe('Hi');
    }
  });
});

describe('resolveDimensions', () => {
  it('defaults to 1200x630 when neither dimension is provided', () => {
    expect(resolveDimensions()).toEqual({
      success: true,
      width: 1200,
      height: 630,
    });
    expect(resolveDimensions(undefined, undefined)).toEqual({
      success: true,
      width: 1200,
      height: 630,
    });
  });

  it('derives height when only width is supplied', () => {
    expect(resolveDimensions(600)).toEqual({
      success: true,
      width: 600,
      height: 315,
    });
    expect(resolveDimensions(200)).toEqual({
      success: true,
      width: 200,
      height: 105,
    });
    expect(resolveDimensions(2400)).toEqual({
      success: true,
      width: 2400,
      height: 1260,
    });
  });

  it('rounds a fractional width to a whole number', () => {
    expect(resolveDimensions(600.5)).toEqual({
      success: true,
      width: 601,
      height: 316,
    });
    expect(resolveDimensions(333.3)).toEqual({
      success: true,
      width: 333,
      height: 175,
    });
  });

  it('derives width when only height is supplied', () => {
    expect(resolveDimensions(undefined, 315)).toEqual({
      success: true,
      width: 600,
      height: 315,
    });
    expect(resolveDimensions(undefined, 105)).toEqual({
      success: true,
      width: 200,
      height: 105,
    });
    expect(resolveDimensions(undefined, 1260)).toEqual({
      success: true,
      width: 2400,
      height: 1260,
    });
  });

  it('accepts valid matching aspect ratios when both width and height are supplied', () => {
    expect(resolveDimensions(600, 315)).toEqual({
      success: true,
      width: 600,
      height: 315,
    });
    expect(resolveDimensions(1200, 630)).toEqual({
      success: true,
      width: 1200,
      height: 630,
    });
    expect(resolveDimensions(2400, 1260)).toEqual({
      success: true,
      width: 2400,
      height: 1260,
    });
  });

  it('rejects mismatched aspect ratios when both dimensions are supplied', () => {
    const res1 = resolveDimensions(600, 400);
    expect(res1.success).toBe(false);
    if (!res1.success) {
      expect(res1.error).toMatch(/aspect ratio/i);
    }

    const res2 = resolveDimensions(800, 400);
    expect(res2.success).toBe(false);

    const res3 = resolveDimensions(1200, 600);
    expect(res3.success).toBe(false);
  });

  it('rejects dimensions that resolve out of bounds', () => {
    expect(resolveDimensions(50).success).toBe(false);
    expect(resolveDimensions(199).success).toBe(false);
    expect(resolveDimensions(2401).success).toBe(false);
    expect(resolveDimensions(3000).success).toBe(false);
    expect(resolveDimensions(undefined, 50).success).toBe(false);
    expect(resolveDimensions(undefined, 104).success).toBe(false);
    expect(resolveDimensions(undefined, 1261).success).toBe(false);
    expect(resolveDimensions(undefined, 2000).success).toBe(false);
    expect(resolveDimensions(600, 50).success).toBe(false);
    expect(resolveDimensions(600, 1300).success).toBe(false);
  });
});

describe('mergeOgParams', () => {
  const defaults: Record<string, string | number | boolean> = {
    quote: 'Default quote',
    author: 'Default Author',
    bgColor: '#0a0a0a',
  };

  function merge(query: string, templateDefaults: Record<string, string | number | boolean> = defaults) {
    const searchParams = new URLSearchParams(query);
    const parsed = parseSearchParams(searchParams, ogQuerySchema);
    expect(parsed.success).toBe(true);
    if (!parsed.success) throw new Error(parsed.error);
    return mergeOgParams(parsed.data, templateDefaults, searchParams);
  }

  it('overrides template defaults with non-empty schema params', () => {
    const merged = merge('author=Ada%20Lovelace');
    expect(merged.author).toBe('Ada Lovelace');
  });

  it('empty schema values never replace defaults', () => {
    const merged = merge('author=&bgColor=');
    expect(merged.author).toBe('Default Author');
    expect(merged.bgColor).toBe('#0a0a0a');
  });

  it('template-specific query params override template defaults', () => {
    const merged = merge('quote=Custom%20quote');
    expect(merged.quote).toBe('Custom quote');
  });

  it('empty template-specific values never replace defaults', () => {
    const merged = merge('quote=');
    expect(merged.quote).toBe('Default quote');
  });

  it('passes through template-specific params that have no default', () => {
    const merged = merge('authorTitle=Computer%20Scientist');
    expect(merged.authorTitle).toBe('Computer Scientist');
  });

  it('renders quote-centered-serif without a title param', () => {
    const template = getTemplate('quote-centered-serif');
    expect(template).toBeDefined();
    const merged = merge('template=quote-centered-serif', template!.defaults);
    expect(merged.title).toBeUndefined();
    expect(merged.quote).toBe(template!.defaults.quote);
    expect(() => template!.render(merged)).not.toThrow();
  });

  it('renders developer-portfolio-card without a title param', () => {
    const template = getTemplate('developer-portfolio-card');
    expect(template).toBeDefined();
    const merged = merge('template=developer-portfolio-card', template!.defaults);
    expect(merged.title).toBeUndefined();
    expect(merged.name).toBe(template!.defaults.name);
    expect(() => template!.render(merged)).not.toThrow();
  });

  it('quote-centered-serif query overrides template-specific defaults', () => {
    const template = getTemplate('quote-centered-serif');
    expect(template).toBeDefined();
    const merged = merge(
      'template=quote-centered-serif&quote=Talk is cheap, show me the code.',
      template!.defaults
    );
    expect(merged.quote).toBe('Talk is cheap, show me the code.');
    expect(merged.author).toBe(template!.defaults.author);
  });
});

// og-engine pulls in the resvg wasm binary through a Vite-only `?module`
// specifier that vitest cannot resolve, so it has to be mocked before the route
// handler is imported.
vi.mock('@/lib/og-engine', () => ({
  renderToPng: vi.fn(async () => new Uint8Array([137, 80, 78, 71])),
}));

const { GET } = await import('@/pages/api/og');

function makeContext(url: string) {
  return {
    request: new Request(url),
    locals: {},
  } as unknown as Parameters<NonNullable<typeof GET>>[0];
}

const BASE = 'http://localhost:4321/api/og';

describe('OG API error caching', () => {
  it('does not cache a 404 for a template that does not exist', async () => {
    const res = await GET(makeContext(`${BASE}?template=does-not-exist&title=Hi`));

    expect(res.status).toBe(404);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('does not cache a 400 for invalid params', async () => {
    const res = await GET(makeContext(`${BASE}?width=not-a-number&title=Hi`));

    expect(res.status).toBe(400);
    expect(res.headers.get('cache-control')).toBe('no-store');
  });

  it('does not cache a 500 when rendering throws', async () => {
    const template = getTemplate('blog-minimal-dark')!;
    const render = vi.spyOn(template, 'render').mockImplementation(() => {
      throw new Error('boom');
    });

    try {
      const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi`));

      expect(res.status).toBe(500);
      expect(res.headers.get('cache-control')).toBe('no-store');
    } finally {
      render.mockRestore();
    }
  });

  it('still caches a 200 for a day', async () => {
    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi`));

    expect(res.status).toBe(200);
    expect(res.headers.get('cache-control')).toBe('public, max-age=86400');
  });
});

describe('OG API color normalization and templates', () => {
  it('passes normalized accentColor to template render', async () => {
    const template = getTemplate('blog-minimal-dark')!;
    const render = vi.spyOn(template, 'render');

    try {
      const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&accentColor=00ff00`));

      expect(res.status).toBe(200);
      expect(render).toHaveBeenCalledWith(
        expect.objectContaining({ accentColor: '#00ff00' })
      );
    } finally {
      render.mockRestore();
    }
  });

  it('ensures partial editor input does not cause render errors across templates', () => {
    const templates = getAllTemplates();
    const partialValues = ['#', '#0', '#0f', '0', '00', 'invalid', ''];
    for (const t of templates) {
      for (const partial of partialValues) {
        const partialParams: Record<string, any> = { ...t.defaults };
        for (const f of t.fields) {
          if (f.type === 'color') {
            partialParams[f.key] = partial;
          }
        }
        const normalized = normalizeColorFields(t, partialParams);
        expect(() => t.render(normalized)).not.toThrow();
      }
    }
  });
});

describe('OG API dimension resolution and scaling', () => {
  it('renders at 1200x630 and scales down with requested width and height', async () => {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();

    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi&width=600&height=315`));
    expect(res.status).toBe(200);
    expect(renderToPng).toHaveBeenCalledWith(
      expect.anything(),
      { width: 1200, height: 630, scaleDown: 600 }
    );
  });

  it('renders at 1200x630 and scales down when only width is provided', async () => {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();

    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi&width=600`));
    expect(res.status).toBe(200);
    expect(renderToPng).toHaveBeenCalledWith(
      expect.anything(),
      { width: 1200, height: 630, scaleDown: 600 }
    );
  });

  it('renders at 1200x630 and scales down when only height is provided', async () => {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();

    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi&height=315`));
    expect(res.status).toBe(200);
    expect(renderToPng).toHaveBeenCalledWith(
      expect.anything(),
      { width: 1200, height: 630, scaleDown: 600 }
    );
  });

  it('scales down to a whole-number width when width is fractional', async () => {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();

    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi&width=600.5`));
    expect(res.status).toBe(200);
    expect(renderToPng).toHaveBeenCalledWith(
      expect.anything(),
      { width: 1200, height: 630, scaleDown: 601 }
    );
  });

  it('scales down to 601 when height is fractional', async () => {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();

    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi&height=315.5`));
    expect(res.status).toBe(200);
    expect(renderToPng).toHaveBeenCalledWith(
      expect.anything(),
      { width: 1200, height: 630, scaleDown: 601 }
    );
  });

  it('preserves default 1200x630 rendering when neither dimension is provided', async () => {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();

    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi`));
    expect(res.status).toBe(200);
    expect(renderToPng).toHaveBeenCalledWith(
      expect.anything(),
      { width: 1200, height: 630, scaleDown: undefined }
    );
  });

  it('returns 400 without caching for mismatched aspect ratios', async () => {
    const res = await GET(makeContext(`${BASE}?template=blog-minimal-dark&title=Hi&width=600&height=400`));
    expect(res.status).toBe(400);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const json = (await res.json()) as { error: string };
    expect(json.error).toMatch(/aspect ratio/i);
  });
});

describe('OG API empty parameters fall back to the defaults', () => {
  /** The element the route handed to the renderer for this URL. */
  async function elementFor(query: string) {
    const { renderToPng } = await import('@/lib/og-engine');
    vi.mocked(renderToPng).mockClear();
    const res = await GET(makeContext(`${BASE}${query}`));
    expect(res.status, query).toBe(200);
    expect(renderToPng).toHaveBeenCalledOnce();
    return vi.mocked(renderToPng).mock.calls[0][0];
  }

  it('renders the same image for an empty imageUrl as for none', async () => {
    const without = await elementFor('?template=blog-photo-overlay&title=Hi');
    const empty = await elementFor('?template=blog-photo-overlay&title=Hi&imageUrl=');
    expect(empty).toEqual(without);
  });

  it('renders the same image for an empty logoUrl as for none', async () => {
    const without = await elementFor('?template=blog-minimal-dark&title=Hi');
    const empty = await elementFor('?template=blog-minimal-dark&title=Hi&logoUrl=');
    expect(empty).toEqual(without);
  });

  it('renders blog-minimal-dark for an empty template', async () => {
    const named = await elementFor('?template=blog-minimal-dark&title=Hi');
    expect(await elementFor('?template=&title=Hi')).toEqual(named);
    expect(await elementFor('?title=Hi')).toEqual(named);
  });

  it('does not answer 404 or 400 for the empty values', async () => {
    for (const query of ['?template=', '?imageUrl=', '?logoUrl=', '?template=&imageUrl=&logoUrl=']) {
      const res = await GET(makeContext(`${BASE}${query}`));
      expect(res.status, query).toBe(200);
    }
  });

  it('still returns 400 without caching for an imageUrl that is not a URL', async () => {
    const res = await GET(makeContext(`${BASE}?template=blog-photo-overlay&imageUrl=not-a-url`));
    expect(res.status).toBe(400);
    expect(res.headers.get('cache-control')).toBe('no-store');
    const json = (await res.json()) as { error: string };
    expect(json.error).toMatch(/imageUrl/);
  });

  it('still returns 404 for a template that does not exist', async () => {
    const res = await GET(makeContext(`${BASE}?template=does-not-exist`));
    expect(res.status).toBe(404);
  });
});
