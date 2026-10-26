import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-agenda',
  name: 'Agenda',
  category: 'event',
  description: 'Schedule overview with a vertical timeline of sessions and event details',
  tags: ['agenda', 'schedule', 'timeline', 'event', 'conference'],
  fields: [
    commonFields.title,
    commonFields.date,
    {
      key: 'location',
      label: 'Location',
      type: 'text' as const,
      defaultValue: 'San Francisco, CA',
      placeholder: 'San Francisco, CA',
      group: 'Content' as const,
    },
    {
      key: 'session1Time',
      label: 'Session 1 Time',
      type: 'text' as const,
      defaultValue: '09:00 AM',
      placeholder: '09:00 AM',
      group: 'Content' as const,
    },
    {
      key: 'session1Title',
      label: 'Session 1 Title',
      type: 'text' as const,
      defaultValue: 'Keynote: The Future of Web',
      placeholder: 'Session 1 Title',
      group: 'Content' as const,
    },
    {
      key: 'session2Time',
      label: 'Session 2 Time',
      type: 'text' as const,
      defaultValue: '10:30 AM',
      placeholder: '10:30 AM',
      group: 'Content' as const,
    },
    {
      key: 'session2Title',
      label: 'Session 2 Title',
      type: 'text' as const,
      defaultValue: 'Building Resilient Systems',
      placeholder: 'Session 2 Title',
      group: 'Content' as const,
    },
    {
      key: 'session3Time',
      label: 'Session 3 Time',
      type: 'text' as const,
      defaultValue: '01:30 PM',
      placeholder: '01:30 PM (optional)',
      group: 'Content' as const,
    },
    {
      key: 'session3Title',
      label: 'Session 3 Title',
      type: 'text' as const,
      defaultValue: 'Hands-on Deep Dive Workshop',
      placeholder: 'Session 3 Title (optional)',
      group: 'Content' as const,
    },
    {
      key: 'session4Time',
      label: 'Session 4 Time',
      type: 'text' as const,
      defaultValue: '03:45 PM',
      placeholder: '03:45 PM (optional)',
      group: 'Content' as const,
    },
    {
      key: 'session4Title',
      label: 'Session 4 Title',
      type: 'text' as const,
      defaultValue: 'Closing Panel & Discussion',
      placeholder: 'Session 4 Title (optional)',
      group: 'Content' as const,
    },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0f0f23' },
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Tech Summit 2026',
    date: 'Oct 24, 2026',
    location: 'San Francisco, CA',
    session1Time: '09:00 AM',
    session1Title: 'Keynote: The Future of Web',
    session2Time: '10:30 AM',
    session2Title: 'Building Resilient Systems',
    session3Time: '01:30 PM',
    session3Title: 'Hands-on Deep Dive Workshop',
    session4Time: '03:45 PM',
    session4Title: 'Closing Panel & Discussion',
    siteName: 'techsummit.io',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Tech Summit 2026'), 60);
    const date = String(params.date || '').trim();
    const location = String(params.location || '').trim();
    const siteName = String(params.siteName || '').trim();
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const titleSize = autoFontSize(title, [
      { maxLen: 18, size: 52 },
      { maxLen: 28, size: 44 },
      { maxLen: 42, size: 36 },
      { maxLen: 60, size: 30 },
    ]);

    const rawSessions = [
      {
        time: String(params.session1Time ?? '').trim(),
        title: String(params.session1Title ?? '').trim(),
      },
      {
        time: String(params.session2Time ?? '').trim(),
        title: String(params.session2Title ?? '').trim(),
      },
      {
        time: String(params.session3Time ?? '').trim(),
        title: String(params.session3Title ?? '').trim(),
      },
      {
        time: String(params.session4Time ?? '').trim(),
        title: String(params.session4Title ?? '').trim(),
      },
    ];

    const sessions = rawSessions
      .filter((s) => s.time.length > 0 || s.title.length > 0)
      .map((s) => ({
        time: truncate(s.time, 20),
        title: truncate(s.title, 55),
      }));

    const sessionCount = sessions.length;

    let sessionTitleSize = 18;
    let timeSize = 13;
    let itemPaddingBottom = '26px';

    if (sessionCount <= 2) {
      sessionTitleSize = 22;
      timeSize = 15;
      itemPaddingBottom = '48px';
    } else if (sessionCount === 3) {
      sessionTitleSize = 20;
      timeSize = 14;
      itemPaddingBottom = '34px';
    }

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
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
                height: '6px',
                backgroundColor: accentColor,
              },
              children: '',
            },
          },
          // Two-column layout container
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                flex: 1,
                width: '1200px',
                padding: '44px 56px',
                boxSizing: 'border-box',
              },
              children: [
                // Left column (~40%)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '420px',
                      height: '100%',
                    },
                    children: [
                      // Date badge
                      ...(date
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignSelf: 'flex-start',
                                  padding: '6px 14px',
                                  backgroundColor: `${accentColor}20`,
                                  border: `1.5px solid ${accentColor}88`,
                                  borderRadius: '6px',
                                  marginBottom: '20px',
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: accentColor,
                                      letterSpacing: '0.04em',
                                      fontFamily: 'Inter, sans-serif',
                                    },
                                    children: date,
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
                            lineHeight: 1.15,
                            margin: 0,
                            fontFamily: 'Playfair Display, serif',
                          },
                          children: title,
                        },
                      },
                      // Location & SiteName
                      ...(location || siteName
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '8px',
                                  marginTop: '28px',
                                },
                                children: [
                                  ...(location
                                    ? [
                                        {
                                          type: 'div',
                                          props: {
                                            style: {
                                              display: 'flex',
                                              alignItems: 'center',
                                              gap: '8px',
                                            },
                                            children: [
                                              {
                                                type: 'div',
                                                props: {
                                                  style: {
                                                    display: 'flex',
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '3px',
                                                    backgroundColor: accentColor,
                                                    flexShrink: 0,
                                                  },
                                                  children: '',
                                                },
                                              },
                                              {
                                                type: 'span',
                                                props: {
                                                  style: {
                                                    fontSize: '16px',
                                                    color: `${textColor}aa`,
                                                    fontWeight: 500,
                                                    fontFamily: 'Inter, sans-serif',
                                                  },
                                                  children: truncate(location, 40),
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ]
                                    : []),
                                  ...(siteName
                                    ? [
                                        {
                                          type: 'div',
                                          props: {
                                            style: {
                                              display: 'flex',
                                            },
                                            children: {
                                              type: 'span',
                                              props: {
                                                style: {
                                                  fontSize: '14px',
                                                  color: `${textColor}55`,
                                                  letterSpacing: '0.02em',
                                                  fontFamily: 'Inter, sans-serif',
                                                },
                                                children: truncate(siteName, 35),
                                              },
                                            },
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
                },
                // Right column (timeline)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      flex: 1,
                      justifyContent: 'center',
                      marginLeft: '50px',
                    },
                    children:
                      sessions.length > 0
                        ? sessions.map((session, i) => {
                            const isLast = i === sessions.length - 1;
                            return {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'row',
                                  alignItems: 'stretch',
                                },
                                children: [
                                  // Left track (Dot + connecting line)
                                  {
                                    type: 'div',
                                    props: {
                                      style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        width: '20px',
                                        flexShrink: 0,
                                      },
                                      children: [
                                        // Dot
                                        {
                                          type: 'div',
                                          props: {
                                            style: {
                                              display: 'flex',
                                              width: '12px',
                                              height: '12px',
                                              borderRadius: '6px',
                                              backgroundColor: accentColor,
                                              flexShrink: 0,
                                            },
                                            children: '',
                                          },
                                        },
                                        // Connecting line (stops at the last session)
                                        ...(!isLast
                                          ? [
                                              {
                                                type: 'div',
                                                props: {
                                                  style: {
                                                    display: 'flex',
                                                    width: '2px',
                                                    flex: 1,
                                                    backgroundColor: `${accentColor}80`,
                                                  },
                                                  children: '',
                                                },
                                              },
                                            ]
                                          : []),
                                      ],
                                    },
                                  },
                                  // Session Details (Time + Title)
                                  {
                                    type: 'div',
                                    props: {
                                      style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                        marginLeft: '20px',
                                        paddingBottom: !isLast ? itemPaddingBottom : '0px',
                                      },
                                      children: [
                                        ...(session.time
                                          ? [
                                              {
                                                type: 'div',
                                                props: {
                                                  style: {
                                                    display: 'flex',
                                                    fontFamily: 'JetBrains Mono, monospace',
                                                    fontSize: `${timeSize}px`,
                                                    fontWeight: 500,
                                                    color: `${textColor}88`,
                                                    letterSpacing: '0.04em',
                                                    marginBottom: '4px',
                                                    lineHeight: 1,
                                                  },
                                                  children: session.time,
                                                },
                                              },
                                            ]
                                          : []),
                                        ...(session.title
                                          ? [
                                              {
                                                type: 'div',
                                                props: {
                                                  style: {
                                                    display: 'flex',
                                                    fontFamily: 'Inter, sans-serif',
                                                    fontSize: `${sessionTitleSize}px`,
                                                    fontWeight: 600,
                                                    color: textColor,
                                                    lineHeight: 1.3,
                                                  },
                                                  children: session.title,
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
                          })
                        : [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                },
                                children: '',
                              },
                            },
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
