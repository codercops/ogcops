import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const checkIcon = (size: number, color: string): SatoriElement => ({
  type: 'svg',
  props: {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '2.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    children: { type: 'path', props: { d: 'M5 12l4 4L19 6' } },
  },
});

const template: TemplateDefinition = {
  id: 'tutorial-prerequisites',
  name: 'Prerequisites',
  category: 'tutorial',
  description: 'A before-you-start card with a short tutorial prerequisite checklist',
  tags: ['tutorial', 'prerequisites', 'checklist', 'course', 'education'],
  fields: [
    commonFields.title,
    { key: 'item1', label: 'Prerequisite 1', type: 'text', defaultValue: 'Node 20 or newer', placeholder: 'Prerequisite', group: 'Content' },
    { key: 'item2', label: 'Prerequisite 2', type: 'text', defaultValue: 'Basic TypeScript', placeholder: 'Prerequisite', group: 'Content' },
    { key: 'item3', label: 'Prerequisite 3', type: 'text', defaultValue: 'A free Cloudflare account', placeholder: 'Prerequisite', group: 'Content' },
    { key: 'duration', label: 'Duration', type: 'text', defaultValue: 'About 45 minutes', placeholder: 'About 45 minutes', group: 'Content' },
    commonFields.bgColor, commonFields.accentColor, commonFields.textColor,
  ],
  defaults: {
    title: 'Build a REST API with Hono',
    item1: 'Node 20 or newer', item2: 'Basic TypeScript', item3: 'A free Cloudflare account', duration: 'About 45 minutes',
    bgColor: '#0f172a', accentColor: '#38bdf8', textColor: '#f8fafc',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Build a REST API with Hono').trim(), 70);
    const items = [params.item1, params.item2, params.item3]
      .map((item) => String(item ?? '').trim())
      .filter(Boolean);
    const duration = String(params.duration ?? '').trim();
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = isLightColor(bgColor) ? '#475569' : `${textColor}99`;
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 58 },
      { maxLen: 48, size: 48 },
      { maxLen: 70, size: 40 },
    ]);
    const rows: SatoriElement[] = items.map((item) => ({
      type: 'div',
      props: {
        style: { display: 'flex', alignItems: 'flex-start', gap: '18px', minHeight: '58px', padding: '10px 0' },
        children: [
          { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, width: '34px', height: '34px', borderRadius: '50%', backgroundColor: `${accentColor}18`, border: `1px solid ${accentColor}55` }, children: checkIcon(20, accentInk) } },
          { type: 'span', props: { style: { display: 'flex', flex: 1, minWidth: 0, fontSize: '25px', lineHeight: 1.3, color: textColor, overflow: 'hidden' }, children: truncate(item, 72) } },
        ],
      },
    }));

    return {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', padding: '58px 72px', boxSizing: 'border-box', backgroundColor: bgColor, fontFamily: 'Inter, sans-serif', color: textColor },
        children: [
          { type: 'span', props: { style: { fontSize: '20px', fontWeight: 700, color: accentInk, letterSpacing: '0.1em', textTransform: 'uppercase' }, children: 'BEFORE YOU START' } },
          { type: 'h1', props: { style: { fontSize: `${titleSize}px`, lineHeight: 1.15, fontWeight: 800, color: textColor, margin: '18px 0 26px' }, children: title } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', flex: 1 }, children: rows } },
          ...(duration ? [{ type: 'span', props: { style: { fontSize: '20px', fontWeight: 600, color: mutedColor, paddingTop: '18px', borderTop: `1px solid ${textColor}22` }, children: duration } }] : []),
        ],
      },
    };
  },
};

export default template;
