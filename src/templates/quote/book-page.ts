import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-book-page',
  name: 'Book Page',
  category: 'quote',
  description: 'Cream paper background with book-style margins and serif typography',
  tags: ['quote', 'book', 'page', 'literary'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'Any sufficiently advanced technology is indistinguishable from magic.', placeholder: 'Enter your quote...', required: true, group: 'Content' },
    commonFields.author,
    { key: 'source', label: 'Source / Book', type: 'text', defaultValue: "Profiles of the Future", placeholder: 'Book or source title', group: 'Content' },
    { key: 'pageNumber', label: 'Page Number', type: 'text', defaultValue: '42', placeholder: '42', group: 'Content' },
    commonFields.accentColor,
  ],
  defaults: {
    quote: 'Any sufficiently advanced technology is indistinguishable from magic.',
    author: 'Arthur C. Clarke',
    source: "Profiles of the Future",
    pageNumber: '42',
    accentColor: '#8B4513',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'Any sufficiently advanced technology is indistinguishable from magic.'), 200);
    const author = String(params.author || '');
    const source = String(params.source || '');
    const pageNumber = String(params.pageNumber || '');
    const accentColor = String(params.accentColor || '#8B4513');
    const quoteSize = autoFontSize(quote, [
      { maxLen: 50, size: 44 },
      { maxLen: 100, size: 36 },
      { maxLen: 150, size: 30 },
      { maxLen: 200, size: 26 },
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
          backgroundColor: '#E8E0D4',
          fontFamily: 'Inter, sans-serif',
          padding: '40px',
        },
        children: [
          // Book page
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                height: '100%',
                backgroundColor: '#FDF8F0',
                borderRadius: '4px',
                padding: '60px 80px',
                boxShadow: '4px 4px 20px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${accentColor}44`,
              },
              children: [
                // Top margin line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '100%',
                      height: '1px',
                      backgroundColor: `${accentColor}22`,
                      marginBottom: '48px',
                    },
                    children: [],
                  },
                },
                // Quote
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: 1,
                      alignItems: 'center',
                    },
                    children: {
                      type: 'p',
                      props: {
                        style: {
                          fontSize: `${quoteSize}px`,
                          fontFamily: 'Playfair Display, serif',
                          fontStyle: 'italic',
                          color: '#2C2C2C',
                          lineHeight: 1.5,
                          margin: 0,
                        },
                        children: `\u201C${quote}\u201D`,
                      },
                    },
                  },
                },
                // Bottom section
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      borderTop: `1px solid ${accentColor}22`,
                      paddingTop: '24px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          },
                          children: [
                            ...(author
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '18px',
                                        fontWeight: 600,
                                        color: '#2C2C2C',
                                      },
                                      children: `\u2014 ${author}`,
                                    },
                                  },
                                ]
                              : []),
                            ...(source
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '14px',
                                        fontStyle: 'italic',
                                        color: '#666666',
                                      },
                                      children: source,
                                    },
                                  },
                                ]
                              : []),
                          ],
                        },
                      },
                      ...(pageNumber
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: '#999999',
                                  fontFamily: 'JetBrains Mono, monospace',
                                },
                                children: `p. ${pageNumber}`,
                              },
                            },
                          ]
                        : []),
                    ],
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
