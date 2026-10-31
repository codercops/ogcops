import type { TemplateDefinition, SatoriElement } from '../types';
import {
  autoFontSize,
  commonFields,
  contrastText,
  isLightColor,
  mixColors,
  truncate,
} from '../utils';

const DEFAULT_ITEMS = [
  'git status | See what changed',
  'git add -p | Stage changes piece by piece',
  'git commit --amend | Fix the last commit',
  'git switch -c name | Create a branch and switch to it',
  'git log --oneline | Short history',
].join('\n');

interface CheatSheetItem {
  command: string;
  description: string;
}

function parseItems(value: unknown): CheatSheetItem[] {
  return String(value ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 5)
    .map((line) => {
      const separator = line.indexOf('|');
      if (separator === -1) {
        return { command: line.trim(), description: '' };
      }
      return {
        command: line.slice(0, separator).trim(),
        description: line.slice(separator + 1).trim(),
      };
    })
    .filter((item) => item.command || item.description);
}

const template: TemplateDefinition = {
  id: 'tutorial-cheat-sheet',
  name: 'Cheat Sheet',
  category: 'tutorial',
  description: 'Quick reference card with up to five commands and short descriptions',
  tags: ['git', 'cheat-sheet', 'commands', 'reference', 'tutorial'],
  fields: [
    commonFields.title,
    {
      key: 'topic',
      label: 'Topic',
      type: 'text',
      defaultValue: 'Git',
      placeholder: 'Git',
      group: 'Content',
    },
    {
      key: 'items',
      label: 'Items',
      type: 'textarea',
      defaultValue: DEFAULT_ITEMS,
      placeholder: 'command | description (one per line)',
      group: 'Content',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Git Commands Cheat Sheet',
    topic: 'Git',
    items: DEFAULT_ITEMS,
    siteName: 'ogcops.com',
    bgColor: '#FFFFFF',
    accentColor: '#2563EB',
    textColor: '#111827',
  },
  render: (params) => {
    const title = truncate(
      String(params.title || 'Git Commands Cheat Sheet'),
      56
    );
    const topic = truncate(String(params.topic || '').trim(), 18);
    const items = parseItems(params.items);
    const siteName = truncate(String(params.siteName || '').trim(), 36);
    const bgColor = String(params.bgColor || '#FFFFFF');
    const accentColor = String(params.accentColor || '#2563EB');
    const textColor = String(params.textColor || '#111827');
    const lightBackground = isLightColor(bgColor);
    const accentInk = lightBackground
      ? mixColors(accentColor, '#000000', 0.45)
      : accentColor;
    const mutedColor = lightBackground ? '#64748B' : `${textColor}99`;
    const dividerColor = lightBackground ? '#E2E8F0' : `${textColor}1A`;
    const pillBackground = lightBackground ? `${accentColor}14` : `${textColor}0A`;
    const badgeText = contrastText(accentColor);
    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 50 },
      { maxLen: 38, size: 44 },
      { maxLen: 48, size: 38 },
      { maxLen: 56, size: 32 },
    ]);

    const rows: SatoriElement[] = items.map((item, index) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '28px',
          height: '76px',
          borderBottom: index === items.length - 1 ? 'none' : `1px solid ${dividerColor}`,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
                width: '438px',
                height: '48px',
                padding: '0 20px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                backgroundColor: pillBackground,
                border: `1px solid ${accentColor}33`,
                overflow: 'hidden',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '19px',
                    fontWeight: 500,
                    color: accentInk,
                    fontFamily: 'JetBrains Mono, monospace',
                    whiteSpace: 'nowrap',
                  },
                  children: truncate(item.command, 34),
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
                lineHeight: 1.2,
                whiteSpace: 'nowrap',
              },
              children: truncate(item.description, 52),
            },
          },
        ],
      },
    }));

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          padding: '50px 64px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '24px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.15,
                      margin: 0,
                      whiteSpace: 'nowrap',
                    },
                    children: title,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '14px',
                    },
                    children: [
                      ...(topic
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '5px 13px',
                                  borderRadius: '100px',
                                  backgroundColor: accentColor,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '14px',
                                      fontWeight: 700,
                                      color: badgeText,
                                      letterSpacing: '0.06em',
                                      textTransform: 'uppercase' as const,
                                      whiteSpace: 'nowrap',
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
                                style: {
                                  fontSize: '16px',
                                  fontWeight: 500,
                                  color: mutedColor,
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
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
              },
              children: rows,
            },
          },
        ],
      },
    };
  },
};

export default template;
