import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-glassmorphism',
  name: 'Glassmorphism',
  category: 'product',
  description: 'Frosted glass card floating over a vibrant gradient background',
  tags: ['glass', 'frosted', 'product', 'modern', 'gradient'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Beautiful & fast', group: 'Content' },
    commonFields.siteName,
    commonFields.accentColor,
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', defaultValue: '#6366f1', group: 'Style' },
  ],
  defaults: {
    title: 'Your Product Name',
    description: 'A beautifully crafted experience for modern teams.',
    tagline: 'Beautiful & Fast',
    siteName: '',
    accentColor: '#ec4899',
    secondaryColor: '#6366f1',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product Name'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const accentColor = String(params.accentColor || '#ec4899');
    const secondaryColor = String(params.secondaryColor || '#6366f1');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 56 },
      { maxLen: 40, size: 46 },
      { maxLen: 60, size: 38 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${accentColor} 0%, ${secondaryColor} 50%, #0f172a 100%)`,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Background orbs
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-60px',
                right: '100px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `${accentColor}55`,
              },
              children: [],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '-80px',
                left: '80px',
                width: '250px',
                height: '250px',
                borderRadius: '50%',
                background: `${secondaryColor}55`,
              },
              children: [],
            },
          },
          // Glass card
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '900px',
                padding: '56px',
                borderRadius: '24px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(20px)',
              },
              children: [
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: 'rgba(255,255,255,0.7)',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '20px',
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
                      color: '#FFFFFF',
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
                            fontSize: '20px',
                            color: 'rgba(255,255,255,0.6)',
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
                // Bottom: line + site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '36px',
                      paddingTop: '24px',
                      borderTop: '1px solid rgba(255,255,255,0.15)',
                    },
                    children: [
                      // Three dots
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            gap: '8px',
                          },
                          children: [
                            { type: 'div', props: { style: { display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.4)' } } },
                            { type: 'div', props: { style: { display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.25)' } } },
                            { type: 'div', props: { style: { display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)' } } },
                          ],
                        },
                      },
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: 'rgba(255,255,255,0.4)',
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
