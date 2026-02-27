import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-new-arrival',
  name: 'New Arrival',
  category: 'ecommerce',
  description: '"NEW" badge with product name and launch date',
  tags: ['ecommerce', 'new', 'arrival', 'launch'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'launchDate', label: 'Launch Date', type: 'text', defaultValue: 'Available Jan 20', placeholder: 'Available Jan 20', group: 'Content' },
    { key: 'price', label: 'Price', type: 'text', defaultValue: '$249.99', placeholder: '$249.99', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Ultra-Slim Pro Laptop Stand',
    description: 'Machined from a single block of aerospace-grade aluminum. Adjustable height, hidden cable management.',
    launchDate: 'Available Jan 20',
    price: '$249.99',
    siteName: 'DeskSetup',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Ultra-Slim Pro Laptop Stand'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const launchDate = String(params.launchDate || '');
    const price = String(params.price || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 60, size: 36 },
      { maxLen: 80, size: 30 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 80px',
        },
        children: [
          // NEW badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '6px 20px',
                      backgroundColor: accentColor,
                      borderRadius: '4px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                          letterSpacing: '0.15em',
                        },
                        children: 'NEW',
                      },
                    },
                  },
                },
                ...(launchDate
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: `${textColor}66`,
                          },
                          children: launchDate,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Product name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '20px',
              },
              children: title,
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}80`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '32px',
                      maxWidth: '800px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Price + site
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginTop: 'auto',
                paddingTop: '24px',
              },
              children: [
                ...(price
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '36px',
                            fontWeight: 800,
                            color: accentColor,
                          },
                          children: price,
                        },
                      },
                    ]
                  : []),
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: `${textColor}44`,
                          },
                          children: siteName,
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
