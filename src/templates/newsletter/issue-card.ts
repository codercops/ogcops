import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-issue-card',
  name: 'Issue Card',
  category: 'newsletter',
  description: 'Issue number badge with headline and preview text',
  tags: ['newsletter', 'issue', 'card', 'badge'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'issueNumber', label: 'Issue Number', type: 'text', defaultValue: '42', placeholder: '42', group: 'Content' },
    commonFields.siteName,
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'This Week in Tech',
    description: 'A curated roundup of the most interesting stories, tools, and insights from the tech world.',
    issueNumber: '42',
    siteName: 'The Weekly Byte',
    date: 'Jan 15, 2026',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'This Week in Tech'), 80);
    const description = params.description ? truncate(String(params.description), 140) : '';
    const issueNumber = String(params.issueNumber || '42');
    const siteName = String(params.siteName || '');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
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
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top row: issue badge + site name
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
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 20px',
                            backgroundColor: accentColor,
                            borderRadius: '100px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                letterSpacing: '0.05em',
                              },
                              children: `Issue #${issueNumber}`,
                            },
                          },
                        },
                      },
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: `${textColor}66`,
                                },
                                children: date,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 500,
                            color: `${textColor}80`,
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1, alignItems: 'center' },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.2,
                    margin: 0,
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
                      color: `${textColor}99`,
                      lineHeight: 1.6,
                      margin: 0,
                      maxWidth: '900px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom accent bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '80px',
                height: '4px',
                backgroundColor: accentColor,
                borderRadius: '2px',
                marginTop: '40px',
              },
              children: [],
            },
          },
        ],
      },
    };
  },
};

export default template;
