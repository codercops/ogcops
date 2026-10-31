import { describe, it, expect } from 'vitest';
import recap from '@/templates/event/recap';
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
const fontSize = (el: unknown) => Number(String(styleOf(el).fontSize).replace('px', ''));
const widthOf = (el: unknown) => Number(String(styleOf(el).width).replace('px', ''));

const tree = (overrides: Record<string, unknown> = {}) => recap.render({ ...recap.defaults, ...overrides });

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) return texts(asElement(node).props.children);
  return [];
}
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

function everyElement(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(everyElement);
  if (node && typeof node === 'object' && 'props' in node) return [asElement(node), ...everyElement(asElement(node).props.children)];
  return [];
}

// The card is the Recap label, the name over the date, then the stats row, the thank-you line and the site name when there are any.
const parts = (overrides: Record<string, unknown> = {}) => childrenOf(tree(overrides));
const label = (overrides: Record<string, unknown> = {}) => asElement(parts(overrides)[0]);
const middle = (overrides: Record<string, unknown> = {}) => parts(overrides)[1];
const titleSpan = (overrides: Record<string, unknown> = {}) => asElement(childrenOf(middle(overrides))[0]);
const whenSpan = (overrides: Record<string, unknown> = {}) => childrenOf(middle(overrides))[1] as SatoriElement | undefined;
const statsRow = (overrides: Record<string, unknown> = {}) => parts(overrides).find((part) => styleOf(part).gap !== undefined) as SatoriElement | undefined;
const columns = (overrides: Record<string, unknown> = {}) => childrenOf(statsRow(overrides)).map(asElement);
const valueOf = (column: SatoriElement) => asElement(childrenOf(column)[0]);
const labelOf = (column: SatoriElement) => childrenOf(column)[1] as SatoriElement | undefined;
const rest = (overrides: Record<string, unknown> = {}) => parts(overrides).filter((part) => part !== statsRow(overrides)).slice(2);
const thanksSpan = (overrides: Record<string, unknown> = {}) => rest(overrides).find((part) => styleOf(part).fontSize === '26px') as SatoriElement | undefined;
const siteSpan = (overrides: Record<string, unknown> = {}) => rest(overrides).find((part) => styleOf(part).fontSize === '20px') as SatoriElement | undefined;

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

const BLANKS = ['', '   ', '\t\n', undefined, null];

describe('event-recap', () => {
  it('is registered in the event category', () => {
    expect(getTemplate('event-recap')?.category).toBe('event');
    expect(recap.id).toBe('event-recap');
  });

  it('has the fields from the issue', () => {
    expect(recap.fields.map((field) => field.key)).toEqual([
      'title',
      'description',
      'when',
      'stat1Value',
      'stat1Label',
      'stat2Value',
      'stat2Label',
      'stat3Value',
      'stat3Label',
      'siteName',
      'bgColor',
      'accentColor',
      'textColor',
    ]);
    expect(recap.defaults).toMatchObject({ when: 'Feb 14, Bengaluru', stat1Value: '1,200', stat1Label: 'attendees', stat2Value: '32', stat2Label: 'talks', stat3Value: '18', stat3Label: 'cities' });
    expect(recap.fields.find((field) => field.key === 'title')?.required).toBe(true);
    for (const field of recap.fields) expect(recap.defaults[field.key], field.key).toBe(field.defaultValue);
  });

  it('has a description and 4 to 6 tags', () => {
    expect(recap.description.length).toBeGreaterThan(20);
    expect(recap.tags.length).toBeGreaterThanOrEqual(4);
    expect(recap.tags.length).toBeLessThanOrEqual(6);
  });

  it('shows the label, name, date, three stats and the thank-you line with its defaults', () => {
    expect(render()).toEqual([
      'Recap',
      'JSConf India 2026',
      'Feb 14, Bengaluru',
      '1,200',
      'attendees',
      '32',
      'talks',
      '18',
      'cities',
      'Thanks to everyone who came, see you next year',
    ]);
  });

  describe('stats', () => {
    it.each(['stat1Value', 'stat2Value', 'stat3Value'])('skips a stat whose %s is empty, only spaces, or missing, with no gap', (key) => {
      for (const blank of BLANKS) {
        const cols = columns({ [key]: blank });
        expect(cols, String(blank)).toHaveLength(2);
        expect(render({ [key]: blank }).filter((text) => ['1,200', '32', '18'].includes(text)), String(blank)).toHaveLength(2);
      }
    });

    it('skips a stat with a label but no value, and its label with it', () => {
      const out = render({ stat2Value: '', stat2Label: 'talks given' });
      expect(out).not.toContain('talks given');
      expect(out).not.toContain('talks');
    });

    it('lets the stats that are left share the row evenly', () => {
      const three = columns().map(widthOf);
      const two = columns({ stat2Value: '' }).map(widthOf);
      const one = columns({ stat1Value: '', stat3Value: '' }).map(widthOf);
      expect(new Set(three).size).toBe(1);
      expect(new Set(two).size).toBe(1);
      expect(two[0]).toBeGreaterThan(three[0]);
      expect(one).toHaveLength(1);
      expect(one[0]).toBeGreaterThan(two[0]);
      // Together with the gaps, the columns fill the 1040px of the card.
      const gap = Number(styleOf(statsRow()).gap?.toString().replace('px', ''));
      expect(gap).toBeGreaterThan(0);
      const filled = three.reduce((a, b) => a + b, 0) + 2 * gap;
      expect(filled).toBeLessThanOrEqual(1040);
      expect(filled).toBeGreaterThanOrEqual(1038);
      expect(one[0]).toBe(1040);
    });

    it('hides the stats row cleanly when all three are skipped', () => {
      const overrides = { stat1Value: '', stat2Value: ' ', stat3Value: undefined };
      expect(statsRow(overrides)).toBeUndefined();
      expect(render(overrides)).toEqual(['Recap', 'JSConf India 2026', 'Feb 14, Bengaluru', 'Thanks to everyone who came, see you next year']);
    });

    it('hides a blank label with no gap, and keeps the value', () => {
      for (const blank of BLANKS) {
        const [first] = columns({ stat1Label: blank });
        expect(labelOf(first), String(blank)).toBeUndefined();
        expect(childrenOf(first)).toHaveLength(1);
        expect(texts(first)).toEqual(['1,200']);
      }
    });

    it('shows a value and label with extra spaces and line breaks as single spaces', () => {
      const [first] = columns({ stat1Value: '  1,200\n+ ', stat1Label: ' all   attendees\n' });
      expect(texts(first)).toEqual(['1,200 +', 'all attendees']);
    });

    it('cuts a long value to fit its column, with an ellipsis', () => {
      for (const overrides of [{ stat1Value: '1,234,567,890,123,456' }, { stat1Value: 'x'.repeat(40), stat3Value: '' }, { stat1Value: 'x'.repeat(40), stat2Value: '', stat3Value: '' }]) {
        for (const column of columns(overrides)) {
          const text = texts(valueOf(column)).join('');
          expect(text.length * 0.62 * fontSize(valueOf(column)), JSON.stringify(overrides)).toBeLessThanOrEqual(widthOf(column));
        }
      }
      const cut = texts(valueOf(columns({ stat1Value: '1,234,567,890,123,456' })[0])).join('');
      expect(cut.endsWith('…')).toBe(true);
    });

    it('cuts a long label to fit its column, with an ellipsis', () => {
      const long = 'attendees from every city and country around the world, and then some more';
      for (const overrides of [{ stat1Label: long }, { stat1Label: long, stat3Value: '' }, { stat1Label: long, stat2Value: '', stat3Value: '' }]) {
        const [first] = columns(overrides);
        const text = texts(labelOf(first)).join('');
        // 22px capitals with letter spacing, about 0.78 em a character
        expect(text.length * 0.78 * 22, JSON.stringify(overrides)).toBeLessThanOrEqual(widthOf(first));
        expect(text.endsWith('…')).toBe(true);
      }
      // In a row of three the same label is cut shorter than when it has the row to itself.
      expect(texts(labelOf(columns({ stat1Label: long })[0])).join('').length).toBeLessThan(texts(labelOf(columns({ stat1Label: long, stat2Value: '', stat3Value: '' })[0])).join('').length);
    });

    it('keeps every value and label on one line, inside its column', () => {
      for (const column of columns()) {
        expect(styleOf(valueOf(column)).whiteSpace).toBe('nowrap');
        expect(styleOf(labelOf(column)).whiteSpace).toBe('nowrap');
        expect(styleOf(column).overflow).toBe('hidden');
      }
    });

    it('sets every number at one size, from the longest, and smaller as it grows', () => {
      const sizes = (overrides: Record<string, unknown>) => columns(overrides).map((column) => fontSize(valueOf(column)));
      expect(new Set(sizes({})).size).toBe(1);
      expect(new Set(sizes({ stat2Value: '1,234,567' })).size).toBe(1);
      const growing = ['1', '1,200', '12,345', '123,456,789'].map((value) => sizes({ stat1Value: value })[0]);
      for (let i = 1; i < growing.length; i += 1) expect(growing[i], growing.join()).toBeLessThanOrEqual(growing[i - 1]);
      expect(growing[3]).toBeLessThan(growing[0]);
      expect(Math.max(...growing)).toBeLessThanOrEqual(88);
      expect(Math.min(...growing)).toBeGreaterThanOrEqual(40);
    });

    it('sets a lone stat larger, and the same value in a row of three smaller', () => {
      expect(fontSize(valueOf(columns({ stat1Value: '123,456', stat2Value: '', stat3Value: '' })[0]))).toBeGreaterThan(
        fontSize(valueOf(columns({ stat1Value: '123,456' })[0])),
      );
    });
  });

  describe('event name, date, thank-you line and site name', () => {
    it('shows the name, and falls back to the default when it is empty or blank', () => {
      expect(texts(titleSpan({ title: 'Design Night' }))).toEqual(['Design Night']);
      for (const title of BLANKS) expect(texts(titleSpan({ title })), String(title)).toEqual(['JSConf India 2026']);
    });

    it('shrinks the name as it gets longer, then truncates it with an ellipsis', () => {
      const sizes = ['Short', 'x'.repeat(20), 'x'.repeat(35), 'x'.repeat(50), 'x'.repeat(70)].map((title) => fontSize(titleSpan({ title })));
      for (let i = 1; i < sizes.length; i += 1) expect(sizes[i], sizes.join()).toBeLessThan(sizes[i - 1]);
      const text = texts(titleSpan({ title: 'word '.repeat(60) })).join('');
      expect(text.length).toBeLessThanOrEqual(80);
      expect(text.endsWith('…')).toBe(true);
    });

    it('hides the date when it is empty, only spaces, or missing, with no gap', () => {
      for (const when of BLANKS) {
        expect(whenSpan({ when }), String(when)).toBeUndefined();
        expect(childrenOf(middle({ when }))).toHaveLength(1);
      }
    });

    it('shortens a very long date to 60 characters on one line', () => {
      const text = texts(whenSpan({ when: 'Wednesday 26 November, '.repeat(10) })).join('');
      expect(text.length).toBeLessThanOrEqual(60);
      expect(text.endsWith('…')).toBe(true);
      expect(styleOf(whenSpan()).whiteSpace).toBe('nowrap');
    });

    it('hides the thank-you line when it is empty, only spaces, or missing, with no gap', () => {
      for (const description of BLANKS) {
        expect(thanksSpan({ description }), String(description)).toBeUndefined();
        expect(render({ description }).at(-1), String(description)).toBe('cities');
      }
    });

    it('shows the thank-you line on one line of text, and shortens a very long one', () => {
      expect(texts(thanksSpan({ description: 'Thanks\n\nall' }))).toEqual(['Thanks all']);
      const text = texts(thanksSpan({ description: 'word '.repeat(60) })).join('');
      expect(text.length).toBeLessThanOrEqual(100);
      expect(text.endsWith('…')).toBe(true);
    });

    it('hides the site name when it is empty, only spaces, or missing, and shows it last otherwise', () => {
      for (const siteName of BLANKS) expect(siteSpan({ siteName }), String(siteName)).toBeUndefined();
      expect(texts(siteSpan({ siteName: 'jsconf.example.com' }))).toEqual(['jsconf.example.com']);
      expect(render({ siteName: 'jsconf.example.com' }).at(-1)).toBe('jsconf.example.com');
      expect(texts(siteSpan({ siteName: 's'.repeat(90) })).join('').length).toBeLessThanOrEqual(40);
    });

    it('keeps no stray empty text, and no gaps, when every optional field is blank', () => {
      const overrides = { description: '', when: '', stat1Value: '', stat2Value: '', stat3Value: '', siteName: '' };
      expect(render(overrides)).toEqual(['Recap', 'JSConf India 2026']);
      expect(parts(overrides)).toHaveLength(2);
      expect(everyElement(tree(overrides)).filter((el) => texts(el).length === 0 && el.type === 'span')).toEqual([]);
    });
  });

  describe('unusual input', () => {
    it('does not break on values that are not strings', () => {
      expect(() => tree({ title: undefined, description: null, when: 7, stat1Value: 42, stat1Label: {}, stat2Value: [], siteName: false, bgColor: undefined })).not.toThrow();
      expect(texts(columns({ stat1Value: 42 })[0])[0]).toBe('42');
    });

    it('does not break when nothing is filled in', () => {
      expect(() => tree({ title: '', description: '', when: '', stat1Value: '', stat1Label: '', siteName: '' })).not.toThrow();
    });

    it('counts a stat of 0 as a value', () => {
      expect(columns({ stat2Value: 0 })).toHaveLength(3);
      expect(texts(columns({ stat2Value: '0' })[1])[0]).toBe('0');
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
      for (const overrides of [{}, { stat2Value: '', description: '', siteName: 'x' }, { title: 'x'.repeat(80) }, { stat1Value: '', stat2Value: '', stat3Value: '' }]) {
        for (const el of everyElement(tree(overrides))) {
          if (el.type === 'div') expect(styleOf(el).display, JSON.stringify(overrides)).toBe('flex');
          expect(styleOf(el).display).not.toBe('grid');
        }
      }
    });

    it('draws the same image every time', () => {
      expect(JSON.stringify(tree())).toBe(JSON.stringify(tree()));
    });

    it('only uses characters the fonts have, apart from an ellipsis the template adds', () => {
      const fontSafe = (text: string) => [...text].every((ch) => ch.codePointAt(0)! <= 0xff || ch === '…');
      expect(render().every(fontSafe)).toBe(true);
      expect(render({ title: 't'.repeat(120), description: 'd'.repeat(150), when: 'w'.repeat(90), stat1Value: 'v'.repeat(50), stat1Label: 'l'.repeat(60), siteName: 's'.repeat(80) }).every(fontSafe)).toBe(true);
    });
  });

  describe('colors', () => {
    // The Recap label and the numbers are 28px and 40px or more, so large text: 3:1 at the least.
    // The date and thank-you line are 30px and 26px medium weight, also large. The stat labels and
    // the site name are 22px and 20px, so they need 4.5:1.
    const looks: Array<[string, string, string, string]> = [
      ['dark', '#0b0f1a', '#f8fafc', '#f59e0b'],
      ['white', '#ffffff', '#111111', '#f59e0b'],
      ['white with a pale accent', '#ffffff', '#111111', '#fde68a'],
      ['white with a white accent', '#ffffff', '#111111', '#ffffff'],
      ['dark with a dark accent', '#0b0f1a', '#f8fafc', '#1e3a8a'],
      ['dark with a black accent', '#000000', '#ffffff', '#000000'],
      ['cream', '#fdf6e3', '#1f2937', '#e07a5f'],
      ['indigo', '#312e81', '#e0e7ff', '#a5b4fc'],
    ];

    it.each(looks)('keeps the label, numbers and text readable on %s', (_name, bgColor, textColor, accentColor) => {
      const overrides = { bgColor, textColor, accentColor, siteName: 'jsconf.example.com' };
      expect(styleOf(tree(overrides)).background).toBe(bgColor);
      expect(contrast(String(styleOf(label(overrides)).color), bgColor), 'label').toBeGreaterThanOrEqual(3);
      expect(contrast(String(styleOf(valueOf(columns(overrides)[0])).color), bgColor), 'numbers').toBeGreaterThanOrEqual(3);
      expect(contrast(String(styleOf(titleSpan(overrides)).color), bgColor), 'name').toBeGreaterThanOrEqual(7);
      expect(contrast(String(styleOf(whenSpan(overrides)).color), bgColor), 'date').toBeGreaterThanOrEqual(3);
      expect(contrast(String(styleOf(thanksSpan(overrides)).color), bgColor), 'thank-you line').toBeGreaterThanOrEqual(3);
      expect(contrast(String(styleOf(labelOf(columns(overrides)[0])).color), bgColor), 'stat label').toBeGreaterThanOrEqual(4.5);
      expect(contrast(String(styleOf(siteSpan(overrides)).color), bgColor), 'site name').toBeGreaterThanOrEqual(4.5);
    });

    it('uses the accent as it is on a background it stands out from', () => {
      expect(styleOf(label({ bgColor: '#0b0f1a', accentColor: '#f59e0b' })).color).toBe('#f59e0b');
    });
  });
});
