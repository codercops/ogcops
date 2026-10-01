import { describe, it, expect } from 'vitest';
import { formatStarCount } from '@/lib/github-stars';

describe('formatStarCount', () => {
  it('returns small counts as-is', () => {
    expect(formatStarCount(0)).toBe('0');
    expect(formatStarCount(999)).toBe('999');
  });

  it('formats 1000 as 1k', () => {
    expect(formatStarCount(1000)).toBe('1k');
  });

  it('formats 1500 as 1.5k', () => {
    expect(formatStarCount(1500)).toBe('1.5k');
  });

  it('formats 12000 as 12k', () => {
    expect(formatStarCount(12000)).toBe('12k');
  });

  it('drops the trailing .0 on whole thousands', () => {
    expect(formatStarCount(2000)).toBe('2k');
  });

  it('keeps one decimal for non-whole thousands', () => {
    expect(formatStarCount(1234)).toBe('1.2k');
  });
});
