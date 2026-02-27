import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-hackathon',
  name: 'Hackathon',
  category: 'event',
  description: 'Energetic hackathon card with code symbols, prize info, and bold gradient',
  tags: ['hackathon', 'coding', 'competition', 'energetic', 'event'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'prizes', label: 'Prizes', type: 'text' as const, defaultValue: '', placeholder: '$10,000 in prizes', group: 'Content' as const },
    commonFields.date,
    { key: 'duration', label: 'Duration', type: 'text' as const, defaultValue: '', placeholder: '48 hours', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'Online / City', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'HackFest 2026',
    description: 'Build something amazing in 48 hours',
    prizes: '$10,000 in prizes',
    date: 'Jun 14–16, 2026',
    duration: '48 hours',
    location: 'Global / Online',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#00D4FF',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'HackFest 2026'), 50);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const prizes = String(params.prizes || '');
    const date = String(params.date || '');
    const duration = String(params.duration || '');
    const location = String(params.location || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#00D4FF');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 80 },
      { maxLen: 25, size: 64 },
      { maxLen: 40, size: 52 },
      { maxLen: 60, size: 42 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #0d1b2a 50%, #1b2838 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Decorative code symbols (background)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                right: '60px',
                top: '40px',
                fontSize: '180px',
                fontWeight: 800,
                color: `${accentColor}10`,
                fontFamily: 'JetBrains Mono, monospace',
              },
              children: '</>',
            },
          },
          // Top: HACKATHON badge + duration
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '8px 20px',
                      background: `linear-gradient(135deg, ${accentColor}, #7B61FF)`,
                      borderRadius: '100px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                        },
                        children: 'HACKATHON',
                      },
                    },
                  },
                },
                ...(duration
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: `${textColor}88`,
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: duration,
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
                      lineHeight: 1.4,
                      margin: 0,
                      marginTop: '16px',
                      maxWidth: '700px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Prizes highlight
          ...(prizes
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginTop: '28px',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '12px 28px',
                          background: `${accentColor}15`,
                          borderRadius: '12px',
                          border: `2px solid ${accentColor}44`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '24px',
                              fontWeight: 700,
                              color: accentColor,
                            },
                            children: prizes,
                          },
                        },
                      },
                    },
                  },
                },
              ]
            : []),
          // Bottom: date + location + siteName
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
                paddingTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', fontWeight: 600, color: `${textColor}aa` },
                                children: date,
                              },
                            },
                          ]
                        : []),
                      ...(date && location
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', color: `${textColor}33` },
                                children: '·',
                              },
                            },
                          ]
                        : []),
                      ...(location
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', color: `${textColor}77` },
                                children: location,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '16px', color: `${textColor}44` },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
