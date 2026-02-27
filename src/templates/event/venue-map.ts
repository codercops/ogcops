import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-venue-map',
  name: 'Venue Map',
  category: 'event',
  description: 'Simplified venue illustration with colored blocks and event details',
  tags: ['venue', 'map', 'location', 'event'],
  fields: [
    commonFields.title,
    { key: 'venue', label: 'Venue Name', type: 'text' as const, defaultValue: '', placeholder: 'Moscone Center', group: 'Content' as const },
    { key: 'address', label: 'Address', type: 'text' as const, defaultValue: '', placeholder: '747 Howard St', group: 'Content' as const },
    { key: 'city', label: 'City', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco, CA', group: 'Content' as const },
    commonFields.date,
    { key: 'time', label: 'Time', type: 'text' as const, defaultValue: '', placeholder: '9:00 AM – 6:00 PM', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'DevConf 2026',
    venue: 'Moscone Center',
    address: '747 Howard St',
    city: 'San Francisco, CA',
    date: 'Mar 15, 2026',
    time: '9:00 AM – 6:00 PM',
    siteName: '',
    bgColor: '#1a1a2e',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Event'), 50);
    const venue = String(params.venue || '');
    const address = String(params.address || '');
    const city = String(params.city || '');
    const date = String(params.date || '');
    const time = String(params.time || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#1a1a2e');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 48 },
      { maxLen: 35, size: 40 },
      { maxLen: 50, size: 34 },
      { maxLen: 70, size: 28 },
    ]);

    // Venue illustration blocks
    const blocks = [
      { x: 40, y: 80, w: 180, h: 120, color: `${accentColor}33` },
      { x: 60, y: 50, w: 60, h: 30, color: `${accentColor}55` },
      { x: 20, y: 220, w: 220, h: 8, color: `${accentColor}22` },
      { x: 240, y: 100, w: 100, h: 100, color: `${accentColor}22` },
      { x: 260, y: 70, w: 40, h: 30, color: `${accentColor}44` },
      { x: 0, y: 240, w: 360, h: 4, color: `${textColor}15` },
    ];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: Venue illustration area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '420px',
                height: '630px',
                background: `${accentColor}08`,
                position: 'relative',
                overflow: 'hidden',
              },
              children: [
                // Building blocks
                ...blocks.map((b) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${b.x}px`,
                      top: `${b.y + 120}px`,
                      width: `${b.w}px`,
                      height: `${b.h}px`,
                      background: b.color,
                      borderRadius: '4px',
                    },
                    children: '',
                  },
                })),
                // Pin icon (triangle + circle)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'absolute',
                      left: '160px',
                      top: '160px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: accentColor,
                            border: `3px solid ${textColor}`,
                          },
                          children: '',
                        },
                      },
                    ],
                  },
                },
                // Venue label
                ...(venue
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            position: 'absolute',
                            bottom: '60px',
                            padding: '10px 24px',
                            background: accentColor,
                            borderRadius: '8px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                              },
                              children: venue,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: Event details
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
              },
              children: [
                // Event name
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      marginBottom: '32px',
                    },
                    children: title,
                  },
                },
                // Venue details
                ...(venue
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            marginBottom: '24px',
                            paddingBottom: '24px',
                            borderBottom: `1px solid ${textColor}15`,
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '12px', fontWeight: 600, color: `${textColor}55`, letterSpacing: '0.1em', textTransform: 'uppercase' },
                                children: 'VENUE',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '22px', fontWeight: 600, color: `${textColor}dd` },
                                children: venue,
                              },
                            },
                            ...(address
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: `${textColor}77` },
                                      children: address,
                                    },
                                  },
                                ]
                              : []),
                            ...(city
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: `${textColor}66` },
                                      children: city,
                                    },
                                  },
                                ]
                              : []),
                          ],
                        },
                      },
                    ]
                  : []),
                // Date & time
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    },
                    children: [
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', fontWeight: 600, color: accentColor },
                                children: date,
                              },
                            },
                          ]
                        : []),
                      ...(time
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: `${textColor}77` },
                                children: time,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44`, marginTop: 'auto', paddingTop: '24px' },
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
    };
  },
};

export default template;
