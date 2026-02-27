import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-editorial',
  name: 'Editorial',
  category: 'newsletter',
  description: 'Elegant serif heading with author byline, editorial style',
  tags: ['newsletter', 'editorial', 'serif', 'elegant'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    { key: 'authorTitle', label: 'Author Title', type: 'text', defaultValue: 'Editor-in-Chief', placeholder: 'Editor-in-Chief', group: 'Content' },
    commonFields.siteName,
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Art of Writing Code That Lasts',
    description: 'On craftsmanship, patience, and the long game of software engineering',
    author: 'Sarah Chen',
    authorTitle: 'Editor-in-Chief',
    siteName: 'The Craft',
    date: 'January 2026',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'The Art of Writing Code That Lasts'), 80);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const author = String(params.author || '');
    const authorTitle = String(params.authorTitle || '');
    const siteName = String(params.siteName || '');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
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
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '80px',
        },
        children: [
          // Site name top
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      fontWeight: 600,
                      color: accentColor,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase' as const,
                      marginBottom: '32px',
                    },
                    children: siteName,
                  },
                },
              ]
            : []),
          // Title in serif
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontStyle: 'italic',
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '24px',
              },
              children: title,
            },
          },
          // Description / subtitle
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}80`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '40px',
                      maxWidth: '800px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Divider
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '60px',
                height: '2px',
                backgroundColor: accentColor,
                marginBottom: '24px',
              },
              children: [],
            },
          },
          // Author byline
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                ...(author
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: textColor,
                          },
                          children: author,
                        },
                      },
                    ]
                  : []),
                ...(authorTitle
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: `${textColor}66`,
                          },
                          children: authorTitle,
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
                            color: `${textColor}44`,
                          },
                          children: `  |  ${date}`,
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
