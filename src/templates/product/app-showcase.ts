import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-app-showcase',
  name: 'App Showcase',
  category: 'product',
  description: 'Phone/laptop mockup frame showcasing your app with text alongside',
  tags: ['app', 'showcase', 'mockup', 'product', 'mobile'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'platform', label: 'Platform', type: 'select', defaultValue: 'mobile', options: [{ label: 'Mobile', value: 'mobile' }, { label: 'Desktop', value: 'desktop' }], group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your App Name',
    description: 'Available on all platforms. Download now.',
    platform: 'mobile',
    siteName: '',
    bgColor: '#111827',
    accentColor: '#8b5cf6',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your App Name'), 40);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const platform = String(params.platform || 'mobile');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#111827');
    const accentColor = String(params.accentColor || '#8b5cf6');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 56 },
      { maxLen: 30, size: 46 },
      { maxLen: 40, size: 38 },
    ]);
    const isMobile = platform === 'mobile';

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(160deg, ${bgColor} 0%, #0f0f1a 100%)`,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        },
        children: [
          // Left text content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '600px',
                padding: '60px',
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
                      lineHeight: 1.15,
                      margin: 0,
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
                            fontSize: '18px',
                            color: `${textColor}77`,
                            lineHeight: 1.6,
                            margin: 0,
                            marginTop: '16px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // App store badges placeholder
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '12px',
                      marginTop: '32px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            background: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '14px', fontWeight: 600, color: '#FFFFFF' },
                              children: isMobile ? 'App Store' : 'Download',
                            },
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: `1px solid ${textColor}33`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '14px', fontWeight: 500, color: `${textColor}88` },
                              children: isMobile ? 'Google Play' : 'Web App',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '13px', color: `${textColor}44`, marginTop: '28px' },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: device mockup
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '600px',
                height: '630px',
              },
              children: isMobile
                ? {
                    // Phone frame
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        width: '220px',
                        height: '440px',
                        borderRadius: '32px',
                        border: `3px solid ${textColor}33`,
                        background: `linear-gradient(180deg, ${accentColor}18 0%, ${bgColor} 100%)`,
                        padding: '16px',
                        overflow: 'hidden',
                      },
                      children: [
                        // Notch
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignSelf: 'center',
                              width: '80px',
                              height: '20px',
                              borderRadius: '10px',
                              background: bgColor,
                              marginBottom: '16px',
                            },
                            children: [],
                          },
                        },
                        // Screen content lines
                        { type: 'div', props: { style: { display: 'flex', width: '70%', height: '12px', borderRadius: '4px', background: `${accentColor}25`, marginBottom: '10px' } } },
                        { type: 'div', props: { style: { display: 'flex', width: '90%', height: '12px', borderRadius: '4px', background: `${accentColor}18`, marginBottom: '10px' } } },
                        { type: 'div', props: { style: { display: 'flex', width: '100%', height: '60px', borderRadius: '8px', background: `${accentColor}12`, marginBottom: '10px' } } },
                        { type: 'div', props: { style: { display: 'flex', width: '50%', height: '12px', borderRadius: '4px', background: `${accentColor}15`, marginBottom: '10px' } } },
                        { type: 'div', props: { style: { display: 'flex', width: '100%', height: '80px', borderRadius: '8px', background: `${accentColor}10` } } },
                      ],
                    },
                  }
                : {
                    // Laptop frame
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      },
                      children: [
                        // Screen
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              flexDirection: 'column',
                              width: '420px',
                              height: '280px',
                              borderRadius: '12px 12px 0 0',
                              border: `3px solid ${textColor}33`,
                              borderBottom: 'none',
                              background: `linear-gradient(180deg, ${accentColor}12 0%, ${bgColor} 100%)`,
                              padding: '20px',
                              gap: '8px',
                            },
                            children: [
                              { type: 'div', props: { style: { display: 'flex', width: '50%', height: '10px', borderRadius: '3px', background: `${accentColor}22` } } },
                              { type: 'div', props: { style: { display: 'flex', width: '75%', height: '10px', borderRadius: '3px', background: `${accentColor}16` } } },
                              { type: 'div', props: { style: { display: 'flex', width: '100%', height: '100px', borderRadius: '6px', background: `${accentColor}10`, marginTop: '8px' } } },
                            ],
                          },
                        },
                        // Base
                        {
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              width: '480px',
                              height: '14px',
                              borderRadius: '0 0 4px 4px',
                              background: `${textColor}22`,
                            },
                            children: [],
                          },
                        },
                      ],
                    },
                  },
            },
          },
        ],
      },
    };
  },
};

export default template;
