import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, mixColors, isLightColor, commonFields } from '../utils';

const MONO = 'JetBrains Mono, monospace';
// JetBrains Mono is fixed width: every character is 0.6 em wide.
const CHAR_WIDTH = 0.6;
const LINE_HEIGHT = 1.55;
const MAX_QUOTE_LENGTH = 240;
// Width of the text inside the panel, and the height the comment may use.
const TEXT_WIDTH = 940;
const TEXT_HEIGHT = 340;
const FONT_SIZES = [40, 34, 30, 26, 22];

/** Breaks a long word into pieces of at most `width` characters. */
function splitWord(word: string, width: number): string[] {
  const pieces: string[] = [];
  for (let i = 0; i < word.length; i += width) pieces.push(word.slice(i, i + width));
  return pieces;
}

/** Wraps one paragraph to lines of at most `width` characters, breaking at spaces. */
function wrapParagraph(text: string, width: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ').filter(Boolean)) {
    for (const piece of word.length > width ? splitWord(word, width) : [word]) {
      if (!line) line = piece;
      else if (line.length + 1 + piece.length <= width) line += ` ${piece}`;
      else {
        lines.push(line);
        line = piece;
      }
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Wraps the quote, keeping the line breaks the author typed. An empty line stays empty. */
function wrapQuote(quote: string, width: number): string[] {
  return quote.split('\n').flatMap((paragraph) => {
    const lines = wrapParagraph(paragraph, width);
    return lines.length ? lines : [''];
  });
}

const template: TemplateDefinition = {
  id: 'quote-code-comment',
  name: 'Code Comment',
  category: 'quote',
  description: 'A quote written as a block comment in an editor panel, with the author as an @author line and a file name tab',
  tags: ['quote', 'code', 'comment', 'developer', 'editor'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'Talk is cheap. Show me the code.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    { key: 'fileName', label: 'File Name', type: 'text', defaultValue: 'quote.ts', placeholder: 'quote.ts', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    fileName: 'quote.ts',
    bgColor: '#0f111a',
    accentColor: '#7dcfff',
    textColor: '#e6e9f2',
  },
  render: (params) => {
    const quote = truncate(
      String(params.quote ?? '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+/g, ' ')
        .split('\n')
        .map((line) => line.trim())
        .join('\n')
        .trim() || 'Talk is cheap. Show me the code.',
      MAX_QUOTE_LENGTH,
    );
    const author = truncate(String(params.author ?? '').replace(/\s+/g, ' ').trim(), 40);
    const fileName = truncate(String(params.fileName ?? '').replace(/\s+/g, ' ').trim(), 30);
    const bgColor = String(params.bgColor || '#0f111a');
    const accentColor = String(params.accentColor || '#7dcfff');
    const textColor = String(params.textColor || '#e6e9f2');

    // The comment is the opening line, the quote, the author and the closing line. Use the
    // largest text size where all of it fits in the panel, and the smallest one otherwise.
    const extraRows = 2 + (author ? 1 : 0);
    const fits = (size: number, rows: number) => rows * size * LINE_HEIGHT <= TEXT_HEIGHT;
    const widthFor = (size: number) => Math.floor((TEXT_WIDTH - 3 * size * CHAR_WIDTH) / (size * CHAR_WIDTH));
    let fontSize = FONT_SIZES[FONT_SIZES.length - 1];
    let quoteLines = wrapQuote(quote, widthFor(fontSize));
    for (const size of FONT_SIZES) {
      const lines = wrapQuote(quote, widthFor(size));
      if (fits(size, lines.length + extraRows)) {
        fontSize = size;
        quoteLines = lines;
        break;
      }
    }
    // Even the smallest size can run out of room when the quote has many short lines.
    const maxQuoteLines = Math.max(1, Math.floor(TEXT_HEIGHT / (fontSize * LINE_HEIGHT)) - extraRows);
    if (quoteLines.length > maxQuoteLines) {
      const kept = quoteLines.slice(0, maxQuoteLines);
      kept[maxQuoteLines - 1] = truncate(`${kept[maxQuoteLines - 1]}…`, widthFor(fontSize));
      quoteLines = kept;
    }

    // Neutral colors are mixed from the background and text colors, so the panel reads the
    // same on dark and on light backgrounds.
    const lightBg = isLightColor(bgColor);
    const panelBg = mixColors(bgColor, textColor, lightBg ? 0.04 : 0.07);
    const panelBorder = mixColors(bgColor, textColor, 0.2);
    const markerColor = mixColors(bgColor, textColor, 0.55);
    const fileNameColor = mixColors(bgColor, textColor, 0.8);
    // An accent as light as the background (or as dark as it) is hard to read as text, so
    // pull it toward the text color. Otherwise it reads as it is.
    const accentText = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;

    const row = (marker: string, text: string, color: string, textWeight = 400): SatoriElement => ({
      type: 'div',
      props: {
        style: { display: 'flex', height: `${Math.round(fontSize * LINE_HEIGHT)}px`, alignItems: 'center' },
        children: [
          { type: 'span', props: { style: { color: markerColor, whiteSpace: 'pre' }, children: marker } },
          ...(text ? [{ type: 'span', props: { style: { color, fontWeight: textWeight, whiteSpace: 'pre' }, children: text } }] : []),
        ],
      },
    });

    const comment: SatoriElement[] = [
      row('/**', '', markerColor),
      ...quoteLines.map((line) => row(line ? ' * ' : ' *', line, textColor)),
      ...(author ? [row(' * ', `@author ${author}`, accentText, 700)] : []),
      row(' */', '', markerColor),
    ];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: MONO,
          padding: '60px 80px',
        },
        children: [
          // File name tab
          ...(fileName
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex' },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '10px 24px',
                          borderRadius: '12px 12px 0 0',
                          background: panelBg,
                          border: `1px solid ${panelBorder}`,
                          borderBottom: 'none',
                        },
                        children: {
                          type: 'span',
                          props: { style: { fontSize: '20px', color: fileNameColor }, children: fileName },
                        },
                      },
                    },
                  },
                },
              ]
            : []),
          // Editor panel
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                padding: '36px 40px',
                background: panelBg,
                border: `1px solid ${panelBorder}`,
                borderRadius: fileName ? '0 16px 16px 16px' : '16px',
                fontSize: `${fontSize}px`,
              },
              children: comment,
            },
          },
        ],
      },
    };
  },
};

export default template;
