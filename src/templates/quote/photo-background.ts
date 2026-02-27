import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-photo-background',
  name: 'Photo Background',
  category: 'quote',
  description: 'Quote text on a dark overlay simulating a photo background',
  tags: ['quote', 'photo', 'overlay', 'dramatic'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'In the middle of difficulty lies opportunity.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    { key: 'overlayColor', label: 'Overlay Color', type: 'color', defaultValue: '#1a1a2e', group: 'Style' },
    commonFields.accentColor,
  ],
  defaults: {
    quote: 'In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    overlayColor: '#1a1a2e',
    accentColor: '#E07A5F',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'In the middle of difficulty lies opportunity.'), 180);
    const author = String(params.author || '');
    const overlayColor = String(params.overlayColor || '#1a1a2e');
    const accentColor = String(params.accentColor || '#E07A5F');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 50, size: 52 },
      { maxLen: 100, size: 42 },
      { maxLen: 150, size: 34 },
      { maxLen: 200, size: 28 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${overlayColor} 0%, #0a0a0a 50%, ${overlayColor} 100%)`,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Overlay with content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
                padding: '80px 100px',
              },
              children: [
                // Accent line above
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '60px',
                      height: '3px',
                      backgroundColor: accentColor,
                      marginBottom: '40px',
                    },
                    children: [],
                  },
                },
                // Quote
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: `${quoteSize}px`,
                      fontWeight: 600,
                      color: '#FFFFFF',
                      lineHeight: 1.4,
                      textAlign: 'center',
                      margin: 0,
                      maxWidth: '960px',
                    },
                    children: `\u201C${quote}\u201D`,
                  },
                },
                // Author
                ...(author
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.7)',
                            marginTop: '40px',
                          },
                          children: `\u2014 ${author}`,
                        },
                      },
                    ]
                  : []),
                // Accent line below
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '60px',
                      height: '3px',
                      backgroundColor: accentColor,
                      marginTop: '40px',
                    },
                    children: [],
                  },
                },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
