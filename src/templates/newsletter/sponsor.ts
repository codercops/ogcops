import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, contrastText, isLightColor, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-sponsor',
  name: 'Sponsor',
  category: 'newsletter',
  description: 'A newsletter sponsor feature with a centered brand pitch and call to action',
  tags: ['newsletter', 'sponsor', 'ad', 'cta', 'brand'],
  fields: [
    commonFields.siteName,
    { key: 'issueNumber', label: 'Issue Number', type: 'text', defaultValue: '42', placeholder: '42 (leave empty to hide)', group: 'Content' },
    { key: 'sponsorLabel', label: 'Sponsor Label', type: 'text', defaultValue: 'Sponsored by', placeholder: 'Sponsored by', group: 'Content' },
    { key: 'sponsorName', label: 'Sponsor Name', type: 'text', defaultValue: 'Acme', placeholder: 'Acme', group: 'Content' },
    commonFields.description,
    { key: 'ctaText', label: 'Button Text', type: 'text', defaultValue: 'Learn more', placeholder: 'Learn more (leave empty to hide)', group: 'Content' },
    { ...commonFields.bgColor, defaultValue: '#0a0a0a' },
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'The Friday Brief',
    issueNumber: '42',
    sponsorLabel: 'Sponsored by',
    sponsorName: 'Acme',
    description: 'The fastest way to ship production-ready apps.',
    ctaText: 'Learn more',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const siteName = truncate(String(params.siteName ?? '').trim(), 40);
    const issueNumber = truncate(String(params.issueNumber ?? '').trim(), 16);
    const sponsorLabel = truncate(String(params.sponsorLabel ?? '').trim(), 24);
    const sponsorName = truncate(String(params.sponsorName ?? '').trim(), 40);
    const description = truncate(String(params.description ?? '').trim(), 90);
    const ctaText = truncate(String(params.ctaText ?? '').trim(), 24);
    const bgColor = String(params.bgColor ?? '#0a0a0a');
    const accentColor = String(params.accentColor ?? '#E07A5F');
    const textColor = String(params.textColor ?? '#FFFFFF');
    const labelColor = mixColors(bgColor, textColor, 0.6);
    const buttonText = contrastText(accentColor);
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const sponsorNameSize = autoFontSize(sponsorName, [
      { maxLen: 10, size: 96 },
      { maxLen: 18, size: 80 },
      { maxLen: 28, size: 64 },
      { maxLen: 40, size: 52 },
    ]);

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
          padding: '60px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              },
              children: [
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: accentInk,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase' as const,
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
                ...(issueNumber
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '8px 20px',
                            backgroundColor: accentColor,
                            borderRadius: '100px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 700,
                                color: buttonText,
                                letterSpacing: '0.05em',
                              },
                              children: `Issue #${issueNumber}`,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '3px',
                backgroundColor: accentColor,
                marginBottom: '24px',
              },
              children: [],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
              children: [
                ...(sponsorLabel
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: labelColor,
                            letterSpacing: '0.16em',
                            textTransform: 'uppercase' as const,
                          },
                          children: sponsorLabel,
                        },
                      },
                    ]
                  : []),
                ...(sponsorName
                  ? [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: `${sponsorNameSize}px`,
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1.1,
                            margin: 0,
                            marginTop: '18px',
                            textAlign: 'center',
                            letterSpacing: '-0.03em',
                          },
                          children: sponsorName,
                        },
                      },
                    ]
                  : []),
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            display: 'flex',
                            fontSize: '26px',
                            fontWeight: 400,
                            color: `${textColor}CC`,
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
              ],
            },
          },
          ...(ctaText
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'flex-start',
                      padding: '18px 32px',
                      backgroundColor: accentColor,
                      borderRadius: '12px',
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
              ]
            : []),
        ],
      },
    };
  },
};

export default template;