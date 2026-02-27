import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-waveform',
  name: 'Waveform',
  category: 'podcast',
  description: 'Audio waveform graphic made of colored bars with episode info',
  tags: ['podcast', 'waveform', 'audio', 'bars'],
  fields: [
    commonFields.title,
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const, defaultValue: '', placeholder: '45 min', group: 'Content' as const },
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Deep Dive into WebAssembly',
    showName: 'Code Radio',
    episodeNumber: '87',
    duration: '45 min',
    date: 'Feb 28, 2026',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Episode Title'), 70);
    const showName = String(params.showName || '');
    const episodeNumber = String(params.episodeNumber || '');
    const duration = String(params.duration || '');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 48 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
      { maxLen: 100, size: 28 },
    ]);

    // Generate waveform bar heights
    const barHeights = [30, 55, 80, 45, 95, 60, 110, 75, 50, 90, 40, 100, 65, 85, 35, 70, 105, 55, 80, 45, 95, 60, 40, 75, 55, 90, 50, 70, 100, 60, 80, 45, 65, 95, 50, 75, 85, 40, 110, 55];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top: show name + episode
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '32px',
              },
              children: [
                ...(showName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', fontWeight: 700, color: `${textColor}cc` },
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
                          style: { fontSize: '16px', color: `${textColor}55` },
                          children: `Episode ${episodeNumber}`,
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
                marginBottom: '36px',
                maxWidth: '900px',
              },
              children: title,
            },
          },
          // Waveform bars
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                height: '120px',
                marginTop: 'auto',
                marginBottom: '32px',
              },
              children: barHeights.map((h, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: '20px',
                    height: `${h}px`,
                    borderRadius: '4px',
                    background: i < barHeights.length * 0.6
                      ? accentColor
                      : `${accentColor}44`,
                  },
                  children: '',
                },
              })),
            },
          },
          // Bottom: duration + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                ...(duration
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '15px', fontWeight: 600, color: `${textColor}88` },
                          children: duration,
                        },
                      },
                    ]
                  : []),
                ...(duration && date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '15px', color: `${textColor}33` },
                          children: '\u00B7',
                        },
                      },
                    ]
                  : []),
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '15px', color: `${textColor}55` },
                          children: date,
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
