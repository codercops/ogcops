import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-episode-card',
  name: 'Episode Card',
  category: 'podcast',
  description: 'Podcast episode card with show name, episode number, title, and guest',
  tags: ['podcast', 'episode', 'card', 'guest'],
  fields: [
    commonFields.title,
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    { key: 'guest', label: 'Guest Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', group: 'Content' as const },
    { key: 'guestRole', label: 'Guest Role', type: 'text' as const, defaultValue: '', placeholder: 'CTO at Acme', group: 'Content' as const },
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Building Developer Tools That Scale',
    showName: 'The Dev Show',
    episodeNumber: '42',
    guest: 'Jane Smith',
    guestRole: 'CTO at Acme',
    date: 'Mar 12, 2026',
    bgColor: '#0d1117',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Episode Title'), 80);
    const showName = String(params.showName || '');
    const episodeNumber = String(params.episodeNumber || '');
    const guest = String(params.guest || '');
    const guestRole = String(params.guestRole || '');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 48 },
      { maxLen: 50, size: 40 },
      { maxLen: 70, size: 34 },
      { maxLen: 100, size: 28 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(160deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Top: show name + episode badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '36px',
              },
              children: [
                // Podcast icon (microphone circle)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: accentColor,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '22px', color: '#FFFFFF' },
                        children: '\u266A',
                      },
                    },
                  },
                },
                ...(showName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: `${textColor}cc`,
                          },
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
                            padding: '4px 14px',
                            background: `${accentColor}22`,
                            borderRadius: '100px',
                            border: `1px solid ${accentColor}55`,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: accentColor,
                              },
                              children: `EP ${episodeNumber}`,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Title
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1 },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.25,
                    margin: 0,
                    maxWidth: '900px',
                  },
                  children: title,
                },
              },
            },
          },
          // Bottom: guest + date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
                paddingTop: '24px',
                borderTop: `1px solid ${textColor}15`,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    },
                    children: [
                      ...(guest
                        ? [
                            // Guest avatar
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '44px',
                                  height: '44px',
                                  borderRadius: '50%',
                                  background: `${accentColor}22`,
                                  border: `2px solid ${accentColor}66`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: { fontSize: '18px', fontWeight: 700, color: accentColor },
                                    children: guest.charAt(0).toUpperCase(),
                                  },
                                },
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', flexDirection: 'column' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', fontWeight: 600, color: `${textColor}cc` },
                                      children: guest,
                                    },
                                  },
                                  ...(guestRole
                                    ? [
                                        {
                                          type: 'span',
                                          props: {
                                            style: { fontSize: '13px', color: `${textColor}66` },
                                            children: guestRole,
                                          },
                                        },
                                      ]
                                    : []),
                                ],
                              },
                            },
                          ]
                        : [{ type: 'div', props: { children: '' } }]),
                    ],
                  },
                },
                date
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '15px', color: `${textColor}55` },
                        children: date,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
