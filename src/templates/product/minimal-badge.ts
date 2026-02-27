import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-minimal-badge',
  name: 'Minimal Badge',
  category: 'product',
  description: 'Version badge, product name, and a single-line description',
  tags: ['minimal', 'badge', 'version', 'product', 'clean'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'version', label: 'Version', type: 'text', defaultValue: 'v2.0', placeholder: 'v1.0, Beta, etc.', group: 'Content' },
    { key: 'status', label: 'Status', type: 'select', defaultValue: 'stable', options: [{ label: 'Stable', value: 'stable' }, { label: 'Beta', value: 'beta' }, { label: 'Alpha', value: 'alpha' }, { label: 'New', value: 'new' }], group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Product',
    description: 'The fastest way to build modern apps.',
    version: 'v2.0',
    status: 'stable',
    siteName: '',
    bgColor: '#fafafa',
    accentColor: '#18181b',
    textColor: '#18181b',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product'), 40);
    const description = params.description ? truncate(String(params.description), 80) : '';
    const version = String(params.version || 'v2.0');
    const status = String(params.status || 'stable');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#fafafa');
    const accentColor = String(params.accentColor || '#18181b');
    const textColor = String(params.textColor || '#18181b');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 72 },
      { maxLen: 30, size: 60 },
      { maxLen: 40, size: 48 },
    ]);

    const statusColors: Record<string, string> = {
      stable: '#22c55e',
      beta: '#f59e0b',
      alpha: '#ef4444',
      new: '#3b82f6',
    };
    const statusColor = statusColors[status] || '#22c55e';

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
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Version + status badges
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '28px',
              },
              children: [
                // Version badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      background: `${accentColor}10`,
                      border: `1px solid ${accentColor}22`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '15px',
                          fontWeight: 600,
                          color: accentColor,
                          fontFamily: 'JetBrains Mono, monospace',
                        },
                        children: version,
                      },
                    },
                  },
                },
                // Status dot + label
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      background: `${statusColor}12`,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: statusColor,
                          },
                          children: [],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            fontWeight: 500,
                            color: statusColor,
                            textTransform: 'capitalize',
                          },
                          children: status,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                textAlign: 'center',
                letterSpacing: '-0.03em',
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
                      fontSize: '22px',
                      color: `${textColor}77`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '16px',
                      textAlign: 'center',
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
                width: '48px',
                height: '2px',
                background: `${textColor}22`,
                marginTop: '36px',
              },
              children: [],
            },
          },
          // Site name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      color: `${textColor}44`,
                      marginTop: '20px',
                    },
                    children: siteName,
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
