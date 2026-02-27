import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-product-card',
  name: 'Product Card',
  category: 'ecommerce',
  description: 'Product image area with name, price, and star rating',
  tags: ['ecommerce', 'product', 'card', 'price', 'rating'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'price', label: 'Price', type: 'text', defaultValue: '$99.99', placeholder: '$99.99', group: 'Content' },
    { key: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 4, min: 1, max: 5, group: 'Content' },
    { key: 'reviewCount', label: 'Review Count', type: 'text', defaultValue: '128 reviews', placeholder: '128 reviews', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Wireless Noise-Cancelling Headphones',
    description: 'Premium sound quality with 30-hour battery life and adaptive noise cancellation.',
    price: '$99.99',
    rating: 4,
    reviewCount: '128 reviews',
    siteName: 'TechStore',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Wireless Noise-Cancelling Headphones'), 60);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const price = String(params.price || '$99.99');
    const rating = Math.min(5, Math.max(1, Number(params.rating) || 4));
    const reviewCount = String(params.reviewCount || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 40 },
      { maxLen: 40, size: 34 },
      { maxLen: 60, size: 28 },
      { maxLen: 80, size: 24 },
    ]);

    const stars = Array.from({ length: 5 }, (_, i) => ({
      type: 'span',
      props: {
        style: {
          fontSize: '24px',
          color: i < rating ? '#F5C518' : '#333333',
        },
        children: '\u2605',
      },
    }));

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: product image area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '500px',
                height: '630px',
                backgroundColor: '#1a1a1a',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '300px',
                    height: '300px',
                    borderRadius: '24px',
                    backgroundColor: '#252525',
                    border: `2px dashed ${accentColor}44`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '16px',
                        color: `${textColor}44`,
                      },
                      children: 'Product Image',
                    },
                  },
                },
              },
            },
          },
          // Right: product details
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
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
                            fontSize: '14px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
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
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      marginBottom: '16px',
                    },
                    children: title,
                  },
                },
                // Star rating
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      marginBottom: '8px',
                    },
                    children: [
                      ...stars,
                      ...(reviewCount
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: `${textColor}66`,
                                  marginLeft: '12px',
                                },
                                children: reviewCount,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Description
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: `${textColor}80`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '12px',
                            marginBottom: '24px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Price
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 800,
                      color: accentColor,
                      marginTop: '8px',
                    },
                    children: price,
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
