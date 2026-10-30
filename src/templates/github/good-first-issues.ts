import type { SatoriElement, TemplateDefinition } from '../types';
import { isLightColor, mixColors, truncate, commonFields } from '../utils';

const MAX_ISSUES = 4;

export function parseIssues(input: unknown): { number: string; title: string }[] {
  if (typeof input !== 'string') return [];
  return input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = /^(\d+)\s+(.+)$/.exec(line);
      return match ? { number: match[1], title: match[2].trim() } : { number: '', title: line };
    });
}

const template: TemplateDefinition = {
  id: 'github-good-first-issues',
  name: 'Good First Issues',
  category: 'github',
  description: 'A shareable list of beginner-friendly GitHub issues',
  tags: ['github', 'issues', 'open-source', 'good first issue', 'community'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'codercops/ogcops', placeholder: 'owner/repo', group: 'Content' },
    commonFields.title,
    { key: 'issues', label: 'Issues', type: 'textarea', defaultValue: '128 Add a dark mode toggle\n117 Improve the onboarding flow\n103 Add keyboard shortcuts\n96 Update the documentation', placeholder: '128 Add a dark mode toggle', group: 'Content' },
    { key: 'footer', label: 'Footer', type: 'text', defaultValue: 'Comment on an issue to get assigned', placeholder: 'Footer message', group: 'Content' },
    { ...commonFields.bgColor, defaultValue: '#0d1117' },
    commonFields.accentColor,
    { ...commonFields.textColor, defaultValue: '#e6edf3' },
  ],
  defaults: {
    repoName: 'codercops/ogcops',
    title: 'Good first issues this week',
    issues: '128 Add a dark mode toggle\n117 Improve the onboarding flow\n103 Add keyboard shortcuts\n96 Update the documentation',
    footer: 'Comment on an issue to get assigned',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const repoName = truncate(String(params.repoName ?? '').trim(), 48);
    const title = truncate(String(params.title || 'Good first issues this week').trim(), 60);
    const allIssues = parseIssues(params.issues);
    const displayedIssues = allIssues.slice(0, MAX_ISSUES);
    const moreCount = allIssues.length - displayedIssues.length;
    const footer = String(params.footer ?? '').trim();
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');
    const adaptedAccent = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const issueRows: SatoriElement[] = displayedIssues.map((issue) => ({
      type: 'div',
      props: {
        style: { display: 'flex', alignItems: 'center', height: '52px', gap: '18px', width: '100%' },
        children: [
          ...(issue.number
            ? [{ type: 'span', props: { style: { width: '64px', flexShrink: 0, fontSize: '24px', fontWeight: 700, color: adaptedAccent, fontFamily: 'JetBrains Mono, monospace' }, children: `#${issue.number}` } }]
            : []),
          { type: 'span', props: { style: { flex: 1, minWidth: 0, fontSize: '25px', color: textColor, whiteSpace: 'nowrap', overflow: 'hidden' }, children: truncate(issue.title, 64) } },
        ],
      },
    }));

    return {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', padding: '58px 72px', boxSizing: 'border-box', background: bgColor, fontFamily: 'Inter, sans-serif', color: textColor },
        children: [
          { type: 'span', props: { style: { fontSize: '22px', fontWeight: 600, color: adaptedAccent, fontFamily: 'JetBrains Mono, monospace', marginBottom: '18px' }, children: repoName } },
          { type: 'h1', props: { style: { fontSize: '50px', lineHeight: 1.15, margin: 0, color: textColor }, children: title } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', marginTop: '28px' }, children: issueRows } },
          ...(moreCount > 0 ? [{ type: 'span', props: { style: { fontSize: '18px', color: `${textColor}88`, marginTop: '6px' }, children: `+${moreCount} more` } }] : []),
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          ...(footer ? [{ type: 'div', props: { style: { display: 'flex', borderTop: `1px solid ${textColor}22`, paddingTop: '18px' }, children: { type: 'span', props: { style: { fontSize: '20px', color: `${textColor}99` }, children: footer } } } }] : []),
        ],
      },
    };
  },
};

export default template;
