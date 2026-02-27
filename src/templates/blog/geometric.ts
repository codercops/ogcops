import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-geometric',
  name: 'Geometric',
  category: 'blog',
  description: 'Decorative background shapes with circles and rectangles for a modern feel',
  tags: ['geometric', 'modern', 'shapes', 'creative', 'blog'],
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
    bgColor: '#0F0F23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0F0F23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 58 },
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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 72px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Decorative circle - top right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-60px',
                right: '-40px',
                width: '260px',
                height: '260px',
                borderRadius: '50%',
                border: `3px solid ${accentColor}33`,
              },
              children: '',
            },
          },
          // Decorative circle - smaller, top right (nested feel)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '20px',
                right: '40px',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: `${accentColor}22`,
              },
              children: '',
            },
          },
          // Decorative rectangle - bottom left
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '-20px',
                left: '-20px',
                width: '180px',
                height: '180px',
                border: `3px solid ${accentColor}22`,
                borderRadius: '8px',
                transform: 'rotate(15deg)',
              },
              children: '',
            },
          },
          // Decorative small square - bottom right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '80px',
                right: '100px',
                width: '40px',
                height: '40px',
                backgroundColor: `${accentColor}33`,
                borderRadius: '4px',
                transform: 'rotate(45deg)',
              },
              children: '',
            },
          },
          // Decorative dots pattern - mid right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '300px',
                right: '50px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                opacity: 0.6,
              },
              children: '',
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '320px',
                right: '72px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                opacity: 0.4,
              },
              children: '',
            },
          },
          // Content layer
          // Top row: category + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px',
                position: 'relative',
              },
              children: [
                category
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '8px 20px',
                          background: `${accentColor}22`,
                          borderRadius: '100px',
                          border: `1px solid ${accentColor}44`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '13px',
                              fontWeight: 600,
                              color: accentColor,
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
                        style: { fontSize: '16px', fontWeight: 500, color: `${textColor}55` },
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
              style: {
                display: 'flex',
                flex: 1,
                position: 'relative',
              },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.2,
                    margin: 0,
                    maxWidth: '900px',
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
                      color: `${textColor}88`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '12px',
                      maxWidth: '750px',
                      position: 'relative' as const,
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom: accent bar + author + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginTop: 'auto',
                paddingTop: '28px',
                position: 'relative',
              },
              children: [
                // Accent bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '40px',
                      height: '3px',
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
                          style: { fontSize: '16px', fontWeight: 500, color: `${textColor}AA` },
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
                          style: { fontSize: '16px', color: `${textColor}33` },
                          children: '/',
                        },
                      },
                    ]
                  : []),
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}66` },
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
