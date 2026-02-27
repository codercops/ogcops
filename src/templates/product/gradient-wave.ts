import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-gradient-wave',
  name: 'Gradient Wave',
  category: 'product',
  description: 'Curved gradient wave dividing content into two zones',
  tags: ['gradient', 'wave', 'product', 'modern', 'creative'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Next-gen platform', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Product Name',
    description: 'Reimagine the way you build and ship products.',
    tagline: 'Next Generation',
    siteName: '',
    bgColor: '#1a1a2e',
    accentColor: '#e94560',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product Name'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#1a1a2e');
    const accentColor = String(params.accentColor || '#e94560');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 68 },
      { maxLen: 40, size: 56 },
      { maxLen: 60, size: 44 },
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
          // Wave gradient overlay - top band
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '1200px',
                height: '280px',
                background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}88 50%, transparent 100%)`,
                borderRadius: '0 0 50% 0',
              },
              children: [],
            },
          },
          // Second wave layer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '800px',
                height: '220px',
                background: `linear-gradient(120deg, ${accentColor}cc 0%, transparent 100%)`,
                borderRadius: '0 0 60% 0',
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
                justifyContent: 'flex-end',
                flex: 1,
                padding: '60px',
                zIndex: 1,
              },
              children: [
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                          },
                          children: tagline,
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
                      lineHeight: 1.1,
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
                            color: `${textColor}88`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '16px',
                            maxWidth: '700px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Bottom bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '32px',
                    },
                    children: [
                      // Accent line
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '60px',
                            height: '4px',
                            background: accentColor,
                            borderRadius: '2px',
                          },
                          children: [],
                        },
                      },
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: `${textColor}55`,
                                },
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
