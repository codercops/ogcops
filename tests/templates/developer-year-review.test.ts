import { describe, it, expect } from 'vitest';
import yearReview from '@/templates/developer/year-review';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

type Style = Record<string, string | number>;

const asElement = (node: unknown) => node as SatoriElement;
const childrenOf = (node: unknown): unknown[] => {
  const { children } = asElement(node).props;
  return Array.isArray(children) ? children : children === undefined ? [] : [children];
};
const styleOf = (node: unknown) => (asElement(node).props.style ?? {}) as Style;

const tree = (overrides: Record<string, unknown> = {}) =>
  yearReview.render({ ...yearReview.defaults, ...overrides });

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) return texts(asElement(node).props.children);
  return [];
}
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

/** Every element in the tree. */
function everyElement(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(everyElement);
  if (node && typeof node === 'object' && 'props' in node) {
    return [asElement(node), ...everyElement(asElement(node).props.children)];
  }
  return [];
}

/** The stat cards: each is a value and, when there is one, a label. */
function cards(overrides: Record<string, unknown> = {}): SatoriElement[] {
  const row = childrenOf(tree(overrides)).find((child) => styleOf(child).gap !== undefined);
  return row ? (childrenOf(row) as SatoriElement[]) : [];
}
const valueSpan = (card: SatoriElement) => asElement(childrenOf(card)[0]);
const values = (overrides: Record<string, unknown> = {}) => cards(overrides).map((card) => texts(valueSpan(card)).join(''));
const labels = (overrides: Record<string, unknown> = {}) =>
  cards(overrides).map((card) => (childrenOf(card)[1] ? texts(childrenOf(card)[1]).join('') : ''));
const valueSize = (overrides: Record<string, unknown> = {}) =>
  cards(overrides).map((card) => Number(String(styleOf(valueSpan(card)).fontSize).replace('px', '')));

const yearSpan = (overrides: Record<string, unknown> = {}) => {
  const top = childrenOf(tree(overrides))[0];
  return asElement(childrenOf(top)[0]);
};
const nameSpan = (overrides: Record<string, unknown> = {}) => {
  const top = childrenOf(tree(overrides))[0];
  return childrenOf(top)[1] ? asElement(childrenOf(top)[1]) : undefined;
};
const highlightText = (overrides: Record<string, unknown> = {}) => {
  const last = childrenOf(tree(overrides)).at(-1);
  return styleOf(last).alignItems === 'center' && childrenOf(last).length === 2 ? texts(childrenOf(last)[1]).join('') : '';
};

function luminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) throw new Error(`not a hex color: ${hex}`);
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

describe('developer-year-review', () => {
  it('is registered in the developer category', () => {
    expect(getTemplate('developer-year-review')?.category).toBe('developer');
  });

  it('has the fields from the issue', () => {
    expect(yearReview.fields.map((field) => field.key)).toEqual([
      'name',
      'year',
      'stat1Value',
      'stat1Label',
      'stat2Value',
      'stat2Label',
      'stat3Value',
      'stat3Label',
      'highlight',
      'bgColor',
      'accentColor',
      'textColor',
    ]);
    expect(yearReview.defaults.year).toBe('2026');
  });

  it('shows the year, name, three stats and the highlight with its defaults', () => {
    expect(render()).toEqual([
      '2026',
      'Alex Rivera',
      '1,248',
      'commits',
      '86',
      'pull requests',
      'TypeScript',
      'top language',
      'Shipped my first open source library',
    ]);
  });

  describe('stats', () => {
    it('shares the row between three stats', () => {
      expect(cards()).toHaveLength(3);
      for (const card of cards()) expect(styleOf(card).flex).toBe(1);
    });

    it('hides a stat with an empty value, and its label, and the others share the row', () => {
      expect(values({ stat2Value: '' })).toEqual(['1,248', 'TypeScript']);
      expect(labels({ stat2Value: '' })).toEqual(['commits', 'top language']);
      expect(render({ stat2Value: '' })).not.toContain('pull requests');
    });

    it('hides a stat whose value is only spaces, or is missing', () => {
      expect(values({ stat1Value: '   ' })).toEqual(['86', 'TypeScript']);
      expect(values({ stat1Value: undefined })).toEqual(['86', 'TypeScript']);
      expect(values({ stat3Value: null })).toEqual(['1,248', '86']);
    });

    it('shows one stat on its own, and none without a row', () => {
      expect(values({ stat1Value: '', stat3Value: '' })).toEqual(['86']);
      expect(cards({ stat1Value: '', stat2Value: '', stat3Value: '' })).toHaveLength(0);
      // No empty row is left behind either
      const none = { stat1Value: '', stat2Value: '', stat3Value: '' };
      expect(childrenOf(tree(none)).some((child) => styleOf(child).gap !== undefined)).toBe(false);
    });

    it('keeps the order, even when the first one is missing', () => {
      expect(values({ stat1Value: '' })).toEqual(['86', 'TypeScript']);
    });

    it('shows a stat without a label when the label is empty', () => {
      expect(values({ stat2Label: '' })).toEqual(['1,248', '86', 'TypeScript']);
      expect(labels({ stat2Label: '  ' })).toEqual(['commits', '', 'top language']);
      // The card holds just the value, with no empty label and its spacing
      expect(childrenOf(cards({ stat2Label: '' })[1])).toHaveLength(1);
    });

    it('shortens a long value to 14 characters and a long label to 28', () => {
      const [value] = values({ stat1Value: '1,234,567,890,123,456' });
      expect(value.length).toBeLessThanOrEqual(14);
      expect(value.endsWith('…')).toBe(true);
      const [label] = labels({ stat1Label: 'a very long label that goes on and on and on' });
      expect(label.length).toBeLessThanOrEqual(28);
      expect(label.endsWith('…')).toBe(true);
    });

    it('uses one size for every value', () => {
      for (const overrides of [{}, { stat3Value: 'x'.repeat(14) }, { stat2Value: '' }]) {
        expect(new Set(valueSize(overrides)).size, JSON.stringify(overrides)).toBe(1);
      }
    });

    it('shrinks the values when one is long, and grows them when fewer share the row', () => {
      const [normal] = valueSize();
      const [long] = valueSize({ stat3Value: 'Rust, Go, Zig, C' });
      expect(long).toBeLessThan(normal);
      const [two] = valueSize({ stat2Value: '' });
      expect(two).toBeGreaterThan(normal);
      const [one] = valueSize({ stat1Value: '', stat3Value: '' });
      expect(one).toBeGreaterThanOrEqual(two);
    });

    it('keeps a long value inside its card, with an ellipsis if it still does not fit', () => {
      for (const card of cards({ stat1Value: 'W'.repeat(14) })) {
        const style = styleOf(valueSpan(card));
        expect(style.overflow).toBe('hidden');
        expect(style.textOverflow).toBe('ellipsis');
        expect(style.whiteSpace).toBe('nowrap');
      }
    });

    it('turns a number into text', () => {
      expect(values({ stat1Value: 1248, stat2Value: 0 })).toEqual(['1248', '0', 'TypeScript']);
    });

    it('puts text on one line, however it was typed', () => {
      expect(values({ stat1Value: '  1,248\n\ncommits ' })[0]).toBe('1,248 commits');
    });
  });

  describe('highlight', () => {
    it('hides when it is empty, only spaces, or missing', () => {
      for (const highlight of ['', '   ', '\n\t', undefined, null]) {
        expect(highlightText({ highlight }), String(highlight)).toBe('');
        expect(render({ highlight })).toEqual([
          '2026',
          'Alex Rivera',
          '1,248',
          'commits',
          '86',
          'pull requests',
          'TypeScript',
          'top language',
        ]);
      }
    });

    it('shows the line, and shortens a very long one', () => {
      expect(highlightText({ highlight: 'Learned Rust' })).toBe('Learned Rust');
      const long = highlightText({ highlight: 'word '.repeat(60) });
      expect(long.length).toBeLessThanOrEqual(80);
      expect(long.endsWith('…')).toBe(true);
    });

    it('is one line of text even when it was typed with line breaks', () => {
      expect(highlightText({ highlight: 'First\n\nsecond' })).toBe('First second');
    });
  });

  describe('year and name', () => {
    it('shows the year and the name next to it', () => {
      expect(texts(yearSpan())).toEqual(['2026']);
      expect(texts(nameSpan())).toEqual(['Alex Rivera']);
    });

    it('hides the name when it is empty or blank', () => {
      for (const name of ['', '   ', undefined]) expect(nameSpan({ name }), String(name)).toBeUndefined();
    });

    it('falls back to 2026 when the year is empty or blank', () => {
      for (const year of ['', '   ', undefined]) expect(texts(yearSpan({ year })), String(year)).toEqual(['2026']);
    });

    it('shows another year, and uses a smaller size for a long one', () => {
      expect(texts(yearSpan({ year: '2027' }))).toEqual(['2027']);
      const size = (year: string) => Number(String(styleOf(yearSpan({ year })).fontSize).replace('px', ''));
      expect(size('FY2026')).toBeLessThan(size('2026'));
      expect(size('FY2026-27')).toBeLessThan(size('FY2026'));
    });

    // A long name in capitals can take more room than is left next to the year. The year must
    // keep its width and the gap, and the name wraps beside it, instead of the year being squeezed.
    it('does not let the year shrink next to a long name', () => {
      for (const overrides of [{}, { name: 'MAXIMILIANO WOLFGANG RODRIGUEZ' }, { name: 'n'.repeat(60), year: 'FY2026-27' }]) {
        expect(styleOf(yearSpan(overrides)).flexShrink, JSON.stringify(overrides)).toBe(0);
      }
      expect(styleOf(nameSpan({ name: 'MAXIMILIANO WOLFGANG RODRIGUEZ' })).marginLeft).toBe('36px');
    });

    it('shortens a very long year and name', () => {
      const year = texts(yearSpan({ year: 'x'.repeat(40) })).join('');
      expect(year.length).toBeLessThanOrEqual(10);
      const name = texts(nameSpan({ name: 'n'.repeat(80) })).join('');
      expect(name.length).toBeLessThanOrEqual(26);
      expect(name.endsWith('…')).toBe(true);
    });
  });

  describe('unusual input', () => {
    it('does not break on values that are not strings', () => {
      expect(() => tree({ name: undefined, year: null, highlight: 42, stat1Value: {}, stat2Label: [] })).not.toThrow();
      expect(() => tree({ name: 7, year: 2026, stat3Value: true })).not.toThrow();
      expect(texts(yearSpan({ year: 2026 }))).toEqual(['2026']);
    });

    it('does not break when nothing is filled in', () => {
      expect(() =>
        tree({ name: '', year: '', stat1Value: '', stat2Value: '', stat3Value: '', highlight: '' }),
      ).not.toThrow();
    });
  });

  describe('layout', () => {
    it('fills the card, in Inter', () => {
      const style = styleOf(tree());
      expect(style.width).toBe('1200px');
      expect(style.height).toBe('630px');
      expect(style.fontFamily).toContain('Inter');
    });

    it('uses flexbox only, with display flex on every div', () => {
      for (const overrides of [{}, { stat2Value: '' }, { highlight: '', name: '' }, { stat1Value: '', stat2Value: '', stat3Value: '' }]) {
        for (const el of everyElement(tree(overrides))) {
          const style = styleOf(el);
          if (el.type === 'div') expect(style.display, JSON.stringify(overrides)).toBe('flex');
          expect(style.display).not.toBe('grid');
        }
      }
    });

    it('draws the same image every time', () => {
      expect(JSON.stringify(tree())).toBe(JSON.stringify(tree()));
    });

    it('only uses characters the fonts have, apart from an ellipsis the template adds', () => {
      const fontSafe = (text: string) => [...text].every((ch) => ch.codePointAt(0)! <= 0xff || ch === '…');
      expect(render().every(fontSafe)).toBe(true);
      expect(render({ name: 'n'.repeat(60), highlight: 'h'.repeat(120), stat1Value: 'v'.repeat(30), stat1Label: 'l'.repeat(60) }).every(fontSafe)).toBe(true);
    });
  });

  describe.each([
    ['the dark default', {}],
    ['white with dark text', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#059669' }],
    ['white with a pale accent', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#fde68a' }],
    ['cream with a dark accent', { bgColor: '#faf5ea', textColor: '#1c1917', accentColor: '#7c2d12' }],
    ['dark with a dark accent', { bgColor: '#0b0f1a', textColor: '#f1f5f9', accentColor: '#1e3a8a' }],
  ])('on %s', (_name, colors) => {
    const params = { ...yearReview.defaults, ...colors };
    const bg = String(params.bgColor);
    const root = yearReview.render(params);
    const card = childrenOf(childrenOf(root).find((child) => styleOf(child).gap !== undefined))[0];
    const panelBg = String(styleOf(card).background);

    it('keeps the year readable on the page', () => {
      expect(contrast(String(styleOf(yearSpan(colors)).color), bg)).toBeGreaterThanOrEqual(3);
    });

    it('keeps the name and the highlight readable on the page', () => {
      expect(contrast(String(styleOf(nameSpan(colors)).color), bg)).toBeGreaterThanOrEqual(4.5);
      const last = childrenOf(root).at(-1);
      expect(contrast(String(styleOf(childrenOf(last)[1]).color), bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the stat values and labels readable on their cards', () => {
      expect(contrast(String(styleOf(childrenOf(card)[0]).color), panelBg)).toBeGreaterThanOrEqual(3);
      expect(contrast(String(styleOf(childrenOf(card)[1]).color), panelBg)).toBeGreaterThanOrEqual(4.5);
    });

    it('draws the cards apart from the page', () => {
      expect(panelBg).not.toBe(bg);
    });
  });
});
