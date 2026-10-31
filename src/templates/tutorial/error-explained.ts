import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const DEFAULT_TITLE = "TypeError: Cannot read properties of undefined (reading 'map')";

const template: TemplateDefinition = {
  id: 'tutorial-error-explained',
  name: 'Error Explained',
  category: 'tutorial',
  description: 'Explain a technical error message with what it means and how to fix it',
  tags: ['error', 'debug', 'troubleshooting', 'tutorial', 'code'],
  fields: [
    {
      ...commonFields.title,
      label: 'Error Message',
      defaultValue: DEFAULT_TITLE,
      placeholder: DEFAULT_TITLE,
    },
    {
      key: 'language',
      label: 'Language',
      type: 'text',
      defaultValue: 'JavaScript',
      placeholder: 'JavaScript',
      group: 'Content',
    },
    {
      key: 'meaning',
      label: 'Meaning',
      type: 'text',
      defaultValue: "You called .map() on something that isn't an array yet",
      placeholder: "You called .map() on something that isn't an array yet",
      group: 'Content',
    },
    {
      key: 'fix',
      label: 'Fix',
      type: 'text',
      defaultValue: 'Start the state as [] or check before mapping',
      placeholder: 'Start the state as [] or check before mapping',
      group: 'Content',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: DEFAULT_TITLE,
    language: 'JavaScript',
    meaning: "You called .map() on something that isn't an array yet",
    fix: 'Start the state as [] or check before mapping',
    siteName: 'codercops.com',
    bgColor: '#0f172a',
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const rawTitle =
      typeof params.title === 'string' && params.title.trim() ? params.title.trim() : DEFAULT_TITLE;
    const title = truncate(rawTitle, 120);
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 40, size: 36 },
      { maxLen: 70, size: 30 },
      { maxLen: 95, size: 25 },
      { maxLen: 120, size: 21 },
    ]);

    const language = typeof params.language === 'string' ? truncate(params.language.trim(), 24) : '';
    const meaning = typeof params.meaning === 'string' ? truncate(params.meaning.trim(), 140) : '';
    const fix = typeof params.fix === 'string' ? truncate(params.fix.trim(), 140) : '';
    const siteName = typeof params.siteName === 'string' ? truncate(params.siteName.trim(), 40) : '';

    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const bodyText = lightBg && isLightColor(textColor) ? '#0f172a' : textColor;
    const mutedText = lightBg ? '#475569' : `${textColor}99`;

    const errorBoxBg = lightBg ? mixColors('#ef4444', bgColor, 0.92) : mixColors('#ef4444', bgColor, 0.88);
    const errorBoxBorder = lightBg ? mixColors('#ef4444', bgColor, 0.55) : mixColors('#ef4444', bgColor, 0.65);
    const errorTextColor = lightBg ? '#991b1b' : '#fca5a5';

    const pillBg = lightBg ? mixColors(bgColor, bodyText, 0.06) : `${bodyText}14`;
    const pillBorder = lightBg ? mixColors(bgColor, bodyText, 0.2) : `${bodyText}28`;
    const pillText = lightBg ? mixColors(bgColor, bodyText, 0.75) : mutedText;

    const explanationRows: SatoriElement[] = [
      ...(meaning
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                },
                children: [
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '18px',
                        fontWeight: 700,
                        color: mutedText,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        flexShrink: 0,
                        width: '105px',
                        marginTop: '4px',
                      },
                      children: 'Meaning',
                    },
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '25px',
                        lineHeight: 1.4,
                        color: bodyText,
                        flex: 1,
                      },
                      children: meaning,
                    },
                  },
                ],
              },
            },
          ]
        : []),
      ...(fix
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                },
                children: [
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '18px',
                        fontWeight: 700,
                        color: accentInk,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        flexShrink: 0,
                        width: '105px',
                        marginTop: '4px',
                      },
                      children: 'Fix',
                    },
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '25px',
                        fontWeight: 500,
                        lineHeight: 1.4,
                        color: bodyText,
                        flex: 1,
                      },
                      children: fix,
                    },
                  },
                ],
              },
            },
          ]
        : []),
    ];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '60px 72px',
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
                justifyContent: 'center',
                flex: 1,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginBottom: '26px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 700,
                            color: accentInk,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                          },
                          children: 'Error explained',
                        },
                      },
                      ...(language
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '5px 14px',
                                  borderRadius: '9999px',
                                  backgroundColor: pillBg,
                                  border: `1px solid ${pillBorder}`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '15px',
                                      fontWeight: 500,
                                      color: pillText,
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
                      alignItems: 'center',
                      padding: '28px 32px',
                      borderRadius: '14px',
                      backgroundColor: errorBoxBg,
                      border: `1px solid ${errorBoxBorder}`,
                      boxSizing: 'border-box',
                      overflow: 'hidden',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: `${titleSize}px`,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 600,
                          lineHeight: 1.35,
                          color: errorTextColor,
                          wordBreak: 'break-word',
                        },
                        children: title,
                      },
                    },
                  },
                },
                ...(explanationRows.length > 0
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            marginTop: '32px',
                          },
                          children: explanationRows,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: '16px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 500,
                          color: mutedText,
                        },
                        children: siteName,
                      },
                    },
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
