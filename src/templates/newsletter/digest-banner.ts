import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-digest-banner',
  name: 'Digest Banner',
  category: 'newsletter',
  description: '"Weekly Digest" header with topic highlights below',
  tags: ['newsletter', 'digest', 'banner', 'weekly'],
  fields: [
    commonFields.title,
    { key: 'topic1', label: 'Topic 1', type: 'text', defaultValue: 'AI & Machine Learning', placeholder: 'Topic highlight', group: 'Content' },
    { key: 'topic2', label: 'Topic 2', type: 'text', defaultValue: 'Web Development', placeholder: 'Topic highlight', group: 'Content' },
    { key: 'topic3', label: 'Topic 3', type: 'text', defaultValue: 'Cloud & DevOps', placeholder: 'Topic highlight', group: 'Content' },
    commonFields.siteName,
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Weekly Digest',
    topic1: 'AI & Machine Learning',
    topic2: 'Web Development',
    topic3: 'Cloud & DevOps',
    siteName: 'Tech Digest',
    date: 'Jan 15, 2026',
    bgColor: '#1a1a2e',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Weekly Digest'), 60);
    const topics = [
      String(params.topic1 || ''),
      String(params.topic2 || ''),
      String(params.topic3 || ''),
    ].filter(Boolean);
    const siteName = String(params.siteName || '');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#1a1a2e');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

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
          // Site name + date top bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              },
              children: [
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
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
              ],
            },
          },
          // Accent divider
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '3px',
                background: `linear-gradient(90deg, ${accentColor}, ${accentColor}33)`,
                marginBottom: '40px',
              },
              children: [],
            },
          },
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '72px',
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                marginBottom: '48px',
              },
              children: title,
            },
          },
          // Topic highlights
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'flex-end',
                gap: '16px',
                flexWrap: 'wrap',
              },
              children: topics.map((topic) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 24px',
                    border: `2px solid ${accentColor}66`,
                    borderRadius: '100px',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '18px',
                        fontWeight: 500,
                        color: `${textColor}CC`,
                      },
                      children: topic,
                    },
                  },
                },
              })),
            },
          },
        ],
      },
    };
  },
};

export default template;
