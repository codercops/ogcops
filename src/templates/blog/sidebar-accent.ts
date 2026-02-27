import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-sidebar-accent',
  name: 'Sidebar Accent',
  category: 'blog',
  description: 'Left 8px accent bar with clean padded layout',
  tags: ['sidebar', 'accent', 'clean', 'modern', 'blog'],
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
    bgColor: '#FFFFFF',
    accentColor: '#E07A5F',
    textColor: '#1A1A1A',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 80);
    const description = params.description ? truncate(String(params.description), 130) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#FFFFFF');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#1A1A1A');
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
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '8px',
                height: '630px',
                background: `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}88 100%)`,
              },
              children: '',
            },
          },
          // Content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '56px 72px',
              },
              children: [
                // Top row: category + site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '36px',
                    },
                    children: [
                      category
                        ? {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                padding: '6px 16px',
                                borderRadius: '4px',
                                border: `2px solid ${accentColor}`,
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
                              style: {
                                fontSize: '16px',
                                fontWeight: 500,
                                color: `${textColor}66`,
                              },
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
                          color: textColor,
                          lineHeight: 1.2,
                          margin: 0,
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
                            fontSize: '19px',
                            color: `${textColor}88`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '12px',
                            maxWidth: '800px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Bottom: author + date with accent dot separator
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: 'auto',
                      paddingTop: '28px',
                    },
                    children: [
                      // Small accent square
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '6px',
                            height: '6px',
                            backgroundColor: accentColor,
                            borderRadius: '1px',
                          },
                          children: '',
                        },
                      },
                      ...(author
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 500, color: textColor },
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
                                style: { fontSize: '16px', color: `${textColor}44` },
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
                                style: { fontSize: '16px', color: `${textColor}77` },
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
