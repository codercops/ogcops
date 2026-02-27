import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-comparison',
  name: 'Comparison',
  category: 'saas',
  description: '"Before vs After" split layout showing transformation',
  tags: ['comparison', 'before', 'after', 'saas', 'versus'],
  fields: [
    commonFields.title,
    { key: 'beforeLabel', label: 'Before Label', type: 'text', defaultValue: 'Before', placeholder: 'Before, Without, Old...', group: 'Content' },
    { key: 'afterLabel', label: 'After Label', type: 'text', defaultValue: 'After', placeholder: 'After, With, New...', group: 'Content' },
    { key: 'beforeItem1', label: 'Before Item 1', type: 'text', defaultValue: 'Manual processes', placeholder: 'Pain point', group: 'Content' },
    { key: 'beforeItem2', label: 'Before Item 2', type: 'text', defaultValue: 'Slow deployments', placeholder: 'Pain point', group: 'Content' },
    { key: 'beforeItem3', label: 'Before Item 3', type: 'text', defaultValue: 'No visibility', placeholder: 'Pain point', group: 'Content' },
    { key: 'afterItem1', label: 'After Item 1', type: 'text', defaultValue: 'Fully automated', placeholder: 'Benefit', group: 'Content' },
    { key: 'afterItem2', label: 'After Item 2', type: 'text', defaultValue: '10x faster shipping', placeholder: 'Benefit', group: 'Content' },
    { key: 'afterItem3', label: 'After Item 3', type: 'text', defaultValue: 'Real-time insights', placeholder: 'Benefit', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'See the Difference',
    beforeLabel: 'Before',
    afterLabel: 'After',
    beforeItem1: 'Manual processes',
    beforeItem2: 'Slow deployments',
    beforeItem3: 'No visibility',
    afterItem1: 'Fully automated',
    afterItem2: '10x faster shipping',
    afterItem3: 'Real-time insights',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#10b981',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'See the Difference'), 50);
    const beforeLabel = String(params.beforeLabel || 'Before');
    const afterLabel = String(params.afterLabel || 'After');
    const beforeItems = [
      String(params.beforeItem1 || 'Manual processes'),
      String(params.beforeItem2 || 'Slow deployments'),
      String(params.beforeItem3 || 'No visibility'),
    ];
    const afterItems = [
      String(params.afterItem1 || 'Fully automated'),
      String(params.afterItem2 || '10x faster shipping'),
      String(params.afterItem3 || 'Real-time insights'),
    ];
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#10b981');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 40 },
      { maxLen: 35, size: 34 },
      { maxLen: 50, size: 28 },
    ]);

    const beforeColor = '#ef4444';

    const listItem = (text: string, isAfter: boolean) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isAfter ? `${accentColor}22` : `${beforeColor}22`,
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '14px',
                    fontWeight: 700,
                    color: isAfter ? accentColor : beforeColor,
                  },
                  children: isAfter ? '+' : '-',
                },
              },
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                color: `${textColor}${isAfter ? 'cc' : '77'}`,
                ...(isAfter ? {} : { textDecoration: 'line-through' }),
              },
              children: truncate(text, 28),
            },
          },
        ],
      },
    });

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
          padding: '48px',
        },
        children: [
          // Title row
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
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
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
          // Comparison columns
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                gap: '24px',
              },
              children: [
                // Before column
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      padding: '32px',
                      borderRadius: '16px',
                      background: `${beforeColor}08`,
                      border: `1px solid ${beforeColor}22`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            fontWeight: 600,
                            color: beforeColor,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '24px',
                          },
                          children: beforeLabel,
                        },
                      },
                      ...beforeItems.map((item) => listItem(item, false)),
                    ],
                  },
                },
                // Divider with arrow
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '60px',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          background: `${accentColor}22`,
                          border: `1px solid ${accentColor}44`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: { fontSize: '18px', color: accentColor, fontWeight: 700 },
                            children: '\u2192',
                          },
                        },
                      },
                    },
                  },
                },
                // After column
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      padding: '32px',
                      borderRadius: '16px',
                      background: `${accentColor}08`,
                      border: `1px solid ${accentColor}22`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '24px',
                          },
                          children: afterLabel,
                        },
                      },
                      ...afterItems.map((item) => listItem(item, true)),
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
