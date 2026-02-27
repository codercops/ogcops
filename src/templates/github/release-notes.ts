import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-release-notes',
  name: 'Release Notes',
  category: 'github',
  description: 'Version badge with changelog-style layout for release announcements',
  tags: ['github', 'release', 'changelog', 'version', 'notes'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'my-project', placeholder: 'repo-name', group: 'Content' },
    { key: 'version', label: 'Version', type: 'text', defaultValue: 'v3.0.0', placeholder: 'v3.0.0', group: 'Content' },
    { key: 'releaseTitle', label: 'Release Title', type: 'text', defaultValue: 'Major Release', placeholder: 'Release codename', group: 'Content' },
    { key: 'change1', label: 'Change 1', type: 'text', defaultValue: 'New plugin system', placeholder: 'What changed', group: 'Content' },
    { key: 'change2', label: 'Change 2', type: 'text', defaultValue: 'Performance improvements', placeholder: 'What changed', group: 'Content' },
    { key: 'change3', label: 'Change 3', type: 'text', defaultValue: 'Breaking: Updated API', placeholder: 'What changed', group: 'Content' },
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    repoName: 'my-project',
    version: 'v3.0.0',
    releaseTitle: 'Major Release',
    change1: 'New plugin system',
    change2: 'Performance improvements',
    change3: 'Breaking: Updated API',
    date: 'Feb 26, 2026',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const repoName = String(params.repoName || 'my-project');
    const version = String(params.version || 'v3.0.0');
    const releaseTitle = String(params.releaseTitle || 'Major Release');
    const changes = [
      String(params.change1 || 'New plugin system'),
      String(params.change2 || 'Performance improvements'),
      String(params.change3 || 'Breaking: Updated API'),
    ];
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');
    const versionSize = autoFontSize(version, [
      { maxLen: 6, size: 72 },
      { maxLen: 10, size: 56 },
      { maxLen: 15, size: 44 },
    ]);

    const changeItem = (text: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: accentColor,
              },
              children: [],
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '17px',
                color: `${textColor}88`,
                fontFamily: 'JetBrains Mono, monospace',
              },
              children: truncate(text, 40),
            },
          },
        ],
      },
    });

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
          // Left: version + repo
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '480px',
                padding: '60px',
                borderRight: `1px solid ${textColor}12`,
              },
              children: [
                // Repo name
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      color: `${textColor}55`,
                      fontFamily: 'JetBrains Mono, monospace',
                      marginBottom: '16px',
                    },
                    children: repoName,
                  },
                },
                // Version
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${versionSize}px`,
                      fontWeight: 800,
                      color: accentColor,
                      lineHeight: 1.1,
                      margin: 0,
                      fontFamily: 'JetBrains Mono, monospace',
                    },
                    children: version,
                  },
                },
                // Release title
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 600,
                      color: textColor,
                      marginTop: '12px',
                    },
                    children: releaseTitle,
                  },
                },
                // Date
                ...(date
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            color: `${textColor}44`,
                            marginTop: '16px',
                          },
                          children: date,
                        },
                      },
                    ]
                  : []),
                // Release tag badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignSelf: 'flex-start',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      background: '#238636',
                      marginTop: '20px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '12px', fontWeight: 600, color: '#FFFFFF' },
                        children: 'Latest',
                      },
                    },
                  },
                },
              ],
            },
          },
          // Right: changelog
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
                // Changelog header
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '13px',
                      fontWeight: 600,
                      color: `${textColor}55`,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      marginBottom: '24px',
                    },
                    children: 'What\'s Changed',
                  },
                },
                // Changes list
                ...changes.map((c) => changeItem(c)),
                // Footer
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginTop: '24px',
                      paddingTop: '20px',
                      borderTop: `1px solid ${textColor}12`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          color: `${textColor}44`,
                          fontFamily: 'JetBrains Mono, monospace',
                        },
                        children: `Full Changelog: ${version}`,
                      },
                    },
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
