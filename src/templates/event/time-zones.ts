import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'event-time-zones',
  name: 'Time Zones',
  category: 'event',
  description: 'Event schedule showing local times across multiple cities and time zones.',
  tags: ['timezones', 'schedule', 'global', 'remote', 'event', 'agenda'],
  fields: [
    commonFields.title,
    commonFields.date,
    {
      key: 'city1',
      label: 'City 1',
      type: 'text' as const,
      defaultValue: 'San Francisco',
      placeholder: 'San Francisco',
      group: 'Content' as const,
    },
    {
      key: 'time1',
      label: 'Time 1',
      type: 'text' as const,
      defaultValue: '9:00 AM',
      placeholder: '9:00 AM',
      group: 'Content' as const,
    },
    {
      key: 'city2',
      label: 'City 2',
      type: 'text' as const,
      defaultValue: 'New York',
      placeholder: 'New York',
      group: 'Content' as const,
    },
    {
      key: 'time2',
      label: 'Time 2',
      type: 'text' as const,
      defaultValue: '12:00 PM',
      placeholder: '12:00 PM',
      group: 'Content' as const,
    },
    {
      key: 'city3',
      label: 'City 3',
      type: 'text' as const,
      defaultValue: 'London',
      placeholder: 'London',
      group: 'Content' as const,
    },
    {
      key: 'time3',
      label: 'Time 3',
      type: 'text' as const,
      defaultValue: '5:00 PM',
      placeholder: '5:00 PM',
      group: 'Content' as const,
    },
    {
      key: 'city4',
      label: 'City 4',
      type: 'text' as const,
      defaultValue: 'Bangalore',
      placeholder: 'Bangalore',
      group: 'Content' as const,
    },
    {
      key: 'time4',
      label: 'Time 4',
      type: 'text' as const,
      defaultValue: '10:30 PM',
      placeholder: '10:30 PM',
      group: 'Content' as const,
    },
    {
      key: 'note',
      label: 'Note',
      type: 'text' as const,
      defaultValue: 'Online, free to join',
      placeholder: 'Online, free to join',
      group: 'Content' as const,
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Open Source Office Hours: Live Q&A',
    date: 'Thursday, March 12',
    city1: 'San Francisco',
    time1: '9:00 AM',
    city2: 'New York',
    time2: '12:00 PM',
    city3: 'London',
    time3: '5:00 PM',
    city4: 'Bangalore',
    time4: '10:30 PM',
    note: 'Online, free to join',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#38bdf8',
    textColor: '#F8FAFC',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'Event Title').trim();
    const date = String(params.date || '').trim();
    const note = String(params.note || '').trim();
    const siteName = String(params.siteName || '').trim();
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#F8FAFC');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.35) : accentColor;
    const mutedColor = mixColors(textColor, bgColor, lightBg ? 0.35 : 0.4);
    const subtleColor = mixColors(textColor, bgColor, lightBg ? 0.5 : 0.55);
    const panelBg = mixColors(bgColor, textColor, lightBg ? 0.03 : 0.06);
    const panelBorder = mixColors(bgColor, textColor, lightBg ? 0.12 : 0.18);

    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 32, size: 52 },
      { maxLen: 48, size: 44 },
      { maxLen: 64, size: 38 },
      { maxLen: 90, size: 32 },
    ]);
    const title = truncate(rawTitle, 90);

    const entries = Array.from({ length: 4 }, (_, index) => {
      const city = String(params[`city${index + 1}`] ?? '').trim();
      const time = String(params[`time${index + 1}`] ?? '').trim();
      return { city: truncate(city, 18), time };
    }).filter((entry) => entry.time.length > 0);

    const hasEntries = entries.length > 0;

    const header = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
        },
        children: [
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                margin: 0,
              },
              children: title,
            },
          },
          ...(date
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 500,
                      color: mutedColor,
                      marginTop: '14px',
                    },
                    children: date,
                  },
                },
              ]
            : []),
        ],
      },
    };

    const row = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          gap: '20px',
          width: '100%',
        },
        children: entries.map((entry) => {
          const timeSize = autoFontSize(entry.time, [
            { maxLen: 8, size: 40 },
            { maxLen: 12, size: 32 },
            { maxLen: 18, size: 26 },
          ]);

          return {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                minWidth: 0,
                padding: '28px 20px',
                boxSizing: 'border-box',
                background: panelBg,
                border: `1px solid ${panelBorder}`,
                borderTop: `3px solid ${accentInk}`,
                borderRadius: '16px',
              },
              children: [
                ...(entry.city
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: mutedColor,
                            marginBottom: '10px',
                            maxWidth: '100%',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          children: entry.city,
                        },
                      },
                    ]
                  : []),
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: `${timeSize}px`,
                      fontWeight: 700,
                      color: accentInk,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      maxWidth: '100%',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    children: entry.time,
                  },
                },
              ],
            },
          };
        }),
      },
    };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          padding: '60px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          header,
          ...(hasEntries
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      width: '100%',
                      marginTop: '40px',
                    },
                    children: row,
                  },
                },
              ]
            : []),
          ...(note
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: subtleColor,
                      marginTop: '24px',
                    },
                    children: note,
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
                      letterSpacing: '0.02em',
                      marginTop: 'auto',
                    },
                    children: siteName,
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
