import type { TemplateDefinition, SatoriElement } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

/**
 * Splits the textarea into rows of `command | description`, skipping blank
 * lines. A line without a `|` becomes a command with no description.
 */
function parseItems(input: unknown): { command: string; description: string }[] {
  if (typeof input !== 'string') return [];
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const [command, ...rest] = line.split('|');
      return {
        command: command.trim(),
        description: rest.join('|').trim(),
      };
    });
}

const template: TemplateDefinition = {
  id: 'tutorial-cheat-sheet',
  name: 'Cheat Sheet',
  category: 'tutorial',
  description: 'Quick reference card with up to five commands and what they do',
  tags: ['tutorial', 'cheat sheet', 'commands', 'reference', 'quick reference'],
  fields: [
    commonFields.title,
    { key: 'topic', label: 'Topic', type: 'text', defaultValue: 'Git', placeholder: 'Git', group: 'Content' },
    {
      key: 'items',
      label: 'Items',
      type: 'textarea',
      defaultValue:
        'git status | See what changed\ngit add -p | Stage changes piece by piece\ngit commit --amend | Fix the last commit\ngit switch -c name | Create a branch and switch to it\ngit log --oneline | Short history',
      placeholder: 'One row per line: command | what it does',
      group: 'Content',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Git commands you\'ll use every day',
    topic: 'Git',
    items:
      'git status | See what changed\ngit add -p | Stage changes piece by piece\ngit commit --amend | Fix the last commit\ngit switch -c name | Create a branch and switch to it\ngit log --oneline | Short history',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Git commands you\'ll use every day'), 60);
    const topic = truncate(String(params.topic || ''), 24);
    const items = parseItems(String(params.items || '')).slice(0, 5);
    const siteName = truncate(String(params.siteName || ''), 40);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const isLightBg = isLightColor(bgColor);
    // The accent is used for text on the background, so darken it on light backgrounds.
    const accentInk = isLightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = isLightBg ? mixColors(textColor, bgColor, 0.45) : `${textColor}99`;
    const codePillBg = isLightBg ? `${accentColor}1A` : `${accentColor}22`;
    const dividerColor = isLightBg ? `${textColor}26` : `${textColor}1F`;
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 60, size: 36 },
      { maxLen: 80, size: 30 },
    ]);

    const row = (item: { command: string; description: string }, i: number, total: number): SatoriElement => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          padding: '18px 0',
          // Thin lines separate the rows, but not after the last one.
          borderBottom: i < total - 1 ? `1px solid ${dividerColor}` : 'none',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                padding: '10px 18px',
                borderRadius: '8px',
                backgroundColor: codePillBg,
                flexShrink: 0,
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '20px',
                    fontWeight: 700,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: accentInk,
                  },
                  children: truncate(item.command, 32),
                },
              },
            },
          },
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                fontSize: '20px',
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.3,
              },
              children: truncate(item.description, 60),
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
          width: '1200px',
          height: '630px',
          padding: '56px 64px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Header: topic badge and site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              },
              children: [
                ...(topic
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 700,
                                color: contrastText(accentColor),
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase' as const,
                              },
                              children: topic,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', fontWeight: 500, color: mutedColor },
                          children: siteName,
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
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '28px',
              },
              children: title,
            },
          },
          // Rows
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
              },
              children: items.map((item, i) => row(item, i, items.length)),
            },
          },
        ],
      },
    };
  },
};

export default template;
