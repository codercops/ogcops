import { describe, it, expect } from 'vitest';
import {
  truncate,
  autoFontSize,
  parseColor,
  linearGradient,
  mixColors,
  isLightColor,
  contrastText,
} from '@/templates/utils';

describe('truncate', () => {
  it('returns short text unchanged', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('returns text exactly at maxLength unchanged', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });

  it('truncates long text with an ellipsis and respects maxLength', () => {
    const result = truncate('hello world', 8);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(8);
  });

  it('trims trailing whitespace before adding the ellipsis', () => {
    // 'hello ' sliced to 7 chars => 'hello ' then trimEnd => 'hello' + '…'
    expect(truncate('hello world', 7)).toBe('hello…');
  });
});

describe('autoFontSize', () => {
  const breakpoints = [
    { maxLen: 20, size: 48 },
    { maxLen: 40, size: 32 },
    { maxLen: 80, size: 24 },
  ];

  it('picks the first matching breakpoint', () => {
    expect(autoFontSize('short', breakpoints)).toBe(48);
  });

  it('picks a smaller size as text grows', () => {
    expect(autoFontSize('x'.repeat(30), breakpoints)).toBe(32);
  });

  it('falls back to the last size when nothing matches', () => {
    expect(autoFontSize('x'.repeat(200), breakpoints)).toBe(24);
  });
});

describe('parseColor', () => {
  it('adds a leading hash when missing', () => {
    expect(parseColor('ffffff')).toBe('#ffffff');
  });

  it('leaves an existing hash intact', () => {
    expect(parseColor('#000000')).toBe('#000000');
  });
});

describe('linearGradient', () => {
  it('builds a gradient string from an angle and stops', () => {
    expect(linearGradient(90, '#000', '#fff')).toBe(
      'linear-gradient(90deg, #000, #fff)'
    );
  });

  it('supports a single stop', () => {
    expect(linearGradient(45, '#123456')).toBe('linear-gradient(45deg, #123456)');
  });
});

describe('mixColors', () => {
  it('mixes black and white evenly to mid grey', () => {
    expect(mixColors('#000000', '#ffffff', 0.5)).toBe('#808080');
  });

  it('returns the first color at ratio 0', () => {
    expect(mixColors('#000000', '#ffffff', 0)).toBe('#000000');
  });

  it('returns the second color at ratio 1', () => {
    expect(mixColors('#000000', '#ffffff', 1)).toBe('#ffffff');
  });

  it('accepts colors without a leading hash', () => {
    expect(mixColors('000000', 'ffffff', 0.5)).toBe('#808080');
  });
});

describe('isLightColor', () => {
  it('treats pure white as light', () => {
    expect(isLightColor('#ffffff')).toBe(true);
  });

  it('treats pure black as not light', () => {
    expect(isLightColor('#000000')).toBe(false);
  });

  it('returns false for an invalid color', () => {
    expect(isLightColor('not-a-color')).toBe(false);
  });
});

describe('contrastText', () => {
  it('returns black text on a light background', () => {
    expect(contrastText('#ffffff')).toBe('#000000');
  });

  it('returns white text on a dark background', () => {
    expect(contrastText('#000000')).toBe('#FFFFFF');
  });
});
