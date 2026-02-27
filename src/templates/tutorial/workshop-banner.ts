import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-workshop-banner',
  name: 'Workshop Banner',
  category: 'tutorial',
  description: '"Live Workshop" badge with date and topic details',
  tags: ['tutorial', 'workshop', 'live', 'banner'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'workshopDate', label: 'Workshop Date', type: 'text', defaultValue: 'March 15, 2026 at 10:00 AM EST', placeholder: 'Date and time', group: 'Content' },
    { key: 'instructor', label: 'Instructor', type: 'text', defaultValue: 'Dr. Emily Rivers', placeholder: 'Instructor name', group: 'Content' },
    { key: 'spots', label: 'Spots Available', type: 'text', defaultValue: '30 spots left', placeholder: '30 spots left', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Building Production-Ready GraphQL APIs',
    description: 'A hands-on workshop covering schema design, performance optimization, and real-world patterns.',
    workshopDate: 'March 15, 2026 at 10:00 AM EST',
    instructor: 'Dr. Emily Rivers',
    spots: '30 spots left',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Building Production-Ready GraphQL APIs'), 70);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const workshopDate = String(params.workshopDate || '');
    const instructor = String(params.instructor || '');
    const spots = String(params.spots || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 48 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
      { maxLen: 90, size: 28 },
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
          padding: '60px',
          borderTop: `4px solid ${accentColor}`,
        },
        children: [
          // Top: badges
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              },
              children: [
                // LIVE badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '8px 20px',
                      backgroundColor: '#EF4444',
                      borderRadius: '6px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: '#FFFFFF',
                          },
                          children: [],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 800,
                            color: '#FFFFFF',
                            letterSpacing: '0.1em',
                          },
                          children: 'LIVE WORKSHOP',
                        },
                      },
                    ],
                  },
                },
                ...(spots
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 500,
                            color: `${textColor}66`,
                          },
                          children: spots,
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
                marginBottom: '20px',
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
                      color: `${textColor}80`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '24px',
                      maxWidth: '900px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom row: date + instructor
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 'auto',
                paddingTop: '24px',
                borderTop: `1px solid ${textColor}1A`,
              },
              children: [
                ...(workshopDate
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: accentColor,
                          },
                          children: workshopDate,
                        },
                      },
                    ]
                  : [{ type: 'div', props: { children: '' } }]),
                ...(instructor
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: `${textColor}88`,
                          },
                          children: `with ${instructor}`,
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
