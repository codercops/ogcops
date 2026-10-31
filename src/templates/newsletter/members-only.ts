import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, isLightColor, contrastText, hexToRgb, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-members-only',
  name: 'Members Only',
  category: 'newsletter',
  description: 'A members-only newsletter preview with teaser text fading into the background and an upgrade CTA',
  tags: ['newsletter', 'members', 'subscribers', 'paid', 'premium'],
  fields: [
    commonFields.title,
    commonFields.description,
    {
      key: 'label',
      label: 'Label',
      type: 'text',
      defaultValue: 'For paid subscribers',
      placeholder: 'For paid subscribers',
      group: 'Content',
    },
    {
      key: 'cta',
      label: 'Button Text',
      type: 'text',
      defaultValue: 'Upgrade to keep reading',
      placeholder: 'Upgrade to keep reading',
      group: 'Content',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'How we cut our cloud bill in half',
    description: 'We spent three months moving off managed databases. Here is what worked, what broke, and the numbers before and after.',
    label: 'For paid subscribers',
    cta: 'Upgrade to keep reading',
    siteName: 'The Weekly Byte',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = params.title !== undefined ? String(params.title).trim() : 'How we cut our cloud bill in half';
    const rawDescription = params.description !== undefined ? String(params.description).trim() : '';
    const rawLabel = params.label !== undefined ? String(params.label).trim() : 'For paid subscribers';
    const rawCta = params.cta !== undefined ? String(params.cta).trim() : 'Upgrade to keep reading';
    const rawSiteName = params.siteName !== undefined ? String(params.siteName).trim() : 'The Weekly Byte';

    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 35, size: 58 },
      { maxLen: 55, size: 48 },
      { maxLen: 75, size: 40 },
      { maxLen: 100, size: 34 },
    ]);
    const title = truncate(rawTitle || 'How we cut our cloud bill in half', 90);

    const teaserSize = autoFontSize(rawDescription, [
      { maxLen: 80, size: 24 },
      { maxLen: 140, size: 21 },
      { maxLen: 220, size: 19 },
      { maxLen: 320, size: 17 },
    ]);
    const description = rawDescription ? truncate(rawDescription, 300) : '';

    const label = rawLabel ? truncate(rawLabel, 40) : '';
    const cta = rawCta ? truncate(rawCta, 32) : '';
    const siteName = rawSiteName ? truncate(rawSiteName, 50) : '';

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const lightBg = isLightColor(bgColor);
    const accentInk = isLightColor(accentColor) === lightBg
      ? mixColors(accentColor, lightBg ? '#000000' : '#FFFFFF', 0.55)
      : accentColor;
    const buttonText = contrastText(accentColor);

    const bgRgb = hexToRgb(bgColor);
    const fadeStart = bgRgb ? `rgba(${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}, 0)` : 'transparent';

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
          padding: '60px 80px',
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
                      marginBottom: '20px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 700,
                          color: accentInk,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase' as const,
                        },
                        children: label,
                      },
                    },
                  },
                },
              ]
            : []),
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: description ? '20px' : '32px',
              },
              children: title,
            },
          },
          ...(description
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'relative',
                      overflow: 'hidden',
                      maxHeight: '145px',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: `${teaserSize}px`,
                            fontWeight: 400,
                            color: `${textColor}99`,
                            lineHeight: 1.55,
                            margin: 0,
                          },
                          children: description,
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            position: 'absolute',
                            left: '0px',
                            width: '100%',
                            bottom: '0px',
                            height: '55px',
                            background: `linear-gradient(180deg, ${fadeStart} 0%, ${bgColor} 100%)`,
                          },
                          children: [],
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
          ...(cta
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'flex-start',
                      padding: '14px 28px',
                      backgroundColor: accentColor,
                      borderRadius: '999px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 700,
                          color: buttonText,
                          letterSpacing: '0.02em',
                        },
                        children: cta,
                      },
                    },
                  },
                },
              ]
            : []),
          ...(siteName
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
                          fontSize: '18px',
                          fontWeight: 600,
                          color: `${textColor}80`,
                          letterSpacing: '0.04em',
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
