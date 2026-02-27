import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-stars-banner',
  name: 'Stars Banner',
  category: 'github',
  description: 'Large star count with growth indicator and repository info',
  tags: ['github', 'stars', 'banner', 'growth', 'popular'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'my-project', placeholder: 'repo-name', group: 'Content' },
    commonFields.description,
    { key: 'starCount', label: 'Star Count', type: 'text', defaultValue: '12,847', placeholder: '12,847', group: 'Content' },
    { key: 'growth', label: 'Growth', type: 'text', defaultValue: '+2.4k this month', placeholder: '+2.4k this month', group: 'Content' },
    { key: 'rank', label: 'Rank/Badge', type: 'text', defaultValue: 'Trending', placeholder: 'Trending, Top 100, etc.', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    repoName: 'my-project',
    description: 'The open-source framework that developers love.',
    starCount: '12,847',
    growth: '+2.4k this month',
    rank: 'Trending',
    bgColor: '#0d1117',
    accentColor: '#f0c000',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const repoName = String(params.repoName || 'my-project');
    const description = params.description ? truncate(String(params.description), 120) : '';
    const starCount = String(params.starCount || '12,847');
    const growth = String(params.growth || '+2.4k this month');
    const rank = String(params.rank || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#f0c000');
    const textColor = String(params.textColor || '#e6edf3');

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Background star glow
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '80px',
                right: '100px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accentColor}12 0%, transparent 60%)`,
              },
              children: [],
            },
          },
          // Left content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '650px',
                padding: '60px',
              },
              children: [
                // Rank badge
                ...(rank
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignSelf: 'flex-start',
                            padding: '6px 16px',
                            borderRadius: '100px',
                            background: `${accentColor}18`,
                            border: `1px solid ${accentColor}33`,
                            marginBottom: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '13px', fontWeight: 600, color: accentColor },
                              children: rank,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Repo name
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: '#58a6ff',
                      fontFamily: 'JetBrains Mono, monospace',
                      marginBottom: '12px',
                    },
                    children: repoName,
                  },
                },
                // Description
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: `${textColor}77`,
                            lineHeight: 1.5,
                            margin: 0,
                            maxWidth: '500px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: star count
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                padding: '40px',
              },
              children: [
                // Star icon
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '48px',
                      color: accentColor,
                      marginBottom: '12px',
                    },
                    children: '\u2605',
                  },
                },
                // Count
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '72px',
                      fontWeight: 900,
                      color: textColor,
                      lineHeight: 1,
                      fontFamily: 'JetBrains Mono, monospace',
                    },
                    children: starCount,
                  },
                },
                // Label
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: `${textColor}55`,
                      marginTop: '8px',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    },
                    children: 'GitHub Stars',
                  },
                },
                // Growth indicator
                ...(growth
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '16px',
                            padding: '6px 14px',
                            borderRadius: '100px',
                            background: '#238636',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '12px', color: '#FFFFFF' },
                                children: '\u2191',
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '13px', fontWeight: 600, color: '#FFFFFF' },
                                children: growth,
                              },
                            },
                          ],
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
