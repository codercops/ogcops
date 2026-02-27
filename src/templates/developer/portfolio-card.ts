import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-portfolio-card',
  name: 'Portfolio Card',
  category: 'developer',
  description: 'Developer portfolio card with name, avatar area, and skill pills',
  tags: ['developer', 'portfolio', 'card', 'skills'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    { key: 'tagline', label: 'Tagline', type: 'text' as const, defaultValue: '', placeholder: 'Building the future, one commit at a time', group: 'Content' as const },
    { key: 'skills', label: 'Skills (comma-separated)', type: 'text' as const, defaultValue: '', placeholder: 'React, TypeScript, Node.js, Go', group: 'Content' as const },
    { key: 'website', label: 'Website', type: 'text' as const, defaultValue: '', placeholder: 'janesmith.dev', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Full-Stack Developer',
    tagline: 'Building the future, one commit at a time',
    skills: 'React, TypeScript, Node.js, Go, PostgreSQL',
    website: 'janesmith.dev',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const tagline = params.tagline ? truncate(String(params.tagline), 80) : '';
    const skillsStr = String(params.skills || '');
    const skills = skillsStr.split(',').map((s: string) => s.trim()).filter(Boolean);
    const website = String(params.website || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const skillColors = ['#E07A5F', '#7B61FF', '#00D4FF', '#4CAF50', '#FF9800', '#F44336', '#9C27B0', '#00BCD4'];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: avatar + name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '400px',
                height: '630px',
                padding: '48px',
                borderRight: `1px solid ${textColor}12`,
              },
              children: [
                // Avatar circle
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '140px',
                      height: '140px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                      marginBottom: '28px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '56px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                        },
                        children: name.charAt(0).toUpperCase(),
                      },
                    },
                  },
                },
                // Name
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: 700,
                      color: textColor,
                      textAlign: 'center',
                      fontFamily: 'Playfair Display, serif',
                    },
                    children: name,
                  },
                },
                // Role
                ...(role
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: accentColor,
                            fontWeight: 600,
                            textAlign: 'center',
                            marginTop: '8px',
                          },
                          children: role,
                        },
                      },
                    ]
                  : []),
                // Website
                ...(website
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            color: `${textColor}55`,
                            marginTop: '12px',
                          },
                          children: website,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: tagline + skills
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
              },
              children: [
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '24px',
                            color: `${textColor}cc`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginBottom: '36px',
                            fontFamily: 'Playfair Display, serif',
                            fontStyle: 'italic',
                          },
                          children: tagline,
                        },
                      },
                    ]
                  : []),
                // Skills label
                ...(skills.length > 0
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '12px',
                            fontWeight: 700,
                            color: `${textColor}55`,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                          },
                          children: 'SKILLS',
                        },
                      },
                    ]
                  : []),
                // Skill pills
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '10px',
                    },
                    children: skills.slice(0, 8).map((skill: string, i: number) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '8px 18px',
                          background: `${skillColors[i % skillColors.length]}15`,
                          borderRadius: '100px',
                          border: `1px solid ${skillColors[i % skillColors.length]}44`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '15px',
                              fontWeight: 600,
                              color: skillColors[i % skillColors.length],
                            },
                            children: skill,
                          },
                        },
                      },
                    })),
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
