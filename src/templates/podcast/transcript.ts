import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const DEFAULT_TIMES = ['12:04', '12:09', '12:11'];
const DEFAULT_SPEAKERS = ['Maya', 'Leo', 'Maya'];
const DEFAULT_LINES = [
  'We had more services than engineers.',
  'So you merged them back?',
  'One repo, one deploy. Nobody misses the old setup.',
];

const template: TemplateDefinition = {
  id: 'podcast-transcript',
  name: 'Transcript',
  category: 'podcast',
  description: 'Podcast episode card with up to three transcript lines, each with a timestamp and speaker',
  tags: ['podcast', 'transcript', 'quote', 'dialogue', 'episode'],
  fields: [
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: 'The Build Log', placeholder: 'Podcast name', group: 'Content' as const },
    commonFields.title,
    ...[1, 2, 3].flatMap((number) => [
      { key: `time${number}`, label: `Time ${number}`, type: 'text' as const, defaultValue: DEFAULT_TIMES[number - 1], placeholder: '12:04', group: 'Content' as const },
      { key: `speaker${number}`, label: `Speaker ${number}`, type: 'text' as const, defaultValue: DEFAULT_SPEAKERS[number - 1], placeholder: 'Speaker name', group: 'Content' as const },
      { key: `line${number}`, label: `Line ${number}`, type: 'text' as const, defaultValue: DEFAULT_LINES[number - 1], placeholder: 'What they said', group: 'Content' as const },
    ]),
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    showName: 'The Build Log',
    title: 'Why we went back to a monolith',
    time1: '12:04',
    speaker1: 'Maya',
    line1: 'We had more services than engineers.',
    time2: '12:09',
    speaker2: 'Leo',
    line2: 'So you merged them back?',
    time3: '12:11',
    speaker3: 'Maya',
    line3: 'One repo, one deploy. Nobody misses the old setup.',
    bgColor: '#0d1117',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const showName = truncate(String(params.showName ?? '').trim(), 48);
    const title = String(params.title ?? '').trim() || 'Episode Transcript';
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 46 },
      { maxLen: 40, size: 38 },
      { maxLen: 52, size: 32 },
      { maxLen: 64, size: 28 },
    ]);
    const rows = [1, 2, 3]
      .map((number) => ({
        time: String(params[`time${number}`] ?? '').trim(),
        speaker: String(params[`speaker${number}`] ?? '').trim(),
        line: String(params[`line${number}`] ?? '').trim(),
      }))
      .filter((row) => row.line); // blank text => row skipped, no gap

    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const light = isLightColor(bgColor);
    const accentInk = light ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = mixColors(bgColor, textColor, light ? 0.68 : 0.62);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          padding: '64px 72px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          ...(showName
            ? [{
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' },
                  children: [
                    { type: 'div', props: { style: { display: 'flex', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: accentInk } } },
                    { type: 'span', props: { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: mutedColor, letterSpacing: '0.04em' }, children: showName } },
                  ],
                },
              }]
            : []),
          {
            type: 'h1',
            props: {
              style: { display: 'flex', margin: rows.length ? '0 0 32px' : '0', fontSize: `${titleSize}px`, lineHeight: 1.15, fontWeight: 700, color: textColor, whiteSpace: 'nowrap', overflow: 'hidden' },
              children: truncate(title, 64),
            },
          },
          ...(rows.length
            ? [{
                type: 'div',
                props: {
                  style: { display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, minHeight: 0, overflow: 'hidden' },
                  children: rows.map((row) => ({
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '16px 24px',
                        gap: '20px',
                        borderRadius: '16px',
                        backgroundColor: `${textColor}08`,
                        border: `1px solid ${textColor}16`,
                      },
                      children: [
                        { type: 'span', props: { style: { display: 'flex', width: '96px', flexShrink: 0, fontFamily: 'JetBrains Mono', fontSize: '20px', lineHeight: '34px', color: mutedColor, whiteSpace: 'nowrap' }, children: truncate(row.time, 8) } },
                        { type: 'span', props: { style: { display: 'block', width: '130px', flexShrink: 0, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontSize: '22px', lineHeight: '34px', fontWeight: 700, color: accentInk }, children: truncate(row.speaker, 12) } },
                        { type: 'span', props: { style: { display: 'block', flex: 1, minWidth: 0, overflow: 'hidden', lineClamp: 2, fontSize: '26px', lineHeight: '34px', fontWeight: 500, color: textColor }, children: truncate(row.line, 110) } },
                      ],
                    },
                  })),
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;