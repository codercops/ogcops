import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-pricing-highlight',
  name: 'Pricing Highlight',
  category: 'saas',
  description: 'Pricing tier card with a featured plan highlighted',
  tags: ['pricing', 'plans', 'saas', 'tiers', 'subscription'],
  fields: [
    commonFields.title,
    { key: 'planName', label: 'Plan Name', type: 'text', defaultValue: 'Pro', placeholder: 'Pro, Team, Business...', group: 'Content' },
    { key: 'price', label: 'Price', type: 'text', defaultValue: '$29', placeholder: '$29', group: 'Content' },
    { key: 'period', label: 'Period', type: 'text', defaultValue: '/month', placeholder: '/month, /year', group: 'Content' },
    { key: 'feature1', label: 'Feature 1', type: 'text', defaultValue: 'Unlimited projects', placeholder: 'Feature', group: 'Content' },
    { key: 'feature2', label: 'Feature 2', type: 'text', defaultValue: 'Priority support', placeholder: 'Feature', group: 'Content' },
    { key: 'feature3', label: 'Feature 3', type: 'text', defaultValue: 'Advanced analytics', placeholder: 'Feature', group: 'Content' },
    { key: 'feature4', label: 'Feature 4', type: 'text', defaultValue: 'Custom integrations', placeholder: 'Feature', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Simple, transparent pricing',
    planName: 'Pro',
    price: '$29',
    period: '/month',
    feature1: 'Unlimited projects',
    feature2: 'Priority support',
    feature3: 'Advanced analytics',
    feature4: 'Custom integrations',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#6366f1',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Simple, transparent pricing'), 60);
    const planName = String(params.planName || 'Pro');
    const price = String(params.price || '$29');
    const period = String(params.period || '/month');
    const features = [
      String(params.feature1 || 'Unlimited projects'),
      String(params.feature2 || 'Priority support'),
      String(params.feature3 || 'Advanced analytics'),
      String(params.feature4 || 'Custom integrations'),
    ];
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#6366f1');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 44 },
      { maxLen: 40, size: 38 },
      { maxLen: 60, size: 32 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '520px',
                padding: '60px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                // Accent line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '48px',
                      height: '4px',
                      background: accentColor,
                      borderRadius: '2px',
                      marginTop: '24px',
                    },
                    children: [],
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44`, marginTop: '24px' },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: pricing card
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '680px',
                padding: '40px',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '380px',
                    padding: '40px',
                    borderRadius: '20px',
                    background: `linear-gradient(180deg, ${accentColor}18 0%, ${accentColor}05 100%)`,
                    border: `1px solid ${accentColor}33`,
                  },
                  children: [
                    // Plan badge
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignSelf: 'flex-start',
                          padding: '4px 14px',
                          borderRadius: '100px',
                          background: accentColor,
                          marginBottom: '20px',
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: { fontSize: '13px', fontWeight: 600, color: '#FFFFFF' },
                            children: planName,
                          },
                        },
                      },
                    },
                    // Price
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '4px',
                          marginBottom: '28px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '56px',
                                fontWeight: 800,
                                color: textColor,
                                lineHeight: 1,
                              },
                              children: price,
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '18px',
                                color: `${textColor}55`,
                              },
                              children: period,
                            },
                          },
                        ],
                      },
                    },
                    // Features
                    ...features.map((f) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '12px',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: `${accentColor}25`,
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: { fontSize: '12px', color: accentColor, fontWeight: 700 },
                                  children: '+',
                                },
                              },
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '15px', color: `${textColor}88` },
                              children: truncate(f, 30),
                            },
                          },
                        ],
                      },
                    })),
                  ],
                },
              },
            },
          },
        ],
      },
    };
  },
};

export default template;
