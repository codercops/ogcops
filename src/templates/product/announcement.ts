import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-announcement',
  name: 'Announcement',
  category: 'product',
  description: '"Introducing..." banner with launch date and product details',
  tags: ['announcement', 'launch', 'product', 'introducing', 'banner'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'prefix', label: 'Prefix Text', type: 'text', defaultValue: 'Introducing', placeholder: 'Introducing, Announcing, Meet...', group: 'Content' },
    { key: 'launchDate', label: 'Launch Date', type: 'text', defaultValue: '', placeholder: 'March 2026', group: 'Content' },
    { key: 'version', label: 'Version', type: 'text', defaultValue: '', placeholder: 'v1.0', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Product Name',
    description: 'The all-in-one platform that changes everything.',
    prefix: 'Introducing',
    launchDate: 'March 2026',
    version: 'v1.0',
    siteName: '',
    bgColor: '#0c0c1d',
    accentColor: '#f59e0b',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product Name'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const prefix = String(params.prefix || 'Introducing');
    const launchDate = String(params.launchDate || '');
    const version = String(params.version || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0c0c1d');
    const accentColor = String(params.accentColor || '#f59e0b');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 72 },
      { maxLen: 35, size: 60 },
      { maxLen: 50, size: 48 },
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
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Top accent stripe
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '1200px',
                height: '6px',
                background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColor}44 100%)`,
              },
              children: [],
            },
          },
          // Decorative corner accent
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '0',
                right: '0',
                width: '400px',
                height: '400px',
                background: `radial-gradient(circle at top right, ${accentColor}15 0%, transparent 60%)`,
              },
              children: [],
            },
          },
          // Content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
              },
              children: [
                // Top row: prefix + version badge + date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '20px',
                    },
                    children: [
                      // Prefix text
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 500,
                            color: accentColor,
                            fontStyle: 'italic',
                          },
                          children: prefix,
                        },
                      },
                      // Version badge
                      ...(version
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  padding: '4px 14px',
                                  borderRadius: '100px',
                                  background: `${accentColor}22`,
                                  border: `1px solid ${accentColor}44`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '13px',
                                      fontWeight: 600,
                                      color: accentColor,
                                      fontFamily: 'JetBrains Mono, monospace',
                                    },
                                    children: version,
                                  },
                                },
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 900,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      fontFamily: 'Playfair Display, serif',
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
                            marginTop: '20px',
                            maxWidth: '800px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Bottom: launch date + site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '40px',
                    },
                    children: [
                      ...(launchDate
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
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
                                        background: accentColor,
                                      },
                                      children: [],
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '16px',
                                        fontWeight: 500,
                                        color: `${textColor}66`,
                                      },
                                      children: `Launching ${launchDate}`,
                                    },
                                  },
                                ],
                              },
                            },
                          ]
                        : []),
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
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
