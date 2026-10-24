import type { SatoriElement, TemplateDefinition } from '../types';
import { commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-roadmap',
  name: 'Roadmap',
  category: 'saas',
  description: 'Product roadmap card with Now, Next, and Later columns',
  tags: ['roadmap', 'product', 'saas', 'launch', 'planning'],
  fields: [
    commonFields.siteName,
    commonFields.title,
    { key: 'now', label: 'Now', type: 'text', defaultValue: 'Dark mode', placeholder: 'Current work', group: 'Content' },
    { key: 'next', label: 'Next', type: 'text', defaultValue: 'Team billing', placeholder: 'Coming next', group: 'Content' },
    { key: 'later', label: 'Later', type: 'text', defaultValue: 'Offline sync', placeholder: 'Future work', group: 'Content' },
    commonFields.bgColor, commonFields.accentColor, commonFields.textColor,
  ],
  defaults: {
    siteName: 'Acme Cloud', title: "What's coming in 2027", now: 'Dark mode', next: 'Team billing', later: 'Offline sync',
    bgColor: '#0f172a', accentColor: '#38bdf8', textColor: '#f8fafc',
  },
  render: (params) => {
    const siteName = truncate(String(params.siteName ?? '').trim(), 40);
    const title = truncate(String(params.title || "What's coming in 2027").trim(), 60);
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const columns = [
      ['Now', params.now],
      ['Next', params.next],
      ['Later', params.later],
    ]
      .map(([label, value]) => ({ label: String(label), item: String(value ?? '').trim() }))
      .filter((column) => column.item);

    const roadmapColumns: SatoriElement[] = columns.map((column) => ({
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, padding: '26px 28px', borderRadius: '16px', backgroundColor: `${textColor}08`, border: `1px solid ${accentColor}33`, boxSizing: 'border-box' },
        children: [
          { type: 'span', props: { style: { fontSize: '16px', fontWeight: 700, color: accentInk, letterSpacing: '0.1em', textTransform: 'uppercase' }, children: column.label } },
          { type: 'span', props: { style: { display: 'flex', flex: 1, marginTop: '22px', fontSize: '27px', lineHeight: 1.25, color: textColor, overflow: 'hidden' }, children: truncate(column.item, 72) } },
        ],
      },
    }));

    return {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', padding: '58px 72px', boxSizing: 'border-box', backgroundColor: bgColor, fontFamily: 'Inter, sans-serif', color: textColor },
        children: [
          ...(siteName ? [{ type: 'span', props: { style: { fontSize: '22px', fontWeight: 700, color: accentInk }, children: siteName } }] : []),
          { type: 'h1', props: { style: { fontSize: '52px', lineHeight: 1.15, fontWeight: 800, color: textColor, margin: siteName ? '16px 0 36px' : '0 0 36px' }, children: title } },
          { type: 'div', props: { style: { display: 'flex', flex: 1, gap: '20px' }, children: roadmapColumns } },
        ],
      },
    };
  },
};

export default template;
