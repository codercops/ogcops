import { describe, it, expect, vi } from 'vitest';

vi.mock('astro:middleware', () => ({
  defineMiddleware: (fn: any) => fn,
}));

import { getCorsRule, onRequest } from '@/middleware';

describe('middleware CORS rule lookup', () => {
  const aiRoutes = [
    '/api/ai/generate',
    '/api/ai/validate',
    '/api/ai/autofill',
  ] as const;

  it.each(aiRoutes)('returns correct CORS rule for %s', (route) => {
    const rule = getCorsRule(route);
    expect(rule).toBeDefined();
    expect(rule?.['Access-Control-Allow-Origin']).toBe('*');
    expect(rule?.['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
    expect(rule?.['Access-Control-Allow-Headers']).toBe('Content-Type');
  });

  it('allows POST, OPTIONS, and Content-Type for all three ai routes', () => {
    for (const route of aiRoutes) {
      const rule = getCorsRule(route);
      expect(rule).toEqual({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
    }
  });

  it('does not match unrelated or sub-path routes', () => {
    expect(getCorsRule('/api/ai')).toBeUndefined();
    expect(getCorsRule('/api/ai/generate/sub')).toBeUndefined();
    expect(getCorsRule('/api/ai/validate/sub')).toBeUndefined();
    expect(getCorsRule('/api/ai/autofill/sub')).toBeUndefined();
    expect(getCorsRule('/api/ai/unknown')).toBeUndefined();
  });
});

describe('middleware preflight OPTIONS handling', () => {
  const aiRoutes = [
    '/api/ai/generate',
    '/api/ai/validate',
    '/api/ai/autofill',
  ] as const;

  it.each(aiRoutes)('returns 204 with CORS headers on OPTIONS preflight for %s', async (route) => {
    const context = {
      url: new URL(`http://localhost:4321${route}`),
      request: new Request(`http://localhost:4321${route}`, {
        method: 'OPTIONS',
      }),
    };
    const next = vi.fn();
    const response = await (onRequest as any)(context, next);

    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(204);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
    expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, OPTIONS');
    expect(response.headers.get('Access-Control-Allow-Headers')).toBe('Content-Type');
    expect(next).not.toHaveBeenCalled();
  });
});
