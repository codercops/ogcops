import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-back-in-stock',
  name: 'Back in Stock',
  category: 'ecommerce',
  description: 'A "back in stock" badge with the product name, price and an optional urgency line',
  tags: ['ecommerce', 'restock', 'back-in-stock', 'product', 'urgency'],
  fields: [
    { key: 'productName', label: 'Product Name', type: 'text', defaultValue: 'Classic Canvas Weekender', placeholder: 'Classic Canvas Weekender', required: true, group: 'Content' },
    { key: 'price', label: 'Price', type: 'text', defaultValue: '$89', placeholder: '$89', group: 'Content' },
    { key: 'stockNote', label: 'Stock Note', type: 'text', defaultValue: 'Only 12 left', placeholder: 'Only 12 left', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    productName: 'Classic Canvas Weekender',
    price: '$89',
    stockNote: 'Only 12 left',
    siteName: 'Field & Co.',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawName = String(params.productName || 'Classic Canvas Weekender').trim() || 'Classic Canvas Weekender';
    const nameSize = autoFontSize(rawName, [
      { maxLen: 24, size: 64 },
      { maxLen: 40, size: 54 },
      { maxLen: 64, size: 44 },
      { maxLen: 90, size: 36 },
    ]);
    const productName = truncate(rawName, 80);
    const price = truncate(String(params.price || '').trim(), 24);
    const stockNote = truncate(String(params.stockNote || '').trim(), 40);
    const siteName = truncate(String(params.siteName || '').trim(), 40);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    // The badge keeps the accent as its background, so its label follows the accent's contrast.
    // Text drawn in the accent sits on the page background, so it is darkened when that is light.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px 80px',
        },
        children: [
          // Back in stock badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignSelf: 'flex-start',
                padding: '9px 24px',
                backgroundColor: accentColor,
                borderRadius: '100px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '16px',
                    fontWeight: 800,
                    color: contrastText(accentColor),
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                  },
                  children: 'Back in stock',
                },
              },
            },
          },
          // Product name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${nameSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                marginTop: '30px',
              },
              children: productName,
            },
          },
          // Price
          ...(price
            ? [{
                type: 'span',
                props: {
                  style: {
                    fontSize: '56px',
                    fontWeight: 800,
                    color: accentInk,
                    lineHeight: 1.1,
                    marginTop: '34px',
                  },
                  children: price,
                },
              }]
            : []),
          // Urgency line
          ...(stockNote
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignSelf: 'flex-start',
                    marginTop: '16px',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    backgroundColor: `${accentInk}1F`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '20px',
                        fontWeight: 600,
                        color: accentInk,
                      },
                      children: stockNote,
                    },
                  },
                },
              }]
            : []),
          // Store name
          ...(siteName
            ? [{
                type: 'span',
                props: {
                  style: {
                    fontSize: '18px',
                    fontWeight: 500,
                    color: `${textColor}66`,
                    marginTop: '44px',
                  },
                  children: siteName,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
