import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-newspaper-fold',
  name: 'Newspaper Fold',
  category: 'newsletter',
  description: 'Above-the-fold newspaper layout with masthead and columns',
  tags: ['newsletter', 'newspaper', 'editorial', 'classic'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'headline2', label: 'Secondary Headline', type: 'text', defaultValue: 'Industry Update', placeholder: 'Second story', group: 'Content' },
    commonFields.siteName,
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Breaking: AI Agents Now Write Production Code',
    description: 'A deep dive into the tools, workflows, and implications of AI-assisted development in enterprise teams.',
    headline2: 'Open Source Funding Reaches Record High',
    siteName: 'THE DAILY DEV',
    date: 'Wednesday, January 15, 2026',
    bgColor: '#FDF8F0',
    accentColor: '#1a1a1a',
    textColor: '#1a1a1a',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Breaking: AI Agents Now Write Production Code'), 80);
    const description = params.description ? truncate(String(params.description), 140) : '';
    const headline2 = String(params.headline2 || '');
    const siteName = String(params.siteName || 'THE DAILY DEV');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#FDF8F0');
    const accentColor = String(params.accentColor || '#1a1a1a');
    const textColor = String(params.textColor || '#1a1a1a');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 48 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
      { maxLen: 100, size: 28 },
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
          padding: '48px 60px',
        },
        children: [
          // Masthead
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderBottom: `3px solid ${accentColor}`,
                paddingBottom: '16px',
                marginBottom: '8px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '42px',
                      fontWeight: 900,
                      fontFamily: 'Playfair Display, serif',
                      color: textColor,
                      letterSpacing: '0.08em',
                    },
                    children: siteName,
                  },
                },
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '12px',
                            color: `${textColor}88`,
                            marginTop: '4px',
                            letterSpacing: '0.05em',
                          },
                          children: date,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Thin rule
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '1px',
                backgroundColor: `${accentColor}44`,
                marginBottom: '32px',
              },
              children: [],
            },
          },
          // Main headline
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '20px',
              },
              children: title,
            },
          },
          // Two-column area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                gap: '32px',
              },
              children: [
                // Left column - description
                ...(description
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flex: 1,
                          },
                          children: {
                            type: 'p',
                            props: {
                              style: {
                                fontSize: '18px',
                                color: `${textColor}AA`,
                                lineHeight: 1.7,
                                margin: 0,
                              },
                              children: description,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Right column - secondary headline
                ...(headline2
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            borderLeft: `1px solid ${accentColor}33`,
                            paddingLeft: '32px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '12px',
                                  fontWeight: 600,
                                  color: `${textColor}88`,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase' as const,
                                  marginBottom: '12px',
                                },
                                children: 'ALSO IN THIS ISSUE',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '24px',
                                  fontFamily: 'Playfair Display, serif',
                                  fontWeight: 600,
                                  color: textColor,
                                  lineHeight: 1.3,
                                },
                                children: headline2,
                              },
                            },
                          ],
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
