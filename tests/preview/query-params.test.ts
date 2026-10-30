import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderToString } from 'react-dom/server';
import React from 'react';
import { PreviewApp, parsePreviewQueryParams, isValidPreviewUrl } from '@/components/preview/PreviewApp';
import { usePreviewState } from '@/components/preview/usePreviewState';

describe('Preview Query Parameter Parsing', () => {
  it('extracts a standard https URL from query params', () => {
    const url = parsePreviewQueryParams('?url=https://example.com');
    expect(url).toBe('https://example.com');
  });

  it('extracts and decodes an encoded URL parameter', () => {
    const url = parsePreviewQueryParams('?url=https%3A%2F%2Fexample.com%2Fpost%3Fid%3D42');
    expect(url).toBe('https://example.com/post?id=42');
  });

  it('supports bare domain without protocol', () => {
    const url = parsePreviewQueryParams('?url=example.com');
    expect(url).toBe('example.com');
  });

  it('supports localhost URLs with port', () => {
    const url = parsePreviewQueryParams('?url=http://localhost:3000');
    expect(url).toBe('http://localhost:3000');
  });

  it('supports URLSearchParams instance as argument', () => {
    const params = new URLSearchParams({ url: 'https://codercops.com' });
    const url = parsePreviewQueryParams(params);
    expect(url).toBe('https://codercops.com');
  });

  it('returns null when url query param is missing', () => {
    expect(parsePreviewQueryParams('')).toBeNull();
    expect(parsePreviewQueryParams('?other=123')).toBeNull();
  });

  it('returns null when url query param is empty or whitespace', () => {
    expect(parsePreviewQueryParams('?url=')).toBeNull();
    expect(parsePreviewQueryParams('?url=   ')).toBeNull();
    expect(parsePreviewQueryParams('?url=%20%20')).toBeNull();
  });

  it('returns null for invalid or non-URL parameters', () => {
    expect(parsePreviewQueryParams('?url=not-a-url')).toBeNull();
    expect(parsePreviewQueryParams('?url=http://')).toBeNull();
    expect(parsePreviewQueryParams('?url=https://')).toBeNull();
    expect(parsePreviewQueryParams('?url=:::invalid')).toBeNull();
  });

  it('rejects disallowed protocols such as javascript:, data:, and ftp:', () => {
    expect(parsePreviewQueryParams('?url=javascript:alert(1)')).toBeNull();
    expect(parsePreviewQueryParams('?url=data:text/html,<h1>bad</h1>')).toBeNull();
    expect(parsePreviewQueryParams('?url=ftp://example.com/file')).toBeNull();
    expect(parsePreviewQueryParams('?url=file:///etc/passwd')).toBeNull();
  });

  it('safely handles malformed percent-encoded query strings without throwing', () => {
    expect(parsePreviewQueryParams('?url=%E0%A4%A')).toBeNull();
  });
});

describe('Preview URL Validation (isValidPreviewUrl)', () => {
  it('validates correct HTTP and HTTPS URLs', () => {
    expect(isValidPreviewUrl('https://example.com')).toBe(true);
    expect(isValidPreviewUrl('http://example.com/blog/article?utm_source=test#top')).toBe(true);
    expect(isValidPreviewUrl('https://sub.domain.co.uk')).toBe(true);
  });

  it('accepts HTTP and HTTPS schemes regardless of letter casing', () => {
    expect(isValidPreviewUrl('HTTP://example.com')).toBe(true);
    expect(isValidPreviewUrl('HTTPS://example.com')).toBe(true);
    expect(parsePreviewQueryParams('?url=HTTPS%3A%2F%2Fexample.com')).toBe('HTTPS://example.com');
  });

  it('validates bare domain names', () => {
    expect(isValidPreviewUrl('example.com')).toBe(true);
    expect(isValidPreviewUrl('og.codercops.com/preview')).toBe(true);
  });

  it('validates localhost and IP addresses', () => {
    expect(isValidPreviewUrl('http://localhost:4321')).toBe(true);
    expect(isValidPreviewUrl('http://127.0.0.1:8080')).toBe(true);
  });

  it('invalidates non-string or empty inputs', () => {
    expect(isValidPreviewUrl('')).toBe(false);
    expect(isValidPreviewUrl('   ')).toBe(false);
    expect(isValidPreviewUrl(null as any)).toBe(false);
    expect(isValidPreviewUrl(undefined as any)).toBe(false);
  });

  it('invalidates malformed or incomplete URLs', () => {
    expect(isValidPreviewUrl('not-a-url')).toBe(false);
    expect(isValidPreviewUrl('http://')).toBe(false);
    expect(isValidPreviewUrl('https:///')).toBe(false);
    expect(isValidPreviewUrl('https://.com')).toBe(false);
    expect(isValidPreviewUrl('https://example..com')).toBe(false);
    expect(isValidPreviewUrl('https://example .com')).toBe(false);
  });

  it('invalidates non-web protocols', () => {
    expect(isValidPreviewUrl('javascript:void(0)')).toBe(false);
    expect(isValidPreviewUrl('mailto:test@example.com')).toBe(false);
    expect(isValidPreviewUrl('tel:1234567890')).toBe(false);
  });
});

describe('PreviewApp Server-Side Rendering', () => {
  it('renders clean empty state on server without hydration errors or alerts', () => {
    const html = renderToString(React.createElement(PreviewApp));

    expect(html).toContain('preview-empty');
    expect(html).toContain('Social Media Preview Checker');
    expect(html).toContain('Enter a URL above to analyze its meta tags');
    expect(html).not.toContain('preview-error');
    expect(html).not.toContain('preview-results');
  });
});

describe('usePreviewState Address Bar Synchronization', () => {
  const originalFetch = global.fetch;
  const originalWindow = global.window;
  let replaceStateMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    replaceStateMock = vi.fn();
    (global as any).window = {
      history: {
        state: null,
        replaceState: replaceStateMock,
      },
    };
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalWindow !== undefined) {
      global.window = originalWindow;
    } else {
      delete (global as any).window;
    }
  });

  it('updates address bar with encoded URL using history.replaceState upon successful check', async () => {
    const mockState = { astro: { index: 1 } };
    (window.history as any).state = mockState;

    const mockData = {
      url: 'https://example.com',
      meta: { title: 'Example Title', description: 'Example Desc' },
      analysis: { score: 90, issues: [] },
      platforms: [],
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockData,
    });

    let hookInstance!: ReturnType<typeof usePreviewState>;
    function TestHook() {
      hookInstance = usePreviewState();
      return null;
    }

    renderToString(React.createElement(TestHook));

    await hookInstance.checkUrl('https://example.com');

    expect(replaceStateMock).toHaveBeenCalledTimes(1);
    expect(replaceStateMock).toHaveBeenCalledWith(
      mockState,
      '',
      '/preview?url=https%3A%2F%2Fexample.com'
    );
  });

  it('normalizes protocol and encodes URL in history.replaceState', async () => {
    const mockState = { astro: { index: 2 } };
    (window.history as any).state = mockState;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'https://example.com/test?a=1&b=2' }),
    });

    let hookInstance!: ReturnType<typeof usePreviewState>;
    function TestHook() {
      hookInstance = usePreviewState();
      return null;
    }

    renderToString(React.createElement(TestHook));

    await hookInstance.checkUrl('example.com/test?a=1&b=2');

    expect(replaceStateMock).toHaveBeenCalledTimes(1);
    expect(replaceStateMock).toHaveBeenCalledWith(
      mockState,
      '',
      '/preview?url=https%3A%2F%2Fexample.com%2Ftest%3Fa%3D1%26b%3D2'
    );
  });

  it('preserves an uppercase HTTP or HTTPS scheme when checking a URL', async () => {
    const mockState = { astro: { index: 3 } };
    (window.history as any).state = mockState;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ url: 'HTTPS://example.com' }),
    });

    let hookInstance!: ReturnType<typeof usePreviewState>;
    function TestHook() {
      hookInstance = usePreviewState();
      return null;
    }

    renderToString(React.createElement(TestHook));

    await hookInstance.checkUrl('HTTPS://example.com');

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/preview?url=HTTPS%3A%2F%2Fexample.com'
    );
    expect(replaceStateMock).toHaveBeenCalledWith(
      mockState,
      '',
      '/preview?url=HTTPS%3A%2F%2Fexample.com'
    );
  });

  it('does NOT update address bar when check fails with API error', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Site unreachable' }),
    });

    let hookInstance!: ReturnType<typeof usePreviewState>;
    function TestHook() {
      hookInstance = usePreviewState();
      return null;
    }

    renderToString(React.createElement(TestHook));

    await hookInstance.checkUrl('https://failing-site.com');

    expect(replaceStateMock).not.toHaveBeenCalled();
  });

  it('does NOT update address bar when check fails with network exception', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    let hookInstance!: ReturnType<typeof usePreviewState>;
    function TestHook() {
      hookInstance = usePreviewState();
      return null;
    }

    renderToString(React.createElement(TestHook));

    await hookInstance.checkUrl('https://network-error.com');

    expect(replaceStateMock).not.toHaveBeenCalled();
  });
});
