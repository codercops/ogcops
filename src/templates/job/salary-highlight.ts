import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-salary-highlight',
  name: 'Salary Highlight',
  category: 'job',
  description: 'Large salary range numbers prominently displayed',
  tags: ['job', 'salary', 'compensation', 'money'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'PayWell Inc', placeholder: 'Company name', group: 'Content' },
    { key: 'salaryMin', label: 'Salary Min', type: 'text', defaultValue: '$150k', placeholder: '$150k', required: true, group: 'Content' },
    { key: 'salaryMax', label: 'Salary Max', type: 'text', defaultValue: '$220k', placeholder: '$220k', required: true, group: 'Content' },
    { key: 'extras', label: 'Additional Comp', type: 'text', defaultValue: '+ equity + bonus', placeholder: '+ equity', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Staff Engineer',
    company: 'PayWell Inc',
    salaryMin: '$150k',
    salaryMax: '$220k',
    extras: '+ equity + bonus',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Staff Engineer'), 50);
    const company = String(params.company || '');
    const salaryMin = String(params.salaryMin || '$150k');
    const salaryMax = String(params.salaryMax || '$220k');
    const extras = String(params.extras || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Company
          ...(company
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 600,
                      color: `${textColor}66`,
                      marginBottom: '12px',
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
                fontSize: '36px',
                fontWeight: 600,
                color: textColor,
                margin: 0,
                marginBottom: '40px',
              },
              children: title,
            },
          },
          // Salary range
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'baseline',
                gap: '20px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '88px',
                      fontWeight: 900,
                      color: accentColor,
                      lineHeight: 1,
                      fontFamily: 'JetBrains Mono, monospace',
                    },
                    children: salaryMin,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 300,
                      color: `${textColor}44`,
                    },
                    children: '\u2013',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '88px',
                      fontWeight: 900,
                      color: accentColor,
                      lineHeight: 1,
                      fontFamily: 'JetBrains Mono, monospace',
                    },
                    children: salaryMax,
                  },
                },
              ],
            },
          },
          // Extras
          ...(extras
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}66`,
                      marginTop: '20px',
                    },
                    children: extras,
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
