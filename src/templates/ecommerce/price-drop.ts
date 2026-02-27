import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-price-drop',
  name: 'Price Drop',
  category: 'ecommerce',
  description: 'Strikethrough old price with large new price and savings',
  tags: ['ecommerce', 'price', 'drop', 'savings'],
  fields: [
    commonFields.title,
    { key: 'oldPrice', label: 'Old Price', type: 'text', defaultValue: '$299.99', placeholder: '$299.99', required: true, group: 'Content' },
    { key: 'newPrice', label: 'New Price', type: 'text', defaultValue: '$149.99', placeholder: '$149.99', required: true, group: 'Content' },
    { key: 'savings', label: 'Savings Text', type: 'text', defaultValue: 'You save $150', placeholder: 'You save $150', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Premium Mechanical Keyboard',
    oldPrice: '$299.99',
    newPrice: '$149.99',
    savings: 'You save $150',
    siteName: 'GearUp',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Premium Mechanical Keyboard'), 60);
    const oldPrice = String(params.oldPrice || '$299.99');
    const newPrice = String(params.newPrice || '$149.99');
    const savings = String(params.savings || '');
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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                padding: '8px 24px',
                backgroundColor: '#D32F2F',
                borderRadius: '100px',
                marginBottom: '24px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase' as const,
                  },
                  children: 'PRICE DROP',
                },
              },
            },
          },
          // Product name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: '32px',
                fontWeight: 600,
                color: textColor,
                margin: 0,
                marginBottom: '40px',
                textAlign: 'center',
              },
              children: title,
            },
          },
          // Price comparison row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '32px',
              },
              children: [
                // Old price
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 400,
                      color: `${textColor}55`,
                      textDecoration: 'line-through',
                    },
                    children: oldPrice,
                  },
                },
                // Arrow
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '40px',
                      color: accentColor,
                    },
                    children: '\u2192',
                  },
                },
                // New price
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '80px',
                      fontWeight: 900,
                      color: accentColor,
                      lineHeight: 1,
                    },
                    children: newPrice,
                  },
                },
              ],
            },
          },
          // Savings
          ...(savings
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '10px 24px',
                      backgroundColor: `${accentColor}22`,
                      borderRadius: '8px',
                      marginTop: '32px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 600,
                          color: accentColor,
                        },
                        children: savings,
                      },
                    },
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
                      fontSize: '14px',
                      color: `${textColor}44`,
                      marginTop: '32px',
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
