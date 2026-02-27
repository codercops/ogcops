import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-language-bars',
  name: 'Language Bars',
  category: 'github',
  description: 'Color-coded language percentage bars like the GitHub repository overview',
  tags: ['github', 'language', 'bars', 'stats', 'code'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'my-project', placeholder: 'repo-name', group: 'Content' },
    commonFields.description,
    { key: 'lang1', label: 'Language 1', type: 'text', defaultValue: 'TypeScript', placeholder: 'Language', group: 'Content' },
    { key: 'pct1', label: 'Percentage 1', type: 'text', defaultValue: '62.4%', placeholder: '62.4%', group: 'Content' },
    { key: 'color1', label: 'Color 1', type: 'color', defaultValue: '#3178c6', group: 'Style' },
    { key: 'lang2', label: 'Language 2', type: 'text', defaultValue: 'Rust', placeholder: 'Language', group: 'Content' },
    { key: 'pct2', label: 'Percentage 2', type: 'text', defaultValue: '24.1%', placeholder: '24.1%', group: 'Content' },
    { key: 'color2', label: 'Color 2', type: 'color', defaultValue: '#dea584', group: 'Style' },
    { key: 'lang3', label: 'Language 3', type: 'text', defaultValue: 'CSS', placeholder: 'Language', group: 'Content' },
    { key: 'pct3', label: 'Percentage 3', type: 'text', defaultValue: '8.3%', placeholder: '8.3%', group: 'Content' },
    { key: 'color3', label: 'Color 3', type: 'color', defaultValue: '#563d7c', group: 'Style' },
    { key: 'lang4', label: 'Language 4', type: 'text', defaultValue: 'Other', placeholder: 'Language', group: 'Content' },
    { key: 'pct4', label: 'Percentage 4', type: 'text', defaultValue: '5.2%', placeholder: '5.2%', group: 'Content' },
    { key: 'color4', label: 'Color 4', type: 'color', defaultValue: '#6e7681', group: 'Style' },
    commonFields.bgColor,
    commonFields.textColor,
  ],
  defaults: {
    repoName: 'my-project',
    description: 'A full-stack application with multiple language support.',
    lang1: 'TypeScript', pct1: '62.4%', color1: '#3178c6',
    lang2: 'Rust', pct2: '24.1%', color2: '#dea584',
    lang3: 'CSS', pct3: '8.3%', color3: '#563d7c',
    lang4: 'Other', pct4: '5.2%', color4: '#6e7681',
    bgColor: '#0d1117',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const repoName = String(params.repoName || 'my-project');
    const description = params.description ? truncate(String(params.description), 120) : '';
    const bgColor = String(params.bgColor || '#0d1117');
    const textColor = String(params.textColor || '#e6edf3');

    const langs = [
      { name: String(params.lang1 || 'TypeScript'), pct: String(params.pct1 || '62.4%'), color: String(params.color1 || '#3178c6') },
      { name: String(params.lang2 || 'Rust'), pct: String(params.pct2 || '24.1%'), color: String(params.color2 || '#dea584') },
      { name: String(params.lang3 || 'CSS'), pct: String(params.pct3 || '8.3%'), color: String(params.color3 || '#563d7c') },
      { name: String(params.lang4 || 'Other'), pct: String(params.pct4 || '5.2%'), color: String(params.color4 || '#6e7681') },
    ];

    const repoSize = autoFontSize(repoName, [
      { maxLen: 15, size: 48 },
      { maxLen: 25, size: 40 },
      { maxLen: 40, size: 32 },
    ]);

    // Parse percentage numbers for bar widths
    const parseNum = (s: string) => parseFloat(s.replace('%', '')) || 0;
    const total = langs.reduce((sum, l) => sum + parseNum(l.pct), 0) || 100;

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
                      fontSize: '18px',
                      color: `${textColor}77`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '12px',
                      maxWidth: '800px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Spacer
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Language bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '100%',
                height: '12px',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '24px',
              },
              children: langs.map((l) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: `${(parseNum(l.pct) / total) * 100}%`,
                    height: '12px',
                    background: l.color,
                  },
                  children: [],
                },
              })),
            },
          },
          // Language legend (2x2 grid)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
              },
              children: langs.map((l) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '240px',
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
                          background: l.color,
                        },
                        children: [],
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: '16px', fontWeight: 600, color: textColor },
                        children: l.name,
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: { fontSize: '14px', color: `${textColor}55` },
                        children: l.pct,
                      },
                    },
                  ],
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
