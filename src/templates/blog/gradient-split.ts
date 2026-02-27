import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-gradient-split',
  name: 'Gradient Split',
  category: 'blog',
  description: 'Left 40% gradient panel, right 60% content area',
  tags: ['gradient', 'split', 'modern', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    commonFields.siteName,
    commonFields.accentColor,
    commonFields.bgColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    date: '',
    category: '',
    siteName: '',
    accentColor: '#E07A5F',
    bgColor: '#0a0a0a',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const accentColor = String(params.accentColor || '#E07A5F');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 50, size: 44 },
      { maxLen: 70, size: 36 },
      { maxLen: 100, size: 30 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left gradient panel (40%)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                width: '480px',
                height: '630px',
                background: `linear-gradient(180deg, ${accentColor} 0%, ${bgColor} 100%)`,
                padding: '48px',
              },
              children: [
                ...(category
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.9)',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                          },
                          children: category,
                        },
                      },
                    ]
                  : []),
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: 'rgba(255,255,255,0.6)',
                            marginTop: '12px',
                          },
                          children: date,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right content (60%)
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
                padding: '60px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: 'white',
                      lineHeight: 1.2,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: 'rgba(255,255,255,0.6)',
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '20px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Author + site
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '40px',
                    },
                    children: [
                      ...(author
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.8)' },
                                children: author,
                              },
                            },
                          ]
                        : []),
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: 'rgba(255,255,255,0.4)' },
                                children: siteName,
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
