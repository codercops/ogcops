import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-listing-card',
  name: 'Listing Card',
  category: 'job',
  description: 'Company logo area, role title, location pill, and salary range',
  tags: ['job', 'listing', 'card', 'hiring'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'Acme Corp', placeholder: 'Company name', required: true, group: 'Content' },
    { key: 'location', label: 'Location', type: 'text', defaultValue: 'San Francisco, CA', placeholder: 'Location', group: 'Content' },
    { key: 'salary', label: 'Salary Range', type: 'text', defaultValue: '$120k - $180k', placeholder: '$120k - $180k', group: 'Content' },
    { key: 'type', label: 'Job Type', type: 'text', defaultValue: 'Full-time', placeholder: 'Full-time', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Senior Software Engineer',
    company: 'Acme Corp',
    location: 'San Francisco, CA',
    salary: '$120k - $180k',
    type: 'Full-time',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Senior Software Engineer'), 60);
    const company = String(params.company || 'Company');
    const location = String(params.location || '');
    const salary = String(params.salary || '');
    const type = String(params.type || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 60, size: 36 },
      { maxLen: 80, size: 30 },
    ]);

    const pill = (text: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          padding: '8px 18px',
          backgroundColor: `${textColor}0F`,
          borderRadius: '100px',
          border: `1px solid ${textColor}1A`,
        },
        children: {
          type: 'span',
          props: {
            style: {
              fontSize: '16px',
              fontWeight: 500,
              color: `${textColor}CC`,
            },
            children: text,
          },
        },
      },
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Company row with logo placeholder
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                marginBottom: '40px',
              },
              children: [
                // Logo placeholder
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '56px',
                      height: '56px',
                      borderRadius: '12px',
                      backgroundColor: accentColor,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '28px',
                          fontWeight: 800,
                          color: '#FFFFFF',
                        },
                        children: company.charAt(0).toUpperCase(),
                      },
                    },
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 600,
                            color: textColor,
                          },
                          children: company,
                        },
                      },
                      ...(type
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: `${textColor}66`,
                                  marginTop: '2px',
                                },
                                children: type,
                              },
                            },
                          ]
                        : []),
                    ],
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
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '32px',
              },
              children: title,
            },
          },
          // Info pills
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: 'auto',
              },
              children: [
                ...(location ? [pill(location)] : []),
                ...(salary ? [pill(salary)] : []),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
