import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-minimal-player',
  name: 'Minimal Player',
  category: 'podcast',
  description: 'Audio player UI mockup with progress bar, play button, and episode info',
  tags: ['podcast', 'player', 'minimal', 'ui'],
  fields: [
    commonFields.title,
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const, defaultValue: '', placeholder: '45:32', group: 'Content' as const },
    { key: 'currentTime', label: 'Current Time', type: 'text' as const, defaultValue: '', placeholder: '12:45', group: 'Content' as const },
    { key: 'progressPercent', label: 'Progress %', type: 'number' as const, defaultValue: 35, min: 0, max: 100, group: 'Style' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Art of Clean Code Architecture',
    showName: 'Code Radio',
    episodeNumber: '87',
    duration: '45:32',
    currentTime: '15:48',
    progressPercent: 35,
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Episode Title'), 70);
    const showName = String(params.showName || '');
    const episodeNumber = String(params.episodeNumber || '');
    const duration = String(params.duration || '');
    const currentTime = String(params.currentTime || '');
    const progressPercent = Number(params.progressPercent || 35);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 42 },
      { maxLen: 50, size: 36 },
      { maxLen: 70, size: 30 },
      { maxLen: 100, size: 26 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Player card
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '1000px',
                padding: '48px',
                background: `${textColor}06`,
                borderRadius: '24px',
                border: `1px solid ${textColor}12`,
              },
              children: [
                // Top: show info
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
                      // Show art thumbnail
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '64px',
                            height: '64px',
                            borderRadius: '14px',
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '28px', color: '#FFFFFF' },
                              children: '\u266A',
                            },
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column' },
                          children: [
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
                                      style: { fontSize: '13px', color: `${textColor}55` },
                                      children: `Episode ${episodeNumber}`,
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
                      marginBottom: '40px',
                    },
                    children: title,
                  },
                },
                // Player controls
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                    },
                    children: [
                      // Play button
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            background: accentColor,
                          },
                          children: {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                width: 0,
                                height: 0,
                                borderTop: '10px solid transparent',
                                borderBottom: '10px solid transparent',
                                borderLeft: '16px solid #FFFFFF',
                                marginLeft: '4px',
                              },
                              children: '',
                            },
                          },
                        },
                      },
                      // Progress area
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            gap: '8px',
                          },
                          children: [
                            // Progress bar
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '100%',
                                  height: '6px',
                                  background: `${textColor}15`,
                                  borderRadius: '3px',
                                  overflow: 'hidden',
                                },
                                children: {
                                  type: 'div',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      width: `${progressPercent}%`,
                                      height: '6px',
                                      background: accentColor,
                                      borderRadius: '3px',
                                    },
                                    children: '',
                                  },
                                },
                              },
                            },
                            // Time display
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
                                      style: {
                                        fontSize: '13px',
                                        color: `${textColor}55`,
                                        fontFamily: 'JetBrains Mono, monospace',
                                      },
                                      children: currentTime || '0:00',
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '13px',
                                        color: `${textColor}55`,
                                        fontFamily: 'JetBrains Mono, monospace',
                                      },
                                      children: duration || '0:00',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
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
