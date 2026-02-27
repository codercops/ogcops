import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-startup-hiring',
  name: 'Startup Hiring',
  category: 'job',
  description: 'Energetic startup hiring post with equity mention',
  tags: ['job', 'startup', 'hiring', 'equity'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'LaunchPad', placeholder: 'Startup name', group: 'Content' },
    { key: 'stage', label: 'Stage', type: 'text', defaultValue: 'Series A', placeholder: 'Series A', group: 'Content' },
    { key: 'equity', label: 'Equity', type: 'text', defaultValue: '0.5% - 1.0% equity', placeholder: 'Equity range', group: 'Content' },
    { key: 'salary', label: 'Salary', type: 'text', defaultValue: '$130k - $170k', placeholder: 'Salary range', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Founding Engineer',
    company: 'LaunchPad',
    stage: 'Series A',
    equity: '0.5% - 1.0% equity',
    salary: '$130k - $170k',
    bgColor: '#0a0a0a',
    accentColor: '#F59E0B',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Founding Engineer'), 50);
    const company = String(params.company || '');
    const stage = String(params.stage || '');
    const equity = String(params.equity || '');
    const salary = String(params.salary || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#F59E0B');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 60 },
      { maxLen: 35, size: 50 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
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
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a0a 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 80px',
        },
        children: [
          // Hiring badge + company
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
                      padding: '8px 20px',
                      backgroundColor: accentColor,
                      borderRadius: '6px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#000000',
                          letterSpacing: '0.1em',
                        },
                        children: "WE'RE HIRING!",
                      },
                    },
                  },
                },
                ...(stage
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '8px 16px',
                            border: `1px solid ${accentColor}66`,
                            borderRadius: '6px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: accentColor,
                              },
                              children: stage,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Company name
          ...(company
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 600,
                      color: `${textColor}88`,
                      marginBottom: '8px',
                    },
                    children: company,
                  },
                },
              ]
            : []),
          // Role title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '40px',
              },
              children: title,
            },
          },
          // Compensation row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '32px',
                marginTop: 'auto',
              },
              children: [
                ...(salary
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '12px', color: `${textColor}55`, letterSpacing: '0.1em', textTransform: 'uppercase' as const },
                                children: 'SALARY',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '24px', fontWeight: 700, color: textColor },
                                children: salary,
                              },
                            },
                          ],
                        },
                      },
                    ]
                  : []),
                ...(equity
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', gap: '4px' },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '12px', color: `${textColor}55`, letterSpacing: '0.1em', textTransform: 'uppercase' as const },
                                children: 'EQUITY',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '24px', fontWeight: 700, color: accentColor },
                                children: equity,
                              },
                            },
                          ],
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
