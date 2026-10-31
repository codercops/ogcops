import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const STATUS = {
  scheduled: 'Scheduled maintenance',
  'in-progress': 'Maintenance in progress',
  completed: 'Maintenance completed',
};
const MAX_SERVICES = 4;

const template: TemplateDefinition = {
  id: 'saas-maintenance',
  name: 'Scheduled Maintenance',
  category: 'saas',
  description: 'Maintenance notice with a status pill, time window, expected impact and affected services',
  tags: ['saas', 'maintenance', 'status', 'downtime', 'incident'],
  fields: [
    commonFields.siteName,
    { ...commonFields.title, defaultValue: 'Database upgrade', placeholder: 'e.g. Database upgrade' },
    {
      key: 'status', label: 'Status', type: 'select', defaultValue: 'scheduled',
      options: [
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'In progress', value: 'in-progress' },
        { label: 'Completed', value: 'completed' },
      ],
      group: 'Content',
    },
    { key: 'timeWindow', label: 'Time Window', type: 'text', defaultValue: 'Sat, Nov 1, 02:00 to 04:00 UTC', placeholder: 'Sat, Nov 1, 02:00 to 04:00 UTC', group: 'Content' },
    { key: 'impact', label: 'Impact', type: 'text', defaultValue: 'The API is read-only for up to 30 minutes', placeholder: 'What users will notice', group: 'Content' },
    { key: 'services', label: 'Affected Services', type: 'text', defaultValue: 'API, Dashboard, Webhooks', placeholder: 'API, Dashboard, Webhooks', group: 'Content' },
    commonFields.bgColor, commonFields.accentColor, commonFields.textColor,
  ],
  defaults: {
    siteName: 'Acme Cloud', title: 'Database upgrade', status: 'scheduled',
    timeWindow: 'Sat, Nov 1, 02:00 to 04:00 UTC', impact: 'The API is read-only for up to 30 minutes', services: 'API, Dashboard, Webhooks',
    bgColor: '#0f172a', accentColor: '#f59e0b', textColor: '#f8fafc',
  },
  render: (params) => {
    const siteName = truncate(String(params.siteName ?? '').trim(), 32);
    const title = truncate(String(params.title || 'Database upgrade').trim(), 60);
    const rawStatus = String(params.status ?? '').trim().toLowerCase();
    const status = Object.hasOwn(STATUS, rawStatus) ? STATUS[rawStatus as keyof typeof STATUS] : STATUS.scheduled;
    const timeWindow = truncate(String(params.timeWindow ?? '').trim(), 50);
    const impact = truncate(String(params.impact ?? '').trim(), 80);
    const services = String(params.services ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#f59e0b');
    const textColor = String(params.textColor || '#f8fafc');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 72 },
      { maxLen: 40, size: 60 },
      { maxLen: 60, size: 48 },
    ]);

    const chipLabels = services.slice(0, MAX_SERVICES).map((s) => truncate(s, 24));
    if (services.length > MAX_SERVICES) chipLabels.push(`+${services.length - MAX_SERVICES} more`);
    const chips: SatoriElement[] = chipLabels.map((label) => ({
      type: 'div',
      props: {
        style: { display: 'flex', padding: '8px 18px', borderRadius: '999px', backgroundColor: `${textColor}0d`, border: `1px solid ${textColor}33` },
        children: { type: 'span', props: { style: { fontSize: '20px', fontWeight: 500, color: `${textColor}cc` }, children: label } },
      },
    }));

    return {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: '1200px', height: '630px', padding: '60px 72px', boxSizing: 'border-box', backgroundColor: bgColor, fontFamily: 'Inter, sans-serif' },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderRadius: '999px', backgroundColor: `${accentColor}22`, border: `1px solid ${accentColor}` },
                    children: [
                      { type: 'div', props: { style: { display: 'flex', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: accentColor }, children: [] } },
                      { type: 'span', props: { style: { fontSize: '20px', fontWeight: 600, color: accentInk }, children: status } },
                    ],
                  },
                },
                ...(siteName ? [{ type: 'span', props: { style: { fontSize: '24px', fontWeight: 600, color: `${textColor}b3` }, children: siteName } }] : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
              children: [
                { type: 'h1', props: { style: { fontSize: `${titleSize}px`, lineHeight: 1.1, fontWeight: 700, color: textColor, margin: 0 }, children: title } },
                ...(timeWindow ? [{ type: 'span', props: { style: { fontSize: '30px', fontWeight: 600, color: accentInk, marginTop: '24px' }, children: timeWindow } }] : []),
                ...(impact ? [{ type: 'span', props: { style: { fontSize: '26px', color: `${textColor}b3`, marginTop: '12px' }, children: impact } }] : []),
              ],
            },
          },
          ...(chips.length ? [{ type: 'div', props: { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' }, children: chips } }] : []),
        ],
      },
    };
  },
};

export default template;
