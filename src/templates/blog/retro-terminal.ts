import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-retro-terminal',
  name: 'Retro Terminal',
  category: 'blog',
  description: 'Green-on-black CRT aesthetic with JetBrains Mono, scanline effect, and prompt prefix',
  tags: ['retro', 'terminal', 'crt', 'developer', 'hacker', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    commonFields.siteName,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    date: '',
    category: '',
    siteName: '',
    accentColor: '#00FF41',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 70);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const author = String(params.author || '');
    const date = String(params.date || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const accentColor = String(params.accentColor || '#00FF41');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 42 },
      { maxLen: 45, size: 34 },
      { maxLen: 65, size: 28 },
      { maxLen: 100, size: 22 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0A0A0A',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // CRT scanline overlay - horizontal lines
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1200px',
                height: '630px',
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.03) 2px, rgba(0,255,65,0.03) 4px)',
                pointerEvents: 'none',
              },
              children: '',
            },
          },
          // CRT vignette - darker edges
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1200px',
                height: '630px',
                background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.5) 100%)',
                pointerEvents: 'none',
              },
              children: '',
            },
          },
          // Screen glow
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1200px',
                height: '630px',
                background: `radial-gradient(ellipse at center, ${accentColor}08 0%, transparent 70%)`,
                pointerEvents: 'none',
              },
              children: '',
            },
          },
          // Main content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '1200px',
                height: '630px',
                padding: '48px 60px',
                fontFamily: 'JetBrains Mono, monospace',
                position: 'relative',
              },
              children: [
                // Terminal header bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            color: `${accentColor}88`,
                          },
                          children: siteName ? `${siteName} - terminal` : 'blog - terminal',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            color: `${accentColor}55`,
                          },
                          children: '[session active]',
                        },
                      },
                    ],
                  },
                },
                // Separator line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '100%',
                      height: '1px',
                      backgroundColor: `${accentColor}33`,
                      marginBottom: '32px',
                    },
                    children: '',
                  },
                },
                // Category line
                ...(category
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginBottom: '16px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                color: `${accentColor}99`,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                              },
                              children: `[${category}]`,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Title with prompt prefix
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: 1,
                      alignItems: 'flex-start',
                      gap: '16px',
                    },
                    children: [
                      // Prompt prefix
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 700,
                            color: accentColor,
                            lineHeight: 1.3,
                            flexShrink: 0,
                          },
                          children: '>_',
                        },
                      },
                      // Title text
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 700,
                            color: accentColor,
                            lineHeight: 1.3,
                            margin: 0,
                            maxWidth: '960px',
                            textShadow: `0 0 20px ${accentColor}44`,
                          },
                          children: title,
                        },
                      },
                    ],
                  },
                },
                // Description as comment
                ...(description
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginTop: '8px',
                          },
                          children: {
                            type: 'p',
                            props: {
                              style: {
                                fontSize: '16px',
                                color: `${accentColor}66`,
                                lineHeight: 1.5,
                                margin: 0,
                                maxWidth: '900px',
                              },
                              children: `# ${description}`,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Bottom: author + date
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 'auto',
                      paddingTop: '24px',
                      borderTop: `1px solid ${accentColor}22`,
                      gap: '24px',
                    },
                    children: [
                      ...(author
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '15px',
                                  color: `${accentColor}99`,
                                },
                                children: `@${author.toLowerCase().replace(/\s+/g, '_')}`,
                              },
                            },
                          ]
                        : []),
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: `${accentColor}55`,
                                },
                                children: date,
                              },
                            },
                          ]
                        : []),
                      // Blinking cursor simulation (static block)
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '10px',
                            height: '18px',
                            backgroundColor: accentColor,
                            marginLeft: 'auto',
                            opacity: 0.8,
                          },
                          children: '',
                        },
                      },
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
