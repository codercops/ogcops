import type { TemplateDefinition, SatoriElement } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'github-discussion',
  name: 'Discussion',
  category: 'github',
  description: 'Share a GitHub discussion with its repository, category, excerpt, upvotes, comments, and answered status',
  tags: ['github', 'discussion', 'community', 'rfc', 'open-source'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'acme/widgets', group: 'Content' },
    { ...commonFields.category, defaultValue: 'Ideas' },
    commonFields.title,
    commonFields.description,
    { key: 'upvotes', label: 'Upvotes', type: 'text', defaultValue: '128 upvotes', group: 'Content' },
    { key: 'comments', label: 'Comments', type: 'text', defaultValue: '42 comments', group: 'Content' },
    {
      key: 'status', label: 'Status', type: 'select', defaultValue: 'Answered',
      options: [{ label: 'Open', value: 'Open' }, { label: 'Answered', value: 'Answered' }], group: 'Content',
    },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0d1117' },
    { ...commonFields.accentColor, defaultValue: '#58a6ff' },
    { ...commonFields.textColor, defaultValue: '#e6edf3' },
  ],
  defaults: {
    repoName: 'acme/widgets', category: 'Ideas',
    title: 'Should we drop Node 18 support in v3?',
    description: 'Node 18 is end of life, and dropping it lets us remove two polyfills',
    upvotes: '128 upvotes', comments: '42 comments', status: 'Answered',
    siteName: 'github.com', bgColor: '#0d1117', accentColor: '#58a6ff', textColor: '#e6edf3',
  },
  render: (params) => {
    const text = (key: string) => String(params[key] ?? '').trim();
    const title = text('title') || String(template.defaults.title);
    const description = text('description');
    const repoName = truncate(text('repoName'), 40);
    const category = truncate(text('category'), 20);
    const upvotes = truncate(text('upvotes'), 14);
    const comments = truncate(text('comments'), 14);
    const siteName = truncate(text('siteName'), 16);
    const answered = text('status') === 'Answered';
    const bgColor = String(params.bgColor || template.defaults.bgColor);
    const textColor = String(params.textColor || template.defaults.textColor);
    const accentColor = String(params.accentColor || template.defaults.accentColor);
    const light = isLightColor(bgColor);
    const accentText = mixColors(accentColor, light ? '#000000' : '#ffffff', 0.55);
    const mutedText = mixColors(textColor, bgColor, 0.2);
    const titleSize = autoFontSize(title, [{ maxLen: 50, size: 60 }, { maxLen: 90, size: 52 }, { maxLen: 120, size: 44 }]);
    const descriptionSize = autoFontSize(description, [{ maxLen: 65, size: 26 }, { maxLen: 85, size: 22 }, { maxLen: 100, size: 18 }]);
    const label = (value: string, style: Record<string, string | number>): SatoriElement => ({
      type: 'span', props: { style, children: value },
    });
    const pill = (value: string, color: string): SatoriElement => ({
      type: 'div', props: {
        style: {
          display: 'flex', alignItems: 'center', padding: '10px 18px', borderRadius: '999px',
          background: mixColors(bgColor, color, 0.14),
          color: mixColors(color, light ? '#000000' : '#ffffff', 0.55),
          fontSize: '20px', fontWeight: 600, flexShrink: 0,
        },
        children: value,
      },
    });
    const footer: SatoriElement[] = [
      ...(upvotes ? [label(upvotes, { fontSize: '21px', color: mutedText })] : []),
      ...(comments ? [label(comments, { fontSize: '21px', color: mutedText })] : []),
      ...(answered ? [pill('Answered', '#238636')] : []),
    ];

    return {
      type: 'div', props: {
        style: {
          display: 'flex', flexDirection: 'column', width: '1200px', height: '630px',
          padding: '56px 64px', borderTop: `8px solid ${accentColor}`, background: bgColor,
          color: textColor, fontFamily: 'Inter, sans-serif', overflow: 'hidden',
        },
        children: [
          ...(repoName || category ? [{
            type: 'div', props: {
              style: { display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' },
              children: [
                ...(repoName ? [label(repoName, { fontSize: '22px', fontFamily: 'JetBrains Mono, monospace', color: accentText })] : []),
                ...(category ? [pill(category, accentColor)] : []),
              ],
            },
          }] : []),
          label(truncate(title, 120), { fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.18, wordBreak: /\S{30}/.test(title) ? 'break-all' : 'normal' }),
          ...(description ? [label(truncate(description, 100), {
            fontSize: `${descriptionSize}px`, lineHeight: 1.4, color: mutedText, marginTop: '24px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          })] : []),
          ...(footer.length || siteName ? [{
            type: 'div', props: {
              style: { display: 'flex', alignItems: 'center', marginTop: 'auto', paddingTop: '28px', gap: '24px' },
              children: [
                ...(footer.length ? [{ type: 'div', props: { style: { display: 'flex', alignItems: 'center', gap: '24px' }, children: footer } }] : []),
                ...(siteName ? [label(siteName, { marginLeft: 'auto', fontSize: '18px', color: mutedText })] : []),
              ],
            },
          }] : []),
        ],
      },
    };
  },
};

export default template;
