import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-tech-stack-role',
  name: 'Tech Stack Role',
  category: 'job',
  description: 'Role name with tech stack pill tags',
  tags: ['job', 'tech', 'stack', 'developer'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'TechCo', placeholder: 'Company name', group: 'Content' },
    { key: 'tech1', label: 'Tech 1', type: 'text', defaultValue: 'React', placeholder: 'Technology', group: 'Content' },
    { key: 'tech2', label: 'Tech 2', type: 'text', defaultValue: 'TypeScript', placeholder: 'Technology', group: 'Content' },
    { key: 'tech3', label: 'Tech 3', type: 'text', defaultValue: 'Node.js', placeholder: 'Technology', group: 'Content' },
    { key: 'tech4', label: 'Tech 4', type: 'text', defaultValue: 'PostgreSQL', placeholder: 'Technology', group: 'Content' },
    { key: 'tech5', label: 'Tech 5', type: 'text', defaultValue: 'AWS', placeholder: 'Technology', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Full Stack Developer',
    company: 'TechCo',
    tech1: 'React',
    tech2: 'TypeScript',
    tech3: 'Node.js',
    tech4: 'PostgreSQL',
    tech5: 'AWS',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Full Stack Developer'), 50);
    const company = String(params.company || '');
    const techs = [
      String(params.tech1 || ''),
      String(params.tech2 || ''),
      String(params.tech3 || ''),
      String(params.tech4 || ''),
      String(params.tech5 || ''),
    ].filter(Boolean);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 64 },
      { maxLen: 35, size: 52 },
      { maxLen: 50, size: 42 },
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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 80px',
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
                      color: accentColor,
                      letterSpacing: '0.08em',
                      marginBottom: '16px',
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
                marginBottom: '16px',
              },
              children: title,
            },
          },
          // "Tech Stack" label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '14px',
                fontWeight: 500,
                color: `${textColor}55`,
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                marginBottom: '16px',
                marginTop: '32px',
              },
              children: 'TECH STACK',
            },
          },
          // Tech pills
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              },
              children: techs.map((tech) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    padding: '10px 24px',
                    backgroundColor: `${accentColor}1A`,
                    borderRadius: '8px',
                    border: `1px solid ${accentColor}33`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '18px',
                        fontWeight: 600,
                        color: accentColor,
                        fontFamily: 'JetBrains Mono, monospace',
                      },
                      children: tech,
                    },
                  },
                },
              })),
            },
          },
        ],
      },
    };
  },
};

export default template;
