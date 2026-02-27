import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-duotone',
  name: 'Duotone',
  category: 'blog',
  description: 'Two-tone color scheme with angular geometric divider',
  tags: ['duotone', 'geometric', 'modern', 'colorful', 'blog'],
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
    bgColor: '#1B1B3A',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 110) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#1B1B3A');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 56 },
      { maxLen: 50, size: 46 },
      { maxLen: 70, size: 38 },
      { maxLen: 100, size: 32 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          position: 'relative',
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        },
        children: [
          // Left panel (accent color) - 40%
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: '480px',
                height: '630px',
                backgroundColor: accentColor,
                position: 'relative',
              },
              children: [
                // Category text rotated-style (vertical feel via stacking)
                ...(category
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '12px 24px',
                            border: '2px solid rgba(255,255,255,0.4)',
                            borderRadius: '4px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 700,
                                color: 'white',
                                letterSpacing: '0.15em',
                                textTransform: 'uppercase',
                              },
                              children: category,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginTop: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                color: 'rgba(255,255,255,0.7)',
                                letterSpacing: '0.05em',
                              },
                              children: siteName,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Diagonal divider - triangle overlay
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                left: '420px',
                top: 0,
                width: '120px',
                height: '630px',
                background: `linear-gradient(to bottom right, ${accentColor} 50%, transparent 50%)`,
              },
              children: '',
            },
          },
          // Right panel (dark bg) - 60%
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '720px',
                height: '630px',
                backgroundColor: bgColor,
                padding: '60px 60px 60px 80px',
              },
              children: [
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      maxWidth: '560px',
                    },
                    children: title,
                  },
                },
                // Description
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '17px',
                            color: `${textColor}99`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '20px',
                            maxWidth: '520px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Author + date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: '32px',
                    },
                    children: [
                      ...(author
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '15px', fontWeight: 500, color: `${textColor}CC` },
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
                                style: { fontSize: '15px', color: `${textColor}44` },
                                children: '|',
                              },
                            },
                          ]
                        : []),
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '15px', color: `${textColor}77` },
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
          },
        ],
      },
    };
  },
};

export default template;
