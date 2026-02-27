import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-video-lesson',
  name: 'Video Lesson',
  category: 'tutorial',
  description: 'Video player mockup with progress bar and instructor name',
  tags: ['tutorial', 'video', 'lesson', 'player'],
  fields: [
    commonFields.title,
    { key: 'instructor', label: 'Instructor', type: 'text', defaultValue: 'Alex Johnson', placeholder: 'Instructor name', group: 'Content' },
    { key: 'duration', label: 'Duration', type: 'text', defaultValue: '12:34', placeholder: '12:34', group: 'Content' },
    { key: 'lessonNumber', label: 'Lesson Number', type: 'text', defaultValue: 'Lesson 5 of 20', placeholder: 'Lesson 5 of 20', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Understanding Async/Await in Depth',
    instructor: 'Alex Johnson',
    duration: '12:34',
    lessonNumber: 'Lesson 5 of 20',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Understanding Async/Await in Depth'), 70);
    const instructor = String(params.instructor || '');
    const duration = String(params.duration || '');
    const lessonNumber = String(params.lessonNumber || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 36 },
      { maxLen: 50, size: 30 },
      { maxLen: 70, size: 26 },
      { maxLen: 90, size: 22 },
    ]);

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
          padding: '40px',
        },
        children: [
          // Video player mockup
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: '#111111',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #222',
              },
              children: [
                // Video area (dark with play button)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, #111 0%, #1a1a1a 100%)`,
                    },
                    children: [
                      // Play button circle
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '32px',
                                color: '#FFFFFF',
                                marginLeft: '4px',
                              },
                              children: '\u25B6',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                // Progress bar area
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '16px 24px',
                      gap: '12px',
                    },
                    children: [
                      // Progress bar
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '100%',
                            height: '4px',
                            backgroundColor: '#333',
                            borderRadius: '2px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '25%',
                                  height: '4px',
                                  backgroundColor: accentColor,
                                  borderRadius: '2px',
                                },
                                children: [],
                              },
                            },
                          ],
                        },
                      },
                      // Duration
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '12px', color: '#666' },
                                children: '0:00',
                              },
                            },
                            ...(duration
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '12px', color: '#666' },
                                      children: duration,
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
          },
          // Bottom info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                    },
                    children: [
                      ...(lessonNumber
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: accentColor, fontWeight: 500 },
                                children: lessonNumber,
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 700,
                            color: textColor,
                          },
                          children: title,
                        },
                      },
                    ],
                  },
                },
                ...(instructor
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}88` },
                          children: instructor,
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
