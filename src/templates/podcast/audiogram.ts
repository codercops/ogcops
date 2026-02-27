import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-audiogram',
  name: 'Audiogram',
  category: 'podcast',
  description: 'Circular waveform visualization with a quote from the episode',
  tags: ['podcast', 'audiogram', 'quote', 'waveform', 'social'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea' as const, defaultValue: '', placeholder: 'A memorable quote from the episode...', group: 'Content' as const },
    { key: 'speaker', label: 'Speaker', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', group: 'Content' as const },
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'The best code is the code you never have to write.',
    speaker: 'Jane Smith',
    showName: 'Code Radio',
    episodeNumber: '87',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'Quote text here'), 160);
    const speaker = String(params.speaker || '');
    const showName = String(params.showName || '');
    const episodeNumber = String(params.episodeNumber || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    // Circular waveform: concentric rings simulated with boxes
    const ringRadii = [60, 80, 100, 120, 140, 160, 180];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: Circular waveform area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '460px',
                height: '630px',
                position: 'relative',
              },
              children: [
                // Concentric rings
                ...ringRadii.map((r, i) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${230 - r}px`,
                      top: `${315 - r}px`,
                      width: `${r * 2}px`,
                      height: `${r * 2}px`,
                      borderRadius: '50%',
                      border: `${i < 3 ? 3 : 2}px solid ${accentColor}${i < 4 ? (40 - i * 8).toString(16).padStart(2, '0') : '10'}`,
                    },
                    children: '',
                  },
                })),
                // Center dot
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: '214px',
                      top: '299px',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: accentColor,
                    },
                    children: '',
                  },
                },
              ],
            },
          },
          // Right: Quote + info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
              },
              children: [
                // Show name + episode
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '32px',
                    },
                    children: [
                      ...(showName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  fontWeight: 700,
                                  color: accentColor,
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase',
                                },
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
                                style: { fontSize: '14px', color: `${textColor}44` },
                                children: `EP ${episodeNumber}`,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Opening quote mark
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '72px',
                      color: accentColor,
                      lineHeight: 0.5,
                      marginBottom: '16px',
                      fontFamily: 'Playfair Display, serif',
                    },
                    children: '\u201C',
                  },
                },
                // Quote text
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: quote.length > 100 ? '22px' : '28px',
                      fontWeight: 500,
                      color: `${textColor}ee`,
                      lineHeight: 1.5,
                      margin: 0,
                      fontFamily: 'Playfair Display, serif',
                      fontStyle: 'italic',
                      maxWidth: '580px',
                    },
                    children: quote,
                  },
                },
                // Speaker attribution
                ...(speaker
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginTop: '28px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '32px',
                                  height: '2px',
                                  background: accentColor,
                                },
                                children: '',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: `${textColor}aa`,
                                },
                                children: speaker,
                              },
                            },
                          ],
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
