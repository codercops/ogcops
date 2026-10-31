import type { SatoriElement, TemplateDefinition } from '../types';
import { arrowRightIcon, autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'saas-deprecation',
  name: 'Deprecation Notice',
  category: 'saas',
  description: 'Announce a deprecated API, feature, or version with its replacement and sunset date',
  tags: ['saas', 'deprecated', 'deprecation', 'sunset', 'migration'],
  fields: [
    commonFields.title,
    { key: 'replacement', label: 'Replacement', type: 'text', defaultValue: 'API v2', placeholder: 'What replaces it', group: 'Content' },
    { key: 'sunsetDate', label: 'Sunset Date', type: 'text', defaultValue: 'Shuts down on March 31, 2027', placeholder: 'When it will be unavailable', group: 'Content' },
    commonFields.description,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'API v1',
    replacement: 'API v2',
    sunsetDate: 'Shuts down on March 31, 2027',
    description: 'The migration guide is in the docs',
    siteName: 'Acme API',
    bgColor: '#0b0f1a',
    accentColor: '#f97316',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'API v1').replace(/\s+/g, ' ').trim() || 'API v1';
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 16, size: 76 },
      { maxLen: 28, size: 64 },
      { maxLen: 44, size: 52 },
      { maxLen: 72, size: 42 },
    ]);
    const title = truncate(rawTitle, 44);
    const rawReplacement = String(params.replacement ?? '').replace(/\s+/g, ' ').trim();
    const replacementSize = autoFontSize(rawReplacement, [
      { maxLen: 16, size: 76 },
      { maxLen: 28, size: 64 },
      { maxLen: 44, size: 52 },
      { maxLen: 72, size: 42 },
    ]);
    const replacement = truncate(rawReplacement, 44);
    const sunsetDate = cleanText(params.sunsetDate, 72);
    const description = cleanText(params.description, 100);
    const siteName = cleanText(params.siteName, 40);
    const bgColor = String(params.bgColor || '#0b0f1a');
    const accentColor = String(params.accentColor || '#f97316');
    const textColor = String(params.textColor || '#f8fafc');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = mixColors(bgColor, textColor, 0.68);

    const nameRow: SatoriElement[] = [
      {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            ...(replacement ? { flex: 1 } : {}),
            minWidth: 0,
          },
          children: [
            { type: 'span', props: { style: { fontSize: '16px', fontWeight: 700, letterSpacing: '0.12em', color: mutedColor, textTransform: 'uppercase' }, children: 'NO LONGER SUPPORTED' } },
            { type: 'h1', props: { style: { display: 'flex', overflow: 'hidden', fontSize: `${titleSize}px`, lineHeight: 1.05, fontWeight: 700, color: textColor, textDecoration: 'line-through', margin: '18px 0 0' }, children: title } },
          ],
        },
      },
      ...(replacement
        ? [
            { type: 'div', props: { style: { display: 'flex', flexShrink: 0, margin: '0 28px' }, children: arrowRightIcon(50, accentInk) } },
            {
              type: 'div',
              props: {
                style: { display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 },
                children: [
                  { type: 'span', props: { style: { fontSize: '16px', fontWeight: 700, letterSpacing: '0.12em', color: accentInk, textTransform: 'uppercase' }, children: 'USE INSTEAD' } },
                  { type: 'span', props: { style: { display: 'flex', overflow: 'hidden', fontSize: `${replacementSize}px`, lineHeight: 1.05, fontWeight: 700, color: textColor, marginTop: '18px' }, children: replacement } },
                ],
              },
            },
          ]
        : []),
    ];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          padding: '58px 72px 48px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '54px' }, children: [
              {
                type: 'div',
                props: { style: { display: 'flex', alignItems: 'center', padding: '10px 20px', borderRadius: '999px', backgroundColor: `${accentInk}14`, border: `1px solid ${accentInk}66` }, children: {
                  type: 'span', props: { style: { fontSize: '18px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accentInk }, children: 'Deprecated' },
                } },
              },
            ] },
          },
          {
            type: 'div',
            props: { style: { display: 'flex', alignItems: 'center', flex: 1, minHeight: 0, marginTop: '28px' }, children: nameRow },
          },
          ...(sunsetDate
            ? [{ type: 'span', props: { style: { fontSize: '30px', fontWeight: 700, lineHeight: 1.2, color: accentInk, marginTop: '16px' }, children: sunsetDate } }]
            : []),
          ...(description
            ? [{ type: 'span', props: { style: { fontSize: '22px', lineHeight: 1.3, color: mutedColor, marginTop: '12px' }, children: description } }]
            : []),
          ...(siteName
            ? [{ type: 'span', props: { style: { alignSelf: 'flex-end', fontSize: '20px', fontWeight: 600, color: mutedColor, marginTop: 'auto' }, children: siteName } }]
            : []),
        ],
      },
    };
  },
};

export default template;
