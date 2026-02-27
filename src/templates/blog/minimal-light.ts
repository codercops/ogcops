import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-minimal-light',
  name: 'Minimal Light',
  category: 'blog',
  description: 'White background with dark text and thin top accent line',
  tags: ['minimal', 'light', 'clean', 'blog'],
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
    accentColor: '#E07A5F',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
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
          backgroundColor: '#FAFAF9',
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
          position: 'relative',
        },
        children: [
          // Top accent line
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: accentColor,
              },
              children: '',
            },
          },
          // Category + site name
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
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: accentColor,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        },
                        children: category,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '18px', fontWeight: 500, color: '#A8A29E' },
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
                    color: '#0C0A09',
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
                      color: '#57534E',
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
                borderTop: '1px solid #E7E5E4',
              },
              children: [
                ...(author
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', fontWeight: 500, color: '#292524' },
                          children: author,
                        },
                      },
                    ]
                  : []),
                ...(author && date
                  ? [{ type: 'span', props: { style: { fontSize: '18px', color: '#D6D3D1' }, children: '·' } }]
                  : []),
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: { style: { fontSize: '18px', color: '#A8A29E' }, children: date },
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
