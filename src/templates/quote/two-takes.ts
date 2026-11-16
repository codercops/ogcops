import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'quote-two-takes',
  name: 'Two Takes',
  category: 'quote',
  description: 'Put two opposing opinions side by side with a "vs" chip divider, for debate recaps, panel writeups and two-views columns',
  tags: ['quote', 'debate', 'comparison', 'opinion', 'panel', 'versus'],
  fields: [
    {
      ...commonFields.title,
      defaultValue: 'Should every team write design docs?',
      placeholder: 'The debate topic...',
      required: false,
    },
    { key: 'leftLabel', label: 'Left Label', type: 'text', defaultValue: 'Yes', placeholder: 'Yes', group: 'Content' },
    {
      key: 'leftQuote',
      label: 'Left Quote',
      type: 'textarea',
      defaultValue: "Writing it down is the cheapest review you\u2019ll ever get.",
      placeholder: 'The first opinion...',
      required: true,
      group: 'Content',
    },
    { key: 'leftAuthor', label: 'Left Author', type: 'text', defaultValue: 'Dana Whitfield, Engineering Manager', placeholder: 'Name, role', group: 'Content' },
    { key: 'rightLabel', label: 'Right Label', type: 'text', defaultValue: 'No', placeholder: 'No', group: 'Content' },
    {
      key: 'rightQuote',
      label: 'Right Quote',
      type: 'textarea',
      defaultValue: 'Most design docs are read once, by the person who wrote them.',
      placeholder: 'The opposing opinion...',
      required: true,
      group: 'Content',
    },
    { key: 'rightAuthor', label: 'Right Author', type: 'text', defaultValue: 'Marco Velez, Staff Engineer', placeholder: 'Name, role', group: 'Content' },
    { ...commonFields.siteName, defaultValue: 'Dev Panel Weekly' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Should every team write design docs?',
    leftLabel: 'Yes',
    leftQuote: "Writing it down is the cheapest review you’ll ever get.",
    leftAuthor: 'Dana Whitfield, Engineering Manager',
    rightLabel: 'No',
    rightQuote: 'Most design docs are read once, by the person who wrote them.',
    rightAuthor: 'Marco Velez, Staff Engineer',
    siteName: 'Dev Panel Weekly',
    bgColor: '#0b1120',
    accentColor: '#818cf8',
    textColor: '#e2e8f0',
  },
  render: (params) => {
    const bgColor = String(params.bgColor || '#0b1120');
    const accentColor = String(params.accentColor || '#818cf8');
    const textColor = String(params.textColor || '#e2e8f0');
    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mainColor = lightBg && isLightColor(textColor) ? '#111111' : textColor;
    const mutedColor = mixColors(bgColor, mainColor, 0.62);
    const dividerColor = mixColors(bgColor, mainColor, 0.35);
    const rightLabelColor = mutedColor;

    // Title
    const rawTitle = String(params.title ?? '').replace(/\s+/g, ' ').trim();
    const title = truncate(rawTitle, 80);
    const titleSize = title
      ? autoFontSize(title, [
          { maxLen: 32, size: 36 },
          { maxLen: 56, size: 30 },
          { maxLen: 80, size: 26 },
        ])
      : 30;

    // Quotes — required, fall back to defaults
    const rawLeftQuote = String(params.leftQuote ?? '').replace(/\s+/g, ' ').trim() ||
      "Writing it down is the cheapest review you’ll ever get.";
    const rawRightQuote = String(params.rightQuote ?? '').replace(/\s+/g, ' ').trim() ||
      'Most design docs are read once, by the person who wrote them.';

    // Font size driven by the longer of the two to keep both columns balanced
    const longerQuote = rawLeftQuote.length >= rawRightQuote.length ? rawLeftQuote : rawRightQuote;
    const quoteSize = autoFontSize(longerQuote, [
      { maxLen: 60, size: 36 },
      { maxLen: 110, size: 30 },
      { maxLen: 160, size: 26 },
      { maxLen: 220, size: 22 },
    ]);

    const leftQuote = truncate(rawLeftQuote, 220);
    const rightQuote = truncate(rawRightQuote, 220);

    // Labels and authors
    const leftLabel = cleanText(params.leftLabel, 24) || 'Yes';
    const rightLabel = cleanText(params.rightLabel, 24) || 'No';
    const leftAuthor = cleanText(params.leftAuthor, 56);
    const rightAuthor = cleanText(params.rightAuthor, 56);
    const siteName = cleanText(params.siteName, 48);

    const renderQuoteColumn = (
      label: string,
      labelColor: string,
      quote: string,
      author: string,
    ) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          gap: '0px',
        },
        children: [
          // Label pill
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                marginBottom: '20px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '13px',
                    fontWeight: 700,
                    color: labelColor,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '5px 12px',
                    border: `1.5px solid ${labelColor}60`,
                    borderRadius: '20px',
                  },
                  children: label,
                },
              },
            },
          },
          // Quote text — flex 1 so both columns grow equally
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'flex-start',
                overflow: 'hidden',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: `${quoteSize}px`,
                    fontWeight: 600,
                    lineHeight: 1.3,
                    color: mainColor,
                    display: 'flex',
                    overflow: 'hidden',
                  },
                  children: quote,
                },
              },
            },
          },
          // Author byline
          ...(author
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      marginTop: '18px',
                      fontSize: '15px',
                      fontWeight: 400,
                      color: mutedColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    children: author,
                  },
                },
              ]
            : []),
        ],
      },
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          padding: '54px 60px 48px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Title row
          ...(title
            ? [
                {
                  type: 'h1',
                  props: {
                    style: {
                      margin: '0 0 32px',
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: mainColor,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    children: title,
                  },
                },
              ]
            : []),
          // Two-column body
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                gap: '0px',
                minHeight: 0,
                overflow: 'hidden',
              },
              children: [
                // Left column
                renderQuoteColumn(leftLabel, accentInk, leftQuote, leftAuthor),
                // Divider with "vs" chip
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      width: '64px',
                      position: 'relative',
                    },
                    children: [
                      // Thin vertical line top
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '1px',
                            flex: 1,
                            backgroundColor: dividerColor,
                          },
                          children: [],
                        },
                      },
                      // "vs" chip
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
                            border: `1.5px solid ${dividerColor}`,
                            backgroundColor: bgColor,
                            flexShrink: 0,
                            margin: '8px 0',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '11px',
                                fontWeight: 700,
                                color: mutedColor,
                                letterSpacing: '0.04em',
                              },
                              children: 'vs',
                            },
                          },
                        },
                      },
                      // Thin vertical line bottom
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '1px',
                            flex: 1,
                            backgroundColor: dividerColor,
                          },
                          children: [],
                        },
                      },
                    ],
                  },
                },
                // Right column
                renderQuoteColumn(rightLabel, rightLabelColor, rightQuote, rightAuthor),
              ],
            },
          },
          // Footer: site name bottom right
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'flex-end',
                      marginTop: '20px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: mutedColor,
                          letterSpacing: '0.07em',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
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
