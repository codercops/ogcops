import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-matrix',
  name: 'Matrix',
  category: 'github',
  description: 'Matrix-style falling code background with centered text overlay',
  tags: ['github', 'matrix', 'code', 'hacker', 'cyber', 'dark'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Follow the code...', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'My Project',
    description: 'Decode the future of open source development.',
    tagline: 'Open Source',
    siteName: '',
    bgColor: '#000000',
    accentColor: '#00ff41',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'My Project'), 40);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#000000');
    const accentColor = String(params.accentColor || '#00ff41');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 72 },
      { maxLen: 30, size: 58 },
      { maxLen: 40, size: 46 },
    ]);

    // Generate matrix columns
    const matrixChars = '01{}[]<>=>+-/*&|!?@#$%^~:;'.split('');
    const columns: any[] = [];
    for (let col = 0; col < 30; col++) {
      const chars: any[] = [];
      const colHeight = 8 + (col * 3) % 7; // varied heights
      for (let row = 0; row < colHeight; row++) {
        const charIndex = (col * 7 + row * 13) % matrixChars.length;
        const opacity = Math.max(0.04, 0.35 - row * 0.03);
        chars.push({
          type: 'span',
          props: {
            style: {
              fontSize: '14px',
              fontFamily: 'JetBrains Mono, monospace',
              color: accentColor,
              opacity,
              lineHeight: '18px',
            },
            children: matrixChars[charIndex],
          },
        });
      }
      columns.push({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '38px',
          },
          children: chars,
        },
      });
    }

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
          // Matrix background columns
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '0',
                left: '20px',
                width: '1160px',
                height: '630px',
              },
              children: columns,
            },
          },
          // Dark center overlay for readability
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                width: '1200px',
                height: '630px',
                background: `radial-gradient(ellipse at center, ${bgColor}ee 0%, ${bgColor}aa 50%, ${bgColor}66 100%)`,
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
                zIndex: 1,
                padding: '60px',
              },
              children: [
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 18px',
                            borderRadius: '4px',
                            border: `1px solid ${accentColor}44`,
                            marginBottom: '24px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '13px',
                                fontWeight: 600,
                                color: accentColor,
                                fontFamily: 'JetBrains Mono, monospace',
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
                // Title
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
                      textShadow: `0 0 30px ${accentColor}44`,
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
                            color: `${accentColor}88`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '16px',
                            textAlign: 'center',
                            maxWidth: '650px',
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Bottom line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '60px',
                      height: '2px',
                      background: accentColor,
                      marginTop: '32px',
                      boxShadow: `0 0 10px ${accentColor}66`,
                    },
                    children: [],
                  },
                },
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '12px',
                            color: `${accentColor}44`,
                            marginTop: '20px',
                            fontFamily: 'JetBrains Mono, monospace',
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
