import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-bold-highlight',
  name: 'Bold Highlight',
  category: 'quote',
  description: 'Key words highlighted in accent color for emphasis',
  tags: ['quote', 'bold', 'highlight', 'emphasis'],
  fields: [
    { key: 'quoteBefore', label: 'Text Before Highlight', type: 'text', defaultValue: 'First, solve the', placeholder: 'Text before...', required: true, group: 'Content' },
    { key: 'highlight', label: 'Highlighted Text', type: 'text', defaultValue: 'problem.', placeholder: 'Highlighted words', required: true, group: 'Content' },
    { key: 'quoteAfter', label: 'Text After Highlight', type: 'text', defaultValue: 'Then, write the code.', placeholder: 'Text after...', group: 'Content' },
    commonFields.author,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quoteBefore: 'First, solve the',
    highlight: 'problem.',
    quoteAfter: 'Then, write the code.',
    author: 'John Johnson',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const quoteBefore = truncate(String(params.quoteBefore || 'First, solve the'), 80);
    const highlight = truncate(String(params.highlight || 'problem.'), 40);
    const quoteAfter = String(params.quoteAfter || '');
    const author = String(params.author || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

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
          // Quote with highlight
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0px',
                maxWidth: '1000px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '56px',
                      fontWeight: 300,
                      color: `${textColor}CC`,
                      lineHeight: 1.3,
                    },
                    children: `${quoteBefore} `,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '56px',
                      fontWeight: 800,
                      color: accentColor,
                      lineHeight: 1.3,
                    },
                    children: highlight,
                  },
                },
                ...(quoteAfter
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '56px',
                            fontWeight: 300,
                            color: `${textColor}CC`,
                            lineHeight: 1.3,
                          },
                          children: ` ${quoteAfter}`,
                        },
                      },
                    ]
                  : []),
              ],
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
                      marginTop: '48px',
                      gap: '16px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '32px',
                            height: '2px',
                            backgroundColor: accentColor,
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
                            color: `${textColor}88`,
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
