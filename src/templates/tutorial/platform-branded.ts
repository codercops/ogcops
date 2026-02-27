import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-platform-branded',
  name: 'Platform Branded',
  category: 'tutorial',
  description: 'Platform name with course title and rating stars',
  tags: ['tutorial', 'platform', 'branded', 'rating'],
  fields: [
    commonFields.title,
    { key: 'platform', label: 'Platform Name', type: 'text', defaultValue: 'LearnHub', placeholder: 'Platform name', required: true, group: 'Content' },
    { key: 'instructor', label: 'Instructor', type: 'text', defaultValue: 'Sarah Chen', placeholder: 'Instructor name', group: 'Content' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 5, min: 1, max: 5, group: 'Content' },
    { key: 'students', label: 'Student Count', type: 'text', defaultValue: '12,500 students', placeholder: '12,500 students', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Complete Web Development Bootcamp',
    platform: 'LearnHub',
    instructor: 'Sarah Chen',
    rating: 5,
    students: '12,500 students',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'The Complete Web Development Bootcamp'), 70);
    const platform = String(params.platform || 'LearnHub');
    const instructor = String(params.instructor || '');
    const rating = Math.min(5, Math.max(1, Number(params.rating) || 5));
    const students = String(params.students || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 48 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
      { maxLen: 90, size: 28 },
    ]);

    const stars = Array.from({ length: 5 }, (_, i) => ({
      type: 'span',
      props: {
        style: {
          fontSize: '24px',
          color: i < rating ? '#F5C518' : '#333',
        },
        children: '\u2605',
      },
    }));

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
          // Platform header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: accentColor,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '20px', fontWeight: 800, color: '#FFFFFF' },
                        children: platform.charAt(0).toUpperCase(),
                      },
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 700,
                      color: textColor,
                    },
                    children: platform,
                  },
                },
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
                marginBottom: '24px',
                flex: 1,
              },
              children: title,
            },
          },
          // Stars + students
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '2px' },
                    children: stars,
                  },
                },
                ...(students
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}66` },
                          children: students,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Instructor
          ...(instructor
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}88`,
                    },
                    children: `by ${instructor}`,
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
