import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-now',
  name: 'Developer Now',
  category: 'developer',
  description: 'A focused developer now card for what you are building, learning, and reading',
  tags: ['developer', 'now', 'status', 'building', 'learning'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    commonFields.title,
    { key: 'building', label: 'Building', type: 'text' as const, defaultValue: '', placeholder: 'A calmer way to plan projects', group: 'Content' as const },
    { key: 'learning', label: 'Learning', type: 'text' as const, defaultValue: '', placeholder: 'Distributed systems', group: 'Content' as const },
    { key: 'reading', label: 'Reading', type: 'text' as const, defaultValue: '', placeholder: 'Designing Data-Intensive Applications', group: 'Content' as const },
    { key: 'updated', label: 'Updated', type: 'text' as const, defaultValue: '', placeholder: 'oct 2026', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith', title: 'What I am focused on now', building: 'A calmer way to plan projects',
    learning: 'Distributed systems', reading: 'Designing Data-Intensive Applications', updated: 'oct 2026',
    bgColor: '#F5F1EA', accentColor: '#E07A5F', textColor: '#1E1E1E',
  },
  render: (params) => {
    const name = truncate(String(params.name || 'Developer'), 42);
    const title = truncate(String(params.title || 'What I am focused on now'), 90);
    const building = String(params.building ?? '').trim();
    const learning = String(params.learning ?? '').trim();
    const reading = String(params.reading ?? '').trim();
    const updatedValue = String(params.updated ?? '').trim();
    const updated = updatedValue ? truncate(updatedValue, 24) : '';
    const bgColor = String(params.bgColor || '#F5F1EA');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#1E1E1E');
    const rows = [
      { label: 'BUILDING', value: building }, { label: 'LEARNING', value: learning },
      { label: 'READING', value: reading },
    ].filter((row) => row.value);

    return {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', padding: '56px 72px', background: bgColor, color: textColor, fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' },
        children: [
          { type: 'div', props: { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [
            { type: 'span', props: { style: { display: 'flex', fontSize: '32px', fontWeight: 700, fontFamily: 'Playfair Display, serif' }, children: name } },
            ...(updated ? [{ type: 'span', props: { style: { display: 'flex', fontSize: '14px', color: `${textColor}99`, letterSpacing: '0.08em', textTransform: 'uppercase' }, children: `updated ${updated}` } }] : []),
          ] } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', marginTop: '74px', flex: 1 }, children: [
            { type: 'span', props: { style: { display: 'flex', fontSize: autoFontSize(title, [{ maxLen: 36, size: 54 }, { maxLen: 60, size: 46 }, { maxLen: 90, size: 38 }]), lineHeight: 1.08, fontWeight: 700, maxWidth: '920px', fontFamily: 'Playfair Display, serif' }, children: title } },
            { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '48px', maxWidth: '1050px' }, children: rows.map((row) => ({
              type: 'div', props: { style: { display: 'flex', alignItems: 'flex-start', gap: '32px' }, children: [
                { type: 'span', props: { style: { display: 'flex', flexShrink: 0, width: '120px', paddingTop: '5px', fontSize: '13px', fontWeight: 700, color: isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor, letterSpacing: '0.14em' }, children: row.label } },
                { type: 'span', props: { style: { display: 'flex', minWidth: 0, fontSize: '22px', lineHeight: 1.35, color: textColor, overflowWrap: 'anywhere' }, children: truncate(String(row.value), 120) } },
              ] },
            })) } },
          ] } },
        ],
      },
    };
  },
};

export default template;
