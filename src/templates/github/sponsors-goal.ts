import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, normalizeHexColor, truncate } from '../utils';

function parseRaised(value: unknown, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  const raw = String(value).trim();
  if (raw === '') return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n);
}

function parseGoal(value: unknown, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  const raw = String(value).trim();
  if (raw === '') return 1;
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 1) return 1;
  return Math.round(n);
}

const template: TemplateDefinition = {
  id: 'github-sponsors-goal',
  name: 'Sponsors Goal',
  category: 'github',
  description: 'Maintainer or project sponsorship progress bar toward a monthly or recurring goal, with raised amounts, percentage, and sponsor count',
  tags: ['github', 'sponsors', 'funding', 'goal', 'open-source'],
  fields: [
    commonFields.title,
    commonFields.description,
    {
      key: 'raised',
      label: 'Raised',
      type: 'number' as const,
      defaultValue: 420,
      min: 0,
      max: 10000,
      group: 'Content' as const,
    },
    {
      key: 'goal',
      label: 'Goal',
      type: 'number' as const,
      defaultValue: 1000,
      min: 0,
      max: 10000,
      group: 'Content' as const,
    },
    {
      key: 'currency',
      label: 'Currency',
      type: 'text' as const,
      defaultValue: '$',
      placeholder: '$',
      group: 'Content' as const,
    },
    {
      key: 'period',
      label: 'Period',
      type: 'text' as const,
      defaultValue: 'a month',
      placeholder: 'a month',
      group: 'Content' as const,
    },
    {
      key: 'sponsors',
      label: 'Sponsors',
      type: 'text' as const,
      defaultValue: '37 sponsors',
      placeholder: '37 sponsors',
      group: 'Content' as const,
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'codercops/toolbelt',
    description: 'Free developer tools that run in your browser',
    raised: 420,
    goal: 1000,
    currency: '$',
    period: 'a month',
    sponsors: '37 sponsors',
    siteName: 'github.com/sponsors/codercops',
    bgColor: '#0d1117',
    accentColor: '#ea4aaa',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#ea4aaa');
    const textColor = String(params.textColor || '#e6edf3');
    const normTextColor = normalizeHexColor(textColor, '#e6edf3');

    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const rawTitle = String(params.title ?? '').trim() || 'codercops/toolbelt';
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 16, size: 76 },
      { maxLen: 28, size: 64 },
      { maxLen: 42, size: 52 },
      { maxLen: 60, size: 40 },
    ]);
    const title = truncate(rawTitle, 60);

    const rawDescription = String(params.description ?? '').trim();
    const descriptionSize = autoFontSize(rawDescription, [
      { maxLen: 40, size: 28 },
      { maxLen: 70, size: 24 },
      { maxLen: 100, size: 20 },
    ]);
    const description = truncate(rawDescription, 100);

    const raised = parseRaised(params.raised, 420);
    const goal = parseGoal(params.goal, 1000);
    const percent = Math.round((raised / goal) * 100);
    const barWidthPercent = Math.min(100, Math.max(0, percent));

    const currency = String(params.currency ?? '$').trim();
    const formattedRaised = `${currency}${raised.toLocaleString('en-US')}`;
    const formattedGoal = `${currency}${goal.toLocaleString('en-US')}`;

    const rawPeriod = String(params.period ?? '').trim();
    const period = truncate(rawPeriod, 24);
    const progressText = period ? `${formattedRaised} of ${formattedGoal} ${period}` : `${formattedRaised} of ${formattedGoal}`;

    const sponsors = truncate(String(params.sponsors ?? '').trim(), 32);
    const siteName = truncate(String(params.siteName ?? '').trim(), 40);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px',
        },
        children: [
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                fontWeight: 700,
                color: accentInk,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                marginBottom: '16px',
              },
              children: 'Sponsor',
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                textAlign: 'center' as const,
                margin: 0,
                marginBottom: description ? '14px' : '48px',
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
                      fontWeight: 400,
                      color: `${normTextColor}AA`,
                      lineHeight: 1.4,
                      textAlign: 'center' as const,
                      margin: 0,
                      marginBottom: '48px',
                      maxWidth: '880px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '880px',
                height: '24px',
                borderRadius: '100px',
                backgroundColor: `${normTextColor}1A`,
                overflow: 'hidden',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: `${barWidthPercent}%`,
                    height: '100%',
                    borderRadius: '100px',
                    backgroundColor: accentColor,
                  },
                },
              },
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                width: '880px',
                marginTop: '18px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '24px',
                      fontWeight: 600,
                      color: `${normTextColor}DD`,
                    },
                    children: progressText,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: 800,
                      color: accentInk,
                    },
                    children: `${percent}%`,
                  },
                },
              ],
            },
          },
          ...((sponsors || siteName)
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: sponsors ? 'space-between' : 'flex-end',
                      width: '880px',
                      marginTop: '36px',
                    },
                    children: [
                      ...(sponsors
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 500,
                                  color: `${normTextColor}88`,
                                },
                                children: sponsors,
                              },
                            },
                          ]
                        : []),
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 500,
                                  color: `${normTextColor}66`,
                                },
                                children: siteName,
                              },
                            },
                          ]
                        : []),
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
