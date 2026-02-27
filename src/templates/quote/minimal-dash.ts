import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-minimal-dash',
  name: 'Minimal Dash',
  category: 'quote',
  description: 'Clean minimal design with em dash separator between quote and author',
  tags: ['quote', 'minimal', 'dash', 'clean'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'Make it work, make it right, make it fast.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    commonFields.bgColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'Make it work, make it right, make it fast.',
    author: 'Kent Beck',
    bgColor: '#0a0a0a',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'Make it work, make it right, make it fast.'), 180);
    const author = String(params.author || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const textColor = String(params.textColor || '#FFFFFF');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 40, size: 52 },
      { maxLen: 80, size: 42 },
      { maxLen: 130, size: 34 },
      { maxLen: 180, size: 28 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '80px 100px',
        },
        children: [
          // Quote
          {
            type: 'p',
            props: {
              style: {
                fontSize: `${quoteSize}px`,
                fontWeight: 300,
                color: textColor,
                lineHeight: 1.5,
                margin: 0,
                maxWidth: '960px',
              },
              children: quote,
            },
          },
          // Em dash separator
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '48px',
                height: '1px',
                backgroundColor: `${textColor}44`,
                marginTop: '40px',
                marginBottom: '24px',
              },
              children: [],
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
                      color: `${textColor}88`,
                      letterSpacing: '0.02em',
                    },
                    children: author,
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
