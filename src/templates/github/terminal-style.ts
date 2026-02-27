import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-terminal-style',
  name: 'Terminal Style',
  category: 'github',
  description: 'Terminal window with git clone command and project info',
  tags: ['github', 'terminal', 'cli', 'command-line', 'clone'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'username/my-project', placeholder: 'owner/repo', group: 'Content' },
    commonFields.description,
    { key: 'installCmd', label: 'Install Command', type: 'text', defaultValue: '', placeholder: 'npm install my-project', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    repoName: 'username/my-project',
    description: 'A powerful CLI tool for modern developers.',
    installCmd: 'npm install my-project',
    bgColor: '#1a1b26',
    accentColor: '#7aa2f7',
    textColor: '#c0caf5',
  },
  render: (params) => {
    const repoName = String(params.repoName || 'username/my-project');
    const description = params.description ? truncate(String(params.description), 100) : '';
    const installCmd = String(params.installCmd || '');
    const bgColor = String(params.bgColor || '#1a1b26');
    const accentColor = String(params.accentColor || '#7aa2f7');
    const textColor = String(params.textColor || '#c0caf5');

    const termBg = '#15161e';

    const termLine = (prompt: string, command: string, color: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          marginBottom: '10px',
        },
        children: [
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                color: '#9ece6a',
                fontWeight: 600,
              },
              children: prompt,
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                color: color,
              },
              children: ` ${command}`,
            },
          },
        ],
      },
    });

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
          padding: '48px',
        },
        children: [
          // Description above terminal
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}66`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '28px',
                      textAlign: 'center',
                      maxWidth: '700px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Terminal window
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '900px',
                borderRadius: '12px',
                border: `1px solid ${textColor}15`,
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
                      gap: '8px',
                      padding: '14px 18px',
                      background: `${textColor}08`,
                      borderBottom: `1px solid ${textColor}10`,
                    },
                    children: [
                      { type: 'div', props: { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f57' } } },
                      { type: 'div', props: { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', background: '#febc2e' } } },
                      { type: 'div', props: { style: { display: 'flex', width: '12px', height: '12px', borderRadius: '50%', background: '#28c840' } } },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '13px',
                            color: `${textColor}44`,
                            marginLeft: '12px',
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: 'terminal',
                        },
                      },
                    ],
                  },
                },
                // Terminal content
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '24px',
                      background: termBg,
                    },
                    children: [
                      // git clone command
                      termLine('$', `git clone https://github.com/${repoName}.git`, accentColor),
                      // Cloning output
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontFamily: 'JetBrains Mono, monospace',
                            color: `${textColor}44`,
                            marginBottom: '6px',
                          },
                          children: 'Cloning into \'my-project\'...',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontFamily: 'JetBrains Mono, monospace',
                            color: `${textColor}44`,
                            marginBottom: '14px',
                          },
                          children: 'remote: Enumerating objects: done.',
                        },
                      },
                      // cd command
                      termLine('$', `cd ${repoName.split('/').pop() || 'project'}`, textColor),
                      // install command
                      ...(installCmd
                        ? [termLine('$', installCmd, '#e0af68')]
                        : []),
                      // Cursor
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0',
                            marginTop: '4px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  color: '#9ece6a',
                                  fontWeight: 600,
                                },
                                children: '$ ',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '10px',
                                  height: '20px',
                                  background: accentColor,
                                },
                                children: [],
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
          },
        ],
      },
    };
  },
};

export default template;
