import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-speaker-spotlight',
  name: 'Speaker Spotlight',
  category: 'event',
  description: 'Large speaker focus area with talk title and event branding',
  tags: ['speaker', 'spotlight', 'talk', 'keynote', 'event'],
  fields: [
    commonFields.title,
    { key: 'speaker', label: 'Speaker Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Doe', group: 'Content' as const },
    { key: 'speakerRole', label: 'Speaker Role', type: 'text' as const, defaultValue: '', placeholder: 'VP of Engineering', group: 'Content' as const },
    { key: 'eventName', label: 'Event Name', type: 'text' as const, defaultValue: '', placeholder: 'DevConf 2026', group: 'Content' as const },
    commonFields.date,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Future of AI-Powered Development',
    speaker: 'Sarah Johnson',
    speakerRole: 'VP of Engineering at TechCorp',
    eventName: 'DevConf 2026',
    date: 'Mar 16, 2026',
    siteName: '',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Talk Title'), 80);
    const speaker = String(params.speaker || '');
    const speakerRole = String(params.speakerRole || '');
    const eventName = String(params.eventName || '');
    const date = String(params.date || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 40 },
      { maxLen: 50, size: 34 },
      { maxLen: 70, size: 28 },
      { maxLen: 100, size: 24 },
    ]);

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
          // Left: Speaker area
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
                background: `linear-gradient(180deg, ${accentColor}33 0%, ${accentColor}11 100%)`,
                borderRight: `3px solid ${accentColor}`,
                padding: '40px',
              },
              children: [
                // Large avatar circle
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '160px',
                      height: '160px',
                      borderRadius: '50%',
                      background: `${accentColor}22`,
                      border: `4px solid ${accentColor}`,
                      marginBottom: '28px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '64px',
                          fontWeight: 700,
                          color: accentColor,
                          fontFamily: 'Playfair Display, serif',
                        },
                        children: speaker ? speaker.charAt(0).toUpperCase() : '?',
                      },
                    },
                  },
                },
                // Speaker name
                ...(speaker
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '28px',
                            fontWeight: 700,
                            color: textColor,
                            textAlign: 'center',
                          },
                          children: speaker,
                        },
                      },
                    ]
                  : []),
                // Speaker role
                ...(speakerRole
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: `${textColor}77`,
                            textAlign: 'center',
                            marginTop: '8px',
                          },
                          children: speakerRole,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: Talk details
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
                // Event name badge
                ...(eventName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginBottom: '24px',
                          },
                          children: {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                padding: '6px 16px',
                                background: `${accentColor}22`,
                                borderRadius: '6px',
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: {
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    color: accentColor,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                  },
                                  children: eventName,
                                },
                              },
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Talk title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.3,
                      margin: 0,
                      fontFamily: 'Playfair Display, serif',
                    },
                    children: title,
                  },
                },
                // Bottom info
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: 'auto',
                      paddingTop: '32px',
                    },
                    children: [
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: `${textColor}66` },
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
                                style: { fontSize: '16px', color: `${textColor}44` },
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
        ],
      },
    };
  },
};

export default template;
