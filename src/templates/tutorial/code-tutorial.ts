import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-code-tutorial',
  name: 'Code Tutorial',
  category: 'tutorial',
  description: 'Code editor mockup window with syntax-highlighted code and title overlay',
  tags: ['tutorial', 'code', 'editor', 'programming'],
  fields: [
    commonFields.title,
    { key: 'codeLine1', label: 'Code Line 1', type: 'text', defaultValue: 'const app = createApp({', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine2', label: 'Code Line 2', type: 'text', defaultValue: '  plugins: [router, store],', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine3', label: 'Code Line 3', type: 'text', defaultValue: '  middleware: [auth],', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine4', label: 'Code Line 4', type: 'text', defaultValue: '});', placeholder: 'Code line', group: 'Content' },
    { key: 'language', label: 'Language', type: 'text', defaultValue: 'TypeScript', placeholder: 'Language', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Building APIs with Express & TypeScript',
    codeLine1: 'const app = createApp({',
    codeLine2: '  plugins: [router, store],',
    codeLine3: '  middleware: [auth],',
    codeLine4: '});',
    language: 'TypeScript',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Building APIs with Express & TypeScript'), 60);
    const codeLines = [
      String(params.codeLine1 || ''),
      String(params.codeLine2 || ''),
      String(params.codeLine3 || ''),
      String(params.codeLine4 || ''),
    ].filter(Boolean);
    const language = String(params.language || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 44 },
      { maxLen: 40, size: 36 },
      { maxLen: 60, size: 30 },
      { maxLen: 80, size: 26 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: title area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '480px',
                padding: '60px',
              },
              children: [
                ...(language
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 16px',
                            backgroundColor: `${accentColor}22`,
                            borderRadius: '6px',
                            alignSelf: 'flex-start',
                            marginBottom: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: accentColor,
                                fontFamily: 'JetBrains Mono, monospace',
                              },
                              children: language,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.3,
                      margin: 0,
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Right: code editor mockup
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      backgroundColor: '#1e1e1e',
                      borderRadius: '12px',
                      border: '1px solid #333',
                      overflow: 'hidden',
                    },
                    children: [
                      // Title bar
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 16px',
                            backgroundColor: '#252526',
                            gap: '8px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF5F57' },
                                children: [],
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FEBC2E' },
                                children: [],
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28C840' },
                                children: [],
                              },
                            },
                          ],
                        },
                      },
                      // Code content
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '24px',
                            gap: '8px',
                          },
                          children: codeLines.map((line, i) => ({
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                gap: '16px',
                              },
                              children: [
                                {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '16px',
                                      fontFamily: 'JetBrains Mono, monospace',
                                      color: '#555',
                                      width: '24px',
                                      textAlign: 'right',
                                    },
                                    children: `${i + 1}`,
                                  },
                                },
                                {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '16px',
                                      fontFamily: 'JetBrains Mono, monospace',
                                      color: '#D4D4D4',
                                    },
                                    children: line,
                                  },
                                },
                              ],
                            },
                          })),
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
