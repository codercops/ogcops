import { describe, it, expect } from 'vitest';
import callForSpeakers from '@/templates/event/call-for-speakers';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

/** Every string rendered anywhere in the element tree, in order. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

/** The style of the element that directly holds this text. */
function styleOf(node: unknown, text: string): Record<string, string> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = styleOf(child, text);
      if (found) return found;
    }
    return undefined;
  }
  if (node && typeof node === 'object' && 'props' in node) {
    const { style, children } = (node as SatoriElement).props;
    if (children === text) return style;
    return styleOf(children, text);
  }
  return undefined;
}

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

const tree = (overrides: Record<string, unknown> = {}) =>
  callForSpeakers.render({ ...callForSpeakers.defaults, ...overrides });
const render = (overrides: Record<string, unknown> = {}) => texts(tree(overrides));

const LABEL = 'Call for speakers';
const DEFAULT_CHIPS = ['AI', 'Web', 'DevOps', 'Security'];
/** The chips, which sit between the event name and the "Deadline" label. */
const chipsOf = (overrides: Record<string, unknown> = {}) => {
  const out = render(overrides);
  const start = out.indexOf(String(overrides.title ?? callForSpeakers.defaults.title)) + 1;
  const end = out.includes('Deadline') ? out.indexOf('Deadline') : out.length - 1;
  return out.slice(start, end);
};

describe('event-call-for-speakers', () => {
  it('is registered in the event category', () => {
    expect(getTemplate('event-call-for-speakers')?.category).toBe('event');
  });

  it('shows the label, event name, chips, deadline and button with its defaults', () => {
    expect(render()).toEqual([
      LABEL,
      'DevConf 2027',
      ...DEFAULT_CHIPS,
      'Deadline',
      'Nov 30, 2026',
      'Submit a talk',
    ]);
  });

  describe('topic chips', () => {
    it('shows at most four, in order', () => {
      expect(chipsOf({ topics: 'a, b, c, d, e, f' })).toEqual(['a', 'b', 'c', 'd']);
    });

    it('drops empty entries before counting, so blanks do not use up the four', () => {
      expect(chipsOf({ topics: ',, a ,  , b,, c, d, e' })).toEqual(['a', 'b', 'c', 'd']);
    });

    it('trims spaces around each topic', () => {
      expect(chipsOf({ topics: '  AI  ,\tWeb ' })).toEqual(['AI', 'Web']);
    });

    it('shows fewer when there are fewer', () => {
      expect(chipsOf({ topics: 'Only one' })).toEqual(['Only one']);
    });

    it('shows no chips for empty or blank topics', () => {
      for (const topics of ['', '   ', ' , , ']) {
        expect(chipsOf({ topics })).toEqual([]);
      }
    });

    it('shortens each chip', () => {
      const [chip] = chipsOf({ topics: 'An extremely long topic name that goes on and on' });
      expect(chip.length).toBeLessThanOrEqual(22);
      expect(chip.endsWith('…')).toBe(true);
    });

    it('reads the topics from a value that is not a string', () => {
      expect(() => render({ topics: undefined })).not.toThrow();
      expect(chipsOf({ topics: 42 })).toEqual(['42']);
    });

    // When the event name wraps onto two lines the card is full, and a flex item that is allowed
    // to shrink gets squeezed until its outline is gone. The chips and their row must not shrink.
    it('does not let the chips or their row shrink', () => {
      const chain = (node: unknown, text: string): SatoriElement[] | undefined => {
        if (Array.isArray(node)) {
          for (const child of node) {
            const found = chain(child, text);
            if (found) return found;
          }
          return undefined;
        }
        if (node && typeof node === 'object' && 'props' in node) {
          const element = node as SatoriElement;
          if (element.props.children === text) return [element];
          const found = chain(element.props.children, text);
          return found && [...found, element];
        }
        return undefined;
      };
      const [, chip, row] = chain(tree(), 'AI') ?? [];
      expect(chip.props.style?.flexShrink).toBe(0);
      expect(row.props.style?.flexShrink).toBe(0);
    });
  });

  describe('deadline', () => {
    it('hides the deadline and its label when empty or blank', () => {
      for (const deadline of ['', '   ']) {
        const out = render({ deadline });
        expect(out).not.toContain('Deadline');
        expect(out).not.toContain('Nov 30, 2026');
      }
    });

    it('keeps the button when there is no deadline', () => {
      expect(render({ deadline: '' }).at(-1)).toBe('Submit a talk');
    });

    it('shortens a very long deadline so it cannot reach the button', () => {
      const out = render({ deadline: 'D'.repeat(80) });
      const deadline = out[out.indexOf('Deadline') + 1];
      expect(deadline.length).toBeLessThanOrEqual(24);
    });
  });

  describe('button', () => {
    it('falls back to "Submit a talk" when the text is empty or blank', () => {
      for (const ctaText of ['', '   ', undefined]) {
        expect(render({ ctaText }).at(-1)).toBe('Submit a talk');
      }
    });

    it('uses the text that is set', () => {
      expect(render({ ctaText: 'Apply now' }).at(-1)).toBe('Apply now');
    });

    it('shortens a very long label', () => {
      expect(render({ ctaText: 'C'.repeat(60) }).at(-1)!.length).toBeLessThanOrEqual(20);
    });
  });

  it('shows the site name only when it is set', () => {
    expect(render({ siteName: 'devconf.example.com' })).toContain('devconf.example.com');
    expect(render()).not.toContain('devconf.example.com');
    expect(render({ siteName: '   ' })).toEqual(render());
  });

  it('shortens a very long event name, and falls back when it is empty', () => {
    expect(render({ title: 'T'.repeat(200) })[1].length).toBeLessThanOrEqual(60);
    expect(render({ title: '' })[1]).toBe('DevConf 2027');
  });

  it('draws only characters the bundled fonts have (no arrows or icons)', () => {
    const fontSafe = (text: string) => [...text].every((ch) => ch.codePointAt(0)! <= 0xff || ch === '…');
    expect(render().every(fontSafe)).toBe(true);
    expect(render({ title: 'T'.repeat(200), topics: 'x'.repeat(60) }).every(fontSafe)).toBe(true);
  });

  describe.each([
    ['the dark default', {}],
    ['white with dark text', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#4f46e5' }],
    ['white with a pale accent', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#fde68a' }],
    ['cream with a dark accent', { bgColor: '#faf5ea', textColor: '#1c1917', accentColor: '#7c2d12' }],
    ['dark with a dark accent', { bgColor: '#0b1020', textColor: '#f8fafc', accentColor: '#1e3a8a' }],
  ])('on %s', (_name, colors) => {
    const params: Record<string, string | number | boolean> = { ...callForSpeakers.defaults, ...colors };
    const bg = String(params.bgColor);
    const root = callForSpeakers.render(params);

    it('keeps the event name and deadline readable', () => {
      for (const text of ['DevConf 2027', 'Nov 30, 2026']) {
        const color = styleOf(root, text)?.color;
        expect(contrast(String(color), bg), text).toBeGreaterThanOrEqual(4.5);
      }
    });

    it('keeps the "Deadline" label readable', () => {
      expect(contrast(String(styleOf(root, 'Deadline')?.color), bg)).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the label and the chips readable', () => {
      for (const text of [LABEL, 'AI', 'Security']) {
        const color = styleOf(root, text)?.color;
        expect(contrast(String(color), bg), text).toBeGreaterThanOrEqual(3);
      }
    });

    it('keeps the button text readable on the accent', () => {
      const color = styleOf(root, 'Submit a talk')?.color;
      expect(contrast(String(color), String(params.accentColor))).toBeGreaterThanOrEqual(4.5);
    });
  });
});
