import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-comparison-grid',
  name: 'Comparison Grid',
  category: 'ecommerce',
  description: 'Side-by-side product comparison with features',
  tags: ['ecommerce', 'comparison', 'grid', 'versus'],
  fields: [
    commonFields.title,
    { key: 'product1', label: 'Product 1 Name', type: 'text', defaultValue: 'Pro Model', placeholder: 'Product 1', required: true, group: 'Content' },
    { key: 'price1', label: 'Product 1 Price', type: 'text', defaultValue: '$299', placeholder: '$299', group: 'Content' },
    { key: 'product2', label: 'Product 2 Name', type: 'text', defaultValue: 'Max Model', placeholder: 'Product 2', required: true, group: 'Content' },
    { key: 'price2', label: 'Product 2 Price', type: 'text', defaultValue: '$499', placeholder: '$499', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Which one is right for you?',
    product1: 'Pro Model',
    price1: '$299',
    product2: 'Max Model',
    price2: '$499',
    siteName: 'TechCompare',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Which one is right for you?'), 60);
    const product1 = truncate(String(params.product1 || 'Pro Model'), 30);
    const price1 = String(params.price1 || '');
    const product2 = truncate(String(params.product2 || 'Max Model'), 30);
    const price2 = String(params.price2 || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const productColumn = (name: string, price: string, featured: boolean) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: '40px',
          backgroundColor: featured ? `${accentColor}11` : 'transparent',
          borderRadius: '16px',
          border: featured ? `2px solid ${accentColor}44` : `1px solid ${textColor}1A`,
        },
        children: [
          // Product image placeholder
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '120px',
                height: '120px',
                borderRadius: '16px',
                backgroundColor: `${textColor}0A`,
                marginBottom: '24px',
              },
              children: {
                type: 'span',
                props: {
                  style: { fontSize: '12px', color: `${textColor}33` },
                  children: 'Image',
                },
              },
            },
          },
          // Product name
          {
            type: 'span',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 700,
                color: textColor,
                marginBottom: '12px',
              },
              children: name,
            },
          },
          // Price
          ...(price
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '36px',
                      fontWeight: 800,
                      color: featured ? accentColor : `${textColor}CC`,
                    },
                    children: price,
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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '48px 60px',
        },
        children: [
          // Header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: 700,
                      color: textColor,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}55` },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Products side by side
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                gap: '24px',
              },
              children: [
                productColumn(product1, price1, false),
                // VS divider
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: 700,
                          color: `${textColor}33`,
                        },
                        children: 'VS',
                      },
                    },
                  },
                },
                productColumn(product2, price2, true),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
