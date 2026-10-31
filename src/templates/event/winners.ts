import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields, isLightColor, mixColors } from '../utils';

const template: TemplateDefinition = {
  id: 'event-winners',
  name: 'Winners Podium',
  category: 'event',
  description: 'Hackathon or contest results card with a 2nd, 1st, 3rd podium, winner names and project names',
  tags: ['winners', 'podium', 'hackathon', 'contest', 'results', 'event'],
  fields: [
    { ...commonFields.siteName, label: 'Event Name', placeholder: 'HackFest 2026' },
    commonFields.title,
    { key: 'first', label: '1st Place', type: 'text' as const, defaultValue: '', placeholder: 'Team Nova', group: 'Content' as const },
    { key: 'firstProject', label: '1st Place Project', type: 'text' as const, defaultValue: '', placeholder: 'AI Code Reviewer', group: 'Content' as const },
    { key: 'second', label: '2nd Place', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', group: 'Content' as const },
    { key: 'secondProject', label: '2nd Place Project', type: 'text' as const, defaultValue: '', placeholder: 'Open Source Linter', group: 'Content' as const },
    { key: 'third', label: '3rd Place', type: 'text' as const, defaultValue: '', placeholder: 'Byte Bandits', group: 'Content' as const },
    { key: 'thirdProject', label: '3rd Place Project', type: 'text' as const, defaultValue: '', placeholder: 'Realtime Dashboard', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'HackFest 2026',
    title: 'Hackathon Winners',
    first: 'Team Nova',
    firstProject: 'AI Code Reviewer',
    second: 'Jane Smith',
    secondProject: 'Open Source Linter',
    third: 'Byte Bandits',
    thirdProject: 'Realtime Dashboard',
    bgColor: '#0a0a0a',
    accentColor: '#00D4FF',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const siteName = String(params.siteName || '');
    const title = truncate(String(params.title || 'Winners'), 40);
    const first = String(params.first || 'Winner');
    const firstProject = String(params.firstProject || '');
    const second = String(params.second || '');
    const secondProject = String(params.secondProject || '');
    const third = String(params.third || '');
    const thirdProject = String(params.thirdProject || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#00D4FF');
    const textColor = String(params.textColor || '#FFFFFF');

    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 60 },
      { maxLen: 30, size: 52 },
      { maxLen: 40, size: 44 },
    ]);

    // Readable number color on the accent-filled 1st place block
    const onAccentColor = isLightColor(accentColor) ? '#111111' : '#FFFFFF';
    // Accent used as text on the page background: darkened on light backgrounds
    const accentTextColor = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const podiumColumn = (
      place: number,
      name: string,
      project: string,
      blockHeight: number,
      isFirst: boolean,
    ) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '320px',
        },
        children: [
          // Winner name
          {
            type: 'span',
            props: {
              style: {
                fontSize: isFirst ? '32px' : '28px',
                fontWeight: 700,
                color: textColor,
                textAlign: 'center',
                maxWidth: '320px',
              },
              children: truncate(name, isFirst ? 16 : 18),
            },
          },
          // Project name (hidden when empty)
          ...(project
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}99`,
                      textAlign: 'center',
                      marginTop: '6px',
                      maxWidth: '320px',
                    },
                    children: truncate(project, 28),
                  },
                },
              ]
            : []),
          // Podium block
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '320px',
                height: `${blockHeight}px`,
                marginTop: '16px',
                borderRadius: '16px 16px 0 0',
                background: isFirst ? accentColor : `${textColor}15`,
                border: isFirst ? `2px solid ${accentColor}` : `2px solid ${textColor}30`,
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: isFirst ? '96px' : '72px',
                    fontWeight: 700,
                    color: isFirst ? onAccentColor  : `${textColor}cc`,
                    fontFamily: 'JetBrains Mono, monospace',
                  },
                  children: String(place),
                },
              },
            },
          },
        ],
      },
    });

    // Order: 2nd, 1st, 3rd. Empty 2nd/3rd are skipped, so the podium stays centered.
    const columns = [
      ...(second ? [podiumColumn(2, second, secondProject, 160, false)] : []),
      podiumColumn(1, first, firstProject, 220, true),
      ...(third ? [podiumColumn(3, third, thirdProject, 110, false)] : []),
    ];

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
          padding: '48px 60px 0 60px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Header: event name + title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              },
              children: [
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 600,
                            color: accentTextColor,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            marginBottom: '12px',
                          },
                          children: truncate(siteName, 40),
                        },
                      },
                    ]
                  : []),
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      textAlign: 'center',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Podium, bottom-aligned
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'flex-end',
                justifyContent: 'center',
                gap: '24px',
              },
              children: columns,
            },
          },
        ],
      },
    };
  },
};

export default template;
