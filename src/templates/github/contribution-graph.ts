import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-contribution-graph',
  name: 'Contribution Graph',
  category: 'github',
  description: 'Faux GitHub contribution graph background with overlay text',
  tags: ['github', 'contribution', 'graph', 'commits', 'activity'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'contributions', label: 'Contributions', type: 'text', defaultValue: '2,847', placeholder: 'Total contributions', group: 'Content' },
    { key: 'year', label: 'Year', type: 'text', defaultValue: '2026', placeholder: '2026', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Open Source Contributor',
    description: 'Building in the open, one commit at a time.',
    contributions: '2,847',
    year: '2026',
    siteName: '',
    bgColor: '#0d1117',
    accentColor: '#39d353',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Open Source Contributor'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const contributions = String(params.contributions || '2,847');
    const year = String(params.year || '2026');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#39d353');
    const textColor = String(params.textColor || '#e6edf3');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 52 },
      { maxLen: 35, size: 44 },
      { maxLen: 50, size: 36 },
    ]);

    // Generate contribution graph cells (7 rows x 20 cols)
    const intensities = ['06', '15', '25', '40', '70', 'cc'];
    const cells: any[] = [];
    for (let col = 0; col < 20; col++) {
      const colCells: any[] = [];
      for (let row = 0; row < 7; row++) {
        const seed = (col * 7 + row * 13 + 5) % 6;
        colCells.push({
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '14px',
              height: '14px',
              borderRadius: '3px',
              background: `${accentColor}${intensities[seed]}`,
            },
            children: [],
          },
        });
      }
      cells.push({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          },
          children: colCells,
        },
      });
    }

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
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Contribution graph background (bottom area, semi-transparent)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '40px',
                left: '56px',
                gap: '4px',
                opacity: 0.6,
              },
              children: cells,
            },
          },
          // Content overlay
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '56px',
                zIndex: 1,
              },
              children: [
                // Top: year badge + site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '6px 16px',
                            borderRadius: '6px',
                            background: `${textColor}10`,
                            border: `1px solid ${textColor}15`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '14px', fontWeight: 600, color: `${textColor}88`, fontFamily: 'JetBrains Mono, monospace' },
                              children: year,
                            },
                          },
                        },
                      },
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: `${textColor}44` },
                                children: siteName,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Contribution count
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '12px',
                      marginBottom: '8px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '64px',
                            fontWeight: 800,
                            color: accentColor,
                            fontFamily: 'JetBrains Mono, monospace',
                            lineHeight: 1,
                          },
                          children: contributions,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '20px', color: `${textColor}55` },
                          children: 'contributions',
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
                      marginTop: '12px',
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
                            color: `${textColor}66`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '12px',
                            maxWidth: '700px',
                          },
                          children: description,
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
