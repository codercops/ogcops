import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'event-office-hours',
  name: 'Office Hours',
  category: 'event',
  description: 'Friendly recurring office-hours card for maintainer and community calls',
  tags: ['office hours', 'maintainers', 'community', 'discord', 'event'],
  fields: [
    commonFields.title,
    { key: 'schedule', label: 'Schedule', type: 'text' as const, defaultValue: 'Every Thursday · 17:00 to 18:00 IST', placeholder: 'Every Thursday · 17:00 to 18:00 IST', group: 'Content' as const },
    { key: 'host', label: 'Host', type: 'text' as const, defaultValue: '', placeholder: 'Host name', required: true, group: 'Content' as const },
    { key: 'hostRole', label: 'Host Role', type: 'text' as const, defaultValue: '', placeholder: 'Maintainer', group: 'Content' as const },
    { key: 'topic', label: 'Topic', type: 'text' as const, defaultValue: '', placeholder: 'Bring your PR questions', group: 'Content' as const },
    { key: 'ctaText', label: 'Call to Action', type: 'text' as const, defaultValue: 'Join on Discord', placeholder: 'Join on Discord', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Ask the maintainers',
    schedule: 'Every Thursday · 17:00 to 18:00 IST',
    host: 'Priya Shah',
    hostRole: 'Maintainer',
    topic: 'Bring your PR questions',
    ctaText: 'Join on Discord',
    bgColor: '#f5f1e8',
    accentColor: '#5b4bdb',
    textColor: '#171521',
  },
  render: (params) => {
    const value = (key: string, fallback = '') => {
      const raw = params[key];
      return typeof raw === 'string' ? raw.trim() : raw == null ? fallback : String(raw).trim();
    };
    const title = truncate(value('title', 'Ask the maintainers') || 'Ask the maintainers', 90);
    const schedule = truncate(value('schedule', 'Every Thursday · 17:00 to 18:00 IST') || 'Every Thursday · 17:00 to 18:00 IST', 64);
    const host = truncate(value('host', ''), 40);
    const hostRole = truncate(value('hostRole'), 48);
    const topic = truncate(value('topic'), 90);
    const ctaText = truncate(value('ctaText'), 28);
    const bgColor = value('bgColor', '#f5f1e8');
    const accentColor = value('accentColor', '#5b4bdb');
    const textColor = value('textColor', '#171521');
    const ctaColor = contrastText(accentColor);
    const labelColor = isLightColor(accentColor) === isLightColor(bgColor) ? mixColors(accentColor, textColor, 0.55) : accentColor;
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 70 },
      { maxLen: 50, size: 58 },
      { maxLen: 72, size: 48 },
      { maxLen: 90, size: 40 },
    ]);

    return {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', background: bgColor, fontFamily: 'Inter, sans-serif', padding: '58px 68px' },
        children: [
          { type: 'span', props: { style: { fontSize: '16px', fontWeight: 700, color: labelColor, letterSpacing: '0.16em', textTransform: 'uppercase' }, children: 'Office hours' } },
          { type: 'div', props: { style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', maxWidth: '1000px' }, children: [
            { type: 'h1', props: { style: { fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.08, color: textColor, margin: 0, maxWidth: '1000px' }, children: title } },
            { type: 'span', props: { style: { marginTop: '28px', fontSize: '25px', fontWeight: 600, color: textColor }, children: schedule } },
            ...(host ? [{ type: 'div', props: { style: { display: 'flex', alignItems: 'center', marginTop: '24px', gap: '12px' }, children: [
              { type: 'span', props: { style: { fontSize: '22px', fontWeight: 700, color: textColor }, children: host } },
              ...(hostRole ? [{ type: 'span', props: { style: { fontSize: '20px', color: `${textColor}99` }, children: `· ${hostRole}` } }] : []),
            ] } }] : []),
            ...(topic ? [{ type: 'span', props: { style: { marginTop: '16px', fontSize: '20px', color: `${textColor}aa` }, children: topic } }] : []),
          ] } },
          { type: 'div', props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: `1px solid ${textColor}22`, paddingTop: '24px' }, children: [
            { type: 'span', props: { style: { fontSize: '15px', fontWeight: 600, color: `${textColor}88`, letterSpacing: '0.08em', textTransform: 'uppercase' }, children: 'Community connection' } },
            ...(ctaText ? [{ type: 'div', props: { style: { display: 'flex', alignItems: 'center', padding: '14px 24px', borderRadius: '999px', background: accentColor }, children: { type: 'span', props: { style: { fontSize: '18px', fontWeight: 700, color: ctaColor }, children: ctaText } } } }] : []),
          ] } },
        ],
      },
    };
  },
};

export default template;
