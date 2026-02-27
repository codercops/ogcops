import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-bold-typography',
  name: 'Bold Typography',
  category: 'blog',
  description: 'Oversized bold title filling most of the space with minimal supporting elements',
  tags: ['bold', 'typography', 'minimal', 'large', 'blog'],
  fields: [
    commonFields.title,
    commonFields.author,
    commonFields.category,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    author: '',
    category: '',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 60);
    const author = String(params.author || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 96 },
      { maxLen: 25, size: 80 },
      { maxLen: 40, size: 68 },
      { maxLen: 55, size: 56 },
      { maxLen: 70, size: 48 },
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
          padding: '56px 72px',
          position: 'relative',
        },
        children: [
          // Small top row: category + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              },
              children: [
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
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 500,
                          color: `${textColor}55`,
                        },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
          // Title - takes up most of the space
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                flex: 1,
              },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 900,
                    color: textColor,
                    lineHeight: 1.05,
                    margin: 0,
                    letterSpacing: '-0.03em',
                    textTransform: 'uppercase',
                    maxWidth: '1060px',
                  },
                  children: title,
                },
              },
            },
          },
          // Bottom: accent line + author
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginTop: 'auto',
              },
              children: [
                // Accent line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '48px',
                      height: '4px',
                      backgroundColor: accentColor,
                      borderRadius: '2px',
                    },
                    children: '',
                  },
                },
                ...(author
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 400,
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
          },
        ],
      },
    };
  },
};

export default template;
