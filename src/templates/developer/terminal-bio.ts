import type { TemplateDefinition } from '../types';
import { commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-terminal-bio',
  name: 'Terminal Bio',
  category: 'developer',
  description: 'Terminal-style "whoami" output with JetBrains Mono font',
  tags: ['developer', 'terminal', 'cli', 'hacker', 'bio'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco, CA', group: 'Content' as const },
    { key: 'skills', label: 'Skills (comma-separated)', type: 'text' as const, defaultValue: '', placeholder: 'React, TypeScript, Go', group: 'Content' as const },
    { key: 'website', label: 'Website', type: 'text' as const, defaultValue: '', placeholder: 'janesmith.dev', group: 'Content' as const },
    { key: 'github', label: 'GitHub Username', type: 'text' as const, defaultValue: '', placeholder: 'janesmith', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Full-Stack Developer',
    location: 'San Francisco, CA',
    skills: 'React, TypeScript, Go, Rust',
    website: 'janesmith.dev',
    github: 'janesmith',
    bgColor: '#1e1e1e',
    accentColor: '#4EC9B0',
    textColor: '#D4D4D4',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const location = String(params.location || '');
    const skills = String(params.skills || '');
    const website = String(params.website || '');
    const github = String(params.github || '');
    const bgColor = String(params.bgColor || '#1e1e1e');
    const accentColor = String(params.accentColor || '#4EC9B0');
    const textColor = String(params.textColor || '#D4D4D4');

    const promptColor = '#569CD6';
    const stringColor = '#CE9178';
    const commentColor = '#6A9955';
    const keywordColor = accentColor;

    const lines: Array<{ prefix: string; key: string; value: string; valueColor: string }> = [];
    lines.push({ prefix: '$', key: 'whoami', value: '', valueColor: textColor });
    lines.push({ prefix: '', key: 'name', value: name, valueColor: stringColor });
    if (role) lines.push({ prefix: '', key: 'role', value: role, valueColor: stringColor });
    if (location) lines.push({ prefix: '', key: 'location', value: location, valueColor: stringColor });
    if (skills) lines.push({ prefix: '', key: 'skills', value: `[${skills}]`, valueColor: keywordColor });
    if (website) lines.push({ prefix: '', key: 'website', value: website, valueColor: '#569CD6' });
    if (github) lines.push({ prefix: '', key: 'github', value: `github.com/${github}`, valueColor: '#569CD6' });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'JetBrains Mono, monospace',
          padding: '0',
        },
        children: [
          // Terminal title bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '44px',
                background: '#2d2d2d',
                padding: '0 20px',
                gap: '8px',
              },
              children: [
                // Traffic light dots
                ...[
                  { color: '#FF5F56' },
                  { color: '#FFBD2E' },
                  { color: '#27C93F' },
                ].map((dot) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: dot.color,
                    },
                    children: '',
                  },
                })),
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '13px',
                      color: '#888888',
                      marginLeft: '16px',
                    },
                    children: 'terminal ~ whoami',
                  },
                },
              ],
            },
          },
          // Terminal body
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '32px 40px',
                gap: '6px',
              },
              children: [
                // Comment line
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex' },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '16px', color: commentColor },
                        children: `# ${name}'s developer profile`,
                      },
                    },
                  },
                },
                // Blank line
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', height: '12px' },
                    children: '',
                  },
                },
                // Lines
                ...lines.map((line) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '8px',
                      minHeight: '28px',
                    },
                    children: line.prefix === '$'
                      ? [
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '18px', fontWeight: 700, color: promptColor },
                              children: '$ ',
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '18px', fontWeight: 700, color: keywordColor },
                              children: line.key,
                            },
                          },
                        ]
                      : [
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '17px', color: textColor, width: '120px' },
                              children: `  ${line.key}:`,
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '17px', color: line.valueColor },
                              children: line.key === 'skills' ? line.value : `"${line.value}"`,
                            },
                          },
                        ],
                  },
                })),
                // Cursor line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '16px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', fontWeight: 700, color: promptColor },
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
                            background: textColor,
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
