import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-startup-bold',
  name: 'Startup Bold',
  category: 'saas',
  description: 'Vibrant colors with energetic, bold typography and dynamic feel',
  tags: ['startup', 'bold', 'vibrant', 'saas', 'energetic', 'colorful'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Ship faster, iterate smarter', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    { key: 'secondaryColor', label: 'Secondary Color', type: 'color', defaultValue: '#f97316', group: 'Style' },
  ],
  defaults: {
    title: 'Move Fast, Build Smart',
    description: 'The developer-first platform for startups that scale.',
    tagline: 'Ship it today',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#8b5cf6',
    secondaryColor: '#f97316',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Move Fast, Build Smart'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#8b5cf6');
    const secondaryColor = String(params.secondaryColor || '#f97316');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 76 },
      { maxLen: 35, size: 62 },
      { maxLen: 50, size: 50 },
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
          // Dynamic diagonal stripe - top
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-200px',
                right: '-100px',
                width: '600px',
                height: '600px',
                background: `linear-gradient(45deg, ${accentColor}33 0%, ${secondaryColor}33 100%)`,
                borderRadius: '40px',
                transform: 'rotate(15deg)',
              },
              children: [],
            },
          },
          // Dynamic diagonal stripe - bottom
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '-300px',
                left: '-100px',
                width: '500px',
                height: '500px',
                background: `linear-gradient(45deg, ${secondaryColor}22 0%, ${accentColor}22 100%)`,
                borderRadius: '40px',
                transform: 'rotate(-20deg)',
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
                zIndex: 1,
              },
              children: [
                // Tagline pill
                ...(tagline
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignSelf: 'flex-start',
                            padding: '8px 20px',
                            borderRadius: '100px',
                            background: `linear-gradient(90deg, ${accentColor} 0%, ${secondaryColor} 100%)`,
                            marginBottom: '24px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                                letterSpacing: '0.05em',
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
                      fontWeight: 900,
                      color: '#FFFFFF',
                      lineHeight: 1.05,
                      margin: 0,
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
                            fontSize: '20px',
                            color: 'rgba(255,255,255,0.55)',
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '20px',
                            maxWidth: '700px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Bottom: gradient line + site name
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
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '80px',
                            height: '4px',
                            borderRadius: '2px',
                            background: `linear-gradient(90deg, ${accentColor} 0%, ${secondaryColor} 100%)`,
                          },
                          children: [],
                        },
                      },
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: 'rgba(255,255,255,0.3)' },
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
