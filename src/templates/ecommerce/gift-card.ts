import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-gift-card',
  name: 'Gift Card',
  category: 'ecommerce',
  description: 'Gift card promo with a headline, optional note, and accent-colored card',
  tags: ['ecommerce', 'gift card', 'gift', 'promo', 'holiday', 'store'],
  fields: [
    commonFields.siteName,
    commonFields.title,
    {
      key: 'amount',
      label: 'Amount',
      type: 'text' as const,
      defaultValue: '$50',
      placeholder: '$50',
      required: true,
      group: 'Content' as const,
    },
    {
      key: 'note',
      label: 'Note',
      type: 'text' as const,
      defaultValue: '',
      placeholder: 'Delivered instantly by email',
      group: 'Content' as const,
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'Northstar Supply',
    title: 'Give them the choice',
    amount: '$50',
    note: 'Delivered instantly by email',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? '').trim();
    const title = truncate(rawTitle || 'Give them the choice', 50);
    const rawAmount = String(params.amount ?? '').trim();
    const amount = truncate(rawAmount || '$50', 14);
    const note = truncate(String(params.note ?? '').trim(), 90);
    const siteName = truncate(String(params.siteName ?? '').trim(), 24);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const cardTextColor = contrastText(accentColor);

    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 64 },
      { maxLen: 38, size: 54 },
      { maxLen: 50, size: 44 },
    ]);

    const amountSize = autoFontSize(amount, [
      { maxLen: 4, size: 92 },
      { maxLen: 6, size: 80 },
      { maxLen: 10, size: 64 },
      { maxLen: 14, size: 44 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '64px',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          padding: '64px 72px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'center',
                minWidth: 0,
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      margin: 0,
                    },
                    children: title,
                  },
                },
                ...(note
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 400,
                            color: `${textColor}CC`,
                            lineHeight: 1.5,
                            margin: '20px 0 0 0',
                          },
                          children: note,
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
                flexShrink: 0,
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '500px',
                height: '360px',
                boxSizing: 'border-box',
                padding: '44px',
                borderRadius: '32px',
                backgroundColor: accentColor,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '24px',
                    },
                    children: [
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  display: 'flex',
                                  minWidth: 0,
                                  fontSize: '22px',
                                  fontWeight: 600,
                                  color: cardTextColor,
                                  letterSpacing: '0.01em',
                                },
                                children: siteName,
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'span',
                        props: {
                          style: {
                            display: 'flex',
                            flexShrink: 0,
                            fontSize: '19px',
                            fontWeight: 500,
                            color: cardTextColor,
                            letterSpacing: '0.04em',
                          },
                          children: 'Gift card',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: `${amountSize}px`,
                      fontWeight: 700,
                      color: cardTextColor,
                      lineHeight: 1,
                      letterSpacing: '-0.03em',
                    },
                    children: amount,
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
