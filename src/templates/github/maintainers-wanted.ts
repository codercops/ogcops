import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, starIcon, truncate } from '../utils';

function issueIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      children: [
        {
          type: 'path',
          props: {
            d: 'M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z',
            fill: color,
          },
        },
        {
          type: 'path',
          props: {
            d: 'M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM1.5 8a6.5 6.5 0 1 1 13 0 6.5 6.5 0 0 1-13 0z',
            fill: color,
          },
        },
      ],
    },
  };
}

function checkIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      fill: 'none',
      stroke: color,
      strokeWidth: '2.5',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: {
        type: 'path',
        props: {
          d: 'M3.5 8.5l3 3 6-6',
        },
      },
    },
  };
}

const template: TemplateDefinition = {
  id: 'github-maintainers-wanted',
  name: 'Maintainers Wanted',
  category: 'github',
  description: 'Call for open source maintainers with repository stats, pitch, help checklist and site branding',
  tags: ['github', 'maintainers', 'open-source', 'contributors', 'community'],
  fields: [
    {
      ...commonFields.title,
      defaultValue: 'acme/csv-stream',
      placeholder: 'owner/repo',
    },
    {
      ...commonFields.description,
      defaultValue: 'A streaming CSV parser for Node',
      placeholder: 'A streaming CSV parser for Node',
      required: false,
    },
    {
      key: 'stars',
      label: 'Stars',
      type: 'text',
      defaultValue: '4.2k stars',
      placeholder: '4.2k stars',
      required: false,
      group: 'Content',
    },
    {
      key: 'openIssues',
      label: 'Open Issues',
      type: 'text',
      defaultValue: '38 open issues',
      placeholder: '38 open issues',
      required: false,
      group: 'Content',
    },
    {
      key: 'help1',
      label: 'Help Item 1',
      type: 'text',
      defaultValue: 'Review pull requests',
      placeholder: 'Review pull requests',
      required: false,
      group: 'Content',
    },
    {
      key: 'help2',
      label: 'Help Item 2',
      type: 'text',
      defaultValue: 'Triage new issues',
      placeholder: 'Triage new issues',
      required: false,
      group: 'Content',
    },
    {
      key: 'help3',
      label: 'Help Item 3',
      type: 'text',
      defaultValue: 'Cut releases',
      placeholder: 'Cut releases',
      required: false,
      group: 'Content',
    },
    {
      ...commonFields.siteName,
      defaultValue: 'github.com/acme/csv-stream',
      placeholder: 'github.com/acme/csv-stream',
    },
    {
      ...commonFields.bgColor,
      defaultValue: '#0d1117',
    },
    {
      ...commonFields.accentColor,
      defaultValue: '#58a6ff',
    },
    {
      ...commonFields.textColor,
      defaultValue: '#e6edf3',
    },
  ],
  defaults: {
    title: 'acme/csv-stream',
    description: 'A streaming CSV parser for Node',
    stars: '4.2k stars',
    openIssues: '38 open issues',
    help1: 'Review pull requests',
    help2: 'Triage new issues',
    help3: 'Cut releases',
    siteName: 'github.com/acme/csv-stream',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? '').trim() || 'acme/csv-stream';
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 18, size: 54 },
      { maxLen: 28, size: 46 },
      { maxLen: 40, size: 38 },
      { maxLen: 55, size: 32 },
    ]);
    const title = truncate(rawTitle, 60);

    const rawDescription = params.description !== undefined && params.description !== null
      ? String(params.description).trim()
      : 'A streaming CSV parser for Node';
    const descriptionSize = autoFontSize(rawDescription, [
      { maxLen: 40, size: 24 },
      { maxLen: 70, size: 21 },
      { maxLen: 100, size: 19 },
      { maxLen: 140, size: 17 },
    ]);
    const description = rawDescription ? truncate(rawDescription, 140) : '';

    const rawStars = params.stars !== undefined && params.stars !== null
      ? String(params.stars).trim()
      : '4.2k stars';
    const stars = rawStars ? truncate(rawStars, 30) : '';

    const rawOpenIssues = params.openIssues !== undefined && params.openIssues !== null
      ? String(params.openIssues).trim()
      : '38 open issues';
    const openIssues = rawOpenIssues ? truncate(rawOpenIssues, 30) : '';

    const defaultHelps = ['Review pull requests', 'Triage new issues', 'Cut releases'];
    const helpKeys = ['help1', 'help2', 'help3'] as const;
    const helpItems = helpKeys
      .map((key, i) => {
        const val = params[key];
        const text = val !== undefined && val !== null ? String(val).trim() : defaultHelps[i];
        return text ? truncate(text, 60) : '';
      })
      .filter(Boolean);

    const rawSiteName = params.siteName !== undefined && params.siteName !== null
      ? String(params.siteName).trim()
      : 'github.com/acme/csv-stream';
    const siteName = rawSiteName ? truncate(rawSiteName, 50) : '';

    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const cardBg = mixColors(bgColor, textColor, lightBg ? 0.04 : 0.06);
    const cardBorder = mixColors(bgColor, textColor, lightBg ? 0.12 : 0.16);
    const checkCircleBg = mixColors(bgColor, accentInk, lightBg ? 0.12 : 0.2);
    const checkCircleBorder = mixColors(bgColor, accentInk, lightBg ? 0.25 : 0.35);

    const statsItems = [
      ...(stars
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                },
                children: [
                  starIcon(18, accentInk),
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '17px',
                        fontWeight: 600,
                        color: textColor,
                        fontFamily: 'JetBrains Mono, monospace',
                      },
                      children: stars,
                    },
                  },
                ],
              },
            },
          ]
        : []),
      ...(openIssues
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                },
                children: [
                  issueIcon(18, accentInk),
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '17px',
                        fontWeight: 600,
                        color: textColor,
                        fontFamily: 'JetBrains Mono, monospace',
                      },
                      children: openIssues,
                    },
                  },
                ],
              },
            },
          ]
        : []),
    ];

    const helpRows: SatoriElement[] = helpItems.map((item) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: '14px 22px',
          borderRadius: '12px',
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          width: '100%',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: checkCircleBg,
                border: `1px solid ${checkCircleBorder}`,
                marginRight: '16px',
                flexShrink: 0,
              },
              children: checkIcon(14, accentInk),
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '19px',
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.4,
              },
              children: item,
            },
          },
        ],
      },
    }));

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '48px 64px',
        },
        children: [
          // Header block: Label badge, Title, Pitch
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '5px 14px',
                      borderRadius: '999px',
                      backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.16),
                      border: `1px solid ${accentInk}55`,
                      marginBottom: '14px',
                      alignSelf: 'flex-start',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '13px',
                          fontWeight: 700,
                          color: accentInk,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        },
                        children: 'Maintainers wanted',
                      },
                    },
                  },
                },
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.15,
                      margin: 0,
                      letterSpacing: '-0.02em',
                    },
                    children: title,
                  },
                },
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: `${descriptionSize}px`,
                            color: lightBg ? mixColors(bgColor, textColor, 0.7) : `${textColor}aa`,
                            lineHeight: 1.4,
                            margin: 0,
                            marginTop: '10px',
                            maxWidth: '960px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Stats row
          ...(statsItems.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: '20px',
                      marginBottom: '20px',
                    },
                    children: statsItems,
                  },
                },
              ]
            : []),
          // Help items list
          ...(helpRows.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      width: '100%',
                      marginTop: statsItems.length > 0 ? '0px' : '24px',
                    },
                    children: helpRows,
                  },
                },
              ]
            : []),
          // Spacer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
              },
              children: [],
            },
          },
          // Bottom branding
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: `1px solid ${lightBg ? mixColors(bgColor, textColor, 0.12) : `${textColor}15`}`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '17px',
                            fontWeight: 500,
                            color: lightBg ? mixColors(bgColor, textColor, 0.6) : `${textColor}88`,
                            fontFamily: 'Inter, sans-serif',
                          },
                          children: siteName,
                        },
                      },
                    ],
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
