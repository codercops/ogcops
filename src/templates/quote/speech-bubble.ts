import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-speech-bubble',
  name: 'Speech Bubble',
  category: 'quote',
  description: 'Chat bubble design with tail and author below',
  tags: ['quote', 'speech', 'bubble', 'chat'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'Talk is cheap. Show me the code.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'Talk is cheap. Show me the code.',
    author: 'Linus Torvalds',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'Talk is cheap. Show me the code.'), 180);
    const author = String(params.author || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 40, size: 48 },
      { maxLen: 80, size: 38 },
      { maxLen: 140, size: 30 },
      { maxLen: 200, size: 26 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 80px',
        },
        children: [
          // Bubble
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1e1e1e',
                borderRadius: '24px',
                borderBottomLeftRadius: '4px',
                padding: '48px 56px',
                maxWidth: '1000px',
                border: `2px solid ${accentColor}33`,
              },
              children: [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: `${quoteSize}px`,
                      fontWeight: 600,
                      color: textColor,
                      lineHeight: 1.4,
                      margin: 0,
                    },
                    children: quote,
                  },
                },
              ],
            },
          },
          // Bubble tail (triangle simulated with a small box)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                marginLeft: '40px',
                width: '20px',
                height: '20px',
                backgroundColor: '#1e1e1e',
                borderBottomRightRadius: '16px',
              },
              children: [],
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
                      marginTop: '24px',
                      marginLeft: '8px',
                      gap: '16px',
                    },
                    children: [
                      // Avatar circle
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '22px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                              },
                              children: author.charAt(0).toUpperCase(),
                            },
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 500,
                            color: `${textColor}AA`,
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
    };
  },
};

export default template;
