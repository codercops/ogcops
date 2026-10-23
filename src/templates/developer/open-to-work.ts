import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-open-to-work',
  name: 'Open to Work',
  category: 'developer',
  description: 'Developer availability card with status pill, skills, and initials avatar',
  tags: ['developer', 'open to work', 'hiring', 'freelance', 'skills'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Alex Morgan', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    {
      key: 'availability',
      label: 'Availability',
      type: 'select',
      defaultValue: 'Open to work',
      options: [
        { label: 'Open to work', value: 'Open to work' },
        { label: 'Available for freelance', value: 'Available for freelance' },
        { label: 'Open to collaborate', value: 'Open to collaborate' },
      ],
      required: true,
      group: 'Content',
    },
    { key: 'skills', label: 'Skills (comma-separated)', type: 'text' as const, defaultValue: '', placeholder: 'React, TypeScript, Node.js, PostgreSQL', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'Bengaluru, India', group: 'Content' as const },
    { key: 'website', label: 'Website', type: 'text' as const, defaultValue: '', placeholder: 'alexmorgan.dev', group: 'Content' as const },
    commonFields.bgColor,
    { ...commonFields.accentColor, defaultValue: '#22C55E' },
    commonFields.textColor,
  ],
  defaults: {
    name: 'Alex Morgan',
    role: 'Full-Stack Developer',
    availability: 'Open to work',
    skills: 'React, TypeScript, Node.js, PostgreSQL, AWS',
    location: 'Bengaluru, India',
    website: 'alexmorgan.dev',
    bgColor: '#0a0a0a',
    accentColor: '#22C55E',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const name = truncate(String(params.name || 'Developer'), 36);
    const nameSize = autoFontSize(name, [
      { maxLen: 18, size: 64 },
      { maxLen: 28, size: 52 },
      { maxLen: 36, size: 44 },
    ]);
    const role = params.role ? truncate(String(params.role), 60) : '';
    const availability = String(params.availability || 'Open to work');
    const skills = String(params.skills || '')
      .split(',')
      .map((s: string) => truncate(s.trim(), 20))
      .filter(Boolean)
      .slice(0, 6);
    const location = params.location ? truncate(String(params.location), 32) : '';
    const website = params.website ? truncate(String(params.website), 32) : '';
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#22C55E');
    const textColor = String(params.textColor || '#FFFFFF');

    // First letters of the first two words, e.g. "Alex Morgan" -> "AM"
    const initials = name
      .split(' ')
      .filter(Boolean)
      .map((w: string) => w.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');

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
          // Left: status, name, role, skills, footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '64px',
              },
              children: [
                // Status pill
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      alignSelf: 'flex-start',
                      gap: '10px',
                      padding: '10px 22px',
                      borderRadius: '100px',
                      border: `1px solid ${accentColor}66`,
                      background: `${accentColor}14`,
                      marginBottom: '32px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: accentColor,
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '15px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.04em',
                          },
                          children: availability,
                        },
                      },
                    ],
                  },
                },
                // Name
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: `${nameSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      fontFamily: 'Playfair Display, serif',
                      lineHeight: 1.1,
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
                            fontSize: '22px',
                            fontWeight: 500,
                            color: `${textColor}aa`,
                            marginTop: '12px',
                          },
                          children: role,
                        },
                      },
                    ]
                  : []),
                // Skill pills
                ...(skills.length > 0
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            marginTop: '32px',
                          },
                          children: skills.map((skill: string) => ({
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                padding: '8px 18px',
                                borderRadius: '100px',
                                border: `1px solid ${accentColor}44`,
                                background: `${accentColor}15`,
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: {
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: accentColor,
                                  },
                                  children: skill,
                                },
                              },
                            },
                          })),
                        },
                      },
                    ]
                  : []),
                // Footer: location and website
                ...(location || website
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            marginTop: '40px',
                          },
                          children: [
                            ...(location
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '16px',
                                        color: `${textColor}77`,
                                      },
                                      children: location,
                                    },
                                  },
                                ]
                              : []),
                            ...(location && website
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '16px',
                                        color: `${textColor}33`,
                                      },
                                      children: '·',
                                    },
                                  },
                                ]
                              : []),
                            ...(website
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: accentColor,
                                      },
                                      children: website,
                                    },
                                  },
                                ]
                              : []),
                          ],
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: initials circle with accent ring
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '420px',
                height: '630px',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    border: `6px solid ${accentColor}`,
                    background: `${accentColor}12`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '80px',
                        fontWeight: 700,
                        color: textColor,
                        fontFamily: 'Playfair Display, serif',
                      },
                      children: initials,
                    },
                  },
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
