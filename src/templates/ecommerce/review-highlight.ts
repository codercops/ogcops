import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-review-highlight',
  name: 'Review Highlight',
  category: 'ecommerce',
  description: '5 gold stars with customer quote and product name',
  tags: ['ecommerce', 'review', 'rating', 'testimonial'],
  fields: [
    { key: 'review', label: 'Review Text', type: 'textarea', defaultValue: 'Absolutely love this product! The quality exceeded my expectations and the shipping was incredibly fast.', placeholder: 'Customer review...', required: true, group: 'Content' },
    { key: 'reviewer', label: 'Reviewer Name', type: 'text', defaultValue: 'Sarah M.', placeholder: 'Customer name', group: 'Content' },
    commonFields.title,
    { key: 'rating', label: 'Rating (1-5)', type: 'number', defaultValue: 5, min: 1, max: 5, group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    review: 'Absolutely love this product! The quality exceeded my expectations and the shipping was incredibly fast.',
    reviewer: 'Sarah M.',
    title: 'Premium Wireless Earbuds',
    rating: 5,
    siteName: 'TechShop',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const review = truncate(String(params.review || 'Absolutely love this product!'), 180);
    const reviewer = String(params.reviewer || '');
    const title = String(params.title || '');
    const rating = Math.min(5, Math.max(1, Number(params.rating) || 5));
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const reviewSize = autoFontSize(review, [
      { maxLen: 60, size: 36 },
      { maxLen: 120, size: 30 },
      { maxLen: 180, size: 24 },
      { maxLen: 220, size: 22 },
    ]);

    const stars = Array.from({ length: 5 }, (_, i) => ({
      type: 'span',
      props: {
        style: {
          fontSize: '32px',
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
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 80px',
        },
        children: [
          // Stars
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '4px',
                marginBottom: '32px',
              },
              children: stars,
            },
          },
          // Review quote
          {
            type: 'p',
            props: {
              style: {
                fontSize: `${reviewSize}px`,
                fontStyle: 'italic',
                fontWeight: 400,
                color: textColor,
                lineHeight: 1.5,
                margin: 0,
                marginBottom: '32px',
                maxWidth: '900px',
              },
              children: `\u201C${review}\u201D`,
            },
          },
          // Reviewer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                ...(reviewer
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: `${textColor}CC`,
                          },
                          children: `\u2014 ${reviewer}`,
                        },
                      },
                    ]
                  : []),
                ...(reviewer && title
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}44` },
                          children: 'on',
                        },
                      },
                    ]
                  : []),
                ...(title
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 500,
                            color: accentColor,
                          },
                          children: title,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Store branding
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      color: `${textColor}44`,
                      marginTop: '40px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase' as const,
                    },
                    children: `Verified purchase on ${siteName}`,
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
