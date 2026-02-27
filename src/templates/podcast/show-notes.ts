import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-show-notes',
  name: 'Show Notes',
  category: 'podcast',
  description: 'Bulleted topics preview list with episode title and show branding',
  tags: ['podcast', 'show-notes', 'topics', 'list'],
  fields: [
    commonFields.title,
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    { key: 'topic1', label: 'Topic 1', type: 'text' as const, defaultValue: '', placeholder: 'First topic', group: 'Content' as const },
    { key: 'topic2', label: 'Topic 2', type: 'text' as const, defaultValue: '', placeholder: 'Second topic', group: 'Content' as const },
    { key: 'topic3', label: 'Topic 3', type: 'text' as const, defaultValue: '', placeholder: 'Third topic', group: 'Content' as const },
    { key: 'topic4', label: 'Topic 4', type: 'text' as const, defaultValue: '', placeholder: 'Fourth topic', group: 'Content' as const },
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Modern Web Performance Deep Dive',
    showName: 'Code Radio',
    episodeNumber: '88',
    topic1: 'Core Web Vitals in 2026',
    topic2: 'Edge computing strategies',
    topic3: 'Streaming SSR patterns',
    topic4: 'Real-world optimization wins',
    date: 'Mar 5, 2026',
    bgColor: '#0d1117',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Episode Title'), 70);
    const showName = String(params.showName || '');
    const episodeNumber = String(params.episodeNumber || '');
    const topics = [
      String(params.topic1 || ''),
      String(params.topic2 || ''),
      String(params.topic3 || ''),
      String(params.topic4 || ''),
    ].filter(Boolean);
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 44 },
      { maxLen: 50, size: 38 },
      { maxLen: 70, size: 32 },
      { maxLen: 100, size: 26 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(160deg, ${bgColor} 0%, #16213e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top: show info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    },
                    children: [
                      // Show icon
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '18px', color: '#FFFFFF' },
                              children: '\u266A',
                            },
                          },
                        },
                      },
                      ...(showName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 700, color: `${textColor}cc` },
                                children: showName,
                              },
                            },
                          ]
                        : []),
                      ...(episodeNumber
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: `${textColor}55` },
                                children: `#${episodeNumber}`,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                date
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '14px', color: `${textColor}55` },
                        children: date,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
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
                marginBottom: '32px',
              },
              children: title,
            },
          },
          // "In this episode" label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '12px',
                fontWeight: 700,
                color: accentColor,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              },
              children: 'IN THIS EPISODE',
            },
          },
          // Topics list
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                flex: 1,
              },
              children: topics.map((topic, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                  },
                  children: [
                    // Bullet number
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: `${accentColor}22`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '13px',
                              fontWeight: 700,
                              color: accentColor,
                            },
                            children: String(i + 1),
                          },
                        },
                      },
                    },
                    // Topic text
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          color: `${textColor}cc`,
                          fontWeight: 500,
                        },
                        children: truncate(topic, 60),
                      },
                    },
                  ],
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
