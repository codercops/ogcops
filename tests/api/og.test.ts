import { describe, it, expect, vi } from 'vitest';
import { ogQuerySchema, parseSearchParams, mergeOgParams } from '@/lib/api-validation';
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
      expect(result.data.width).toBe(1200);
      expect(result.data.height).toBe(630);
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
    const result = ogQuerySchema.safeParse({
      title: 'Test',
      width: '50', // too small
    });
    expect(result.success).toBe(false);
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
