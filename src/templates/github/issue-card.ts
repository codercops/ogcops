import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

// Fixed, deterministic label-chip palette. Chip index i takes palette[i];
// there are at most 4 chips so the palette never wraps by accident.
const LABEL_COLORS = ['#d87456', '#2c899a', '#56d498', '#8250df'];

const template: TemplateDefinition = {
  id: 'github-issue-card',
  name: 'Issue Card',
  category: 'github',
  description: 'Mimics a GitHub issue header with title, status pill, labels, and a footer',
  tags: ['github', 'issue', 'card', 'open-source', 'hacktoberfest'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'coderscorp/ogcops', placeholder: 'owner/repo', group: 'Content' },
    { key: 'issueNumber', label: 'Issue Number', type: 'text', defaultValue: '42', placeholder: '42', group: 'Content' },
    { ...commonFields.title, defaultValue: 'Fix the login redirect loop' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'Open',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Closed', value: 'Closed' },
      ],
      group: 'Content',
    },
    { key: 'labels', label: 'Labels', type: 'text', defaultValue: 'good first issue, hacktoberfest', placeholder: 'good first issue, hacktoberfest', group: 'Content' },
    commonFields.author,
    { key: 'comments', label: 'Comments', type: 'text', defaultValue: '12', placeholder: '12', group: 'Content' },
    { ...commonFields.bgColor, defaultValue: '#0d1117' },
    commonFields.textColor,
    commonFields.accentColor,
  ],
  defaults: {
    repoName: 'coderscorp/ogcops',
    issueNumber: '42',
    title: 'Fix the login redirect loop',
    status: 'Open',
    labels: 'good first issue, hacktoberfest',
    author: '',
    comments: '12',
    bgColor: '#0d1117',
    textColor: '#FFFFFF',
    accentColor: '#E07A5F',
  },
  render: (params) => {
    const repoName = truncate(String(params.repoName || 'coderscorp/ogcops'), 40);
    const issueNumber = String(params.issueNumber || '42');
    const title = truncate(String(params.title || 'Fix the login redirect loop'), 60);
    const statusRaw = String(params.status || 'Open').toLowerCase();
    const isOpen = statusRaw !== 'closed';
    const statusLabel = isOpen ? 'Open' : 'Closed';
    const statusColor = isOpen ? '#238636' : '#8250df';
    const author = String(params.author || '').trim();
    const commentsRaw = String(params.comments ?? '').trim();
    const bgColor = String(params.bgColor || '#0d1117');
    const textColor = String(params.textColor || '#FFFFFF');

    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 52 },
      { maxLen: 34, size: 42 },
      { maxLen: 48, size: 34 },
      { maxLen: 64, size: 28 },
    ]);

    // Up to 4 label chips, colors chosen by index from the fixed palette (deterministic).
    const labels = String(params.labels || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 4);

    // Footer only when there is something to say; hide cleanly when both are empty.
    const footerText = [
      author ? `${author} opened this issue` : 'opened this issue',
      commentsRaw ? `${commentsRaw} comments` : '',
    ]
      .filter(Boolean)
      .join(' · ');

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
          // Repo name, small, at the top
          {
            type: 'div',
            props: {
              style: { display: 'flex', marginBottom: '24px' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: `${textColor}77`,
                    },
                    children: repoName,
                  },
                },
              ],
            },
          },
          // Big title followed by a muted "#42"
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'baseline', gap: '14px', marginBottom: '20px' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                    },
                    children: title,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 500,
                      fontFamily: 'JetBrains Mono, monospace',
                      color: `${textColor}55`,
                    },
                    children: `#${issueNumber}`,
                  },
                },
              ],
            },
          },
          // Status pill: a small ring icon (bordered circle) plus the label
          {
            type: 'div',
            props: {
              style: {
                display: 'inline-flex' as const,
                alignItems: 'center',
                gap: '8px',
                alignSelf: 'flex-start',
                padding: '5px 14px',
                borderRadius: '9999px',
                border: `1px solid ${statusColor}66`,
                background: `${statusColor}22`,
              },
              children: [
                // ring icon: a bordered circle div
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: `2px solid ${statusColor}`,
                      background: 'transparent',
                    },
                    children: [],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      fontWeight: 600,
                      color: statusColor,
                    },
                    children: statusLabel,
                  },
                },
              ],
            },
          },
          // Up to 4 label chips, wrapping, colors by index
          ...(labels.length
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '24px' },
                    children: labels.map((label, i) => {
                      const color = LABEL_COLORS[i % LABEL_COLORS.length];
                      return {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            border: `1px solid ${color}66`,
                            background: `${color}18`,
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  fontFamily: 'JetBrains Mono, monospace',
                                  color,
                                },
                                children: truncate(label, 24),
                              },
                            },
                          ],
                        },
                      };
                    }),
                  },
                },
              ]
            : []),
          // Spacer
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Footer
          ...(footerText
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: '24px',
                      borderTop: `1px solid ${textColor}15`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '15px',
                            color: `${textColor}66`,
                            fontFamily: 'Inter, sans-serif',
                          },
                          children: footerText,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
