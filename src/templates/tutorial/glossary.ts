import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-glossary',
  name: 'Glossary Term',
  category: 'tutorial',
  description: 'A glossary-style card for explaining a technical term',
  tags: ['glossary', 'term', 'definition', 'tutorial', 'education'],
  fields: [
    { key: 'label', label: 'Label', type: 'text', defaultValue: 'Term of the day', placeholder: 'Term of the day', group: 'Content' },
    { key: 'term', label: 'Term', type: 'text', defaultValue: 'Idempotent', placeholder: 'Technical term', required: true, group: 'Content' },
    { key: 'partOfSpeech', label: 'Part of Speech', type: 'text', defaultValue: 'adjective', placeholder: 'adjective', group: 'Content' },
    commonFields.description,
    { key: 'example', label: 'Example', type: 'text', defaultValue: 'PUT /users/42 twice still leaves one user', placeholder: 'Usage example', group: 'Content' },
    commonFields.bgColor, commonFields.accentColor, commonFields.textColor,
  ],
  defaults: {
    label: 'Term of the day', term: 'Idempotent', partOfSpeech: 'adjective',
    description: 'An operation that produces the same result whether it is performed once or repeated multiple times.',
    example: 'PUT /users/42 twice still leaves one user', bgColor: '#0f172a', accentColor: '#38bdf8', textColor: '#f8fafc',
  },
  render: (params) => {
    const label = truncate(String(params.label ?? '').trim(), 32);
    const term = truncate(String(params.term || 'Your term').trim(), 48);
    const partOfSpeech = String(params.partOfSpeech ?? '').trim();
    const definition = truncate(String(params.description || '').trim(), 180);
    const example = String(params.example ?? '').trim();
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = isLightColor(bgColor) ? '#475569' : `${textColor}99`;
    const termSize = autoFontSize(term, [{ maxLen: 18, size: 76 }, { maxLen: 30, size: 62 }, { maxLen: 40, size: 50 }, { maxLen: 48, size: 42 }]);
    return { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', padding: '58px 72px', boxSizing: 'border-box', backgroundColor: bgColor, fontFamily: 'Inter, sans-serif', color: textColor }, children: [
      ...(label ? [{ type: 'span', props: { style: { fontSize: '20px', fontWeight: 700, color: accentInk, letterSpacing: '0.08em', textTransform: 'uppercase' }, children: label } }] : []),
      { type: 'div', props: { style: { display: 'flex', alignItems: 'baseline', gap: '18px', marginTop: '20px' }, children: [{ type: 'h1', props: { style: { fontSize: `${termSize}px`, lineHeight: 1.05, fontWeight: 800, margin: 0, color: textColor }, children: term } }, ...(partOfSpeech ? [{ type: 'span', props: { style: { fontSize: '24px', color: mutedColor }, children: partOfSpeech } }] : [])] } },
      { type: 'p', props: { style: { fontSize: '27px', lineHeight: 1.35, color: textColor, margin: '24px 0 0', maxWidth: '1000px' }, children: definition } },
      ...(example ? [{ type: 'div', props: { style: { display: 'flex', marginTop: '30px', padding: '20px 24px', borderRadius: '12px', backgroundColor: `${textColor}0A`, border: `1px solid ${accentColor}44`, boxSizing: 'border-box' }, children: { type: 'span', props: { style: { fontSize: '20px', lineHeight: 1.35, color: accentInk, fontFamily: 'JetBrains Mono, monospace' }, children: truncate(example, 88) } } } }] : []),
    ] } };
  },
};

export default template;
