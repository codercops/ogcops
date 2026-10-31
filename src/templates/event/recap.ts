import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, isLightColor, commonFields } from '../utils';

const DEFAULT_TITLE = 'JSConf India 2026';
const CONTENT_WIDTH = 1040;
const STAT_GAP = 40;
const STAT_SLOTS = [1, 2, 3] as const;

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const stat = (n: number, defaultValue: string, defaultLabel: string) => [
  { key: `stat${n}Value`, label: `Stat ${n} Value`, type: 'text' as const, defaultValue, placeholder: 'Optional, a number such as 1,200', group: 'Content' as const },
  { key: `stat${n}Label`, label: `Stat ${n} Label`, type: 'text' as const, defaultValue: defaultLabel, placeholder: 'Optional, such as attendees', group: 'Content' as const },
];

const template: TemplateDefinition = {
  id: 'event-recap',
  name: 'Recap',
  category: 'event',
  description: 'A Recap card for after an event: the event name and date, up to three big stats, a thank-you line',
  tags: ['event', 'recap', 'wrap-up', 'stats', 'thank you'],
  fields: [
    { ...commonFields.title, label: 'Event Name', defaultValue: DEFAULT_TITLE, placeholder: 'JSConf India 2026' },
    { ...commonFields.description, label: 'Thank-you Line', type: 'text', defaultValue: 'Thanks to everyone who came, see you next year', placeholder: 'Optional, a line to thank people' },
    { key: 'when', label: 'Date and Place', type: 'text', defaultValue: 'Feb 14, Bengaluru', placeholder: 'Optional, such as Feb 14, Bengaluru', group: 'Content' },
    ...stat(1, '1,200', 'attendees'),
    ...stat(2, '32', 'talks'),
    ...stat(3, '18', 'cities'),
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0b0f1a' },
    { ...commonFields.accentColor, defaultValue: '#f59e0b' },
    { ...commonFields.textColor, defaultValue: '#f8fafc' },
  ],
  defaults: {
    title: DEFAULT_TITLE,
    description: 'Thanks to everyone who came, see you next year',
    when: 'Feb 14, Bengaluru',
    stat1Value: '1,200',
    stat1Label: 'attendees',
    stat2Value: '32',
    stat2Label: 'talks',
    stat3Value: '18',
    stat3Label: 'cities',
    siteName: '',
    bgColor: '#0b0f1a',
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const title = cleanText(params.title, 80) || DEFAULT_TITLE;
    const thanks = cleanText(params.description, 100);
    const when = cleanText(params.when, 60);
    const siteName = cleanText(params.siteName, 40);
    const bgColor = String(params.bgColor || '#0b0f1a');
    const accentColor = String(params.accentColor || '#f59e0b');
    const textColor = String(params.textColor || '#f8fafc');

    // A stat with no value is skipped, whatever its label says, and the rest share the row.
    const filled = STAT_SLOTS.flatMap((n) => {
      const value = String(params[`stat${n}Value`] ?? '').replace(/\s+/g, ' ').trim();
      return value ? [{ value, label: cleanText(params[`stat${n}Label`], 40) }] : [];
    });
    const columnWidth = Math.floor((CONTENT_WIDTH - STAT_GAP * (filled.length - 1)) / Math.max(filled.length, 1));
    // The widest a value can be at the smallest size, so a long one is cut inside its column.
    const MIN_VALUE_SIZE = 40;
    const maxValueLength = Math.max(3, Math.floor(columnWidth / (0.62 * MIN_VALUE_SIZE)));
    // Labels are 22px capitals with letter spacing, about 0.78 em a character.
    const maxLabelLength = Math.max(4, Math.floor(columnWidth / (0.78 * 22)));
    const values = filled.map((entry) => ({ value: truncate(entry.value, maxValueLength), label: truncate(entry.label, maxLabelLength) }));
    // One size for the row, from its longest value, so the numbers line up.
    const longest = Math.max(1, ...values.map((entry) => entry.value.length));
    const valueSize = Math.max(MIN_VALUE_SIZE, Math.min(88, Math.floor(columnWidth / (0.62 * longest))));
    const stats = values.map((entry) => ({ ...entry, size: valueSize }));

    const titleSize = autoFontSize(title, [
      { maxLen: 16, size: 88 },
      { maxLen: 28, size: 72 },
      { maxLen: 44, size: 58 },
      { maxLen: 60, size: 48 },
      { maxLen: 80, size: 42 },
    ]);

    // Neutral colors are mixed from the background and text colors, so the card reads the
    // same on dark and on light backgrounds. An accent as light as a light background (or as
    // dark as a dark one) is pulled toward the text color when it is used as text.
    const lightBg = isLightColor(bgColor);
    const dimmedText = mixColors(bgColor, textColor, 0.72);
    const thanksColor = mixColors(bgColor, textColor, 0.86);
    const accentText = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;

    const text = (children: string, style: Record<string, string | number>): SatoriElement => ({
      type: 'span',
      props: { style: { whiteSpace: 'nowrap', ...style }, children },
    });
    const statColumn = ({ value, size, label }: (typeof stats)[number]): SatoriElement => ({
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', width: `${columnWidth}px`, overflow: 'hidden' },
        children: [
          text(value, { fontSize: `${size}px`, fontWeight: 700, color: accentText, lineHeight: 1.05, letterSpacing: '-0.02em' }),
          ...(label ? [text(label, { fontSize: '22px', fontWeight: 500, color: dimmedText, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' })] : []),
        ],
      },
    });

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
          padding: '64px 80px',
        },
        children: [
          text('Recap', { fontSize: '28px', fontWeight: 700, color: accentText, letterSpacing: '0.2em', textTransform: 'uppercase' }),
          // Event name and when it was
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
              children: [
                { type: 'span', props: { style: { fontSize: `${titleSize}px`, fontWeight: 700, color: textColor, lineHeight: 1.1, letterSpacing: '-0.03em' }, children: title } },
                ...(when ? [text(when, { fontSize: '30px', fontWeight: 500, color: dimmedText, marginTop: '16px' })] : []),
              ],
            },
          },
          ...(stats.length ? [{ type: 'div', props: { style: { display: 'flex', gap: `${STAT_GAP}px`, marginBottom: thanks || siteName ? '32px' : '0' }, children: stats.map(statColumn) } }] : []),
          ...(thanks ? [{ type: 'span', props: { style: { fontSize: '26px', fontWeight: 500, color: thanksColor, lineHeight: 1.3 }, children: thanks } }] : []),
          ...(siteName ? [text(siteName, { fontSize: '20px', fontWeight: 500, color: dimmedText, marginTop: thanks ? '20px' : '0' })] : []),
        ],
      },
    };
  },
};

export default template;
