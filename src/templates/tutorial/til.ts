import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const DEFAULT_TITLE = 'git switch - takes you back to the branch you were just on';
const DEFAULT_CODE = 'git switch -';

const template: TemplateDefinition = {
  id: 'tutorial-til',
  name: 'Today I Learned',
  category: 'tutorial',
  description: 'A card for sharing quick "Today I Learned" discoveries and commands',
  tags: ['til', 'today-i-learned', 'tutorial', 'tip', 'code'],
  fields: [
    {
      ...commonFields.title,
      label: 'Title',
      defaultValue: DEFAULT_TITLE,
      placeholder: 'What you learned',
    },
    {
      key: 'code',
      label: 'Code / Command',
      type: 'text',
      defaultValue: DEFAULT_CODE,
      placeholder: 'git switch -',
      group: 'Content',
    },
    {
      key: 'tag',
      label: 'Tag',
      type: 'text',
      defaultValue: 'git',
      placeholder: 'git',
      group: 'Content',
    },
    {
      ...commonFields.date,
      defaultValue: 'Oct 27, 2026',
      placeholder: 'Oct 27, 2026',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: DEFAULT_TITLE,
    code: DEFAULT_CODE,
    tag: 'git',
    date: 'Oct 27, 2026',
    siteName: 'codercops.com',
    bgColor: '#0f172a',
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const rawTitle =
      typeof params.title === 'string' && params.title.trim() ? params.title.trim() : DEFAULT_TITLE;
    const title = truncate(rawTitle, 130);
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 35, size: 54 },
      { maxLen: 65, size: 44 },
      { maxLen: 95, size: 36 },
      { maxLen: 130, size: 30 },
    ]);

    const code = typeof params.code === 'string' ? truncate(params.code.trim(), 75) : '';
    const tag = typeof params.tag === 'string' ? truncate(params.tag.trim(), 24) : '';
    const date = typeof params.date === 'string' ? truncate(params.date.trim(), 32) : '';
    const siteName = typeof params.siteName === 'string' ? truncate(params.siteName.trim(), 40) : '';

    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const bodyText = lightBg && isLightColor(textColor) ? '#0f172a' : textColor;
    const mutedText = lightBg ? '#475569' : `${textColor}99`;

    const pillBg = lightBg ? mixColors(bgColor, bodyText, 0.06) : `${bodyText}14`;
    const pillBorder = lightBg ? mixColors(bgColor, bodyText, 0.2) : `${bodyText}28`;
    const pillText = lightBg ? mixColors(bgColor, bodyText, 0.75) : mutedText;

    const codeBoxBg = lightBg ? mixColors(bgColor, '#000000', 0.05) : `${bodyText}0D`;
    const codeBoxBorder = lightBg ? mixColors(bgColor, '#000000', 0.15) : `${bodyText}26`;

    const hasFooter = Boolean(date || siteName);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '58px 72px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          color: bodyText,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: accentInk,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          },
                          children: 'Today I learned',
                        },
                      },
                      ...(tag
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '4px 12px',
                                  borderRadius: '9999px',
                                  backgroundColor: pillBg,
                                  border: `1px solid ${pillBorder}`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '15px',
                                      fontWeight: 600,
                                      color: pillText,
                                      fontFamily: 'JetBrains Mono, monospace',
                                    },
                                    children: tag,
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
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      lineHeight: 1.2,
                      fontWeight: 800,
                      color: bodyText,
                      margin: '36px 0 0',
                      maxWidth: '1050px',
                      letterSpacing: '-0.02em',
                      wordBreak: 'break-word',
                    },
                    children: title,
                  },
                },
                ...(code
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            alignSelf: 'flex-start',
                            marginTop: '34px',
                            padding: '18px 24px',
                            borderRadius: '12px',
                            backgroundColor: codeBoxBg,
                            border: `1px solid ${codeBoxBorder}`,
                            boxSizing: 'border-box',
                            maxWidth: '1050px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '22px',
                                lineHeight: 1.35,
                                color: accentInk,
                                fontFamily: 'JetBrains Mono, monospace',
                                wordBreak: 'break-word',
                              },
                              children: code,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          ...(hasFooter
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        date && siteName ? 'space-between' : date ? 'flex-start' : 'flex-end',
                      width: '100%',
                    },
                    children: [
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 500,
                                  color: mutedText,
                                },
                                children: date,
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
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: mutedText,
                                },
                                children: siteName,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
