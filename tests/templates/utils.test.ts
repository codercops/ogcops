import { describe, it, expect } from 'vitest';
import {
  truncate,
  autoFontSize,
  parseColor,
  normalizeHexColor,
  normalizeColorFields,
  linearGradient,
  mixColors,
  isLightColor,
  contrastText,
} from '@/templates/utils';

describe('truncate', () => {
  it('counts and cuts supplementary characters as complete code points', () => {
    expect(truncate('😀😀😀', 3)).toBe('😀😀😀');
    expect(truncate('A😀BC', 3)).toBe('A😀…');
    expect(truncate('A𠮷BC', 3)).toBe('A𠮷…');
  });
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

describe('normalizeHexColor', () => {
  const fallback = '#112233';

  it('normalizes 3-digit hex without hash (RGB)', () => {
    expect(normalizeHexColor('0f0', fallback)).toBe('#00ff00');
    expect(normalizeHexColor('fff', fallback)).toBe('#ffffff');
    expect(normalizeHexColor('F0A', fallback)).toBe('#ff00aa');
  });

  it('normalizes 3-digit hex with hash (#RGB)', () => {
    expect(normalizeHexColor('#0f0', fallback)).toBe('#00ff00');
    expect(normalizeHexColor('#fff', fallback)).toBe('#ffffff');
    expect(normalizeHexColor('#F0A', fallback)).toBe('#ff00aa');
  });

  it('normalizes 6-digit hex without hash (RRGGBB)', () => {
    expect(normalizeHexColor('00ff00', fallback)).toBe('#00ff00');
    expect(normalizeHexColor('E07A5F', fallback)).toBe('#e07a5f');
    expect(normalizeHexColor('1a1a2e', fallback)).toBe('#1a1a2e');
  });

  it('normalizes 6-digit hex with hash (#RRGGBB)', () => {
    expect(normalizeHexColor('#00ff00', fallback)).toBe('#00ff00');
    expect(normalizeHexColor('#E07A5F', fallback)).toBe('#e07a5f');
    expect(normalizeHexColor('#FFFFFF', fallback)).toBe('#ffffff');
  });

  it('trims whitespace around valid hex values', () => {
    expect(normalizeHexColor('  #0f0  ', fallback)).toBe('#00ff00');
    expect(normalizeHexColor('  00ff00  ', fallback)).toBe('#00ff00');
  });

  it('returns fallback for invalid or incomplete hex input', () => {
    expect(normalizeHexColor('', fallback)).toBe(fallback);
    expect(normalizeHexColor('#', fallback)).toBe(fallback);
    expect(normalizeHexColor('#0', fallback)).toBe(fallback);
    expect(normalizeHexColor('#0f', fallback)).toBe(fallback);
    expect(normalizeHexColor('0f', fallback)).toBe(fallback);
    expect(normalizeHexColor('#00ff0', fallback)).toBe(fallback);
    expect(normalizeHexColor('#00ff000', fallback)).toBe(fallback);
    expect(normalizeHexColor('xyz', fallback)).toBe(fallback);
    expect(normalizeHexColor('#ggg', fallback)).toBe(fallback);
    expect(normalizeHexColor(null, fallback)).toBe(fallback);
    expect(normalizeHexColor(undefined, fallback)).toBe(fallback);
    expect(normalizeHexColor(123, fallback)).toBe(fallback);
  });
});

describe('normalizeColorFields', () => {
  const dummyTemplate = {
    fields: [
      { key: 'title', label: 'Title', type: 'text' as const, defaultValue: 'Default Title' },
      { key: 'bgColor', label: 'Background', type: 'color' as const, defaultValue: '#0a0a0a' },
      { key: 'accentColor', label: 'Accent', type: 'color' as const, defaultValue: '#E07A5F' },
      { key: 'customColor', label: 'Custom', type: 'color' as const, defaultValue: '#3b82f6' },
    ],
    defaults: {
      title: 'Default Title',
      bgColor: '#0a0a0a',
      accentColor: '#E07A5F',
      customColor: '#3b82f6',
    },
  };

  it('normalizes 3-digit and 6-digit hex color fields', () => {
    const params = {
      title: 'Custom Title',
      bgColor: '000',
      accentColor: '#0f0',
      customColor: '123456',
    };
    const result = normalizeColorFields(dummyTemplate, params);
    expect(result.title).toBe('Custom Title');
    expect(result.bgColor).toBe('#000000');
    expect(result.accentColor).toBe('#00ff00');
    expect(result.customColor).toBe('#123456');
  });

  it('falls back to template defaults for invalid or partial color values', () => {
    const params = {
      bgColor: '#',
      accentColor: '#0',
      customColor: 'invalid',
    };
    const result = normalizeColorFields(dummyTemplate, params);
    expect(result.bgColor).toBe('#0a0a0a');
    expect(result.accentColor).toBe('#e07a5f');
    expect(result.customColor).toBe('#3b82f6');
  });

  it('supplies template defaults for omitted color fields', () => {
    const result = normalizeColorFields(dummyTemplate, {});
    expect(result.bgColor).toBe('#0a0a0a');
    expect(result.accentColor).toBe('#e07a5f');
    expect(result.customColor).toBe('#3b82f6');
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

  it('supports 3-digit hex colors with and without hash', () => {
    expect(mixColors('#000', '#fff', 0.5)).toBe('#808080');
    expect(mixColors('000', 'fff', 0.5)).toBe('#808080');
  });

  it('returns color1 safely when an input is invalid', () => {
    expect(mixColors('#000000', 'not-a-color', 0.5)).toBe('#000000');
    expect(mixColors('invalid', '#ffffff', 0.5)).toBe('invalid');
  });
});

describe('isLightColor', () => {
  it('treats pure white as light', () => {
    expect(isLightColor('#ffffff')).toBe(true);
  });

  it('treats pure black as not light', () => {
    expect(isLightColor('#000000')).toBe(false);
  });

  it('supports 3-digit hex colors with and without hash', () => {
    expect(isLightColor('#fff')).toBe(true);
    expect(isLightColor('fff')).toBe(true);
    expect(isLightColor('#000')).toBe(false);
    expect(isLightColor('000')).toBe(false);
    expect(isLightColor('#0f0')).toBe(true);
    expect(isLightColor('0f0')).toBe(true);
    expect(isLightColor('#111')).toBe(false);
  });

  it('returns false for an invalid or partially typed color', () => {
    expect(isLightColor('not-a-color')).toBe(false);
    expect(isLightColor('#')).toBe(false);
    expect(isLightColor('#12')).toBe(false);
    expect(isLightColor('')).toBe(false);
    expect(isLightColor(undefined as any)).toBe(false);
  });
});

describe('contrastText', () => {
  it('returns black text on a light background', () => {
    expect(contrastText('#ffffff')).toBe('#000000');
  });

  it('returns white text on a dark background', () => {
    expect(contrastText('#000000')).toBe('#FFFFFF');
  });

  it('supports 3-digit hex backgrounds with and without hash', () => {
    expect(contrastText('#fff')).toBe('#000000');
    expect(contrastText('fff')).toBe('#000000');
    expect(contrastText('#000')).toBe('#FFFFFF');
    expect(contrastText('000')).toBe('#FFFFFF');
    expect(contrastText('#0f0')).toBe('#000000');
    expect(contrastText('0f0')).toBe('#000000');
    expect(contrastText('#111')).toBe('#FFFFFF');
  });

  it('returns white text for invalid or partially typed backgrounds without throwing', () => {
    expect(contrastText('#')).toBe('#FFFFFF');
    expect(contrastText('#12')).toBe('#FFFFFF');
    expect(contrastText('not-a-color')).toBe('#FFFFFF');
    expect(contrastText('')).toBe('#FFFFFF');
  });
});
