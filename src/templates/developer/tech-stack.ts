import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-tech-stack',
  name: 'Tech Stack',
  category: 'developer',
  description: 'Name with tech icon grid showing colored squares with labels',
  tags: ['developer', 'tech-stack', 'icons', 'grid'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    { key: 'tech1', label: 'Tech 1', type: 'text' as const, defaultValue: 'React', placeholder: 'React', group: 'Content' as const },
    { key: 'tech2', label: 'Tech 2', type: 'text' as const, defaultValue: 'TypeScript', placeholder: 'TypeScript', group: 'Content' as const },
    { key: 'tech3', label: 'Tech 3', type: 'text' as const, defaultValue: 'Node.js', placeholder: 'Node.js', group: 'Content' as const },
    { key: 'tech4', label: 'Tech 4', type: 'text' as const, defaultValue: 'PostgreSQL', placeholder: 'PostgreSQL', group: 'Content' as const },
    { key: 'tech5', label: 'Tech 5', type: 'text' as const, defaultValue: 'Docker', placeholder: 'Docker', group: 'Content' as const },
    { key: 'tech6', label: 'Tech 6', type: 'text' as const, defaultValue: 'AWS', placeholder: 'AWS', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Full-Stack Developer',
    tech1: 'React',
    tech2: 'TypeScript',
    tech3: 'Node.js',
    tech4: 'PostgreSQL',
    tech5: 'Docker',
    tech6: 'AWS',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const techs = [
      String(params.tech1 || ''),
      String(params.tech2 || ''),
      String(params.tech3 || ''),
      String(params.tech4 || ''),
      String(params.tech5 || ''),
      String(params.tech6 || ''),
    ].filter(Boolean);
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const techColors = [
      { bg: '#61DAFB', text: '#000000' }, // React blue
      { bg: '#3178C6', text: '#FFFFFF' }, // TS blue
      { bg: '#339933', text: '#FFFFFF' }, // Node green
      { bg: '#4169E1', text: '#FFFFFF' }, // Postgres blue
      { bg: '#2496ED', text: '#FFFFFF' }, // Docker blue
      { bg: '#FF9900', text: '#000000' }, // AWS orange
      { bg: '#7B61FF', text: '#FFFFFF' },
      { bg: '#E07A5F', text: '#FFFFFF' },
    ];

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
        },
        children: [
          // Name + role
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                marginBottom: '40px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                    },
                    children: name,
                  },
                },
                ...(role
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: accentColor,
                            fontWeight: 600,
                            marginTop: '8px',
                          },
                          children: role,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // "My Stack" label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '12px',
                fontWeight: 700,
                color: `${textColor}55`,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              },
              children: 'TECH STACK',
            },
          },
          // Tech grid (3x2)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                flex: 1,
              },
              children: techs.slice(0, 6).map((tech, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '320px',
                    padding: '18px 22px',
                    background: `${textColor}06`,
                    borderRadius: '14px',
                    border: `1px solid ${textColor}10`,
                  },
                  children: [
                    // Colored square icon
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '44px',
                          height: '44px',
                          borderRadius: '10px',
                          background: techColors[i % techColors.length].bg,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '18px',
                              fontWeight: 700,
                              color: techColors[i % techColors.length].text,
                            },
                            children: tech.charAt(0).toUpperCase(),
                          },
                        },
                      },
                    },
                    // Label
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 600,
                          color: `${textColor}cc`,
                        },
                        children: truncate(tech, 20),
                      },
                    },
                  ],
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
