import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-meetup',
  name: 'Meetup',
  category: 'event',
  description: 'Casual meetup card with prominent date badge and topic tag',
  tags: ['meetup', 'casual', 'community', 'event'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'topic', label: 'Topic', type: 'text' as const, defaultValue: '', placeholder: 'React, AI, DevOps...', group: 'Content' as const },
    commonFields.date,
    { key: 'time', label: 'Time', type: 'text' as const, defaultValue: '', placeholder: '6:30 PM', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'Downtown Hub', group: 'Content' as const },
    { key: 'groupName', label: 'Group Name', type: 'text' as const, defaultValue: '', placeholder: 'JS Enthusiasts', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Monthly Dev Meetup',
    description: 'Join us for talks, networking, and pizza!',
    topic: 'React & TypeScript',
    date: 'Feb 20',
    time: '6:30 PM',
    location: 'WeWork Downtown',
    groupName: 'JS Enthusiasts',
    bgColor: '#1a1a2e',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Monthly Dev Meetup'), 70);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const topic = String(params.topic || '');
    const date = String(params.date || '');
    const time = String(params.time || '');
    const location = String(params.location || '');
    const groupName = String(params.groupName || '');
    const bgColor = String(params.bgColor || '#1a1a2e');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 56 },
      { maxLen: 40, size: 48 },
      { maxLen: 60, size: 40 },
      { maxLen: 80, size: 34 },
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
          // Left: Date badge column
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '280px',
                height: '630px',
                background: accentColor,
                padding: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.15)',
                      borderRadius: '20px',
                      padding: '32px 24px',
                    },
                    children: [
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '56px',
                                  fontWeight: 800,
                                  color: '#FFFFFF',
                                  lineHeight: 1,
                                },
                                children: date.split(' ')[1] || date,
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '20px',
                                  fontWeight: 600,
                                  color: 'rgba(255,255,255,0.85)',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.1em',
                                  marginTop: '4px',
                                },
                                children: date.split(' ')[0] || '',
                              },
                            },
                          ]
                        : [{ type: 'div', props: { children: '' } }]),
                      ...(time
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: 'rgba(255,255,255,0.7)',
                                  marginTop: '12px',
                                },
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
          // Right: Content
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
                // Group name
                ...(groupName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                          },
                          children: groupName,
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
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
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
                            fontSize: '18px',
                            color: `${textColor}88`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '16px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Topic pill + location
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '32px',
                    },
                    children: [
                      ...(topic
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  padding: '8px 18px',
                                  background: `${accentColor}22`,
                                  borderRadius: '100px',
                                  border: `1px solid ${accentColor}44`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: { fontSize: '14px', fontWeight: 600, color: accentColor },
                                    children: topic,
                                  },
                                },
                              },
                            },
                          ]
                        : []),
                      ...(location
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: `${textColor}66` },
                                children: location,
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
