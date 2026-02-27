import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-centered-serif',
  name: 'Centered Serif',
  category: 'quote',
  description: 'Large Playfair italic quote centered with em dash and author',
  tags: ['quote', 'serif', 'centered', 'elegant'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'The best way to predict the future is to invent it.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    { key: 'authorTitle', label: 'Author Title', type: 'text', defaultValue: '', placeholder: 'Computer Scientist', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'The best way to predict the future is to invent it.',
    author: 'Alan Kay',
    authorTitle: 'Computer Scientist',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'The best way to predict the future is to invent it.'), 200);
    const author = String(params.author || '');
    const authorTitle = String(params.authorTitle || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 50, size: 52 },
      { maxLen: 100, size: 42 },
      { maxLen: 150, size: 36 },
      { maxLen: 200, size: 30 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '80px 100px',
        },
        children: [
          // Opening quote mark
          {
            type: 'span',
            props: {
              style: {
                fontSize: '120px',
                fontFamily: 'Playfair Display, serif',
                color: accentColor,
                lineHeight: 0.5,
                marginBottom: '16px',
              },
              children: '\u201C',
            },
          },
          // Quote text
          {
            type: 'p',
            props: {
              style: {
                fontSize: `${quoteSize}px`,
                fontFamily: 'Playfair Display, serif',
                fontStyle: 'italic',
                fontWeight: 400,
                color: textColor,
                lineHeight: 1.4,
                textAlign: 'center',
                margin: 0,
              },
              children: quote,
            },
          },
          // Em dash + author
          ...(author
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      marginTop: '40px',
                      gap: '8px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 500,
                            color: `${textColor}CC`,
                          },
                          children: `\u2014 ${author}`,
                        },
                      },
                      ...(authorTitle
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: `${textColor}66`,
                                },
                                children: authorTitle,
                              },
                            },
                          ]
                        : []),
                    ],
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
