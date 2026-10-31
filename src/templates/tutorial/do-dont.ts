import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const checkIcon = (size: number, color: string): SatoriElement => ({
  type: 'svg',
  props: {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    children: { type: 'path', props: { d: 'M5 12l4 4L19 6' } },
  },
});

const crossIcon = (size: number, color: string): SatoriElement => ({
  type: 'svg',
  props: {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    children: [
      { type: 'path', props: { d: 'M18 6L6 18' } },
      { type: 'path', props: { d: 'M6 6l12 12' } },
    ],
  },
});

const template: TemplateDefinition = {
  id: 'tutorial-do-dont',
  name: "Do's and Don'ts",
  category: 'tutorial',
  description: 'A side-by-side comparison of recommended practices and mistakes to avoid.',
  tags: ['tutorial', 'best-practices', 'comparison', 'guide', 'tips'],
  fields: [
    commonFields.title,
    { key: 'do1', label: 'Do 1', type: 'text', defaultValue: 'Use the imperative mood', placeholder: 'Recommended practice', group: 'Content' },
    { key: 'do2', label: 'Do 2', type: 'text', defaultValue: 'Keep the subject under 50 characters', placeholder: 'Recommended practice', group: 'Content' },
    { key: 'do3', label: 'Do 3', type: 'text', defaultValue: 'Explain why in the body', placeholder: 'Recommended practice', group: 'Content' },
    { key: 'dont1', label: "Don't 1", type: 'text', defaultValue: 'End the subject with a period', placeholder: 'Mistake to avoid', group: 'Content' },
    { key: 'dont2', label: "Don't 2", type: 'text', defaultValue: 'Mix unrelated changes', placeholder: 'Mistake to avoid', group: 'Content' },
    { key: 'dont3', label: "Don't 3", type: 'text', defaultValue: 'Write fixed stuff', placeholder: 'Mistake to avoid', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Git Commit Messages',
    do1: 'Use the imperative mood',
    do2: 'Keep the subject under 50 characters',
    do3: 'Explain why in the body',
    dont1: 'End the subject with a period',
    dont2: 'Mix unrelated changes',
    dont3: 'Write fixed stuff',
    siteName: '',
    bgColor: commonFields.bgColor.defaultValue,
    accentColor: commonFields.accentColor.defaultValue,
    textColor: commonFields.textColor.defaultValue,
  },
  render: (params) => {
    const rawTitle = typeof params.title === 'string' && params.title.trim()
      ? params.title.trim()
      : 'Git Commit Messages';
    const title = truncate(rawTitle, 70);

    const doItems = [params.do1, params.do2, params.do3]
      .map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item).trim() : ''))
      .filter(Boolean)
      .slice(0, 3);

    const dontItems = [params.dont1, params.dont2, params.dont3]
      .map((item) => (typeof item === 'string' || typeof item === 'number' ? String(item).trim() : ''))
      .filter(Boolean)
      .slice(0, 3);

    const siteName = typeof params.siteName === 'string' && params.siteName.trim()
      ? truncate(params.siteName.trim(), 40)
      : '';

    const bgColor = String(params.bgColor || commonFields.bgColor.defaultValue);
    const accentColor = String(params.accentColor || commonFields.accentColor.defaultValue);
    const textColor = String(params.textColor || commonFields.textColor.defaultValue);

    const lightBg = isLightColor(bgColor);

    // Ensure green and red headings remain readable against light and dark backgrounds
    const doColor = lightBg ? '#15803d' : '#4ade80';
    const dontColor = lightBg ? '#b91c1c' : '#f87171';

    // Ensure accent text is readable on light backgrounds
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const cardBg = lightBg ? '#ffffff' : `${textColor}08`;
    const cardBorder = lightBg ? mixColors(bgColor, textColor, 0.15) : `${textColor}18`;

    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 48, size: 44 },
      { maxLen: 70, size: 36 },
    ]);

    const hasDo = doItems.length > 0;
    const hasDont = dontItems.length > 0;
    const hasComparison = hasDo || hasDont;

    const renderColumn = (
      type: 'do' | 'dont',
      heading: string,
      items: string[],
      color: string,
    ): SatoriElement => {
      const isDo = type === 'do';
      const icon = (size: number, col: string) => (isDo ? checkIcon(size, col) : crossIcon(size, col));

      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '16px',
            padding: '24px 28px',
            overflow: 'hidden',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                  borderBottom: `2px solid ${color}33`,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: `${color}20`,
                      },
                      children: icon(18, color),
                    },
                  },
                  {
                    type: 'span',
                    props: {
                      style: {
                        display: 'flex',
                        fontSize: '24px',
                        fontWeight: 800,
                        color,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      },
                      children: heading,
                    },
                  },
                ],
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  flex: 1,
                  justifyContent: 'flex-start',
                },
                children: items.map((item) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'flex-start',
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
                            flexShrink: 0,
                            width: '24px',
                            height: '24px',
                            marginTop: '2px',
                            borderRadius: '50%',
                            backgroundColor: `${color}15`,
                          },
                          children: icon(14, color),
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flex: 1,
                            minWidth: 0,
                            fontSize: '19px',
                            lineHeight: 1.35,
                            maxHeight: '52px',
                            overflow: 'hidden',
                            overflowWrap: 'anywhere',
                            color: textColor,
                          },
                          children: truncate(item, 85),
                        },
                      },
                    ],
                  },
                })),
              },
            },
          ],
        },
      };
    };

    const comparisonColumns: SatoriElement[] = [];
    if (hasDo) {
      comparisonColumns.push(renderColumn('do', 'Do', doItems, doColor));
    }
    if (hasDont) {
      comparisonColumns.push(renderColumn('dont', "Don't", dontItems, dontColor));
    }

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          padding: '48px 56px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          color: textColor,
          justifyContent: 'space-between',
        },
        children: [
          // Top section: Header (title + optional siteName)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                marginBottom: hasComparison ? '24px' : '0px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            display: 'flex',
                            flex: 1,
                            fontSize: `${titleSize}px`,
                            lineHeight: 1.18,
                            fontWeight: 800,
                            color: textColor,
                            margin: 0,
                          },
                          children: title,
                        },
                      },
                      ...(siteName
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  flexShrink: 0,
                                  marginLeft: '24px',
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      fontSize: '20px',
                                      fontWeight: 600,
                                      color: accentInk,
                                      letterSpacing: '0.02em',
                                    },
                                    children: siteName,
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
          },

          // Comparison columns area (omitted if both columns are empty)
          ...(hasComparison
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flex: 1,
                      gap: '28px',
                      alignItems: 'stretch',
                      minHeight: 0,
                    },
                    children: comparisonColumns,
                  },
                },
              ]
            : []),

          // Bottom footer if no comparison or spacing filler
          ...(!hasComparison && siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'flex-end',
                      paddingTop: '16px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          display: 'flex',
                          fontSize: '20px',
                          fontWeight: 600,
                          color: accentInk,
                        },
                        children: siteName,
                      },
                    },
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
