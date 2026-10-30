import { describe, it, expect } from 'vitest';
import rescheduled from '@/templates/event/rescheduled';
import { getTemplate } from '@/templates/registry';
import { contrastText, hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

type Style = Record<string, string | number>;

const asElement = (node: unknown) => node as SatoriElement;
const childrenOf = (node: unknown): unknown[] => {
  const { children } = asElement(node).props;
  return Array.isArray(children) ? children : children === undefined ? [] : [children];
};
const styleOf = (node: unknown) => (asElement(node).props.style ?? {}) as Style;

const tree = (overrides: Record<string, unknown> = {}) =>
  rescheduled.render({ ...rescheduled.defaults, ...overrides });

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

// The card is the pill, then the event name over the dates, then the note when there is one.
const pill = (overrides: Record<string, unknown> = {}) => asElement(childrenOf(childrenOf(tree(overrides))[0])[0]);
const middle = (overrides: Record<string, unknown> = {}) => childrenOf(tree(overrides))[1];
const titleSpan = (overrides: Record<string, unknown> = {}) => asElement(childrenOf(middle(overrides))[0]);
const dateRow = (overrides: Record<string, unknown> = {}) => childrenOf(childrenOf(middle(overrides))[1]);
const oldDateSpan = (overrides: Record<string, unknown> = {}) => {
  const row = dateRow(overrides);
  return row.length === 3 ? asElement(row[0]) : undefined;
};
const newDateSpan = (overrides: Record<string, unknown> = {}) => asElement(dateRow(overrides).at(-1));
const noteSpan = (overrides: Record<string, unknown> = {}) => {
  const all = childrenOf(tree(overrides));
  return all.length === 3 ? asElement(all[2]) : undefined;
};
const fontSize = (el: SatoriElement | undefined) => Number(String(styleOf(el).fontSize).replace('px', ''));

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

describe('event-rescheduled', () => {
  it('is registered in the event category', () => {
    expect(getTemplate('event-rescheduled')?.category).toBe('event');
  });

  it('has the fields from the issue', () => {
    expect(rescheduled.fields.map((field) => field.key)).toEqual([
      'title',
      'oldDate',
      'newDate',
      'note',
      'bgColor',
      'accentColor',
      'textColor',
    ]);
  });

  it('shows the pill, event name, both dates and the note with its defaults', () => {
    expect(render()).toEqual([
      'Rescheduled',
      'Frontend Meetup #14',
      'Thu, 6 Nov, 7 PM',
      'Thu, 13 Nov, 7 PM',
      'Same venue, your tickets still work',
    ]);
  });

  describe('dates', () => {
    it('strikes the old date through and dims it', () => {
      const old = styleOf(oldDateSpan());
      expect(old.textDecoration).toBe('line-through');
      expect(old.color).not.toBe(styleOf(titleSpan()).color);
      expect(old.color).not.toBe(styleOf(newDateSpan()).color);
    });

    it('shows the new date bold in the accent colour, with no strike', () => {
      const style = styleOf(newDateSpan());
      expect(style.textDecoration).toBeUndefined();
      expect(style.fontWeight).toBe(700);
      expect(fontSize(newDateSpan())).toBeGreaterThan(fontSize(oldDateSpan()));
    });

    it('puts an arrow between them', () => {
      const row = dateRow();
      expect(row).toHaveLength(3);
      expect(JSON.stringify(row[1])).toContain('svg');
    });

    it('hides the old date, and the arrow, when it is empty, only spaces, or missing', () => {
      for (const oldDate of ['', '   ', '\n', undefined, null]) {
        expect(oldDateSpan({ oldDate }), String(oldDate)).toBeUndefined();
        expect(dateRow({ oldDate }), String(oldDate)).toHaveLength(1);
        expect(render({ oldDate })).toEqual(['Rescheduled', 'Frontend Meetup #14', 'Thu, 13 Nov, 7 PM', 'Same venue, your tickets still work']);
      }
    });

    it('falls back to the default new date when it is empty or blank', () => {
      for (const newDate of ['', '   ', undefined]) {
        expect(texts(newDateSpan({ newDate })), String(newDate)).toEqual(['Thu, 13 Nov, 7 PM']);
      }
    });

    it('shows other dates, with line breaks and extra spaces as single spaces', () => {
      expect(texts(newDateSpan({ newDate: 'Fri,\n14   Nov' }))).toEqual(['Fri, 14 Nov']);
      expect(texts(oldDateSpan({ oldDate: '  Fri,  7 Nov ' }))).toEqual(['Fri, 7 Nov']);
    });

    it('keeps each date on one line', () => {
      expect(styleOf(newDateSpan()).whiteSpace).toBe('nowrap');
      expect(styleOf(oldDateSpan()).whiteSpace).toBe('nowrap');
    });

    it('shortens a very long date to 28 characters', () => {
      const long = 'Wednesday, 26 November 2026 at 7 PM, doors open at 6';
      for (const span of [oldDateSpan({ oldDate: long }), newDateSpan({ newDate: long })]) {
        const text = texts(span).join('');
        expect(text.length).toBeLessThanOrEqual(28);
        expect(text.endsWith('…')).toBe(true);
      }
    });

    it('uses a smaller size for long dates, and a larger one when there is one date', () => {
      const normal = fontSize(newDateSpan());
      const long = fontSize(newDateSpan({ oldDate: 'Wednesday, 26 November 2026', newDate: 'Wednesday, 3 December 2026' }));
      expect(long).toBeLessThan(normal);
      expect(fontSize(newDateSpan({ oldDate: '' }))).toBeGreaterThan(normal);
    });

    it('sizes the longest dates so both fit on the row', () => {
      // 1040px of room: the new date at 0.64 em a character, the old at 0.4125 em, 90px of arrow and gaps
      const max = 'x'.repeat(28);
      const size = fontSize(newDateSpan({ oldDate: max, newDate: max }));
      expect(28 * 0.64 * size + 28 * 0.4125 * size + 90).toBeLessThanOrEqual(1040);
    });
  });

  describe('note', () => {
    it('hides when it is empty, only spaces, or missing', () => {
      for (const note of ['', '   ', '\t\n', undefined, null]) {
        expect(noteSpan({ note }), String(note)).toBeUndefined();
        expect(render({ note }).at(-1), String(note)).toBe('Thu, 13 Nov, 7 PM');
      }
    });

    it('shows the line on one line of text, and shortens a very long one', () => {
      expect(texts(noteSpan({ note: 'New\n\nvenue' }))).toEqual(['New venue']);
      const long = texts(noteSpan({ note: 'word '.repeat(60) })).join('');
      expect(long.length).toBeLessThanOrEqual(80);
      expect(long.endsWith('…')).toBe(true);
    });
  });

  describe('event name', () => {
    it('shows the name, and falls back to the default when it is empty or blank', () => {
      expect(texts(titleSpan({ title: 'Design Night' }))).toEqual(['Design Night']);
      for (const title of ['', '   ', undefined]) expect(texts(titleSpan({ title })), String(title)).toEqual(['Frontend Meetup #14']);
    });

    it('shrinks as the name gets longer', () => {
      const sizes = ['Short', 'x'.repeat(25), 'x'.repeat(40), 'x'.repeat(55), 'x'.repeat(75)].map((title) => fontSize(titleSpan({ title })));
      for (let i = 1; i < sizes.length; i += 1) expect(sizes[i], sizes.join()).toBeLessThan(sizes[i - 1]);
    });

    it('then truncates a very long name with an ellipsis', () => {
      const text = texts(titleSpan({ title: 'word '.repeat(60) })).join('');
      expect(text.length).toBeLessThanOrEqual(80);
      expect(text.endsWith('…')).toBe(true);
    });
  });

  describe('unusual input', () => {
    it('does not break on values that are not strings', () => {
      expect(() => tree({ title: undefined, oldDate: null, newDate: 42, note: {}, bgColor: undefined })).not.toThrow();
      expect(texts(newDateSpan({ newDate: 42 }))).toEqual(['42']);
    });

    it('does not break when nothing is filled in', () => {
      expect(() => tree({ title: '', oldDate: '', newDate: '', note: '' })).not.toThrow();
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
      for (const overrides of [{}, { oldDate: '', note: '' }, { title: 'x'.repeat(80) }]) {
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
      expect(render({ title: 't'.repeat(120), oldDate: 'd'.repeat(60), newDate: 'n'.repeat(60), note: 'x'.repeat(120) }).every(fontSafe)).toBe(true);
    });
  });

  describe('the pill', () => {
    // The text is 24px bold, which counts as large text, so 3:1 is the minimum. contrastText()
    // picks black or white by brightness, so a few mid-tone accents (pure red, mid grey) get
    // 4:1 to 4.5:1 rather than the best ratio.
    it.each(['#f59e0b', '#4f46e5', '#fde68a', '#7c2d12', '#1e3a8a', '#ff0000', '#00ff00', '#777777', '#000000', '#ffffff'])(
      'keeps its text readable on %s',
      (accentColor) => {
        const color = String(styleOf(childrenOf(pill({ accentColor }))[0]).color);
        expect(color).toBe(contrastText(accentColor));
        expect(contrast(color, accentColor)).toBeGreaterThanOrEqual(3);
        expect(styleOf(pill({ accentColor })).background).toBe(accentColor);
      },
    );
  });

  describe.each([
    ['the dark default', {}],
    ['white with dark text', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#d97706' }],
    ['white with a pale accent', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#fde68a' }],
    ['cream with a dark accent', { bgColor: '#faf5ea', textColor: '#1c1917', accentColor: '#7c2d12' }],
    ['dark with a dark accent', { bgColor: '#0b0f1a', textColor: '#f8fafc', accentColor: '#1e3a8a' }],
  ])('on %s', (_name, colors) => {
    const params = { ...rescheduled.defaults, ...colors };
    const bg = String(params.bgColor);
    const colorOf = (el: SatoriElement | undefined) => String(styleOf(el).color);

    it('keeps the event name and the note readable', () => {
      expect(contrast(colorOf(titleSpan(colors)), bg)).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colorOf(noteSpan(colors)), bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the new date readable', () => {
      expect(contrast(colorOf(newDateSpan(colors)), bg)).toBeGreaterThanOrEqual(3);
    });

    it('keeps the old date dimmed but still readable', () => {
      const old = contrast(colorOf(oldDateSpan(colors)), bg);
      expect(old).toBeGreaterThanOrEqual(3);
      expect(old).toBeLessThan(contrast(colorOf(titleSpan(colors)), bg));
    });

    it('draws the arrow in the same colour as the new date', () => {
      expect(JSON.stringify(dateRow(colors)[1])).toContain(colorOf(newDateSpan(colors)));
    });
  });
});
