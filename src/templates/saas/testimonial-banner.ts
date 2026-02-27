import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-testimonial-banner',
  name: 'Testimonial Banner',
  category: 'saas',
  description: 'Customer quote with avatar area, name, and company',
  tags: ['testimonial', 'quote', 'saas', 'customer', 'review'],
  fields: [
    { key: 'quote', label: 'Quote', type: 'textarea', defaultValue: 'This product completely transformed how our team works. We shipped 3x faster in the first month.', placeholder: 'Customer testimonial...', group: 'Content' },
    { key: 'customerName', label: 'Customer Name', type: 'text', defaultValue: 'Sarah Chen', placeholder: 'Full name', group: 'Content' },
    { key: 'customerRole', label: 'Role & Company', type: 'text', defaultValue: 'CTO at TechCorp', placeholder: 'CTO at Company', group: 'Content' },
    { key: 'rating', label: 'Star Rating (1-5)', type: 'number', defaultValue: 5, min: 1, max: 5, group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'This product completely transformed how our team works. We shipped 3x faster in the first month.',
    customerName: 'Sarah Chen',
    customerRole: 'CTO at TechCorp',
    rating: 5,
    siteName: '',
    bgColor: '#18181b',
    accentColor: '#f59e0b',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const quote = truncate(String(params.quote || 'This product completely transformed how our team works.'), 180);
    const customerName = String(params.customerName || 'Sarah Chen');
    const customerRole = String(params.customerRole || 'CTO at TechCorp');
    const rating = Math.min(5, Math.max(1, Number(params.rating) || 5));
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#18181b');
    const accentColor = String(params.accentColor || '#f59e0b');
    const textColor = String(params.textColor || '#FFFFFF');

    const quoteSize = quote.length > 120 ? 24 : quote.length > 80 ? 28 : 32;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
          position: 'relative',
        },
        children: [
          // Large quote mark
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '40px',
                left: '50px',
                fontSize: '180px',
                fontFamily: 'Playfair Display, serif',
                color: `${accentColor}18`,
                lineHeight: 1,
              },
              children: '\u201C',
            },
          },
          // Stars
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '6px',
                marginBottom: '28px',
                zIndex: 1,
              },
              children: Array.from({ length: 5 }, (_, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '24px',
                    height: '24px',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '20px',
                        color: i < rating ? accentColor : `${textColor}22`,
                      },
                      children: '\u2605',
                    },
                  },
                },
              })),
            },
          },
          // Quote text
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                zIndex: 1,
              },
              children: {
                type: 'p',
                props: {
                  style: {
                    fontSize: `${quoteSize}px`,
                    fontWeight: 400,
                    color: textColor,
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: '950px',
                    fontStyle: 'italic',
                  },
                  children: `"${quote}"`,
                },
              },
            },
          },
          // Bottom: customer info + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '32px',
                borderTop: `1px solid ${textColor}12`,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      // Avatar placeholder
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: `${accentColor}22`,
                            border: `2px solid ${accentColor}44`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '18px', fontWeight: 700, color: accentColor },
                              children: customerName.charAt(0).toUpperCase(),
                            },
                          },
                        },
                      },
                      // Name + role
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 600, color: textColor },
                                children: customerName,
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '14px', color: `${textColor}66` },
                                children: customerRole,
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44` },
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
