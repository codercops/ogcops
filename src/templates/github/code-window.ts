import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-code-window',
  name: 'Code Window',
  category: 'github',
  description: 'VS Code-like editor window with a code snippet display',
  tags: ['github', 'code', 'editor', 'vscode', 'snippet'],
  fields: [
    commonFields.title,
    { key: 'fileName', label: 'File Name', type: 'text', defaultValue: 'index.ts', placeholder: 'index.ts', group: 'Content' },
    { key: 'codeLine1', label: 'Code Line 1', type: 'text', defaultValue: 'import { createApp } from \'./core\';', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine2', label: 'Code Line 2', type: 'text', defaultValue: '', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine3', label: 'Code Line 3', type: 'text', defaultValue: 'const app = createApp({', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine4', label: 'Code Line 4', type: 'text', defaultValue: '  plugins: [router(), store()],', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine5', label: 'Code Line 5', type: 'text', defaultValue: '  debug: true,', placeholder: 'Code line', group: 'Content' },
    { key: 'codeLine6', label: 'Code Line 6', type: 'text', defaultValue: '});', placeholder: 'Code line', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'my-project',
    fileName: 'index.ts',
    codeLine1: 'import { createApp } from \'./core\';',
    codeLine2: '',
    codeLine3: 'const app = createApp({',
    codeLine4: '  plugins: [router(), store()],',
    codeLine5: '  debug: true,',
    codeLine6: '});',
    bgColor: '#1e1e2e',
    accentColor: '#89b4fa',
    textColor: '#cdd6f4',
  },
  render: (params) => {
    const title = String(params.title || 'my-project');
    const fileName = String(params.fileName || 'index.ts');
    const codeLines = [
      String(params.codeLine1 || ''),
      String(params.codeLine2 || ''),
      String(params.codeLine3 || ''),
      String(params.codeLine4 || ''),
      String(params.codeLine5 || ''),
      String(params.codeLine6 || ''),
    ];
    const bgColor = String(params.bgColor || '#1e1e2e');
    const accentColor = String(params.accentColor || '#89b4fa');
    const textColor = String(params.textColor || '#cdd6f4');

    const editorBg = '#181825';
    const lineNumColor = `${textColor}33`;
    const gutterBg = `${textColor}05`;

    // Simple syntax coloring heuristics
    const colorize = (line: string) => {
      if (line.startsWith('import') || line.startsWith('export') || line.startsWith('const') || line.startsWith('  const')) {
        return '#cba6f7'; // keyword purple
      }
      if (line.includes('//')) return `${textColor}55`; // comment
      if (line.trim().startsWith('{') || line.trim().startsWith('}') || line.trim() === '});') return '#f9e2af'; // braces yellow
      return textColor;
    };

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
          padding: '40px',
        },
        children: [
          // Project name above editor
          {
            type: 'span',
            props: {
              style: {
                fontSize: '18px',
                fontWeight: 600,
                color: accentColor,
                fontFamily: 'JetBrains Mono, monospace',
                marginBottom: '20px',
              },
              children: title,
            },
          },
          // Editor window
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '920px',
                borderRadius: '12px',
                border: `1px solid ${textColor}12`,
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
                      background: `${textColor}06`,
                      borderBottom: `1px solid ${textColor}08`,
                    },
                    children: [
                      // Traffic lights
                      { type: 'div', props: { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57', marginRight: '8px' } } },
                      { type: 'div', props: { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e', marginRight: '8px' } } },
                      { type: 'div', props: { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', background: '#28c840', marginRight: '20px' } } },
                      // Tab
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 16px',
                            borderRadius: '6px 6px 0 0',
                            background: editorBg,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '13px',
                                color: textColor,
                                fontFamily: 'JetBrains Mono, monospace',
                              },
                              children: fileName,
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                // Code area
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      background: editorBg,
                      padding: '20px 0',
                    },
                    children: [
                      // Line numbers
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            padding: '0 16px',
                            background: gutterBg,
                            minWidth: '56px',
                          },
                          children: codeLines.map((_, i) => ({
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '15px',
                                fontFamily: 'JetBrains Mono, monospace',
                                color: lineNumColor,
                                lineHeight: '28px',
                              },
                              children: String(i + 1),
                            },
                          })),
                        },
                      },
                      // Code content
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '0 20px',
                            flex: 1,
                          },
                          children: codeLines.map((line) => ({
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '15px',
                                fontFamily: 'JetBrains Mono, monospace',
                                color: line ? colorize(line) : 'transparent',
                                lineHeight: '28px',
                                whiteSpace: 'pre',
                              },
                              children: line || ' ',
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
