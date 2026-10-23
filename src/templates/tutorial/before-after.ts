import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const MAX_CODE_LINES = 6;
const MAX_CODE_LINE_LENGTH = 48;
const CODE_LINE_HEIGHT = 28;

const formatCodeLines = (value: unknown): string[] => {
  const lines = (typeof value === 'string' ? value : '').replace(/\r\n?/g, '\n').split('\n');
  return Array.from({ length: MAX_CODE_LINES }, (_, index) => truncate(lines[index] || '', MAX_CODE_LINE_LENGTH));
};

const template: TemplateDefinition = {
  id: 'tutorial-before-after',
  name: 'Before & After Code',
  category: 'tutorial',
  description: 'Compare a code refactor side by side with clear before and after panels',
  tags: ['tutorial', 'code', 'refactor', 'comparison', 'programming'],
  fields: [
    commonFields.title,
    { key: 'beforeCode', label: 'Before Code', type: 'textarea', defaultValue: 'const users = getUsers();\nconst active = [];\nfor (const user of users) {\n  if (user.isActive) active.push(user);\n}', placeholder: 'Paste the original code', group: 'Content' },
    { key: 'afterCode', label: 'After Code', type: 'textarea', defaultValue: 'const activeUsers = getUsers()\n  .filter((user) => user.isActive);', placeholder: 'Paste the refactored code', group: 'Content' },
    { key: 'language', label: 'Language', type: 'text', defaultValue: 'TypeScript', placeholder: 'TypeScript', group: 'Content' },
    { key: 'beforeLabel', label: 'Before Label', type: 'text', defaultValue: 'Before', placeholder: 'Before', group: 'Content' },
    { key: 'afterLabel', label: 'After Label', type: 'text', defaultValue: 'After', placeholder: 'After', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Refactor for cleaner, simpler code',
    beforeCode: 'const users = getUsers();\nconst active = [];\nfor (const user of users) {\n  if (user.isActive) active.push(user);\n}',
    afterCode: 'const activeUsers = getUsers()\n  .filter((user) => user.isActive);',
    language: 'TypeScript',
    beforeLabel: 'Before',
    afterLabel: 'After',
    bgColor: '#0b1020',
    accentColor: '#38bdf8',
    textColor: '#e2e8f0',
  },
  render: (params) => {
    const title = truncate(
      typeof params.title === 'string' && params.title.trim() ? params.title.trim() : 'Refactor for cleaner, simpler code',
      72,
    );
    const language = typeof params.language === 'string' ? truncate(params.language.trim(), 24) : '';
    const beforeLabel =
      typeof params.beforeLabel === 'string' && params.beforeLabel.trim()
        ? truncate(params.beforeLabel.trim(), 24)
        : 'Before';
    const afterLabel =
      typeof params.afterLabel === 'string' && params.afterLabel.trim()
        ? truncate(params.afterLabel.trim(), 24)
        : 'After';
    const beforeLines = formatCodeLines(params.beforeCode);
    const afterLines = formatCodeLines(params.afterCode);
    const bgColor = String(params.bgColor || '#0b1020');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#e2e8f0');
    const lightBackground = isLightColor(bgColor);
    const surfaceColor = lightBackground ? '#f1f5f9' : '#121a2a';
    const codeBackground = lightBackground ? '#ffffff' : '#0b1220';
    const borderColor = lightBackground ? '#dbe3ee' : '#283449';
    const beforeColor = lightBackground ? '#b42318' : '#f87171';
    const afterColor = lightBackground ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const titleSize = autoFontSize(title, [
      { maxLen: 28, size: 44 },
      { maxLen: 48, size: 38 },
      { maxLen: 72, size: 32 },
    ]);

    const renderCodeLines = (lines: string[], color: string): SatoriElement[] =>
      lines.map((line) => ({
        type: 'span',
        props: {
          style: {
            fontSize: '15px',
            fontFamily: 'JetBrains Mono, monospace',
            color: line ? color : 'transparent',
            lineHeight: `${CODE_LINE_HEIGHT}px`,
            whiteSpace: 'pre',
          },
          children: line || ' ',
        },
      }));

    const renderPanel = (label: string, labelColor: string, codeLines: string[]): SatoriElement => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '356px',
          padding: '24px',
          backgroundColor: surfaceColor,
          border: `1px solid ${labelColor}55`,
          borderRadius: '14px',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: '18px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '16px',
                    fontWeight: 700,
                    color: labelColor,
                    letterSpacing: '0.02em',
                  },
                  children: label,
                },
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '16px 18px',
                backgroundColor: codeBackground,
                border: `1px solid ${borderColor}`,
                borderRadius: '9px',
                overflow: 'hidden',
              },
              children: renderCodeLines(codeLines, textColor),
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
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          padding: '42px 54px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '26px',
                gap: '24px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      flex: 1,
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                ...(language
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexShrink: 0,
                            padding: '9px 14px',
                            backgroundColor: surfaceColor,
                            border: `1px solid ${borderColor}`,
                            borderRadius: '8px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '13px',
                                fontWeight: 400,
                                color: afterColor,
                                fontFamily: 'JetBrains Mono, monospace',
                              },
                              children: language,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '22px',
              },
              children: [
                renderPanel(beforeLabel, beforeColor, beforeLines),
                renderPanel(afterLabel, afterColor, afterLines),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
