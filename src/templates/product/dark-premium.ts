import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-dark-premium',
  name: 'Dark Premium',
  category: 'product',
  description: 'Luxury dark design with gold or silver accent lines and refined typography',
  tags: ['dark', 'premium', 'luxury', 'product', 'elegant', 'gold'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Premium quality', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Your Product',
    description: 'Crafted with precision for those who demand the best.',
    tagline: 'Premium Edition',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#d4a574',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#d4a574');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 72 },
      { maxLen: 30, size: 60 },
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
          fontFamily: 'Playfair Display, serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Subtle corner lines - top left
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '40px',
                left: '40px',
                width: '80px',
                height: '80px',
                borderTop: `1px solid ${accentColor}44`,
                borderLeft: `1px solid ${accentColor}44`,
              },
              children: [],
            },
          },
          // Corner lines - bottom right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '40px',
                right: '40px',
                width: '80px',
                height: '80px',
                borderBottom: `1px solid ${accentColor}44`,
                borderRight: `1px solid ${accentColor}44`,
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
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '80px',
              },
              children: [
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            fontWeight: 400,
                            color: accentColor,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            fontFamily: 'Inter, sans-serif',
                            marginBottom: '24px',
                          },
                          children: tagline,
                        },
                      },
                    ]
                  : []),
                // Accent line above title
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '40px',
                      height: '1px',
                      background: accentColor,
                      marginBottom: '32px',
                    },
                    children: [],
                  },
                },
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: '#FFFFFF',
                      lineHeight: 1.15,
                      margin: 0,
                      textAlign: 'center',
                      letterSpacing: '-0.01em',
                    },
                    children: title,
                  },
                },
                // Accent line below title
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '40px',
                      height: '1px',
                      background: accentColor,
                      marginTop: '32px',
                    },
                    children: [],
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
                            color: 'rgba(255,255,255,0.45)',
                            lineHeight: 1.6,
                            margin: 0,
                            marginTop: '28px',
                            textAlign: 'center',
                            maxWidth: '650px',
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 300,
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
                            fontSize: '12px',
                            color: `${accentColor}66`,
                            marginTop: '48px',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            fontFamily: 'Inter, sans-serif',
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
    };
  },
};

export default template;
