import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-coupon-code',
  name: 'Coupon Code',
  category: 'ecommerce',
  description: 'Wide coupon card with discount stub, coupon code, and expiry',
  tags: ['ecommerce', 'coupon', 'discount', 'code', 'promo', 'sale'],
  fields: [
    commonFields.title,
    {
      key: 'discount',
      label: 'Discount',
      type: 'text' as const,
      defaultValue: '30% OFF',
      placeholder: '30% OFF',
      required: true,
      group: 'Content' as const,
    },
    {
      key: 'couponCode',
      label: 'Coupon Code',
      type: 'text' as const,
      defaultValue: 'SAVE30',
      placeholder: 'SAVE30',
      required: true,
      group: 'Content' as const,
    },
    {
      key: 'expiry',
      label: 'Expiry',
      type: 'text' as const,
      defaultValue: 'Valid until Dec 31, 2026',
      placeholder: 'Valid until Dec 31, 2026',
      group: 'Content' as const,
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Summer Clearance Sale',
    discount: '30% OFF',
    couponCode: 'SAVE30',
    expiry: 'Valid until Dec 31, 2026',
    siteName: 'store.example.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Special Offer'), 50);
    const discount = String(params.discount || '30% OFF');
    const rawCouponCode = String(params.couponCode || 'SAVE30');
    const couponCode = truncate(rawCouponCode, 16);
    const expiry = String(params.expiry || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 44 },
      { maxLen: 38, size: 36 },
      { maxLen: 50, size: 30 },
    ]);

    const discountSize = autoFontSize(discount, [
      { maxLen: 4, size: 84 },
      { maxLen: 8, size: 68 },
      { maxLen: 12, size: 52 },
      { maxLen: 16, size: 42 },
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
          // Coupon card container
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '1080px',
                height: '440px',
                background: `${textColor}08`,
                borderRadius: '24px',
                border: `2px solid ${textColor}15`,
                position: 'relative',
              },
              children: [
                // Left stub: discount prominently
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '360px',
                      padding: '48px 32px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 700,
                            color: accentColor,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase' as const,
                            marginBottom: '12px',
                          },
                          children: 'SPECIAL OFFER',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: `${discountSize}px`,
                            fontWeight: 900,
                            color: accentColor,
                            lineHeight: 1,
                            letterSpacing: '-0.02em',
                            textAlign: 'center',
                          },
                          children: discount,
                        },
                      },
                    ],
                  },
                },
                // Vertical dashed divider with semicircular notches
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '2px',
                      height: '440px',
                      position: 'relative',
                    },
                    children: [
                      // Top semicircular notch filled with bgColor
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            position: 'absolute',
                            top: '-20px',
                            left: '-19px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '20px',
                            background: bgColor,
                          },
                          children: '',
                        },
                      },
                      // Bottom semicircular notch filled with bgColor
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            position: 'absolute',
                            bottom: '-20px',
                            left: '-19px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '20px',
                            background: bgColor,
                          },
                          children: '',
                        },
                      },
                      // Vertical dashed divider
                      ...[...Array(24).keys()].map((i) => ({
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '2px',
                            height: '14px',
                            background: i % 2 === 0 ? `${textColor}25` : 'transparent',
                          },
                          children: '',
                        },
                      })),
                    ],
                  },
                },
                // Right body: title, coupon code box, expiry
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flex: 1,
                      padding: '48px 56px',
                    },
                    children: [
                      // Site name
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  fontWeight: 600,
                                  color: `${textColor}66`,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase' as const,
                                  marginBottom: '12px',
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
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1.2,
                            margin: '0 0 24px 0',
                          },
                          children: title,
                        },
                      },
                      // Coupon code box
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            alignSelf: 'flex-start',
                            padding: '12px 28px',
                            borderRadius: '12px',
                            border: `2px dashed ${accentColor}`,
                            background: `${accentColor}12`,
                            marginBottom: expiry ? '20px' : '0px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontFamily: 'JetBrains Mono, monospace',
                                fontSize: '26px',
                                fontWeight: 700,
                                color: textColor,
                                letterSpacing: '0.1em',
                              },
                              children: couponCode,
                            },
                          },
                        },
                      },
                      // Expiry
                      ...(expiry
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: `${textColor}77`,
                                },
                                children: expiry,
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
        ],
      },
    };
  },
};

export default template;
