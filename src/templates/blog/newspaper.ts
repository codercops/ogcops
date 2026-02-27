import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-newspaper',
  name: 'Newspaper',
  category: 'blog',
  description: 'Column layout feel with serif heading, dateline, and cream off-white background',
  tags: ['newspaper', 'classic', 'serif', 'editorial', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    commonFields.siteName,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    date: '',
    category: '',
    siteName: '',
    accentColor: '#8B0000',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 160) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const accentColor = String(params.accentColor || '#8B0000');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 60 },
      { maxLen: 50, size: 48 },
      { maxLen: 70, size: 40 },
      { maxLen: 100, size: 34 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: '#F5F0E8',
          fontFamily: 'Inter, sans-serif',
          padding: '48px 72px',
          position: 'relative',
        },
        children: [
          // Masthead: site name centered
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '8px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#2C2C2C',
                          letterSpacing: '0.2em',
                          textTransform: 'uppercase',
                          fontFamily: 'Playfair Display, serif',
                        },
                        children: siteName,
                      },
                    },
                  },
                },
              ]
            : []),
          // Double rule
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                marginBottom: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '100%',
                      height: '2px',
                      backgroundColor: '#2C2C2C',
                    },
                    children: '',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#2C2C2C',
                    },
                    children: '',
                  },
                },
              ],
            },
          },
          // Dateline row: date + category
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              },
              children: [
                date
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '13px',
                          color: '#666666',
                          letterSpacing: '0.04em',
                          fontStyle: 'italic',
                        },
                        children: date,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
                category
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '12px',
                          fontWeight: 700,
                          color: accentColor,
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        },
                        children: category,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
          // Headline
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1 },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: '#1A1A1A',
                    lineHeight: 1.1,
                    margin: 0,
                    fontFamily: 'Playfair Display, serif',
                    maxWidth: '1000px',
                  },
                  children: title,
                },
              },
            },
          },
          // Thin rule before description
          ...(description
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '100%',
                      height: '1px',
                      backgroundColor: '#CCCCCC',
                      marginTop: '16px',
                      marginBottom: '16px',
                    },
                    children: '',
                  },
                },
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: '#444444',
                      lineHeight: 1.6,
                      margin: 0,
                      maxWidth: '900px',
                      fontFamily: 'Playfair Display, serif',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom rule + byline
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '1px',
                backgroundColor: '#2C2C2C',
                marginTop: 'auto',
              },
              children: '',
            },
          },
          ...(author
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      paddingTop: '12px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          color: '#555555',
                          fontStyle: 'italic',
                          fontFamily: 'Playfair Display, serif',
                        },
                        children: `By ${author}`,
                      },
                    },
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
