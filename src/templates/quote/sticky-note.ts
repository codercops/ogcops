import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const NOTE_WIDTH = 560;
const NOTE_HEIGHT = 460;

const template: TemplateDefinition = {
  id: 'quote-sticky-note',
  name: 'Sticky Note',
  category: 'quote',
  description: 'A slightly tilted sticky note with a tape strip, a serif quote and the author signed at the bottom',
  tags: ['quote', 'sticky-note', 'note', 'playful', 'handwritten'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'Simplicity is prerequisite for reliability.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    { key: 'noteColor', label: 'Note Color', type: 'color', defaultValue: '#FDE68A', group: 'Style' },
    commonFields.bgColor,
    { ...commonFields.textColor, defaultValue: '#1F2937' },
  ],
  defaults: {
    quote: 'Simplicity is prerequisite for reliability.',
    author: 'Edsger W. Dijkstra',
    noteColor: '#FDE68A',
    bgColor: '#0a0a0a',
    textColor: '#1F2937',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'Simplicity is prerequisite for reliability.'), 200);
    const author = String(params.author || '');
    const noteColor = String(params.noteColor || '#FDE68A');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const textColor = String(params.textColor || '#1F2937');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 50, size: 44 },
      { maxLen: 100, size: 36 },
      { maxLen: 150, size: 30 },
      { maxLen: 200, size: 26 },
    ]);
    const box = {
      position: 'absolute' as const,
      width: `${NOTE_WIDTH}px`,
      height: `${NOTE_HEIGHT}px`,
      left: `${(1200 - NOTE_WIDTH) / 2}px`,
      top: `${(630 - NOTE_HEIGHT) / 2}px`,
    };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          position: 'relative',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Tilted note with tape; the text sits straight on top so it renders cleanly
          {
            type: 'div',
            props: {
              style: {
                ...box,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: noteColor,
                borderRadius: '4px',
                boxShadow: '0 18px 40px rgba(0,0,0,0.35)',
                transform: 'rotate(-3deg)',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: '170px',
                    height: '38px',
                    marginTop: '-18px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                    transform: 'rotate(2deg)',
                  },
                  children: [],
                },
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                ...box,
                display: 'flex',
                flexDirection: 'column',
                padding: '56px 52px 40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flex: 1, alignItems: 'center' },
                    children: {
                      type: 'p',
                      props: {
                        style: {
                          fontSize: `${quoteSize}px`,
                          fontFamily: 'Playfair Display, serif',
                          color: textColor,
                          lineHeight: 1.4,
                          margin: 0,
                          wordBreak: 'break-word',
                        },
                        children: `\u201C${quote}\u201D`,
                      },
                    },
                  },
                },
                ...(author
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'flex-end',
                            fontSize: '20px',
                            fontWeight: 600,
                            color: textColor,
                          },
                          children: `\u2014 ${author}`,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
