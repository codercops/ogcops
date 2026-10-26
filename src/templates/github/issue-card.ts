import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields, mixColors, isLightColor } from '../utils';

// Label chips take their color from this list by position, so the same
// labels always come out the same colors.
const LABEL_COLORS = ['#7057ff', '#0e8a16', '#d93f0b', '#1d76db'];
const MAX_LABELS = 4;

const STATUS = {
  open: { label: 'Open', color: '#238636' },
  closed: { label: 'Closed', color: '#8957e5' },
};

const template: TemplateDefinition = {
  id: 'github-issue-card',
  name: 'Issue Card',
  category: 'github',
  description: 'A GitHub issue header with repo, title and number, an Open or Closed pill, label chips, and author and comment count',
  tags: ['github', 'issue', 'open-source', 'labels', 'hacktoberfest'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'codercops/ogcops', placeholder: 'owner/repo', group: 'Content' },
    { key: 'issueNumber', label: 'Issue Number', type: 'text', defaultValue: '42', placeholder: '42', group: 'Content' },
    commonFields.title,
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'open',
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
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
    repoName: 'codercops/ogcops',
    issueNumber: '42',
    title: 'Add dark mode to the editor',
    status: 'open',
    labels: 'good first issue, hacktoberfest',
    author: 'octocat',
    comments: '12',
    bgColor: '#0d1117',
    textColor: '#e6edf3',
    accentColor: '#58a6ff',
  },
  render: (params) => {
    const repoName = truncate(String(params.repoName ?? '').trim(), 60);
    const issueNumber = truncate(String(params.issueNumber ?? '').trim().replace(/^#/, ''), 10);
    const title = truncate(String(params.title || '').trim() || 'Add dark mode to the editor', 90);
    const status = String(params.status ?? '').trim().toLowerCase() === 'closed' ? STATUS.closed : STATUS.open;
    const labels = String(params.labels ?? '')
      .split(',')
      .map((label) => label.trim())
      .filter(Boolean)
      .slice(0, MAX_LABELS)
      .map((label) => truncate(label, 28));
    const author = truncate(String(params.author ?? '').trim(), 39);
    const comments = truncate(String(params.comments ?? '').trim(), 12);
    const bgColor = String(params.bgColor || '#0d1117');
    const textColor = String(params.textColor || '#e6edf3');
    const accentColor = String(params.accentColor || '#58a6ff');
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 60 },
      { maxLen: 55, size: 52 },
      { maxLen: 75, size: 44 },
      { maxLen: 90, size: 40 },
    ]);

    // "1 comment", "12 comments", and "1.2k comments" for counts that aren't plain numbers.
    const commentText = comments ? `${comments} ${Number(comments) === 1 ? 'comment' : 'comments'}` : '';
    const footer = [author ? `${author} opened this issue` : '', commentText].filter(Boolean).join(' · ');

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
          padding: '64px 72px',
        },
        children: [
          // Repo name
          ...(repoName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 500,
                      color: accentColor,
                      fontFamily: 'JetBrains Mono, monospace',
                      marginBottom: '20px',
                    },
                    children: repoName,
                  },
                },
              ]
            : []),
          // Title, then the issue number in a muted color
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                columnGap: '16px',
              },
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
                ...(issueNumber
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 400,
                            color: `${textColor}66`,
                            lineHeight: 1.2,
                          },
                          children: `#${issueNumber}`,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Status pill and label chips
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                marginTop: '32px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 22px',
                      borderRadius: '999px',
                      background: status.color,
                    },
                    children: [
                      // The ring icon: a bordered circle
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: '3px solid #ffffff',
                          },
                          children: [],
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '22px', fontWeight: 600, color: '#ffffff' },
                          children: status.label,
                        },
                      },
                    ],
                  },
                },
                ...labels.map((label, i) => {
                  const color = LABEL_COLORS[i % LABEL_COLORS.length];
                  return {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        padding: '8px 18px',
                        borderRadius: '999px',
                        background: `${color}33`,
                        border: `1px solid ${color}`,
                      },
                      children: {
                        type: 'span',
                        props: {
                          style: { fontSize: '20px', fontWeight: 500, color: mixColors(color, isLightColor(bgColor) ? '#000000' : '#ffffff', 0.45) },
                          children: label,
                        },
                      },
                    },
                  };
                }),
              ],
            },
          },
          // Spacer
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Footer
          ...(footer
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      paddingTop: '24px',
                      borderTop: `1px solid ${textColor}22`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '22px', color: `${textColor}99` },
                        children: footer,
                      },
                    },
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
