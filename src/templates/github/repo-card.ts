import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-repo-card',
  name: 'Repo Card',
  category: 'github',
  description: 'Mimics the GitHub repo card with name, description, stars, and language dot',
  tags: ['github', 'repo', 'card', 'repository', 'open-source'],
  fields: [
    { key: 'owner', label: 'Owner', type: 'text', defaultValue: 'username', placeholder: 'GitHub username or org', group: 'Content' },
    { key: 'repoName', label: 'Repository Name', type: 'text', defaultValue: 'my-awesome-project', placeholder: 'repo-name', group: 'Content' },
    commonFields.description,
    { key: 'stars', label: 'Stars', type: 'text', defaultValue: '2.4k', placeholder: '2.4k', group: 'Content' },
    { key: 'forks', label: 'Forks', type: 'text', defaultValue: '342', placeholder: '342', group: 'Content' },
    { key: 'language', label: 'Language', type: 'text', defaultValue: 'TypeScript', placeholder: 'TypeScript, Rust, etc.', group: 'Content' },
    { key: 'languageColor', label: 'Language Color', type: 'color', defaultValue: '#3178c6', group: 'Style' },
    commonFields.bgColor,
    commonFields.textColor,
  ],
  defaults: {
    owner: 'username',
    repoName: 'my-awesome-project',
    description: 'A blazing-fast toolkit for building modern web applications with type safety.',
    stars: '2.4k',
    forks: '342',
    language: 'TypeScript',
    languageColor: '#3178c6',
    bgColor: '#0d1117',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const owner = String(params.owner || 'username');
    const repoName = String(params.repoName || 'my-awesome-project');
    const description = params.description ? truncate(String(params.description), 140) : '';
    const stars = String(params.stars || '2.4k');
    const forks = String(params.forks || '342');
    const language = String(params.language || 'TypeScript');
    const languageColor = String(params.languageColor || '#3178c6');
    const bgColor = String(params.bgColor || '#0d1117');
    const textColor = String(params.textColor || '#e6edf3');
    const repoSize = autoFontSize(repoName, [
      { maxLen: 15, size: 48 },
      { maxLen: 25, size: 40 },
      { maxLen: 40, size: 32 },
    ]);

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
          padding: '56px',
        },
        children: [
          // GitHub icon + owner
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
                // GitHub-like octicon placeholder
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: `${textColor}15`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '16px', color: `${textColor}88` },
                        children: '\u2697',
                      },
                    },
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}77`,
                      fontFamily: 'JetBrains Mono, monospace',
                    },
                    children: owner,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '18px', color: `${textColor}44` },
                    children: '/',
                  },
                },
              ],
            },
          },
          // Repo name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${repoSize}px`,
                fontWeight: 700,
                color: '#58a6ff',
                lineHeight: 1.2,
                margin: 0,
                fontFamily: 'JetBrains Mono, monospace',
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
                      color: `${textColor}88`,
                      lineHeight: 1.6,
                      margin: 0,
                      marginTop: '20px',
                      maxWidth: '900px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Spacer
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Bottom stats row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '28px',
                paddingTop: '24px',
                borderTop: `1px solid ${textColor}15`,
              },
              children: [
                // Language
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '14px',
                            height: '14px',
                            borderRadius: '50%',
                            background: languageColor,
                          },
                          children: [],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}88` },
                          children: language,
                        },
                      },
                    ],
                  },
                },
                // Stars
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}66` },
                          children: '\u2605',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}88` },
                          children: stars,
                        },
                      },
                    ],
                  },
                },
                // Forks
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}66`, fontFamily: 'JetBrains Mono, monospace' },
                          children: '\u2442',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}88` },
                          children: forks,
                        },
                      },
                    ],
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
