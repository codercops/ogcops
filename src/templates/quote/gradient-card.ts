import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-gradient-card',
  name: 'Gradient Card',
  category: 'quote',
  description: 'Gradient background with white quote text',
  tags: ['quote', 'gradient', 'card', 'colorful'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'Simplicity is the ultimate sophistication.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    commonFields.accentColor,
    { key: 'gradientEnd', label: 'Gradient End', type: 'color', defaultValue: '#3D405B', group: 'Style' },
  ],
  defaults: {
    quote: 'Simplicity is the ultimate sophistication.',
    author: 'Leonardo da Vinci',
    accentColor: '#E07A5F',
    gradientEnd: '#3D405B',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'Simplicity is the ultimate sophistication.'), 180);
    const author = String(params.author || '');
    const accentColor = String(params.accentColor || '#E07A5F');
    const gradientEnd = String(params.gradientEnd || '#3D405B');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 50, size: 56 },
      { maxLen: 100, size: 44 },
      { maxLen: 150, size: 36 },
      { maxLen: 200, size: 30 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${accentColor} 0%, ${gradientEnd} 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '80px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                maxWidth: '1000px',
              },
              children: [
                // Quote text
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: `${quoteSize}px`,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.3,
                      textAlign: 'center',
                      margin: 0,
                    },
                    children: `\u201C${quote}\u201D`,
                  },
                },
                // Author
                ...(author
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            marginTop: '40px',
                            gap: '12px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '40px',
                                  height: '2px',
                                  backgroundColor: 'rgba(255,255,255,0.5)',
                                },
                                children: [],
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '22px',
                                  fontWeight: 500,
                                  color: 'rgba(255,255,255,0.85)',
                                },
                                children: author,
                              },
                            },
                          ],
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
