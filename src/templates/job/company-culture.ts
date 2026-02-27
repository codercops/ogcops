import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-company-culture',
  name: 'Company Culture',
  category: 'job',
  description: 'Company values pills with team area and role',
  tags: ['job', 'culture', 'values', 'team'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'Innovate Inc', placeholder: 'Company name', group: 'Content' },
    { key: 'value1', label: 'Value 1', type: 'text', defaultValue: 'Innovation', placeholder: 'Company value', group: 'Content' },
    { key: 'value2', label: 'Value 2', type: 'text', defaultValue: 'Transparency', placeholder: 'Company value', group: 'Content' },
    { key: 'value3', label: 'Value 3', type: 'text', defaultValue: 'Collaboration', placeholder: 'Company value', group: 'Content' },
    { key: 'value4', label: 'Value 4', type: 'text', defaultValue: 'Impact', placeholder: 'Company value', group: 'Content' },
    { key: 'teamSize', label: 'Team Size', type: 'text', defaultValue: '50-100 people', placeholder: 'Team size', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Product Designer',
    company: 'Innovate Inc',
    value1: 'Innovation',
    value2: 'Transparency',
    value3: 'Collaboration',
    value4: 'Impact',
    teamSize: '50-100 people',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Product Designer'), 50);
    const company = String(params.company || '');
    const values = [
      String(params.value1 || ''),
      String(params.value2 || ''),
      String(params.value3 || ''),
      String(params.value4 || ''),
    ].filter(Boolean);
    const teamSize = String(params.teamSize || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 52 },
      { maxLen: 35, size: 44 },
      { maxLen: 50, size: 36 },
      { maxLen: 70, size: 30 },
    ]);

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
          // Company + team size header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '32px',
              },
              children: [
                ...(company
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 700,
                            color: accentColor,
                          },
                          children: company,
                        },
                      },
                    ]
                  : [{ type: 'div', props: { children: '' } }]),
                ...(teamSize
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: `${textColor}66`,
                          },
                          children: teamSize,
                        },
                      },
                    ]
                  : []),
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
                marginBottom: '40px',
              },
              children: title,
            },
          },
          // Values label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '12px',
                fontWeight: 600,
                color: `${textColor}55`,
                letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                marginBottom: '16px',
              },
              children: 'OUR VALUES',
            },
          },
          // Value pills
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '40px',
              },
              children: values.map((val) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 24px',
                    border: `2px solid ${accentColor}55`,
                    borderRadius: '100px',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '18px',
                        fontWeight: 500,
                        color: `${textColor}CC`,
                      },
                      children: val,
                    },
                  },
                },
              })),
            },
          },
          // Team placeholder area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '-8px',
                marginTop: 'auto',
              },
              children: [
                ...[0, 1, 2, 3, 4].map((i) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: `${accentColor}${['44', '55', '66', '77', '33'][i]}`,
                      border: `2px solid ${bgColor}`,
                      marginLeft: i > 0 ? '-12px' : '0px',
                    },
                    children: [],
                  },
                })),
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: `${textColor}66`,
                      marginLeft: '16px',
                    },
                    children: 'Join our team',
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
