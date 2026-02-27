import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-guest-spotlight',
  name: 'Guest Spotlight',
  category: 'podcast',
  description: 'Large guest name focus with episode title and show branding',
  tags: ['podcast', 'guest', 'spotlight', 'interview'],
  fields: [
    commonFields.title,
    { key: 'guest', label: 'Guest Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', group: 'Content' as const },
    { key: 'guestRole', label: 'Guest Role', type: 'text' as const, defaultValue: '', placeholder: 'CTO at Acme', group: 'Content' as const },
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'From Startup to IPO: Lessons Learned',
    guest: 'Sarah Johnson',
    guestRole: 'CEO & Co-Founder at TechCorp',
    showName: 'Founders Talk',
    episodeNumber: '128',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Episode Title'), 80);
    const guest = String(params.guest || '');
    const guestRole = String(params.guestRole || '');
    const showName = String(params.showName || '');
    const episodeNumber = String(params.episodeNumber || '');
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 36 },
      { maxLen: 50, size: 30 },
      { maxLen: 70, size: 26 },
      { maxLen: 100, size: 22 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: Guest area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '460px',
                height: '630px',
                background: `linear-gradient(180deg, ${accentColor}22 0%, ${accentColor}08 100%)`,
                borderRight: `2px solid ${accentColor}33`,
                padding: '48px',
              },
              children: [
                // Guest avatar
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
                      background: `${accentColor}22`,
                      border: `4px solid ${accentColor}`,
                      marginBottom: '28px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '56px',
                          fontWeight: 700,
                          color: accentColor,
                        },
                        children: guest ? guest.charAt(0).toUpperCase() : '?',
                      },
                    },
                  },
                },
                // "with" label
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: 600,
                      color: `${textColor}55`,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      marginBottom: '8px',
                    },
                    children: 'FEATURING',
                  },
                },
                // Guest name
                ...(guest
                  ? [
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
                          children: guest,
                        },
                      },
                    ]
                  : []),
                // Guest role
                ...(guestRole
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '15px',
                            color: `${textColor}77`,
                            textAlign: 'center',
                            marginTop: '8px',
                          },
                          children: guestRole,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: episode details
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
                // Show name + episode
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '24px',
                    },
                    children: [
                      ...(showName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 700, color: accentColor },
                                children: showName,
                              },
                            },
                          ]
                        : []),
                      ...(episodeNumber
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  padding: '4px 12px',
                                  background: `${textColor}0a`,
                                  borderRadius: '100px',
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: { fontSize: '13px', fontWeight: 600, color: `${textColor}66` },
                                    children: `#${episodeNumber}`,
                                  },
                                },
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Episode title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.3,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                // Decorative line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '60px',
                      height: '4px',
                      background: accentColor,
                      borderRadius: '2px',
                      marginTop: '32px',
                    },
                    children: '',
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
