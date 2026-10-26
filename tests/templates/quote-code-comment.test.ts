import { describe, it, expect } from 'vitest';
import codeComment from '@/templates/quote/code-comment';
import { getTemplate } from '@/templates/registry';
import { hexToRgb } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

type Style = Record<string, string>;

const asElement = (node: unknown) => node as SatoriElement;
const childrenOf = (node: unknown): unknown[] => {
  const { children } = asElement(node).props;
  return Array.isArray(children) ? children : children === undefined ? [] : [children];
};

/** The rows of the comment: each is the text of the spans in it, joined. */
function rows(overrides: Record<string, unknown> = {}): string[] {
  const root = tree(overrides);
  const panel = childrenOf(root).at(-1);
  return childrenOf(panel).map((row) =>
    childrenOf(row)
      .map((span) => String(asElement(span).props.children))
      .join(''),
  );
}

/** The row of the comment that starts with this text, as its spans. */
function rowSpans(overrides: Record<string, unknown>, startsWith: string): SatoriElement[] {
  const panel = childrenOf(tree(overrides)).at(-1);
  const row = childrenOf(panel).find((candidate) =>
    childrenOf(candidate)
      .map((span) => String(asElement(span).props.children))
      .join('')
      .startsWith(startsWith),
  );
  if (!row) throw new Error(`no row starts with ${startsWith}`);
  return childrenOf(row) as SatoriElement[];
}

const tree = (overrides: Record<string, unknown> = {}) =>
  codeComment.render({ ...codeComment.defaults, ...overrides });

/** Every element in the tree, with its style. */
function everyElement(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(everyElement);
  if (node && typeof node === 'object' && 'props' in node) {
    return [asElement(node), ...everyElement(asElement(node).props.children)];
  }
  return [];
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

const LONG =
  'Programs must be written for people to read, and only incidentally for machines to execute. ' +
  'Any fool can write code that a computer can understand; good programmers write code that humans can understand.';

/** The text size of the comment, in pixels. */
const panelFontSize = (root: unknown) =>
  Number(String((asElement(childrenOf(root).at(-1)).props.style as Style).fontSize).replace('px', ''));

/** The quote lines of the comment, without the opening and closing lines or the author. */
const quoteRows = (overrides: Record<string, unknown> = {}) =>
  rows(overrides).filter((row) => row.startsWith(' *') && row !== ' */' && !row.startsWith(' * @author'));

/** The quote as written back together from its comment lines. */
const unwrap = (overrides: Record<string, unknown> = {}) =>
  quoteRows(overrides)
    .map((row) => row.replace(/^ \* ?/, ''))
    .join('\n');

describe('quote-code-comment', () => {
  it('is registered in the quote category', () => {
    expect(getTemplate('quote-code-comment')?.category).toBe('quote');
  });

  it('is a block comment with the quote, an @author line and a closing line', () => {
    expect(rows()).toEqual(['/**', ' * Talk is cheap. Show me the code.', ' * @author Linus Torvalds', ' */']);
  });

  it('shows the file name tab above the panel', () => {
    const root = tree();
    expect(childrenOf(root)).toHaveLength(2);
    expect(JSON.stringify(childrenOf(root)[0])).toContain('quote.ts');
  });

  describe('wrapping', () => {
    it('starts every wrapped line with " * "', () => {
      const lines = quoteRows({ quote: LONG });
      expect(lines.length).toBeGreaterThan(1);
      for (const line of lines) expect(line.startsWith(' * ')).toBe(true);
    });

    it('breaks at spaces, so the lines read back as the same quote', () => {
      expect(unwrap({ quote: LONG }).replace(/\n/g, ' ')).toBe(LONG);
      expect(quoteRows({ quote: LONG }).every((line) => !line.endsWith(' '))).toBe(true);
    });

    it('keeps each line short enough to fit inside the panel', () => {
      // 940px of text at 0.6em per character: at most 31 characters at 50px, 63 at 25px.
      for (const line of quoteRows({ quote: LONG })) expect(line.length).toBeLessThanOrEqual(63);
      for (const line of quoteRows({ quote: 'short' })) expect(line.length).toBeLessThanOrEqual(31);
    });

    it('splits one word that is longer than a line', () => {
      const word = 'x'.repeat(150);
      const lines = quoteRows({ quote: word });
      expect(lines.length).toBeGreaterThan(1);
      expect(lines.map((line) => line.slice(3)).join('')).toBe(word);
    });

    it('uses smaller text for a longer quote, and never gets bigger than a short one', () => {
      const size = (quote: string) => panelFontSize(tree({ quote }));
      expect(size(LONG)).toBeLessThan(size('Hi'));
      expect(size('Hi')).toBeGreaterThanOrEqual(34);
    });

    it('keeps the line breaks that were typed, and shows an empty line as " *"', () => {
      const lines = quoteRows({ quote: 'First.\n\nThen.' });
      expect(lines).toEqual([' * First.', ' *', ' * Then.']);
    });

    it('treats Windows line breaks like any other, and trims spaces around lines', () => {
      expect(quoteRows({ quote: '  First.  \r\n   Then.  ' })).toEqual([' * First.', ' * Then.']);
    });

    it('treats a lone carriage return as a line break', () => {
      expect(quoteRows({ quote: 'First.\rThen.' })).toEqual([' * First.', ' * Then.']);
    });

    it('turns tabs and runs of spaces into one space', () => {
      expect(quoteRows({ quote: 'a\t\tb    c' })).toEqual([' * a b c']);
    });
  });

  describe('long quotes', () => {
    it('shortens a very long quote with an ellipsis', () => {
      const text = unwrap({ quote: LONG.repeat(5) });
      expect(text.length).toBeLessThanOrEqual(240);
      expect(text.endsWith('…')).toBe(true);
    });

    it('always keeps the comment inside the panel, however many lines there are', () => {
      for (const quote of ['x\n'.repeat(60), 'a\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nb', LONG.repeat(3), 'w '.repeat(200)]) {
        const root = tree({ quote });
        const panel = childrenOf(root).at(-1);
        const rowCount = childrenOf(panel).length;
        const fontSize = panelFontSize(root);
        // The panel has 36px of padding above and below, and the card has 60px around it.
        expect(rowCount * Math.round(fontSize * 1.55) + 72 + 22 + 120).toBeLessThanOrEqual(630);
      }
    });

    it('marks the end of a quote cut short by running out of room', () => {
      const lines = quoteRows({ quote: 'x\n'.repeat(60) });
      expect(lines.at(-1)?.endsWith('…')).toBe(true);
    });
  });

  describe('optional parts', () => {
    it('hides the @author line when the author is empty or blank', () => {
      for (const author of ['', '   ', undefined]) {
        expect(rows({ author }).some((row) => row.includes('@author')), String(author)).toBe(false);
        expect(rows({ author })).toHaveLength(3);
      }
    });

    it('shortens a very long author', () => {
      const line = rows({ author: 'A'.repeat(100) }).find((row) => row.includes('@author')) ?? '';
      expect(line.length).toBeLessThanOrEqual(' * @author '.length + 40);
      expect(line.endsWith('…')).toBe(true);
    });

    it('hides the tab when the file name is empty or blank', () => {
      for (const fileName of ['', '   ', undefined]) {
        expect(childrenOf(tree({ fileName })), String(fileName)).toHaveLength(1);
      }
    });

    it('shows a different file name, shortened when very long', () => {
      expect(JSON.stringify(tree({ fileName: 'wisdom.py' }))).toContain('wisdom.py');
      expect(JSON.stringify(tree({ fileName: 'f'.repeat(80) }))).not.toContain('f'.repeat(31));
    });

    it('squares off the panel corner under the tab, and rounds all four without one', () => {
      const radius = (overrides: Record<string, unknown>) =>
        (asElement(childrenOf(tree(overrides)).at(-1)).props.style as Style).borderRadius;
      expect(radius({})).toMatch(/^0 /);
      expect(radius({ fileName: '' })).toBe('16px');
    });
  });

  describe('empty and unusual input', () => {
    it('falls back to the default quote when the quote is empty or blank', () => {
      for (const quote of ['', '   ', '\n\n']) expect(quoteRows({ quote })).toEqual([' * Talk is cheap. Show me the code.']);
    });

    it('reads values that are not strings', () => {
      expect(() => tree({ quote: undefined, author: undefined, fileName: undefined })).not.toThrow();
      expect(quoteRows({ quote: 42 })).toEqual([' * 42']);
      expect(() => tree({ quote: null, author: 7, fileName: 7 })).not.toThrow();
    });

    it('does not break on text that looks like a comment', () => {
      expect(quoteRows({ quote: 'a */ b /* c' })).toEqual([' * a */ b /* c']);
    });
  });

  describe('layout', () => {
    it('fills the card, in JetBrains Mono', () => {
      const style = asElement(tree()).props.style as Style;
      expect(style.width).toBe('1200px');
      expect(style.height).toBe('630px');
      expect(style.fontFamily).toContain('JetBrains Mono');
    });

    it('uses flexbox only, with display flex on every div', () => {
      for (const overrides of [{}, { quote: LONG }, { author: '', fileName: '' }]) {
        for (const el of everyElement(tree(overrides))) {
          const style = el.props.style as Style | undefined;
          if (el.type === 'div') expect(style?.display, JSON.stringify(overrides)).toBe('flex');
          expect(style?.display).not.toBe('grid');
        }
      }
    });

    it('keeps spaces in the comment lines', () => {
      for (const span of rowSpans({}, ' * ')) expect((span.props.style as Style).whiteSpace).toBe('pre');
    });

    it('colors the markers, the quote and the author differently', () => {
      const [marker, text] = rowSpans({}, ' * Talk');
      const [, author] = rowSpans({}, ' * @author');
      const colors = [marker, text, author].map((span) => (span.props.style as Style).color);
      expect(new Set(colors).size).toBe(3);
      expect(colors[2]).toBe(codeComment.defaults.accentColor);
    });

    it('draws the same image every time', () => {
      expect(JSON.stringify(tree({ quote: LONG }))).toBe(JSON.stringify(tree({ quote: LONG })));
    });

    it('only uses characters the fonts have, apart from an ellipsis the template adds', () => {
      const fontSafe = (text: string) => [...text].every((ch) => ch.codePointAt(0)! <= 0xff || ch === '…');
      expect(rows().every(fontSafe)).toBe(true);
      expect(rows({ quote: LONG.repeat(5), author: 'A'.repeat(90) }).every(fontSafe)).toBe(true);
    });
  });

  describe.each([
    ['the dark default', {}],
    ['white with dark text', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#4f46e5' }],
    ['white with a pale accent', { bgColor: '#ffffff', textColor: '#1f2937', accentColor: '#fde68a' }],
    ['cream with a dark accent', { bgColor: '#faf5ea', textColor: '#1c1917', accentColor: '#7c2d12' }],
    ['dark with a dark accent', { bgColor: '#0f111a', textColor: '#e6e9f2', accentColor: '#1e3a8a' }],
  ])('on %s', (_name, colors) => {
    const params = { ...codeComment.defaults, ...colors };
    const root = codeComment.render(params);
    const panelBg = String((asElement(childrenOf(root).at(-1)).props.style as Style).background);
    const colorOf = (startsWith: string, index: number) =>
      String(
        (
          (childrenOf(
            childrenOf(childrenOf(root).at(-1)).find((row) =>
              childrenOf(row)
                .map((span) => String(asElement(span).props.children))
                .join('')
                .startsWith(startsWith),
            ),
          )[index] as SatoriElement).props.style as Style
        ).color,
      );

    it('keeps the quote readable on the panel', () => {
      expect(contrast(colorOf(' * Talk', 1), panelBg)).toBeGreaterThanOrEqual(4.5);
    });

    it('keeps the @author line readable on the panel', () => {
      expect(contrast(colorOf(' * @author', 1), panelBg)).toBeGreaterThanOrEqual(3);
    });

    it('keeps the comment markers visible on the panel', () => {
      for (const start of ['/**', ' */', ' * Talk']) expect(contrast(colorOf(start, 0), panelBg), start).toBeGreaterThanOrEqual(3);
    });

    it('keeps the file name readable on its tab', () => {
      const tab = asElement(childrenOf(childrenOf(root)[0])[0]);
      const tabBg = String((tab.props.style as Style).background);
      const color = String((asElement(tab.props.children).props.style as Style).color);
      expect(contrast(color, tabBg)).toBeGreaterThanOrEqual(4.5);
    });

    it('draws the panel apart from the page', () => {
      expect(panelBg).not.toBe(String(params.bgColor));
    });
  });
});
