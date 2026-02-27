import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-minimal-number',
  name: 'Minimal Number',
  category: 'newsletter',
  description: 'Giant issue number with title below, minimalist design',
  tags: ['newsletter', 'minimal', 'number', 'issue'],
  fields: [
    commonFields.title,
    { key: 'issueNumber', label: 'Issue Number', type: 'text', defaultValue: '127', placeholder: '127', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Future of Open Source',
    issueNumber: '127',
    siteName: 'Open Source Weekly',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'The Future of Open Source'), 70);
    const issueNumber = String(params.issueNumber || '127');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 40 },
      { maxLen: 50, size: 34 },
      { maxLen: 70, size: 28 },
      { maxLen: 100, size: 24 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Site name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      fontWeight: 600,
                      color: `${textColor}66`,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase' as const,
                      marginBottom: '24px',
                    },
                    children: siteName,
                  },
                },
              ]
            : []),
          // Giant number
          {
            type: 'span',
            props: {
              style: {
                fontSize: '200px',
                fontWeight: 900,
                color: `${accentColor}22`,
                lineHeight: 0.9,
                fontFamily: 'JetBrains Mono, monospace',
                position: 'relative',
              },
              children: `#${issueNumber}`,
            },
          },
          // Title below
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 600,
                color: textColor,
                lineHeight: 1.3,
                margin: 0,
                marginTop: '24px',
                textAlign: 'center',
              },
              children: title,
            },
          },
          // Accent dot
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: accentColor,
                marginTop: '32px',
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
