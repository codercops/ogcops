import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-workshop',
  name: 'Workshop',
  category: 'event',
  description: 'Hands-on workshop card with instructor, duration, and skill level badge',
  tags: ['workshop', 'hands-on', 'training', 'event'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'instructor', label: 'Instructor', type: 'text' as const, defaultValue: '', placeholder: 'Instructor name', group: 'Content' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const, defaultValue: '', placeholder: '3 hours', group: 'Content' as const },
    { key: 'skillLevel', label: 'Skill Level', type: 'select' as const, defaultValue: 'intermediate', options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }], group: 'Content' as const },
    commonFields.date,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Hands-On Kubernetes Workshop',
    description: 'Deploy, scale, and manage containerized applications',
    instructor: 'Alex Chen',
    duration: '3 hours',
    skillLevel: 'intermediate',
    date: 'Apr 5, 2026',
    siteName: '',
    bgColor: '#0a192f',
    accentColor: '#64ffda',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Workshop Title'), 70);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const instructor = String(params.instructor || '');
    const duration = String(params.duration || '');
    const skillLevel = String(params.skillLevel || 'intermediate');
    const date = String(params.date || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a192f');
    const accentColor = String(params.accentColor || '#64ffda');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 60, size: 38 },
      { maxLen: 80, size: 32 },
    ]);

    const levelColors: Record<string, string> = {
      beginner: '#4CAF50',
      intermediate: '#FF9800',
      advanced: '#F44336',
    };
    const levelColor = levelColors[skillLevel] || '#FF9800';

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
          padding: '60px',
        },
        children: [
          // Top: WORKSHOP label + badges
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '36px',
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
                      // Workshop label
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 16px',
                            background: `${accentColor}22`,
                            borderRadius: '6px',
                            border: `1px solid ${accentColor}66`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '13px',
                                fontWeight: 700,
                                color: accentColor,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                              },
                              children: 'WORKSHOP',
                            },
                          },
                        },
                      },
                      // Skill level badge
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 16px',
                            background: `${levelColor}22`,
                            borderRadius: '6px',
                            border: `1px solid ${levelColor}66`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '13px',
                                fontWeight: 700,
                                color: levelColor,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                              },
                              children: skillLevel,
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                // Duration
                ...(duration
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 16px',
                            background: `${textColor}11`,
                            borderRadius: '6px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '14px', fontWeight: 600, color: `${textColor}88` },
                              children: duration,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
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
                      fontSize: '20px',
                      color: `${textColor}77`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '16px',
                      maxWidth: '800px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom: instructor + date + site
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
                      gap: '12px',
                    },
                    children: [
                      ...(instructor
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: `${textColor}55`, textTransform: 'uppercase', letterSpacing: '0.06em' },
                                children: 'Instructor',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', fontWeight: 600, color: `${textColor}cc` },
                                children: instructor,
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
                      gap: '16px',
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
