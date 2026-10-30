import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, isLightColor, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-welcome',
  name: 'Welcome',
  category: 'newsletter',
  description: 'A welcome card for new subscribers with what to expect and an optional sign-off',
  tags: ['newsletter', 'welcome', 'onboarding', 'expectations', 'subscribers'],
  fields: [
    {
      key: 'label',
      label: 'Label',
      type: 'text',
      defaultValue: 'Welcome to',
      placeholder: 'Welcome to',
      group: 'Content',
    },
    commonFields.siteName,
    {
      key: 'item1',
      label: 'Expectation 1',
      type: 'text',
      defaultValue: 'A 5-minute read every Friday',
      placeholder: 'What to expect...',
      group: 'Content',
    },
    {
      key: 'item2',
      label: 'Expectation 2',
      type: 'text',
      defaultValue: 'One deep dive a month',
      placeholder: 'What to expect...',
      group: 'Content',
    },
    {
      key: 'item3',
      label: 'Expectation 3',
      type: 'text',
      defaultValue: 'No ads, ever',
      placeholder: 'What to expect...',
      group: 'Content',
    },
    {
      key: 'signoff',
      label: 'Sign-off',
      type: 'text',
      defaultValue: 'Priya, editor',
      placeholder: 'Priya, editor (leave empty to hide)',
      group: 'Content',
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    label: 'Welcome to',
    siteName: 'The Friday Brief',
    item1: 'A 5-minute read every Friday',
    item2: 'One deep dive a month',
    item3: 'No ads, ever',
    signoff: 'Priya, editor',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawLabel = params.label !== undefined ? String(params.label).trim() : 'Welcome to';
    const label = rawLabel ? truncate(rawLabel, 32) : '';
    const rawSiteName = params.siteName !== undefined ? String(params.siteName).trim() : 'The Friday Brief';
    const siteName = rawSiteName ? truncate(rawSiteName, 50) : '';
    const rawSignoff = params.signoff !== undefined ? String(params.signoff).trim() : 'Priya, editor';
    const signoff = rawSignoff ? truncate(rawSignoff, 50) : '';

    const rawItems = [
      params.item1 !== undefined ? String(params.item1).trim() : 'A 5-minute read every Friday',
      params.item2 !== undefined ? String(params.item2).trim() : 'One deep dive a month',
      params.item3 !== undefined ? String(params.item3).trim() : 'No ads, ever',
    ];

    const items = rawItems
      .filter((item) => item.length > 0)
      .map((item) => truncate(item, 70));

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const lightBg = isLightColor(bgColor);
    const accentInk = isLightColor(accentColor) === lightBg
      ? mixColors(accentColor, textColor, 0.55)
      : accentColor;

    const cardBg = mixColors(bgColor, textColor, lightBg ? 0.04 : 0.07);
    const cardBorder = mixColors(bgColor, textColor, lightBg ? 0.14 : 0.2);
    const numberCircleBg = mixColors(bgColor, accentInk, lightBg ? 0.1 : 0.18);
    const numberCircleBorder = mixColors(bgColor, accentInk, lightBg ? 0.25 : 0.35);
    const secondaryText = mixColors(bgColor, textColor, 0.7);

    const nameSize = autoFontSize(siteName, [
      { maxLen: 16, size: 60 },
      { maxLen: 28, size: 50 },
      { maxLen: 40, size: 42 },
      { maxLen: 50, size: 36 },
    ]);

    const itemRows: SatoriElement[] = items.map((item, index) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: '14px 22px',
          borderRadius: '16px',
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          marginBottom: index < items.length - 1 ? '12px' : '0px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: numberCircleBg,
                border: `1px solid ${numberCircleBorder}`,
                marginRight: '18px',
                flexShrink: 0,
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '18px',
                    fontWeight: 700,
                    color: accentInk,
                  },
                  children: String(index + 1),
                },
              },
            },
          },
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: '22px',
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '54px 72px',
          boxSizing: 'border-box',
        },
        children: [
          // Header section: label + newsletter name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: '26px',
              },
              children: [
                ...(label
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '6px 18px',
                            borderRadius: '999px',
                            backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.16),
                            border: `1px solid ${accentInk}55`,
                            marginBottom: '14px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 600,
                                color: accentInk,
                                letterSpacing: '0.04em',
                              },
                              children: label,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                ...(siteName
                  ? [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: `${nameSize}px`,
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1.15,
                            margin: 0,
                            letterSpacing: '-0.02em',
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Expectation items
          ...(itemRows.length
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    },
                    children: itemRows,
                  },
                },
              ]
            : []),
          // Optional sign-off
          ...(signoff
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: 'auto',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 500,
                          color: secondaryText,
                        },
                        children: signoff,
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
