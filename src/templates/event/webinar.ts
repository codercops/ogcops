import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-webinar',
  name: 'Webinar',
  category: 'event',
  description: 'Live webinar card with "LIVE" badge, speaker name, and time',
  tags: ['webinar', 'live', 'online', 'speaker', 'event'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'speaker', label: 'Speaker', type: 'text' as const, defaultValue: '', placeholder: 'Speaker name', group: 'Content' as const },
    { key: 'speakerRole', label: 'Speaker Role', type: 'text' as const, defaultValue: '', placeholder: 'CTO at Acme', group: 'Content' as const },
    commonFields.date,
    { key: 'time', label: 'Time', type: 'text' as const, defaultValue: '', placeholder: '2:00 PM EST', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Building Scalable APIs with GraphQL',
    description: 'Learn best practices for production GraphQL services',
    speaker: 'Jane Smith',
    speakerRole: 'Senior Engineer at Acme',
    date: 'Mar 12, 2026',
    time: '2:00 PM EST',
    siteName: '',
    bgColor: '#0d1117',
    accentColor: '#FF4444',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Webinar Title'), 80);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const speaker = String(params.speaker || '');
    const speakerRole = String(params.speakerRole || '');
    const date = String(params.date || '');
    const time = String(params.time || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#FF4444');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 50, size: 44 },
      { maxLen: 70, size: 38 },
      { maxLen: 100, size: 32 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(160deg, ${bgColor} 0%, #1a1a3e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top: LIVE badge + date/time
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '40px',
              },
              children: [
                // LIVE badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px 20px',
                      background: accentColor,
                      borderRadius: '100px',
                    },
                    children: [
                      // Pulsing dot (static circle)
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: '#FFFFFF',
                          },
                          children: '',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                          },
                          children: 'LIVE WEBINAR',
                        },
                      },
                    ],
                  },
                },
                // Date & time
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    },
                    children: [
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: `${textColor}88` },
                                children: date,
                              },
                            },
                          ]
                        : []),
                      ...(date && time
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: `${textColor}44` },
                                children: '·',
                              },
                            },
                          ]
                        : []),
                      ...(time
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 600, color: `${textColor}aa` },
                                children: time,
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
          // Title
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1 },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.2,
                    margin: 0,
                    maxWidth: '900px',
                  },
                  children: title,
                },
              },
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}77`,
                      lineHeight: 1.4,
                      margin: 0,
                      marginBottom: '24px',
                      maxWidth: '700px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom: speaker info + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
                paddingTop: '24px',
                borderTop: `1px solid ${textColor}15`,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      // Speaker avatar placeholder
                      ...(speaker
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '48px',
                                  height: '48px',
                                  borderRadius: '50%',
                                  background: `${accentColor}33`,
                                  border: `2px solid ${accentColor}`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: { fontSize: '20px', fontWeight: 700, color: accentColor },
                                    children: speaker.charAt(0).toUpperCase(),
                                  },
                                },
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', flexDirection: 'column' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '18px', fontWeight: 600, color: `${textColor}dd` },
                                      children: speaker,
                                    },
                                  },
                                  ...(speakerRole
                                    ? [
                                        {
                                          type: 'span',
                                          props: {
                                            style: { fontSize: '14px', color: `${textColor}66` },
                                            children: speakerRole,
                                          },
                                        },
                                      ]
                                    : []),
                                ],
                              },
                            },
                          ]
                        : [{ type: 'div', props: { children: '' } }]),
                    ],
                  },
                },
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '16px', color: `${textColor}44` },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
