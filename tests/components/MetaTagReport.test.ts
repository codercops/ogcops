import { describe, it, expect } from 'vitest';

// Reproduce the truncation logic from MetaTagReport so we can unit-test it
// in isolation without mounting the React component.
const truncateMetaValue = (value: unknown, limit = 200): string =>
  Array.from(String(value)).slice(0, limit).join('');

describe('MetaTagReport truncation', () => {
  it('truncates ASCII values to 200 characters', () => {
    const long = 'a'.repeat(300);
    expect(truncateMetaValue(long)).toHaveLength(200);
  });

  it('does not split a multi-code-unit emoji at the truncation boundary', () => {
    // Each rocket emoji is 2 UTF-16 code units but 1 Unicode character.
    // String.prototype.slice(0, 200) would cut in the middle of emoji #100,
    // producing a broken surrogate; Array.from iterates by code point.
    const rockets = '🚀'.repeat(250); // 250 Unicode chars, 500 UTF-16 code units
    const result = truncateMetaValue(rockets);

    expect(Array.from(result)).toHaveLength(200); // 200 Unicode code points
    expect(result).toBe('🚀'.repeat(200));        // no broken characters
  });

  it('returns the value unchanged when it is within the limit', () => {
    const short = 'Hello, World! 🌍';
    expect(truncateMetaValue(short)).toBe(short);
  });

  it('handles an empty string', () => {
    expect(truncateMetaValue('')).toBe('');
  });
});
