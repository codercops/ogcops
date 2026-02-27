import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-link-tree',
  name: 'Link Tree',
  category: 'developer',
  description: 'Vertical link buttons stack with avatar area, inspired by link-in-bio pages',
  tags: ['developer', 'linktree', 'links', 'social', 'bio'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'tagline', label: 'Tagline', type: 'text' as const, defaultValue: '', placeholder: 'Developer & Creator', group: 'Content' as const },
    { key: 'link1', label: 'Link 1', type: 'text' as const, defaultValue: 'Portfolio', placeholder: 'Portfolio', group: 'Content' as const },
    { key: 'link2', label: 'Link 2', type: 'text' as const, defaultValue: 'GitHub', placeholder: 'GitHub', group: 'Content' as const },
    { key: 'link3', label: 'Link 3', type: 'text' as const, defaultValue: 'Blog', placeholder: 'Blog', group: 'Content' as const },
    { key: 'link4', label: 'Link 4', type: 'text' as const, defaultValue: 'Twitter / X', placeholder: 'Twitter / X', group: 'Content' as const },
    { key: 'link5', label: 'Link 5', type: 'text' as const, defaultValue: '', placeholder: 'LinkedIn', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    tagline: 'Developer & Creator',
    link1: 'Portfolio',
    link2: 'GitHub',
    link3: 'Blog',
    link4: 'Twitter / X',
    link5: 'LinkedIn',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const tagline = params.tagline ? truncate(String(params.tagline), 60) : '';
    const links = [
      String(params.link1 || ''),
      String(params.link2 || ''),
      String(params.link3 || ''),
      String(params.link4 || ''),
      String(params.link5 || ''),
    ].filter(Boolean);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const linkIcons: Record<string, string> = {
      portfolio: '\u2192',
      github: '\u2731',
      blog: '\u270E',
      'twitter / x': '\u2709',
      linkedin: '\u2B95',
      youtube: '\u25B6',
    };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(180deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: decorative gradient panel
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '400px',
                height: '630px',
                background: `linear-gradient(180deg, ${accentColor}22 0%, ${accentColor}08 100%)`,
                position: 'relative',
                overflow: 'hidden',
              },
              children: [
                // Decorative circles
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      left: '-60px',
                      top: '-60px',
                      width: '240px',
                      height: '240px',
                      borderRadius: '50%',
                      background: `${accentColor}11`,
                    },
                    children: '',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      right: '-40px',
                      bottom: '-40px',
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: `${accentColor}0a`,
                    },
                    children: '',
                  },
                },
                // Centered avatar + name
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
                    },
                    children: [
                      // Avatar
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}88)`,
                            border: `4px solid ${textColor}22`,
                            marginBottom: '24px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '48px',
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
                            fontSize: '28px',
                            fontWeight: 700,
                            color: textColor,
                            textAlign: 'center',
                          },
                          children: name,
                        },
                      },
                      // Tagline
                      ...(tagline
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: `${textColor}77`,
                                  textAlign: 'center',
                                  marginTop: '8px',
                                },
                                children: tagline,
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
          // Right: Links stack
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
                gap: '14px',
              },
              children: [
                // Label
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '12px',
                      fontWeight: 700,
                      color: `${textColor}55`,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    },
                    children: 'LINKS',
                  },
                },
                // Link buttons
                ...links.map((link, i) => ({
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '16px 24px',
                      background: i === 0 ? accentColor : `${textColor}08`,
                      borderRadius: '14px',
                      border: i === 0 ? 'none' : `1px solid ${textColor}12`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: i === 0 ? '#FFFFFF' : `${textColor}cc`,
                          },
                          children: link,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: i === 0 ? '#FFFFFF' : `${textColor}44`,
                          },
                          children: linkIcons[link.toLowerCase()] || '\u2192',
                        },
                      },
                    ],
                  },
                })),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
