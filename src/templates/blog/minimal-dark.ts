import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-minimal-dark',
  name: 'Minimal Dark',
  category: 'blog',
  description: 'Clean dark background with white title and accent category badge',
  tags: ['minimal', 'dark', 'clean', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    date: '',
    category: '',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 64 },
      { maxLen: 50, size: 52 },
      { maxLen: 70, size: 44 },
      { maxLen: 100, size: 36 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top row: category badge + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px',
              },
              children: [
                category
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '8px 20px',
                          background: accentColor,
                          borderRadius: '100px',
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '14px',
                              fontWeight: 600,
                              color: 'white',
                              letterSpacing: '0.08em',
                              textTransform: 'uppercase',
                            },
                            children: category,
                          },
                        },
                      },
                    }
                  : { type: 'div', props: { children: '' } },
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '18px', fontWeight: 500, color: 'rgba(255,255,255,0.5)' },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
          // Title
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
                    color: 'white',
                    lineHeight: 1.2,
                    margin: 0,
                    maxWidth: '1000px',
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
                      fontSize: '20px',
                      color: 'rgba(255,255,255,0.6)',
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '16px',
                      maxWidth: '800px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom: author + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: 'auto',
                paddingTop: '32px',
              },
              children: [
                ...(author
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' },
                          children: author,
                        },
                      },
                    ]
                  : []),
                ...(author && date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: 'rgba(255,255,255,0.3)' },
                          children: '·',
                        },
                      },
                    ]
                  : []),
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: 'rgba(255,255,255,0.5)' },
                          children: date,
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
