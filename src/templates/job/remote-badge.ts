import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-remote-badge',
  name: 'Remote Badge',
  category: 'job',
  description: 'Large "REMOTE" badge with benefits list and role title',
  tags: ['job', 'remote', 'badge', 'benefits'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'DistributedCo', placeholder: 'Company name', group: 'Content' },
    { key: 'benefit1', label: 'Benefit 1', type: 'text', defaultValue: 'Flexible Hours', placeholder: 'Benefit', group: 'Content' },
    { key: 'benefit2', label: 'Benefit 2', type: 'text', defaultValue: 'Home Office Stipend', placeholder: 'Benefit', group: 'Content' },
    { key: 'benefit3', label: 'Benefit 3', type: 'text', defaultValue: 'Async-first Culture', placeholder: 'Benefit', group: 'Content' },
    { key: 'benefit4', label: 'Benefit 4', type: 'text', defaultValue: 'Unlimited PTO', placeholder: 'Benefit', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Backend Engineer',
    company: 'DistributedCo',
    benefit1: 'Flexible Hours',
    benefit2: 'Home Office Stipend',
    benefit3: 'Async-first Culture',
    benefit4: 'Unlimited PTO',
    bgColor: '#0a0a0a',
    accentColor: '#10B981',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Backend Engineer'), 50);
    const company = String(params.company || '');
    const benefits = [
      String(params.benefit1 || ''),
      String(params.benefit2 || ''),
      String(params.benefit3 || ''),
      String(params.benefit4 || ''),
    ].filter(Boolean);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#10B981');
    const textColor = String(params.textColor || '#FFFFFF');

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
          // Left side
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '600px',
                padding: '60px',
              },
              children: [
                // REMOTE badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '10px 28px',
                            backgroundColor: accentColor,
                            borderRadius: '8px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '24px',
                                fontWeight: 900,
                                color: '#FFFFFF',
                                letterSpacing: '0.15em',
                              },
                              children: 'REMOTE',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                // Role title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '44px',
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      marginBottom: '12px',
                    },
                    children: title,
                  },
                },
                // Company
                ...(company
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: `${textColor}88`,
                            marginBottom: '8px',
                          },
                          children: `at ${company}`,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: Benefits
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
                borderLeft: `1px solid ${textColor}1A`,
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '12px',
                      fontWeight: 600,
                      color: `${textColor}55`,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase' as const,
                      marginBottom: '24px',
                    },
                    children: 'BENEFITS',
                  },
                },
                ...benefits.map((benefit) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '16px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                          children: [],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: `${textColor}CC`,
                          },
                          children: benefit,
                        },
                      },
                    ],
                  },
                })),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
