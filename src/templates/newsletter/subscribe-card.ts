import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, isLightColor, contrastText, commonFields } from '../utils';

const FORM_PLACEHOLDER = 'you@example.com';

const template: TemplateDefinition = {
  id: 'newsletter-subscribe-card',
  name: 'Subscribe Card',
  category: 'newsletter',
  description: 'A newsletter landing card with a frequency pill, a mock signup form and a reader count',
  tags: ['newsletter', 'subscribe', 'signup', 'form', 'readers'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'frequency', label: 'Frequency', type: 'text', defaultValue: 'Every Friday', placeholder: 'Every Friday', group: 'Content' },
    { key: 'subscriberCount', label: 'Subscriber Count', type: 'text', defaultValue: '12,400', placeholder: '12,400 (leave empty to hide)', group: 'Content' },
    { key: 'ctaText', label: 'Button Text', type: 'text', defaultValue: 'Subscribe', placeholder: 'Subscribe', group: 'Content' },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0a0a0a' },
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Friday Brief',
    description: 'One email a week with the best of web development.',
    frequency: 'Every Friday',
    subscriberCount: '12,400',
    ctaText: 'Subscribe',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'The Friday Brief'), 40);
    const description = params.description ? truncate(String(params.description), 80) : '';
    const frequency = truncate(String(params.frequency ?? '').trim(), 24);
    const subscriberCount = truncate(String(params.subscriberCount ?? '').trim(), 16);
    const ctaText = truncate(String(params.ctaText ?? '').trim() || 'Subscribe', 16);
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const titleSize = autoFontSize(title, [
      { maxLen: 16, size: 76 },
      { maxLen: 28, size: 64 },
      { maxLen: 40, size: 52 },
    ]);

    // Neutral colors are mixed from the background and text colors, so the card
    // reads the same on dark and on light backgrounds.
    const lightBg = isLightColor(bgColor);
    const fieldFace = mixColors(bgColor, textColor, 0.07);
    const fieldBorder = mixColors(bgColor, textColor, 0.25);
    const mutedText = mixColors(bgColor, textColor, 0.55);
    const secondaryText = mixColors(bgColor, textColor, 0.75);
    // An accent as light as the background (or as dark as it) is hard to read as
    // text, so pull it toward the text color. Otherwise it reads as it is.
    const pillText = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;
    const buttonText = contrastText(accentColor);

    const readerCircles: SatoriElement[] = [
      mixColors(accentColor, bgColor, 0),
      mixColors(accentColor, textColor, 0.3),
      mixColors(accentColor, bgColor, 0.4),
      mixColors(textColor, bgColor, 0.55),
    ].map((color, index) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '34px',
          height: '34px',
          borderRadius: '50%',
          background: color,
          border: `3px solid ${bgColor}`,
          marginLeft: index === 0 ? '0px' : '-12px',
        },
        children: [],
      },
    }));

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
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '48px 80px',
        },
        children: [
          // Frequency pill
          ...(frequency
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '8px 22px',
                      borderRadius: '999px',
                      background: `${accentColor}22`,
                      border: `1px solid ${accentColor}66`,
                      marginBottom: '32px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 600,
                          color: pillText,
                          letterSpacing: '0.06em',
                        },
                        children: frequency,
                      },
                    },
                  },
                },
              ]
            : []),
          // Newsletter name
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                textAlign: 'center',
                letterSpacing: '-0.03em',
              },
              children: title,
            },
          },
          // One-line pitch
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: '28px',
                      fontWeight: 400,
                      color: secondaryText,
                      lineHeight: 1.4,
                      margin: 0,
                      marginTop: '18px',
                      textAlign: 'center',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Mock signup form: an input-shaped box joined to the button
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                marginTop: '44px',
                width: '640px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      flex: 1,
                      height: '68px',
                      padding: '0 28px',
                      background: fieldFace,
                      border: `2px solid ${fieldBorder}`,
                      borderRight: 'none',
                      borderRadius: '14px 0 0 14px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '24px', fontWeight: 400, color: mutedText },
                        children: FORM_PLACEHOLDER,
                      },
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '68px',
                      padding: '0 36px',
                      background: accentColor,
                      borderRadius: '0 14px 14px 0',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '24px', fontWeight: 700, color: buttonText },
                        children: ctaText,
                      },
                    },
                  },
                },
              ],
            },
          },
          // Reader line: overlapping circles and the count
          ...(subscriberCount
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '32px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', alignItems: 'center', marginRight: '16px' },
                          children: readerCircles,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '22px', fontWeight: 500, color: secondaryText },
                          children: `Join ${subscriberCount} readers`,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
          // Site name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: mutedText,
                      marginTop: '28px',
                    },
                    children: siteName,
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
