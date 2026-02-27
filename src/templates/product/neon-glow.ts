import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-neon-glow',
  name: 'Neon Glow',
  category: 'product',
  description: 'Dark background with neon-colored glowing text and accents',
  tags: ['neon', 'glow', 'dark', 'product', 'futuristic'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Powered by AI', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Your Product',
    description: 'Experience the next level of performance.',
    tagline: 'Powered by AI',
    siteName: '',
    bgColor: '#0a0a0f',
    accentColor: '#00ff88',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0f');
    const accentColor = String(params.accentColor || '#00ff88');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 80 },
      { maxLen: 30, size: 64 },
      { maxLen: 50, size: 52 },
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
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Glow orb top-right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accentColor}30 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Glow orb bottom-left
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '-120px',
                left: '-80px',
                width: '350px',
                height: '350px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Tagline
          ...(tagline
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '8px 24px',
                      border: `1px solid ${accentColor}44`,
                      borderRadius: '100px',
                      marginBottom: '28px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 500,
                          color: accentColor,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        },
                        children: tagline,
                      },
                    },
                  },
                },
              ]
            : []),
          // Title with neon effect
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 900,
                color: '#FFFFFF',
                lineHeight: 1.1,
                margin: 0,
                textAlign: 'center',
                letterSpacing: '-0.02em',
              },
              children: title,
            },
          },
          // Neon underline
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '120px',
                height: '4px',
                background: accentColor,
                borderRadius: '2px',
                marginTop: '24px',
                boxShadow: `0 0 20px ${accentColor}88, 0 0 40px ${accentColor}44`,
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
                      fontSize: '20px',
                      color: 'rgba(255,255,255,0.5)',
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '24px',
                      textAlign: 'center',
                      maxWidth: '700px',
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
                      fontSize: '13px',
                      color: `${accentColor}66`,
                      marginTop: '48px',
                      fontFamily: 'JetBrains Mono, monospace',
                      letterSpacing: '0.05em',
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
