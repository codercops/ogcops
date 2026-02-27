import type { TemplateDefinition } from '../types';
import { commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-vscode-theme',
  name: 'VS Code Theme',
  category: 'developer',
  description: 'Editor with JSON bio content styled like VS Code',
  tags: ['developer', 'vscode', 'editor', 'code', 'theme'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco', group: 'Content' as const },
    { key: 'website', label: 'Website', type: 'text' as const, defaultValue: '', placeholder: 'janesmith.dev', group: 'Content' as const },
    { key: 'skills', label: 'Top Skills', type: 'text' as const, defaultValue: '', placeholder: 'React, TypeScript, Go', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Full-Stack Developer',
    location: 'San Francisco, CA',
    website: 'janesmith.dev',
    skills: 'React, TypeScript, Go',
    bgColor: '#1e1e1e',
    accentColor: '#007ACC',
    textColor: '#D4D4D4',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const location = String(params.location || '');
    const website = String(params.website || '');
    const skills = String(params.skills || '');
    const bgColor = String(params.bgColor || '#1e1e1e');
    const accentColor = String(params.accentColor || '#007ACC');
    const textColor = String(params.textColor || '#D4D4D4');

    const keyColor = '#9CDCFE';
    const stringColor = '#CE9178';
    const bracketColor = '#FFD700';
    const punctuationColor = textColor;
    const numberColor = '#B5CEA8';
    const commentColor = '#6A9955';
    const lineNumColor = '#858585';

    // Build JSON lines
    const jsonLines: Array<{ num: number; content: Array<{ text: string; color: string }> }> = [];
    let lineNum = 1;

    jsonLines.push({ num: lineNum++, content: [{ text: '{', color: bracketColor }] });
    jsonLines.push({
      num: lineNum++,
      content: [
        { text: '  ', color: textColor },
        { text: `"name"`, color: keyColor },
        { text: ': ', color: punctuationColor },
        { text: `"${name}"`, color: stringColor },
        { text: ',', color: punctuationColor },
      ],
    });
    if (role) {
      jsonLines.push({
        num: lineNum++,
        content: [
          { text: '  ', color: textColor },
          { text: `"role"`, color: keyColor },
          { text: ': ', color: punctuationColor },
          { text: `"${role}"`, color: stringColor },
          { text: ',', color: punctuationColor },
        ],
      });
    }
    if (location) {
      jsonLines.push({
        num: lineNum++,
        content: [
          { text: '  ', color: textColor },
          { text: `"location"`, color: keyColor },
          { text: ': ', color: punctuationColor },
          { text: `"${location}"`, color: stringColor },
          { text: ',', color: punctuationColor },
        ],
      });
    }
    if (website) {
      jsonLines.push({
        num: lineNum++,
        content: [
          { text: '  ', color: textColor },
          { text: `"website"`, color: keyColor },
          { text: ': ', color: punctuationColor },
          { text: `"${website}"`, color: stringColor },
          { text: ',', color: punctuationColor },
        ],
      });
    }
    if (skills) {
      jsonLines.push({
        num: lineNum++,
        content: [
          { text: '  ', color: textColor },
          { text: `"skills"`, color: keyColor },
          { text: ': [', color: punctuationColor },
        ],
      });
      const skillList = skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      skillList.forEach((skill: string, i: number) => {
        jsonLines.push({
          num: lineNum++,
          content: [
            { text: '    ', color: textColor },
            { text: `"${skill}"`, color: stringColor },
            { text: i < skillList.length - 1 ? ',' : '', color: punctuationColor },
          ],
        });
      });
      jsonLines.push({
        num: lineNum++,
        content: [
          { text: '  ', color: textColor },
          { text: '],', color: punctuationColor },
        ],
      });
    }
    jsonLines.push({
      num: lineNum++,
      content: [
        { text: '  ', color: textColor },
        { text: `"available"`, color: keyColor },
        { text: ': ', color: punctuationColor },
        { text: 'true', color: numberColor },
      ],
    });
    jsonLines.push({ num: lineNum++, content: [{ text: '}', color: bracketColor }] });

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
        },
        children: [
          // Title bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '36px',
                background: '#323233',
                padding: '0 16px',
                gap: '8px',
              },
              children: [
                // Traffic dots
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
                    style: { fontSize: '12px', color: '#888', marginLeft: '12px' },
                    children: 'developer.json — Visual Studio Code',
                  },
                },
              ],
            },
          },
          // Tab bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                height: '36px',
                background: '#252526',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 16px',
                    height: '36px',
                    background: bgColor,
                    borderTop: `2px solid ${accentColor}`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: { fontSize: '13px', color: textColor },
                      children: 'developer.json',
                    },
                  },
                },
              },
            },
          },
          // Editor body
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                padding: '20px 0',
              },
              children: [
                // Line numbers gutter
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '60px',
                      paddingRight: '16px',
                      alignItems: 'flex-end',
                    },
                    children: jsonLines.map((line) => ({
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          lineHeight: '28px',
                          color: lineNumColor,
                        },
                        children: String(line.num),
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
                      flex: 1,
                      borderLeft: `1px solid ${textColor}15`,
                      paddingLeft: '20px',
                    },
                    children: jsonLines.map((line) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          height: '28px',
                          alignItems: 'center',
                        },
                        children: line.content.map((token) => ({
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '16px',
                              color: token.color,
                            },
                            children: token.text,
                          },
                        })),
                      },
                    })),
                  },
                },
              ],
            },
          },
          // Status bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '28px',
                background: accentColor,
                padding: '0 16px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '12px', color: '#FFFFFF' },
                    children: 'JSON',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '12px', color: '#FFFFFF' },
                    children: 'UTF-8',
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
