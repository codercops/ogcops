import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const defaultProducts = 'Wireless Headphones\nTravel Backpack\nSmart Watch';
const pricePattern = /^[\$£€¥₹]?\s*([+-]?(?:(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d+)?|\.\d+))\s*[\$£€¥₹]?$/;

function parsePrice(value: string): number | undefined {
  const match = value.trim().match(pricePattern);
  if (!match) return undefined;

  const price = Number(match[1].replace(/,/g, ''));
  return Number.isFinite(price) ? price : undefined;
}

const template: TemplateDefinition = {
  id: 'ecommerce-bundle-deal',
  name: 'Bundle Deal',
  category: 'ecommerce',
  description: 'Show products bundled together with a combined price and savings',
  tags: ['ecommerce', 'bundle', 'deal', 'products', 'savings'],
  fields: [
    {
      key: 'products',
      label: 'Products',
      type: 'textarea',
      defaultValue: defaultProducts,
      placeholder: 'One product per line',
      required: true,
      group: 'Content',
    },
    {
      key: 'oldPrice',
      label: 'Old Total',
      type: 'text',
      defaultValue: '$120',
      placeholder: '$120',
      required: true,
      group: 'Content',
    },
    {
      key: 'newPrice',
      label: 'Bundle Total',
      type: 'text',
      defaultValue: '$89',
      placeholder: '$89',
      required: true,
      group: 'Content',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    products: defaultProducts,
    oldPrice: '$120',
    newPrice: '$89',
    siteName: 'GearUp',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const products = String(params.products ?? defaultProducts)
      .split(/\r?\n/)
      .map((product) => product.trim())
      .filter(Boolean)
      .slice(0, 3)
      .map((product) => truncate(product, 36));
    const oldPriceValue = String(params.oldPrice ?? '$120');
    const newPriceValue = String(params.newPrice ?? '$89');
    const oldPrice = truncate(oldPriceValue, 14);
    const newPrice = truncate(newPriceValue, 14);
    const siteName = truncate(String(params.siteName ?? ''), 40);
    const bgColor = String(params.bgColor ?? '#0a0a0a');
    const accentColor = String(params.accentColor ?? '#E07A5F');
    const textColor = String(params.textColor ?? '#FFFFFF');
    const oldPriceNumber = parsePrice(oldPriceValue);
    const newPriceNumber = parsePrice(newPriceValue);
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const savings =
      oldPriceNumber !== undefined &&
      newPriceNumber !== undefined &&
      oldPriceNumber > newPriceNumber &&
      newPriceNumber >= 0
        ? Math.floor(((oldPriceNumber - newPriceNumber) / oldPriceNumber) * 100)
        : undefined;

    const productCards = products.flatMap((product, index) => {
      const card = {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '280px',
            height: '174px',
            boxSizing: 'border-box',
            padding: '24px',
            border: `2px solid ${accentColor}`,
            borderRadius: '24px',
          },
          children: {
            type: 'span',
            props: {
              style: {
                fontSize: autoFontSize(product, [
                  { maxLen: 18, size: 32 },
                  { maxLen: 28, size: 26 },
                  { maxLen: 36, size: 20 },
                ]),
                fontWeight: 600,
                color: textColor,
                textAlign: 'center',
              },
              children: product,
            },
          },
        },
      };

      if (index === 0) return [card];

      return [
        {
          type: 'span',
          props: {
            style: {
              fontSize: '44px',
              fontWeight: 500,
              color: accentInk,
            },
            children: '+',
          },
        },
        card,
      ];
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          padding: '56px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '10px 22px',
                      borderRadius: '100px',
                      backgroundColor: accentColor,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '17px',
                          fontWeight: 700,
                          color: contrastText(accentColor),
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase' as const,
                        },
                        children: 'BUNDLE DEAL',
                      },
                    },
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 600,
                            color: textColor,
                          },
                          children: siteName,
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
                alignItems: 'center',
                justifyContent: 'center',
                gap: '20px',
              },
              children: productCards,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '28px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '42px',
                      fontWeight: 400,
                      color: textColor,
                      textDecoration: 'line-through',
                    },
                    children: oldPrice,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: autoFontSize(newPrice, [
                        { maxLen: 8, size: 72 },
                        { maxLen: 14, size: 52 },
                      ]),
                      fontWeight: 700,
                      color: accentInk,
                      lineHeight: 1,
                    },
                    children: newPrice,
                  },
                },
                ...(savings !== undefined
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '12px 20px',
                            borderRadius: '100px',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '20px',
                                fontWeight: 700,
                                color: contrastText(accentColor),
                              },
                              children: `Save ${savings}%`,
                            },
                          },
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
