import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-sale-banner',
  name: 'Sale Banner',
  category: 'ecommerce',
  description: 'Large "XX% OFF" text with strikethrough original price',
  tags: ['ecommerce', 'sale', 'banner', 'discount'],
  fields: [
    commonFields.title,
    { key: 'discount', label: 'Discount', type: 'text', defaultValue: '50% OFF', placeholder: '50% OFF', required: true, group: 'Content' },
    { key: 'originalPrice', label: 'Original Price', type: 'text', defaultValue: '$199.99', placeholder: '$199.99', group: 'Content' },
    { key: 'salePrice', label: 'Sale Price', type: 'text', defaultValue: '$99.99', placeholder: '$99.99', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Summer Sale',
    discount: '50% OFF',
    originalPrice: '$199.99',
    salePrice: '$99.99',
    siteName: 'ShopNow',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Summer Sale'), 40);
    const discount = String(params.discount || '50% OFF');
    const originalPrice = String(params.originalPrice || '');
    const salePrice = String(params.salePrice || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

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
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Site name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      fontWeight: 600,
                      color: `${textColor}88`,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase' as const,
                      marginBottom: '24px',
                    },
                    children: siteName,
                  },
                },
              ]
            : []),
          // Title
          {
            type: 'span',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 500,
                color: `${textColor}CC`,
                marginBottom: '16px',
              },
              children: title,
            },
          },
          // Giant discount
          {
            type: 'span',
            props: {
              style: {
                fontSize: '120px',
                fontWeight: 900,
                color: accentColor,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              },
              children: discount,
            },
          },
          // Price comparison
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: '32px',
              },
              children: [
                ...(originalPrice
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '32px',
                            fontWeight: 400,
                            color: `${textColor}66`,
                            textDecoration: 'line-through',
                          },
                          children: originalPrice,
                        },
                      },
                    ]
                  : []),
                ...(originalPrice && salePrice
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '32px',
                            color: `${textColor}44`,
                          },
                          children: '\u2192',
                        },
                      },
                    ]
                  : []),
                ...(salePrice
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '40px',
                            fontWeight: 800,
                            color: textColor,
                          },
                          children: salePrice,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
