import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-series-banner',
  name: 'Series Banner',
  category: 'podcast',
  description: 'Podcast series banner with series name, episode count badge, and show art area',
  tags: ['podcast', 'series', 'banner', 'show'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'episodeCount', label: 'Episode Count', type: 'text' as const, defaultValue: '', placeholder: '12 episodes', group: 'Content' as const },
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'frequency', label: 'Frequency', type: 'text' as const, defaultValue: '', placeholder: 'Weekly', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Architecture Series',
    description: 'Deep dives into system design patterns and distributed systems',
    episodeCount: '12 episodes',
    showName: 'Code Radio',
    frequency: 'Weekly',
    bgColor: '#0d1117',
    accentColor: '#7B61FF',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Series Name'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const episodeCount = String(params.episodeCount || '');
    const showName = String(params.showName || '');
    const frequency = String(params.frequency || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#7B61FF');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 56 },
      { maxLen: 35, size: 48 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a3e 100%)`,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: Show art area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '300px',
                height: '630px',
                padding: '60px',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '200px',
                    height: '200px',
                    borderRadius: '32px',
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}88 100%)`,
                    boxShadow: `0 20px 60px ${accentColor}44`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '80px',
                        color: '#FFFFFF',
                      },
                      children: '\u266B',
                    },
                  },
                },
              },
            },
          },
          // Right: Series info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px 60px 60px 0',
              },
              children: [
                // Show name + frequency
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    },
                    children: [
                      ...(showName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: accentColor,
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                },
                                children: showName,
                              },
                            },
                          ]
                        : []),
                      ...(frequency
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: `${textColor}44` },
                                children: '\u00B7',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: `${textColor}66` },
                                children: frequency,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Series badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginBottom: '20px',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '4px 14px',
                          background: `${accentColor}22`,
                          borderRadius: '100px',
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: { fontSize: '12px', fontWeight: 700, color: accentColor, letterSpacing: '0.1em', textTransform: 'uppercase' },
                            children: 'PODCAST SERIES',
                          },
                        },
                      },
                    },
                  },
                },
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      fontFamily: 'Playfair Display, serif',
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
                            color: `${textColor}77`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '16px',
                            maxWidth: '600px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Episode count badge
                ...(episodeCount
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginTop: '28px',
                          },
                          children: {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                padding: '10px 24px',
                                background: `${textColor}0a`,
                                borderRadius: '12px',
                                border: `1px solid ${textColor}15`,
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: { fontSize: '16px', fontWeight: 600, color: `${textColor}aa` },
                                  children: episodeCount,
                                },
                              },
                            },
                          },
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
