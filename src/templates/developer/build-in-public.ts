import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const MAX_BARS = 6;
const CHART_HEIGHT = 200;
const MIN_BAR_HEIGHT = 12;

function parseHistory(rawHistory: unknown): number[] {
  if (rawHistory === undefined || rawHistory === null) return [];
  const str = String(rawHistory).trim();
  if (!str) return [];

  const rawEntries = str
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (rawEntries.length === 0) return [];

  const parsed = rawEntries.map((entry) => {
    const num = Number(entry);
    return Number.isFinite(num) && num > 0 ? num : 0;
  });

  return parsed.slice(-MAX_BARS);
}

const template: TemplateDefinition = {
  id: 'developer-build-in-public',
  name: 'Build in Public',
  category: 'developer',
  description: 'Monthly building-in-public update with headline metrics, a change chip, and a 6-month bar chart',
  tags: ['developer', 'build in public', 'mrr', 'indie hacker', 'metrics', 'stats'],
  fields: [
    commonFields.title,
    { key: 'period', label: 'Period', type: 'text', defaultValue: 'Month 7', placeholder: 'Month 7', group: 'Content' },
    { key: 'metricValue', label: 'Metric Value', type: 'text', defaultValue: '$2,480', placeholder: '$2,480', group: 'Content' },
    { key: 'metricLabel', label: 'Metric Label', type: 'text', defaultValue: 'MRR', placeholder: 'MRR', group: 'Content' },
    { key: 'change', label: 'Change', type: 'text', defaultValue: '+18% from last month', placeholder: '+18% from last month', group: 'Content' },
    { key: 'history', label: 'History (comma-separated)', type: 'text', defaultValue: '820, 1100, 1350, 1700, 2100, 2480', placeholder: '820, 1100, 1350, 1700, 2100, 2480', group: 'Content' },
    { key: 'note', label: 'Note', type: 'text', defaultValue: '312 paying customers, 2.1% churn', placeholder: '312 paying customers, 2.1% churn', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Invoice Kit',
    period: 'Month 7',
    metricValue: '$2,480',
    metricLabel: 'MRR',
    change: '+18% from last month',
    history: '820, 1100, 1350, 1700, 2100, 2480',
    note: '312 paying customers, 2.1% churn',
    siteName: 'codercops.com',
    bgColor: '#0b0f1a',
    accentColor: '#34d399',
    textColor: '#f1f5f9',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? template.defaults.title).replace(/\s+/g, ' ').trim();
    const title = truncate(rawTitle || String(template.defaults.title), 50);
    const titleSize = autoFontSize(title, [
      { maxLen: 16, size: 44 },
      { maxLen: 28, size: 36 },
      { maxLen: 40, size: 30 },
      { maxLen: 50, size: 26 },
    ]);

    const period = truncate(String(params.period ?? '').replace(/\s+/g, ' ').trim(), 20);
    const metricValue = truncate(String(params.metricValue ?? template.defaults.metricValue).replace(/\s+/g, ' ').trim(), 24);
    const metricLabel = truncate(String(params.metricLabel ?? '').replace(/\s+/g, ' ').trim(), 30);
    const change = truncate(String(params.change ?? '').replace(/\s+/g, ' ').trim(), 40);
    const note = truncate(String(params.note ?? '').replace(/\s+/g, ' ').trim(), 70);
    const siteName = truncate(String(params.siteName ?? template.defaults.siteName).replace(/\s+/g, ' ').trim(), 40);

    const bgColor = String(params.bgColor || template.defaults.bgColor);
    const accentColor = String(params.accentColor || template.defaults.accentColor);
    const textColor = String(params.textColor || template.defaults.textColor);
    const isLight = isLightColor(bgColor);

    const values = parseHistory(params.history);
    const hasChart = values.length > 0;
    const maxValue = hasChart ? Math.max(...values, 0) : 0;

    // Metric value size so larger numbers like "$1,250,000" fit comfortably
    const metricSize = autoFontSize(metricValue, [
      { maxLen: 8, size: 76 },
      { maxLen: 12, size: 62 },
      { maxLen: 16, size: 50 },
      { maxLen: 24, size: 40 },
    ]);

    // Change chip styling
    let chipBg = isLight ? mixColors(textColor, bgColor, 0.08) : mixColors(textColor, bgColor, 0.12);
    let chipBorder = isLight ? mixColors(textColor, bgColor, 0.2) : mixColors(textColor, bgColor, 0.25);
    let chipText = isLight ? mixColors(textColor, bgColor, 0.8) : mixColors(textColor, bgColor, 0.85);

    if (change.startsWith('+')) {
      chipBg = isLight ? '#dcfce7' : '#052e16';
      chipBorder = isLight ? '#86efac' : '#14532d';
      chipText = isLight ? '#15803d' : '#4ade80';
    } else if (change.startsWith('-')) {
      chipBg = isLight ? '#fee2e2' : '#450a0a';
      chipBorder = isLight ? '#fca5a5' : '#7f1d1d';
      chipText = isLight ? '#b91c1c' : '#f87171';
    }

    // Pill styling next to title
    const pillBg = isLight ? mixColors(accentColor, '#ffffff', 0.18) : mixColors(accentColor, '#000000', 0.22);
    const pillBorder = isLight ? mixColors(accentColor, '#000000', 0.35) : mixColors(accentColor, '#ffffff', 0.4);
    const pillText = isLight ? mixColors(accentColor, '#000000', 0.6) : mixColors(accentColor, '#ffffff', 0.95);

    // Muted label and note color
    const mutedColor = isLight ? mixColors(textColor, bgColor, 0.6) : mixColors(textColor, bgColor, 0.65);
    const barInactiveColor = isLight ? mixColors(textColor, bgColor, 0.16) : mixColors(textColor, bgColor, 0.2);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '60px 72px',
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: 'Inter, sans-serif',
          boxSizing: 'border-box',
        },
        children: [
          // Header: Project name (title) + Period pill
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                minHeight: '52px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      lineHeight: 1.1,
                      letterSpacing: '-0.02em',
                      color: textColor,
                    },
                    children: title,
                  },
                },
                ...(period
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 14px',
                            borderRadius: '9999px',
                            backgroundColor: pillBg,
                            border: `1.5px solid ${pillBorder}`,
                            fontSize: '15px',
                            fontWeight: 600,
                            letterSpacing: '0.02em',
                            color: pillText,
                          },
                          children: period,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },

          // Main body: Metric Stats (left) + Bar Chart (right)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '48px',
                flex: 1,
                marginTop: '36px',
                marginBottom: '36px',
              },
              children: [
                // Left Column: Headline number, label, change chip, note
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flex: hasChart ? '0 1 540px' : '1 1 100%',
                      minWidth: 0,
                    },
                    children: [
                      // Metric Value + Label
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'baseline',
                            gap: '14px',
                            flexWrap: 'wrap',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  display: 'flex',
                                  fontSize: `${metricSize}px`,
                                  fontWeight: 800,
                                  lineHeight: 1.05,
                                  letterSpacing: '-0.03em',
                                  fontFamily: 'Inter, sans-serif',
                                  color: textColor,
                                },
                                children: metricValue,
                              },
                            },
                            ...(metricLabel
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        display: 'flex',
                                        fontSize: '24px',
                                        fontWeight: 600,
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase' as const,
                                        color: mutedColor,
                                      },
                                      children: metricLabel,
                                    },
                                  },
                                ]
                              : []),
                          ],
                        },
                      },

                      // Change Chip (if present)
                      ...(change
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  alignSelf: 'flex-start',
                                  marginTop: '18px',
                                  padding: '6px 14px',
                                  borderRadius: '8px',
                                  backgroundColor: chipBg,
                                  border: `1px solid ${chipBorder}`,
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: chipText,
                                },
                                children: change,
                              },
                            },
                          ]
                        : []),

                      // Note (if present)
                      ...(note
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  display: 'flex',
                                  marginTop: change ? '16px' : '20px',
                                  fontSize: '18px',
                                  fontWeight: 500,
                                  color: mutedColor,
                                  lineHeight: 1.4,
                                },
                                children: note,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },

                // Right Column: 6-month bar chart (if history has values)
                ...(hasChart
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            gap: '18px',
                            height: `${CHART_HEIGHT}px`,
                            flexShrink: 0,
                            paddingBottom: '4px',
                          },
                          children: values.map((val, idx) => {
                            const isCurrent = idx === values.length - 1;
                            const barHeight =
                              maxValue > 0
                                ? Math.max(MIN_BAR_HEIGHT, Math.round((val / maxValue) * CHART_HEIGHT))
                                : MIN_BAR_HEIGHT;

                            const barColor = isCurrent ? accentColor : barInactiveColor;

                            return {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  height: `${CHART_HEIGHT}px`,
                                },
                                children: [
                                  {
                                    type: 'div',
                                    props: {
                                      style: {
                                        display: 'flex',
                                        width: '42px',
                                        height: `${barHeight}px`,
                                        borderRadius: '6px 6px 2px 2px',
                                        backgroundColor: barColor,
                                      },
                                      children: '',
                                    },
                                  },
                                ],
                              },
                            };
                          }),
                        },
                      },
                    ]
                  : []),
              ],
            },
          },

          // Footer: Site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                minHeight: '28px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: mutedColor,
                      letterSpacing: '0.04em',
                    },
                    children: siteName,
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
