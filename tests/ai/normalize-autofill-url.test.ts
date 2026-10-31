import { describe, expect, it } from 'vitest';
import { normalizeAutofillUrl } from '@/lib/ai/normalize-autofill-url';

describe('normalizeAutofillUrl', () => {
  it.each([
    'https://example.com',
    'http://example.com',
    'HTTPS://example.com',
    'HTTP://example.com',
    'hTtPs://example.com/Case?key=Value#Section',
  ])('preserves an existing HTTP(S) scheme: %s', (url) => {
    expect(normalizeAutofillUrl(url)).toBe(url);
  });

  it.each(['example.com', 'httpbin.org', 'https-example.com/path'])('adds HTTPS to the bare domain %s', (url) => {
    expect(normalizeAutofillUrl(url)).toBe(`https://${url}`);
  });

  it('trims surrounding whitespace before checking or adding a scheme', () => {
    expect(normalizeAutofillUrl('  HTTPS://example.com \n')).toBe('HTTPS://example.com');
    expect(normalizeAutofillUrl('  httpbin.org \n')).toBe('https://httpbin.org');
  });
});
