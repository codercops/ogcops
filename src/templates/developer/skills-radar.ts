import type { TemplateDefinition } from '../types';
import { commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-skills-radar',
  name: 'Skills Radar',
  category: 'developer',
  description: 'Faux radar/pentagon chart showing skill levels with labels',
  tags: ['developer', 'skills', 'radar', 'chart', 'pentagon'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Role', type: 'text' as const, defaultValue: '', placeholder: 'Full-Stack Developer', group: 'Content' as const },
    { key: 'skill1', label: 'Skill 1', type: 'text' as const, defaultValue: 'Frontend', placeholder: 'Frontend', group: 'Content' as const },
    { key: 'skill2', label: 'Skill 2', type: 'text' as const, defaultValue: 'Backend', placeholder: 'Backend', group: 'Content' as const },
    { key: 'skill3', label: 'Skill 3', type: 'text' as const, defaultValue: 'DevOps', placeholder: 'DevOps', group: 'Content' as const },
    { key: 'skill4', label: 'Skill 4', type: 'text' as const, defaultValue: 'Design', placeholder: 'Design', group: 'Content' as const },
    { key: 'skill5', label: 'Skill 5', type: 'text' as const, defaultValue: 'Testing', placeholder: 'Testing', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Full-Stack Developer',
    skill1: 'Frontend',
    skill2: 'Backend',
    skill3: 'DevOps',
    skill4: 'Design',
    skill5: 'Testing',
    bgColor: '#0a0a1a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const skills = [
      String(params.skill1 || 'Skill 1'),
      String(params.skill2 || 'Skill 2'),
      String(params.skill3 || 'Skill 3'),
      String(params.skill4 || 'Skill 4'),
      String(params.skill5 || 'Skill 5'),
    ];
    const bgColor = String(params.bgColor || '#0a0a1a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    // Pentagon chart: position labels around a center point
    // Center: (230, 260), radius 150
    const cx = 230;
    const cy = 260;
    const r = 140;
    const angleOffset = -Math.PI / 2; // Start from top
    const positions = skills.map((_, i) => {
      const angle = angleOffset + (2 * Math.PI * i) / 5;
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        labelX: cx + (r + 40) * Math.cos(angle),
        labelY: cy + (r + 40) * Math.sin(angle),
      };
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #16213e 100%)`,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: Radar chart area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '520px',
                height: '630px',
                position: 'relative',
              },
              children: [
                // Concentric pentagon rings (approximated with circles)
                ...[1, 0.75, 0.5, 0.25].map((scale) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${cx - r * scale}px`,
                      top: `${cy - r * scale}px`,
                      width: `${r * 2 * scale}px`,
                      height: `${r * 2 * scale}px`,
                      borderRadius: '50%',
                      border: `1px solid ${textColor}${scale === 1 ? '15' : '0a'}`,
                    },
                    children: '',
                  },
                })),
                // Center dot
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${cx - 4}px`,
                      top: `${cy - 4}px`,
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: `${textColor}33`,
                    },
                    children: '',
                  },
                },
                // Skill points (dots on the chart)
                ...positions.map((pos, i) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${pos.x - 8}px`,
                      top: `${pos.y - 8}px`,
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: accentColor,
                      border: `3px solid ${bgColor}`,
                    },
                    children: '',
                  },
                })),
                // Lines from center to points
                ...positions.map((pos) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${Math.min(cx, pos.x)}px`,
                      top: `${cy - 1}px`,
                      width: `${Math.abs(pos.x - cx) || 1}px`,
                      height: '1px',
                      background: `${accentColor}22`,
                    },
                    children: '',
                  },
                })),
                // Skill labels
                ...skills.map((skill, i) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: `${positions[i].labelX - 50}px`,
                      top: `${positions[i].labelY - 10}px`,
                      width: '100px',
                      justifyContent: 'center',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '13px',
                          fontWeight: 600,
                          color: `${textColor}aa`,
                          textAlign: 'center',
                        },
                        children: skill,
                      },
                    },
                  },
                })),
              ],
            },
          },
          // Right: Name + role
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
                    children: 'SKILLS OVERVIEW',
                  },
                },
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      fontFamily: 'Playfair Display, serif',
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
                            marginTop: '12px',
                          },
                          children: role,
                        },
                      },
                    ]
                  : []),
                // Skill bars (horizontal)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginTop: '36px',
                    },
                    children: skills.map((skill, i) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '14px', color: `${textColor}88`, width: '80px' },
                              children: skill,
                            },
                          },
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                flex: 1,
                                height: '6px',
                                background: `${textColor}10`,
                                borderRadius: '3px',
                                overflow: 'hidden',
                              },
                              children: {
                                type: 'div',
                                props: {
                                  style: {
                                    display: 'flex',
                                    width: `${70 + (i * 7) % 30}%`,
                                    height: '6px',
                                    background: accentColor,
                                    borderRadius: '3px',
                                  },
                                  children: '',
                                },
                              },
                            },
                          },
                        ],
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
