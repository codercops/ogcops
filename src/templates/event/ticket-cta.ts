import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-ticket-cta',
  name: 'Ticket CTA',
  category: 'event',
  description: 'Ticket-shaped card with dashed line separator, price, and CTA button',
  tags: ['ticket', 'cta', 'price', 'event'],
  fields: [
    commonFields.title,
    commonFields.date,
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco, CA', group: 'Content' as const },
    { key: 'price', label: 'Price', type: 'text' as const, defaultValue: '', placeholder: '$99', group: 'Content' as const },
    { key: 'priceLabel', label: 'Price Label', type: 'text' as const, defaultValue: 'Early Bird', placeholder: 'Early Bird / VIP', group: 'Content' as const },
    { key: 'ctaText', label: 'CTA Text', type: 'text' as const, defaultValue: 'Get Tickets', placeholder: 'Get Tickets', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'DevConf 2026',
    date: 'Mar 15–18, 2026',
    location: 'San Francisco, CA',
    price: '$99',
    priceLabel: 'Early Bird',
    ctaText: 'Get Tickets',
    siteName: '',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Event'), 50);
    const date = String(params.date || '');
    const location = String(params.location || '');
    const price = String(params.price || '');
    const priceLabel = String(params.priceLabel || '');
    const ctaText = String(params.ctaText || 'Get Tickets');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 56 },
      { maxLen: 35, size: 46 },
      { maxLen: 50, size: 38 },
      { maxLen: 70, size: 32 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Ticket container
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '1080px',
                height: '480px',
                background: `${textColor}08`,
                borderRadius: '24px',
                border: `2px solid ${textColor}15`,
                overflow: 'hidden',
              },
              children: [
                // Left: event info
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flex: 1,
                      padding: '48px',
                    },
                    children: [
                      // Site name
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  color: `${textColor}55`,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  marginBottom: '16px',
                                },
                                children: siteName,
                              },
                            },
                          ]
                        : []),
                      // Title
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 800,
                            color: textColor,
                            lineHeight: 1.1,
                            margin: 0,
                            fontFamily: 'Playfair Display, serif',
                          },
                          children: title,
                        },
                      },
                      // Date + location
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            marginTop: '24px',
                          },
                          children: [
                            ...(date
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '18px', fontWeight: 600, color: accentColor },
                                      children: date,
                                    },
                                  },
                                ]
                              : []),
                            ...(location
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: `${textColor}77` },
                                      children: location,
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
                // Dashed line separator
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2px',
                      height: '480px',
                      position: 'relative',
                    },
                    children: [
                      // Create dashed effect with small boxes
                      ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((i) => ({
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '2px',
                            height: '16px',
                            background: i % 2 === 0 ? `${textColor}22` : 'transparent',
                          },
                          children: '',
                        },
                      })),
                    ],
                  },
                },
                // Right: price + CTA
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '300px',
                      padding: '48px',
                    },
                    children: [
                      // Price label
                      ...(priceLabel
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  color: accentColor,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  marginBottom: '8px',
                                },
                                children: priceLabel,
                              },
                            },
                          ]
                        : []),
                      // Price
                      ...(price
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '64px',
                                  fontWeight: 800,
                                  color: textColor,
                                  lineHeight: 1,
                                  marginBottom: '24px',
                                },
                                children: price,
                              },
                            },
                          ]
                        : []),
                      // CTA button
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '14px 36px',
                            background: accentColor,
                            borderRadius: '12px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                              },
                              children: ctaText,
                            },
                          },
                        },
                      },
                    ],
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
