import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-conference',
  name: 'Conference',
  category: 'event',
  description: 'Large event name with date range, location, and bold accent stripe',
  tags: ['conference', 'event', 'bold', 'professional'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.date,
    { key: 'endDate', label: 'End Date', type: 'text' as const, defaultValue: '', placeholder: 'Jan 5, 2026', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco, CA', group: 'Content' as const },
    { key: 'venue', label: 'Venue', type: 'text' as const, defaultValue: '', placeholder: 'Moscone Center', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'DevConf 2026',
    description: 'The premier developer conference',
    date: 'Mar 15',
    endDate: 'Mar 18, 2026',
    location: 'San Francisco, CA',
    venue: 'Moscone Center',
    siteName: '',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'DevConf 2026'), 60);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const date = String(params.date || '');
    const endDate = String(params.endDate || '');
    const location = String(params.location || '');
    const venue = String(params.venue || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 72 },
      { maxLen: 35, size: 60 },
      { maxLen: 50, size: 48 },
      { maxLen: 70, size: 40 },
    ]);
    const dateStr = endDate ? `${date} – ${endDate}` : date;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Top accent stripe
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '1200px',
                height: '8px',
                background: accentColor,
              },
              children: '',
            },
          },
          // Content area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '60px',
              },
              children: [
                // Date range badge
                ...(dateStr
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginBottom: '32px',
                          },
                          children: {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                padding: '10px 24px',
                                background: `${accentColor}22`,
                                border: `2px solid ${accentColor}`,
                                borderRadius: '8px',
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: {
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: accentColor,
                                    letterSpacing: '0.04em',
                                  },
                                  children: dateStr,
                                },
                              },
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      fontFamily: 'Playfair Display, serif',
                    },
                    children: title,
                  },
                },
                // Description
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '22px',
                            color: `${textColor}99`,
                            lineHeight: 1.4,
                            margin: 0,
                            marginTop: '16px',
                            maxWidth: '800px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Bottom: location + venue + site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '32px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          },
                          children: [
                            ...(venue
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '18px', fontWeight: 600, color: `${textColor}cc` },
                                      children: venue,
                                    },
                                  },
                                ]
                              : []),
                            ...(venue && location
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '18px', color: `${textColor}44` },
                                      children: '|',
                                    },
                                  },
                                ]
                              : []),
                            ...(location
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '18px', color: `${textColor}88` },
                                      children: location,
                                    },
                                  },
                                ]
                              : []),
                          ],
                        },
                      },
                      siteName
                        ? {
                            type: 'span',
                            props: {
                              style: { fontSize: '16px', color: `${textColor}55` },
                              children: siteName,
                            },
                          }
                        : { type: 'div', props: { children: '' } },
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
