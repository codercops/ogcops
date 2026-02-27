import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-photo-overlay',
  name: 'Photo Overlay',
  category: 'blog',
  description: 'Full-bleed background image with dark gradient overlay and text on top',
  tags: ['photo', 'overlay', 'image', 'gradient', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    commonFields.siteName,
    commonFields.accentColor,
    {
      key: 'imageUrl',
      label: 'Background Image URL',
      type: 'image' as const,
      defaultValue: '',
      placeholder: 'https://example.com/image.jpg',
      group: 'Style' as const,
    },
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    date: '',
    category: '',
    siteName: '',
    accentColor: '#E07A5F',
    imageUrl: '',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const accentColor = String(params.accentColor || '#E07A5F');
    const imageUrl = String(params.imageUrl || '');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 64 },
      { maxLen: 50, size: 52 },
      { maxLen: 70, size: 44 },
      { maxLen: 100, size: 36 },
    ]);

    const backgroundStyle = imageUrl
      ? {
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }
      : {
          background: `linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)`,
        };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          position: 'relative',
          fontFamily: 'Inter, sans-serif',
          ...backgroundStyle,
        },
        children: [
          // Background image (if provided)
          ...(imageUrl
            ? [
                {
                  type: 'img',
                  props: {
                    src: imageUrl,
                    style: {
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '1200px',
                      height: '630px',
                      objectFit: 'cover',
                    },
                  },
                },
              ]
            : []),
          // Dark gradient overlay
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1200px',
                height: '630px',
                background: imageUrl
                  ? 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.92) 100%)'
                  : 'transparent',
              },
              children: '',
            },
          },
          // Content layer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                width: '1200px',
                height: '630px',
                padding: '60px',
                position: 'relative',
              },
              children: [
                // Top row: site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      position: 'absolute',
                      top: '40px',
                      left: '60px',
                      right: '60px',
                    },
                    children: [
                      siteName
                        ? {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'rgba(255,255,255,0.8)',
                                letterSpacing: '0.05em',
                              },
                              children: siteName,
                            },
                          }
                        : { type: 'div', props: { children: '' } },
                      { type: 'div', props: { children: '' } },
                    ],
                  },
                },
                // Category badge
                ...(category
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginBottom: '20px',
                          },
                          children: {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                padding: '6px 16px',
                                background: accentColor,
                                borderRadius: '4px',
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: {
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: 'white',
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                  },
                                  children: category,
                                },
                              },
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: 'white',
                      lineHeight: 1.2,
                      margin: 0,
                      maxWidth: '1000px',
                      textShadow: '0 2px 20px rgba(0,0,0,0.4)',
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
                            fontSize: '20px',
                            color: 'rgba(255,255,255,0.75)',
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
                // Author + date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '24px',
                    },
                    children: [
                      ...(author
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.9)' },
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
                                style: { fontSize: '16px', color: 'rgba(255,255,255,0.4)' },
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
                                style: { fontSize: '16px', color: 'rgba(255,255,255,0.6)' },
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
