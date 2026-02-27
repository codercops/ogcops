import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-developer-role',
  name: 'Developer Role',
  category: 'job',
  description: 'Code-themed design with programming language pills',
  tags: ['job', 'developer', 'code', 'programming'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'DevShop', placeholder: 'Company name', group: 'Content' },
    { key: 'lang1', label: 'Language 1', type: 'text', defaultValue: 'TypeScript', placeholder: 'Language', group: 'Content' },
    { key: 'lang2', label: 'Language 2', type: 'text', defaultValue: 'Rust', placeholder: 'Language', group: 'Content' },
    { key: 'lang3', label: 'Language 3', type: 'text', defaultValue: 'Go', placeholder: 'Language', group: 'Content' },
    { key: 'location', label: 'Location', type: 'text', defaultValue: 'Remote / NYC', placeholder: 'Location', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Senior Systems Engineer',
    company: 'DevShop',
    lang1: 'TypeScript',
    lang2: 'Rust',
    lang3: 'Go',
    location: 'Remote / NYC',
    bgColor: '#0d1117',
    accentColor: '#58A6FF',
    textColor: '#C9D1D9',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Senior Systems Engineer'), 50);
    const company = String(params.company || '');
    const langs = [
      String(params.lang1 || ''),
      String(params.lang2 || ''),
      String(params.lang3 || ''),
    ].filter(Boolean);
    const location = String(params.location || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58A6FF');
    const textColor = String(params.textColor || '#C9D1D9');
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
          fontFamily: 'JetBrains Mono, monospace',
          padding: '60px',
        },
        children: [
          // Top: code-style comment
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                color: '#484F58',
                marginBottom: '8px',
              },
              children: '// hiring.config.ts',
            },
          },
          // Company
          ...(company
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '8px',
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: '#FF7B72' },
                          children: 'const',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: accentColor },
                          children: 'company',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: textColor },
                          children: '=',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '18px', color: '#A5D6FF' },
                          children: `"${company}"`,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
          // Role title in regular font
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                fontFamily: 'Inter, sans-serif',
                color: '#FFFFFF',
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '32px',
              },
              children: title,
            },
          },
          // Language pills
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '12px',
                marginBottom: '24px',
              },
              children: langs.map((lang) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '8px 20px',
                    backgroundColor: `${accentColor}1A`,
                    borderRadius: '6px',
                    border: `1px solid ${accentColor}44`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '16px',
                        fontWeight: 600,
                        color: accentColor,
                      },
                      children: lang,
                    },
                  },
                },
              })),
            },
          },
          // Location at bottom
          ...(location
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginTop: 'auto',
                      gap: '8px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: '#484F58' },
                          children: '//',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: '#8B949E' },
                          children: location,
                        },
                      },
                    ],
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
