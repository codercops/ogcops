import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-metric-showcase',
  name: 'Metric Showcase',
  category: 'saas',
  description: 'Large hero numbers with supporting headline text',
  tags: ['metrics', 'numbers', 'saas', 'stats', 'data'],
  fields: [
    commonFields.title,
    { key: 'bigNumber', label: 'Big Number', type: 'text', defaultValue: '10M+', placeholder: '10M+, 99.9%, etc.', group: 'Content' },
    { key: 'numberLabel', label: 'Number Label', type: 'text', defaultValue: 'requests processed daily', placeholder: 'What the number means', group: 'Content' },
    { key: 'stat1Value', label: 'Stat 1 Value', type: 'text', defaultValue: '99.9%', placeholder: '99.9%', group: 'Content' },
    { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', defaultValue: 'Uptime', placeholder: 'Label', group: 'Content' },
    { key: 'stat2Value', label: 'Stat 2 Value', type: 'text', defaultValue: '<50ms', placeholder: '<50ms', group: 'Content' },
    { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', defaultValue: 'Latency', placeholder: 'Label', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Built for Scale',
    bigNumber: '10M+',
    numberLabel: 'requests processed daily',
    stat1Value: '99.9%',
    stat1Label: 'Uptime',
    stat2Value: '<50ms',
    stat2Label: 'Latency',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#22c55e',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Built for Scale'), 50);
    const bigNumber = String(params.bigNumber || '10M+');
    const numberLabel = String(params.numberLabel || 'requests processed daily');
    const stat1Value = String(params.stat1Value || '99.9%');
    const stat1Label = String(params.stat1Label || 'Uptime');
    const stat2Value = String(params.stat2Value || '<50ms');
    const stat2Label = String(params.stat2Label || 'Latency');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#22c55e');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 36 },
      { maxLen: 40, size: 30 },
      { maxLen: 50, size: 26 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(160deg, ${bgColor} 0%, #111118 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top: title + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: `${textColor}88`,
                      lineHeight: 1.2,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44` },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Big number section
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '120px',
                      fontWeight: 900,
                      color: accentColor,
                      lineHeight: 1,
                      letterSpacing: '-0.04em',
                      fontFamily: 'JetBrains Mono, monospace',
                    },
                    children: bigNumber,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: 400,
                      color: `${textColor}66`,
                      marginTop: '12px',
                    },
                    children: numberLabel,
                  },
                },
              ],
            },
          },
          // Bottom stats row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '48px',
                paddingTop: '32px',
                borderTop: `1px solid ${textColor}12`,
              },
              children: [
                // Stat 1
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '32px',
                            fontWeight: 700,
                            color: textColor,
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: stat1Value,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}55`, textTransform: 'uppercase', letterSpacing: '0.05em' },
                          children: stat1Label,
                        },
                      },
                    ],
                  },
                },
                // Stat 2
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '32px',
                            fontWeight: 700,
                            color: textColor,
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: stat2Value,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}55`, textTransform: 'uppercase', letterSpacing: '0.05em' },
                          children: stat2Label,
                        },
                      },
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
