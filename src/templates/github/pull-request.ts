import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields, mixColors, isLightColor } from '../utils';

// Pill colors for each state. An unknown state falls back to merged.
const STATES = {
  merged: { label: 'Merged', color: '#8957e5' },
  open: { label: 'Open', color: '#238636' },
  closed: { label: 'Closed', color: '#da3633' },
} as const;

type StateKey = keyof typeof STATES;

function stateKey(value: unknown): StateKey {
  const key = String(value ?? '').trim().toLowerCase();
  return key === 'open' || key === 'closed' ? key : 'merged';
}

/** A count from a number or from the string the API sends. Anything else is 0. */
function parseCount(value: unknown): number {
  const n = Number(String(value ?? '').trim());
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

const formatCount = (n: number) => n.toLocaleString('en-US');

const template: TemplateDefinition = {
  id: 'github-pull-request',
  name: 'Pull Request',
  category: 'github',
  description: 'A pull request with repo, state pill, title, branches, a split bar of additions and deletions, and the author',
  tags: ['github', 'pull-request', 'merged', 'diff', 'open-source'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'codercops/ogcops', placeholder: 'owner/repo', group: 'Content' },
    commonFields.title,
    { key: 'prNumber', label: 'PR Number', type: 'text', defaultValue: '123', placeholder: '123', group: 'Content' },
    {
      key: 'state',
      label: 'State',
      type: 'select',
      defaultValue: 'merged',
      options: [
        { label: 'Merged', value: 'merged' },
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
      group: 'Content',
    },
    { key: 'headBranch', label: 'Head Branch', type: 'text', defaultValue: 'feature/dark-mode', placeholder: 'feature/dark-mode', group: 'Content' },
    { key: 'baseBranch', label: 'Base Branch', type: 'text', defaultValue: 'main', placeholder: 'main', group: 'Content' },
    { key: 'additions', label: 'Additions', type: 'number', defaultValue: 128, min: 0, max: 5000, group: 'Content' },
    { key: 'deletions', label: 'Deletions', type: 'number', defaultValue: 42, min: 0, max: 5000, group: 'Content' },
    { key: 'filesChanged', label: 'Files Changed', type: 'number', defaultValue: 6, min: 0, max: 200, group: 'Content' },
    commonFields.author,
    { ...commonFields.bgColor, defaultValue: '#0d1117' },
    { ...commonFields.accentColor, defaultValue: '#58a6ff' },
    { ...commonFields.textColor, defaultValue: '#e6edf3' },
  ],
  defaults: {
    repoName: 'codercops/ogcops',
    title: 'Add dark mode to the editor',
    prNumber: '123',
    state: 'merged',
    headBranch: 'feature/dark-mode',
    baseBranch: 'main',
    additions: 128,
    deletions: 42,
    filesChanged: 6,
    author: 'octocat',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const repoName = truncate(String(params.repoName ?? '').trim(), 60);
    const title = truncate(String(params.title || '').trim() || 'Add dark mode to the editor', 90);
    const prNumber = truncate(String(params.prNumber ?? '').trim().replace(/^#/, ''), 10);
    const state = STATES[stateKey(params.state)];
    const headBranch = truncate(String(params.headBranch ?? '').trim(), 40);
    const baseBranch = truncate(String(params.baseBranch ?? '').trim() || 'main', 30);
    const additions = parseCount(params.additions);
    const deletions = parseCount(params.deletions);
    const filesChanged = parseCount(params.filesChanged);
    const author = truncate(String(params.author ?? '').trim(), 39);
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');

    const lightBg = isLightColor(bgColor);
    const mutedText = mixColors(bgColor, textColor, 0.65);
    // An accent as light as the background (or as dark as it) is hard to read as text,
    // so pull it toward the text color. Otherwise it reads as it is.
    const repoColor = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;
    const trackColor = mixColors(bgColor, textColor, 0.15);
    // GitHub's brighter green and red are too pale to read as text on white.
    const addColor = lightBg ? '#1a7f37' : '#3fb950';
    const delColor = lightBg ? '#cf222e' : '#f85149';

    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 60 },
      { maxLen: 55, size: 52 },
      { maxLen: 75, size: 44 },
      { maxLen: 90, size: 40 },
    ]);

    const addText = `+${formatCount(additions)}`;
    const delText = `-${formatCount(deletions)}`;
    const statSize = autoFontSize(`${addText}${delText}`, [
      { maxLen: 10, size: 44 },
      { maxLen: 16, size: 38 },
      { maxLen: 24, size: 32 },
    ]);
    const filesText = filesChanged ? `${formatCount(filesChanged)} ${filesChanged === 1 ? 'file' : 'files'} changed` : '';
    const footerText = [filesText, author ? `by ${author}` : ''].filter(Boolean).join(' · ');
    const pillText = prNumber ? `${state.label} #${prNumber}` : state.label;

    // The bar is split by the ratio of additions to deletions. With neither, it is
    // an empty track. A side with nothing in it is left out.
    const barSegments: SatoriElement[] = [];
    if (additions > 0) {
      barSegments.push({ type: 'div', props: { style: { display: 'flex', flexGrow: additions, flexBasis: 0, background: addColor }, children: [] } });
    }
    if (deletions > 0) {
      barSegments.push({ type: 'div', props: { style: { display: 'flex', flexGrow: deletions, flexBasis: 0, background: delColor }, children: [] } });
    }

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
          padding: '60px 72px',
        },
        children: [
          // Repo name and state pill
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '24px', fontWeight: 500, color: repoColor, fontFamily: 'JetBrains Mono, monospace' },
                    children: repoName,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', padding: '10px 24px', borderRadius: '999px', background: state.color },
                    children: {
                      type: 'span',
                      props: { style: { fontSize: '24px', fontWeight: 600, color: '#ffffff' }, children: pillText },
                    },
                  },
                },
              ],
            },
          },
          // Spacer above the title
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Title
          {
            type: 'div',
            props: {
              style: { display: 'flex' },
              children: {
                type: 'span',
                props: { style: { fontSize: `${titleSize}px`, fontWeight: 700, color: textColor, lineHeight: 1.2 }, children: title },
              },
            },
          },
          // Branches
          ...(headBranch
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', marginTop: '24px' },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '26px', color: mutedText, fontFamily: 'JetBrains Mono, monospace' },
                        children: `${headBranch} into ${baseBranch}`,
                      },
                    },
                  },
                },
              ]
            : []),
          // Spacer below the title
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Additions and deletions
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'baseline', gap: '28px' },
              children: [
                {
                  type: 'span',
                  props: { style: { fontSize: `${statSize}px`, fontWeight: 700, color: addColor, fontFamily: 'JetBrains Mono, monospace' }, children: addText },
                },
                {
                  type: 'span',
                  props: { style: { fontSize: `${statSize}px`, fontWeight: 700, color: delColor, fontFamily: 'JetBrains Mono, monospace' }, children: delText },
                },
              ],
            },
          },
          // Split bar
          {
            type: 'div',
            props: {
              style: { display: 'flex', width: '100%', height: '14px', marginTop: '20px', borderRadius: '7px', overflow: 'hidden', background: trackColor },
              children: barSegments,
            },
          },
          // Files changed and author
          ...(footerText
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', marginTop: '22px' },
                    children: {
                      type: 'span',
                      props: { style: { fontSize: '24px', color: mutedText }, children: footerText },
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
