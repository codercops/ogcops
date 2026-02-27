import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-split-screen',
  name: 'Split Screen',
  category: 'product',
  description: 'Left side text content, right side screenshot/image area',
  tags: ['split', 'screenshot', 'product', 'showcase'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Built for teams', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Product Name',
    description: 'Build faster, ship smarter with our modern toolkit.',
    tagline: 'Built for teams',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#3b82f6',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product Name'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#3b82f6');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 56 },
      { maxLen: 35, size: 46 },
      { maxLen: 50, size: 38 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left text area (50%)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '560px',
                height: '630px',
                padding: '60px',
              },
              children: [
                // Tagline badge
                ...(tagline
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginBottom: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: accentColor,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                              },
                              children: tagline,
                            },
                          },
                        },
                      },
                    ]
                  : []),
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
                            color: `${textColor}88`,
                            lineHeight: 1.6,
                            margin: 0,
                            marginTop: '16px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            color: `${textColor}55`,
                            marginTop: '32px',
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right screenshot area (50%)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '640px',
                height: '630px',
                padding: '40px',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '520px',
                    height: '360px',
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${accentColor}22 0%, ${accentColor}08 100%)`,
                    border: `1px solid ${accentColor}33`,
                    overflow: 'hidden',
                  },
                  children: [
                    // Window chrome
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '14px 18px',
                          borderBottom: `1px solid ${accentColor}22`,
                        },
                        children: [
                          { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' } } },
                          { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' } } },
                          { type: 'div', props: { style: { width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' } } },
                        ],
                      },
                    },
                    // Content area
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          flex: 1,
                          padding: '24px',
                          gap: '12px',
                        },
                        children: [
                          { type: 'div', props: { style: { display: 'flex', width: '60%', height: '16px', borderRadius: '4px', background: `${accentColor}20` } } },
                          { type: 'div', props: { style: { display: 'flex', width: '80%', height: '16px', borderRadius: '4px', background: `${accentColor}15` } } },
                          { type: 'div', props: { style: { display: 'flex', width: '45%', height: '16px', borderRadius: '4px', background: `${accentColor}12` } } },
                          { type: 'div', props: { style: { display: 'flex', width: '100%', height: '80px', borderRadius: '8px', background: `${accentColor}10`, marginTop: '12px' } } },
                        ],
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
