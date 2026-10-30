import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields, isLightColor, mixColors } from '../utils';

/** "34" -> 34, "" / "abc" -> fallback, " 12 " -> 12. */
function toNumber(value: unknown, fallback: number): number {
  if (value === undefined || value === null) return fallback;
  const raw = String(value).trim();
  if (raw === '') return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

const template: TemplateDefinition = {
  id: 'github-milestone',
  name: 'Milestone Progress',
  category: 'github',
  description: 'Repository and milestone name over a progress bar, with closed and total issue counts, percentage and an optional due date',
  tags: ['github', 'milestone', 'progress', 'roadmap', 'open-source'],
  fields: [
    {
      key: 'repoName',
      label: 'Repository',
      type: 'text' as const,
      defaultValue: 'codercops/ogcops',
      placeholder: 'owner/repo',
      group: 'Content' as const,
    },
    commonFields.title,
    {
      key: 'closed',
      label: 'Closed Issues',
      type: 'number' as const,
      defaultValue: 34,
      min: 0,
      max: 1000,
      group: 'Content' as const,
    },
    {
      key: 'total',
      label: 'Total Issues',
      type: 'number' as const,
      defaultValue: 42,
      min: 0,
      max: 1000,
      group: 'Content' as const,
    },
    {
      key: 'dueDate',
      label: 'Due Date',
      type: 'text' as const,
      defaultValue: 'Nov 30',
      placeholder: 'Nov 30',
      group: 'Content' as const,
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    repoName: 'codercops/ogcops',
    title: 'v2.0',
    closed: 34,
    total: 42,
    dueDate: 'Nov 30',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');
    const repoName = truncate(String(params.repoName ?? '').trim(), 48);
    const dueDate = truncate(String(params.dueDate ?? '').trim(), 24);

    // The accent as text drops to 2.5:1 on a light background, so darken it there.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    // Numbers arrive as strings from the API, and users can type anything into the fields.
    const total = Math.max(1, Math.floor(toNumber(params.total, 42)));
    const closed = Math.min(total, Math.max(0, Math.round(toNumber(params.closed, 34))));
    const percent = Math.round((closed / total) * 100);

    const title = truncate(String(params.title ?? '').trim() || 'v2.0', 80);
    const titleSize = autoFontSize(title, [
      { maxLen: 6, size: 96 },
      { maxLen: 12, size: 80 },
      { maxLen: 24, size: 64 },
      { maxLen: 40, size: 52 },
      { maxLen: 80, size: 40 },
    ]);

    const captured = `${closed} of ${total} issues closed`;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px',
        },
        children: [
          ...(repoName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 500,
                      color: `${textColor}88`,
                      letterSpacing: '0.02em',
                      marginBottom: '14px',
                    },
                    children: repoName,
                  },
                },
              ]
            : []),
          {
            type: 'span',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                color: textColor,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textAlign: 'center' as const,
                marginBottom: '52px',
              },
              children: title,
            },
          },
          // Progress bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '880px',
                height: '24px',
                borderRadius: '100px',
                backgroundColor: `${textColor}1A`,
                overflow: 'hidden',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: `${percent}%`,
                    height: '100%',
                    borderRadius: '100px',
                    backgroundColor: accentColor,
                  },
                },
              },
            },
          },
          // Counts on the left, percentage on the right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                width: '880px',
                marginTop: '20px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '22px', fontWeight: 500, color: `${textColor}AA` },
                    children: captured,
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '34px', fontWeight: 800, color: accentInk },
                    children: `${percent}%`,
                  },
                },
              ],
            },
          },
          ...(dueDate
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 500,
                      color: `${textColor}66`,
                      marginTop: '44px',
                    },
                    children: `Due ${dueDate}`,
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
