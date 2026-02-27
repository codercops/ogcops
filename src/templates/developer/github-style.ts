import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-github-style',
  name: 'GitHub Style',
  category: 'developer',
  description: 'GitHub profile header layout with username, bio, stats, and contribution grid',
  tags: ['developer', 'github', 'profile', 'social'],
  fields: [
    { key: 'name', label: 'Display Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'username', label: 'Username', type: 'text' as const, defaultValue: '', placeholder: 'janesmith', group: 'Content' as const },
    { key: 'bio', label: 'Bio', type: 'text' as const, defaultValue: '', placeholder: 'Full-stack developer and open source enthusiast', group: 'Content' as const },
    { key: 'repos', label: 'Repos', type: 'text' as const, defaultValue: '42', placeholder: '42', group: 'Content' as const },
    { key: 'followers', label: 'Followers', type: 'text' as const, defaultValue: '1.2k', placeholder: '1.2k', group: 'Content' as const },
    { key: 'stars', label: 'Stars', type: 'text' as const, defaultValue: '3.4k', placeholder: '3.4k', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    username: 'janesmith',
    bio: 'Full-stack developer and open source enthusiast. Building tools that developers love.',
    repos: '42',
    followers: '1.2k',
    stars: '3.4k',
    bgColor: '#0d1117',
    accentColor: '#238636',
    textColor: '#E6EDF3',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const username = String(params.username || '');
    const bio = params.bio ? truncate(String(params.bio), 100) : '';
    const repos = String(params.repos || '');
    const followers = String(params.followers || '');
    const stars = String(params.stars || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#238636');
    const textColor = String(params.textColor || '#E6EDF3');

    // Mini contribution grid pattern (7 rows x 20 cols)
    const gridRows = 7;
    const gridCols = 20;
    const intensities = [0, 1, 2, 3, 4]; // 0 = empty
    const cellPattern: number[] = [];
    for (let i = 0; i < gridRows * gridCols; i++) {
      cellPattern.push(intensities[(i * 7 + i * i * 3) % intensities.length]);
    }

    const intensityColors: Record<number, string> = {
      0: `${textColor}08`,
      1: `${accentColor}44`,
      2: `${accentColor}77`,
      3: `${accentColor}aa`,
      4: accentColor,
    };

    const stats = [
      { label: 'Repos', value: repos },
      { label: 'Followers', value: followers },
      { label: 'Stars', value: stars },
    ].filter((s) => s.value);

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
          padding: '48px 60px',
        },
        children: [
          // Top: avatar + name + username
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                marginBottom: '24px',
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
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: '#21262d',
                      border: `2px solid ${textColor}15`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '32px', fontWeight: 700, color: `${textColor}cc` },
                        children: name.charAt(0).toUpperCase(),
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
                          style: { fontSize: '28px', fontWeight: 700, color: textColor },
                          children: name,
                        },
                      },
                      ...(username
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '18px', color: `${textColor}66` },
                                children: `@${username}`,
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
          // Bio
          ...(bio
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}aa`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '24px',
                      maxWidth: '700px',
                    },
                    children: bio,
                  },
                },
              ]
            : []),
          // Stats row
          ...(stats.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '32px',
                      marginBottom: '32px',
                      paddingBottom: '24px',
                      borderBottom: `1px solid ${textColor}12`,
                    },
                    children: stats.map((stat) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: '6px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '22px', fontWeight: 700, color: textColor },
                              children: stat.value,
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: { fontSize: '15px', color: `${textColor}66` },
                              children: stat.label,
                            },
                          },
                        ],
                      },
                    })),
                  },
                },
              ]
            : []),
          // Contribution grid
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                marginTop: 'auto',
              },
              children: Array.from({ length: gridRows }).map((_, row) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    gap: '3px',
                  },
                  children: Array.from({ length: gridCols }).map((_, col) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        width: '16px',
                        height: '16px',
                        borderRadius: '3px',
                        background: intensityColors[cellPattern[row * gridCols + col]],
                      },
                      children: '',
                    },
                  })),
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
