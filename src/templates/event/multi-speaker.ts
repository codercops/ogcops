import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-multi-speaker',
  name: 'Multi Speaker',
  category: 'event',
  description: 'Speaker names displayed in a 2x2 grid with event title and date',
  tags: ['speakers', 'grid', 'lineup', 'event'],
  fields: [
    commonFields.title,
    { key: 'speaker1', label: 'Speaker 1', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', group: 'Content' as const },
    { key: 'speaker2', label: 'Speaker 2', type: 'text' as const, defaultValue: '', placeholder: 'Alex Chen', group: 'Content' as const },
    { key: 'speaker3', label: 'Speaker 3', type: 'text' as const, defaultValue: '', placeholder: 'Sam Wilson', group: 'Content' as const },
    { key: 'speaker4', label: 'Speaker 4', type: 'text' as const, defaultValue: '', placeholder: 'Pat Garcia', group: 'Content' as const },
    commonFields.date,
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'DevConf 2026',
    speaker1: 'Jane Smith',
    speaker2: 'Alex Chen',
    speaker3: 'Sam Wilson',
    speaker4: 'Pat Garcia',
    date: 'Mar 15–18, 2026',
    location: 'San Francisco, CA',
    siteName: '',
    bgColor: '#0a0a1a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Event'), 50);
    const speakers = [
      String(params.speaker1 || ''),
      String(params.speaker2 || ''),
      String(params.speaker3 || ''),
      String(params.speaker4 || ''),
    ].filter(Boolean);
    const date = String(params.date || '');
    const location = String(params.location || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a1a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 52 },
      { maxLen: 35, size: 44 },
      { maxLen: 50, size: 36 },
      { maxLen: 70, size: 30 },
    ]);

    const speakerColors = [accentColor, '#7B61FF', '#00D4FF', '#4CAF50'];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #16213e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top: title + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column' },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 800,
                            color: textColor,
                            lineHeight: 1.1,
                            margin: 0,
                          },
                          children: title,
                        },
                      },
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', color: accentColor, fontWeight: 600, marginTop: '12px' },
                                children: date,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '14px', color: `${textColor}44` },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
          // Speaker label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '12px',
                fontWeight: 700,
                color: `${textColor}55`,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              },
              children: 'SPEAKERS',
            },
          },
          // Speakers 2x2 grid
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                flex: 1,
              },
              children: speakers.map((speaker, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    width: '480px',
                    padding: '20px 24px',
                    background: `${textColor}06`,
                    borderRadius: '16px',
                    borderLeft: `4px solid ${speakerColors[i % speakerColors.length]}`,
                  },
                  children: [
                    // Avatar circle
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          background: `${speakerColors[i % speakerColors.length]}22`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '22px',
                              fontWeight: 700,
                              color: speakerColors[i % speakerColors.length],
                            },
                            children: speaker.charAt(0).toUpperCase(),
                          },
                        },
                      },
                    },
                    // Name
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 600,
                          color: `${textColor}dd`,
                        },
                        children: speaker,
                      },
                    },
                  ],
                },
              })),
            },
          },
          // Bottom: location
          ...(location
            ? [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '16px', color: `${textColor}55`, marginTop: '16px' },
                    children: location,
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
