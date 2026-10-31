import type { TemplateDefinition } from '../types';
import {
  autoFontSize,
  commonFields,
  contrastText,
  isLightColor,
  mixColors,
  truncate,
} from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-live-recording',
  name: 'Live Recording',
  category: 'podcast',
  description: 'Podcast episode announcement for a live recording with an audience',
  tags: ['podcast', 'live', 'recording', 'episode', 'audience'],
  fields: [
    commonFields.title,
    {
      key: 'showName',
      label: 'Show Name',
      type: 'text' as const,
      defaultValue: 'The Dev Show',
      placeholder: 'The Dev Show',
      group: 'Content' as const,
    },
    {
      key: 'when',
      label: 'When',
      type: 'text' as const,
      defaultValue: 'Thursday, 7:00 PM IST',
      placeholder: 'Thursday, 7:00 PM IST',
      group: 'Content' as const,
    },
    {
      key: 'where',
      label: 'Where',
      type: 'text' as const,
      defaultValue: 'Live on our channel',
      placeholder: 'Live on our channel',
      group: 'Content' as const,
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Shipping on Fridays: yes or no?',
    showName: 'The Dev Show',
    when: 'Thursday, 7:00 PM IST',
    where: 'Live on our channel',
    bgColor: '#F7F7F2',
    accentColor: '#E07A5F',
    textColor: '#18212B',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'Episode Topic');

    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 30, size: 58 },
      { maxLen: 50, size: 48 },
      { maxLen: 75, size: 40 },
      { maxLen: 110, size: 32 },
      { maxLen: 160, size: 26 },
    ]);

    const title = truncate(rawTitle, 160);
    const showName = String(params.showName || '').trim();
    const when = String(params.when || '').trim();
    const where = String(params.where || '').trim();
    const bgColor = String(params.bgColor || '#F7F7F2');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#18212B');

    // Resolve readable text color for the accent-colored live badge.
    // Keep this aligned with the contrast helper used elsewhere in the project.
    const badgeTextColor = contrastText(accentColor);
    const accentLabelColor = isLightColor(bgColor)
      ? mixColors(accentColor, '#000000', 0.45)
      : accentColor;
    const metaItems = [
      ...(when
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flex: 1,
                  minWidth: 0,
                },
                children: [
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '15px',
                        fontWeight: 800,
                        color: accentLabelColor,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      },
                      children: 'When',
                    },
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '21px',
                        fontWeight: 600,
                        color: textColor,
                        lineHeight: 1.4,
                      },
                      children: when,
                    },
                  },
                ],
              },
            },
          ]
        : []),
      ...(where
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  flex: 1,
                  minWidth: 0,
                },
                children: [
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '15px',
                        fontWeight: 800,
                        color: accentLabelColor,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                      },
                      children: 'Where',
                    },
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '21px',
                        fontWeight: 600,
                        color: textColor,
                        lineHeight: 1.4,
                      },
                      children: where,
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
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px',
        },
        children: [
          // Live status and show name.
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '18px',
                marginBottom: '52px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 17px',
                      borderRadius: '100px',
                      background: accentColor,
                      color: badgeTextColor,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '10px',
                            height: '10px',
                            minWidth: '10px',
                            borderRadius: '50%',
                            background: badgeTextColor,
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 800,
                            color: badgeTextColor,
                          },
                          children: 'Recording live',
                        },
                      },
                    ],
                  },
                },
                ...(showName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 700,
                            color: textColor,
                          },
                          children: showName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },

          // Episode topic.
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                minHeight: 0,
                alignItems: 'center',
              },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 800,
                    color: textColor,
                    lineHeight: 1.15,
                    margin: 0,
                    maxWidth: '1040px',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 3,
                    overflowWrap: 'break-word',
                  },
                  children: title,
                },
              },
            },
          },

          // Event details. Hide the entire section when both values are empty.
          ...(metaItems.length
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '64px',
                      paddingTop: '28px',
                      marginTop: '30px',
                      borderTop: `1px solid ${textColor}22`,
                    },
                    children: metaItems,
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
