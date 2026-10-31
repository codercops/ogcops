import { describe, expect, it } from 'vitest';
import { truncateMetaValue } from '@/lib/meta-value';

describe('truncateMetaValue', () => {
  it.each(['😀', '🚀', '𠮷'])('preserves %s at the cut boundary', (character) => {
    const expected = 'A'.repeat(199) + character;
    expect(truncateMetaValue(expected + 'extra')).toBe(expected);
    expect(truncateMetaValue(expected)).toBe(expected);
  });

  it('preserves existing ASCII cuts, short values, and string conversion', () => {
    expect(truncateMetaValue('A'.repeat(201))).toBe('A'.repeat(200));
    expect(truncateMetaValue('short')).toBe('short');
    expect(truncateMetaValue('')).toBe('');
    expect(truncateMetaValue(42)).toBe('42');
  });
});
