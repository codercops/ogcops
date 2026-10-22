import type { TemplateDefinition, SatoriElement } from '../types';
import { truncate, autoFontSize, commonFields, isLightColor, mixColors } from '../utils';

/**
 * Defensive number parser that falls back to a default value
 * if the input is not a finite number.
 */
function parseNumber(val: unknown, fallback: number): number {
  if (val === undefined || val === null || val === '') return fallback;
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.round(num);
}

const template: TemplateDefinition = {
  id: 'developer-day-streak',
  name: 'Day Streak',
  category: 'developer',
  description: 'Challenge streak tracker with milestone progress grid',
  tags: ['developer', 'streak', 'challenge', 'progress', '100days', 'habit'],
  fields: [
    commonFields.title,
    commonFields.author,
    {
      key: 'currentDay',
      label: 'Current Day',
      type: 'number' as const,
      defaultValue: 42,
      min: 1,
      max: 100,
      group: 'Content' as const,
    },
    {
      key: 'totalDays',
      label: 'Total Days',
      type: 'number' as const,
      defaultValue: 100,
      min: 1,
      max: 100,
      group: 'Content' as const,
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: '100 Days of AI Engineering',
    author: 'Alex Morgan',
    currentDay: 42,
    totalDays: 100,
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || '100 Days Challenge'), 80);
    const author = params.author ? truncate(String(params.author), 36) : '';

    const rawTotal = parseNumber(params.totalDays, 100);
    const totalDays = Math.min(100, Math.max(1, rawTotal));

    const rawCurrent = parseNumber(params.currentDay, 42);
    const clampedCurrent = Math.min(100, Math.max(1, rawCurrent));
    const currentDay = Math.min(clampedCurrent, totalDays);

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const isLightBg = isLightColor(bgColor);
    const adaptedAccent = isLightBg ? mixColors(accentColor, '#000000', 0.25) : accentColor;
    const mutedColor = isLightBg ? mixColors(textColor, bgColor, 0.45) : `${textColor}88`;
    const faintOutlineColor = isLightBg ? `${textColor}28` : `${textColor}20`;
    const todayRingColor = isLightBg ? mixColors(adaptedAccent, '#000000', 0.45) : '#FFFFFF';

    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 44 },
      { maxLen: 40, size: 38 },
      { maxLen: 60, size: 32 },
      { maxLen: 80, size: 26 },
    ]);

    // Build the day streak squares: 10 per row, total of totalDays squares
    const daySquares: SatoriElement[] = Array.from({ length: totalDays }, (_, i) => {
      const day = i + 1;
      const isPast = day < currentDay;
      const isToday = day === currentDay;

      if (isPast) {
        return {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: adaptedAccent,
              boxSizing: 'border-box',
            },
            children: '',
          },
        };
      }

      if (isToday) {
        return {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: '36px',
              height: '36px',
              borderRadius: '6px',
              backgroundColor: adaptedAccent,
              border: `3px solid ${todayRingColor}`,
              boxSizing: 'border-box',
            },
            children: '',
          },
        };
      }

      // Later days: faint outline
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            border: `2px solid ${faintOutlineColor}`,
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
          },
          children: '',
        },
      };
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 64px',
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
        },
        children: [
          // Background ambient radial glow
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-80px',
                right: '-60px',
                width: '560px',
                height: '560px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${adaptedAccent}15 0%, transparent 65%)`,
              },
              children: [],
            },
          },
          // Left column: Challenge name, Day count, and Author
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '520px',
                paddingRight: '40px',
              },
              children: [
                // Challenge Name
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.25,
                      margin: 0,
                      marginBottom: '28px',
                      maxWidth: '480px',
                    },
                    children: title,
                  },
                },
                // Streak Day Row: Large "Day 42" and smaller "of 100"
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      marginBottom: author ? '32px' : '0px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '76px',
                            fontWeight: 800,
                            color: adaptedAccent,
                            lineHeight: 1,
                            fontFamily: 'JetBrains Mono, monospace',
                            letterSpacing: '-0.03em',
                          },
                          children: `Day ${currentDay}`,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '28px',
                            fontWeight: 600,
                            color: mutedColor,
                            lineHeight: 1,
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: `of ${totalDays}`,
                        },
                      },
                    ],
                  },
                },
                // Author (optional)
                ...(author
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: `${adaptedAccent}22`,
                                  border: `1.5px solid ${adaptedAccent}`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '16px',
                                      fontWeight: 700,
                                      color: adaptedAccent,
                                    },
                                    children: author.charAt(0).toUpperCase(),
                                  },
                                },
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '20px',
                                  fontWeight: 500,
                                  color: `${textColor}cc`,
                                },
                                children: author,
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
          // Right column: vertically centered grid of small rounded squares (10 per row)
          // Notice: No alignContent: 'center' on the wrapping grid container (per #159)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '8px',
                      width: '436px',
                    },
                    children: daySquares,
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
