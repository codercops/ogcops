import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-course-card',
  name: 'Course Card',
  category: 'tutorial',
  description: 'Title, instructor, duration pill, and difficulty badge',
  tags: ['tutorial', 'course', 'card', 'education'],
  fields: [
    commonFields.title,
    { key: 'instructor', label: 'Instructor', type: 'text', defaultValue: 'Jane Smith', placeholder: 'Instructor name', group: 'Content' },
    { key: 'duration', label: 'Duration', type: 'text', defaultValue: '4h 30m', placeholder: '4h 30m', group: 'Content' },
    { key: 'difficulty', label: 'Difficulty', type: 'select', defaultValue: 'Intermediate', options: [{ label: 'Beginner', value: 'Beginner' }, { label: 'Intermediate', value: 'Intermediate' }, { label: 'Advanced', value: 'Advanced' }], group: 'Content' },
    { key: 'lessons', label: 'Lesson Count', type: 'text', defaultValue: '24 lessons', placeholder: '24 lessons', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Mastering React Server Components',
    instructor: 'Jane Smith',
    duration: '4h 30m',
    difficulty: 'Intermediate',
    lessons: '24 lessons',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Mastering React Server Components'), 70);
    const instructor = String(params.instructor || '');
    const duration = String(params.duration || '');
    const difficulty = String(params.difficulty || 'Intermediate');
    const lessons = String(params.lessons || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 50, size: 44 },
      { maxLen: 70, size: 36 },
      { maxLen: 90, size: 30 },
    ]);

    const difficultyColors: Record<string, string> = {
      Beginner: '#10B981',
      Intermediate: '#F59E0B',
      Advanced: '#EF4444',
    };
    const diffColor = difficultyColors[difficulty] || accentColor;

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
          padding: '60px',
        },
        children: [
          // Top: difficulty badge + duration
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '6px 18px',
                      backgroundColor: `${diffColor}22`,
                      borderRadius: '100px',
                      border: `1px solid ${diffColor}44`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: diffColor,
                        },
                        children: difficulty,
                      },
                    },
                  },
                },
                ...(duration
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 18px',
                            backgroundColor: `${textColor}0F`,
                            borderRadius: '100px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 500,
                                color: `${textColor}AA`,
                              },
                              children: duration,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                ...(lessons
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 18px',
                            backgroundColor: `${textColor}0F`,
                            borderRadius: '100px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 500,
                                color: `${textColor}AA`,
                              },
                              children: lessons,
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
                flex: 1,
              },
              children: title,
            },
          },
          // Bottom: instructor
          ...(instructor
            ? [
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
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '20px', fontWeight: 700, color: '#FFFFFF' },
                              children: instructor.charAt(0).toUpperCase(),
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
                                style: { fontSize: '12px', color: `${textColor}55` },
                                children: 'Instructor',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', fontWeight: 500, color: `${textColor}CC` },
                                children: instructor,
                              },
                            },
                          ],
                        },
                      },
                    ],
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
