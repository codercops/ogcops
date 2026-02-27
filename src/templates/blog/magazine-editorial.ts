import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-magazine-editorial',
  name: 'Magazine Editorial',
  category: 'blog',
  description: 'Serif title with thin rule separators and an elegant editorial feel',
  tags: ['magazine', 'editorial', 'serif', 'elegant', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    date: '',
    category: '',
    siteName: '',
    bgColor: '#FAF8F5',
    accentColor: '#C0392B',
    textColor: '#1A1A1A',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 90);
    const description = params.description ? truncate(String(params.description), 140) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#FAF8F5');
    const accentColor = String(params.accentColor || '#C0392B');
    const textColor = String(params.textColor || '#1A1A1A');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 62 },
      { maxLen: 50, size: 50 },
      { maxLen: 70, size: 42 },
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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 80px',
          position: 'relative',
        },
        children: [
          // Top thin rule
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: '80px',
                right: '80px',
                height: '2px',
                background: textColor,
              },
              children: '',
            },
          },
          // Header row: site name + category
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
                paddingBottom: '20px',
              },
              children: [
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: textColor,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          fontFamily: 'Inter, sans-serif',
                        },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
                category
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '13px',
                          fontWeight: 600,
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
          // Thin rule separator
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '1px',
                background: `${textColor}33`,
                marginBottom: '40px',
              },
              children: '',
            },
          },
          // Title - serif font
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
                    color: textColor,
                    lineHeight: 1.15,
                    margin: 0,
                    fontFamily: 'Playfair Display, serif',
                    maxWidth: '960px',
                  },
                  children: title,
                },
              },
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}99`,
                      lineHeight: 1.6,
                      margin: 0,
                      marginTop: '12px',
                      maxWidth: '800px',
                      fontStyle: 'italic',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom thin rule
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '1px',
                background: `${textColor}33`,
                marginTop: 'auto',
              },
              children: '',
            },
          },
          // Bottom row: author + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '20px',
              },
              children: [
                author
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          fontWeight: 500,
                          color: textColor,
                          fontStyle: 'italic',
                          fontFamily: 'Playfair Display, serif',
                        },
                        children: `By ${author}`,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
                date
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          color: `${textColor}88`,
                          letterSpacing: '0.05em',
                        },
                        children: date,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
