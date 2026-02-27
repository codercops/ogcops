import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-clean-corporate',
  name: 'Clean Corporate',
  category: 'saas',
  description: 'Professional blue/white design with logo area and clean headline',
  tags: ['corporate', 'clean', 'professional', 'saas', 'blue', 'business'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'companyName', label: 'Company Name', type: 'text', defaultValue: 'Acme Inc', placeholder: 'Your company', group: 'Brand' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Enterprise Solutions for Modern Teams',
    description: 'Trusted by 500+ companies worldwide to streamline operations.',
    companyName: 'Acme Inc',
    siteName: 'acme.com',
    bgColor: '#ffffff',
    accentColor: '#2563eb',
    textColor: '#0f172a',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Enterprise Solutions for Modern Teams'), 70);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const companyName = String(params.companyName || 'Acme Inc');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#ffffff');
    const accentColor = String(params.accentColor || '#2563eb');
    const textColor = String(params.textColor || '#0f172a');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 50, size: 44 },
      { maxLen: 70, size: 36 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Top accent bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '1200px',
                height: '5px',
                background: accentColor,
              },
              children: [],
            },
          },
          // Header: company name + site
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '28px 60px',
              },
              children: [
                // Company logo area
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      // Logo placeholder square
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            background: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '16px', fontWeight: 800, color: '#FFFFFF' },
                              children: companyName.charAt(0),
                            },
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', fontWeight: 700, color: textColor },
                          children: companyName,
                        },
                      },
                    ],
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}55` },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Main content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '0 60px 60px',
              },
              children: [
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      maxWidth: '900px',
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
                            color: `${textColor}77`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '20px',
                            maxWidth: '750px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // CTA-like element
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginTop: '32px',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '12px 28px',
                          borderRadius: '8px',
                          background: accentColor,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: { fontSize: '16px', fontWeight: 600, color: '#FFFFFF' },
                            children: 'Learn More',
                          },
                        },
                      },
                    },
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
