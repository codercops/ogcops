import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, isLightColor, contrastText, commonFields, arrowRightIcon } from '../utils';

const DEFAULT_TITLE = 'Frontend Meetup #14';
const DEFAULT_NEW_DATE = 'Thu, 13 Nov, 7 PM';
const CONTENT_WIDTH = 1040;
// The arrow and the gaps around it, between the old date and the new one.
const DATE_GAPS = 90;

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'event-rescheduled',
  name: 'Rescheduled',
  category: 'event',
  description: 'A Rescheduled notice with the event name, the old date struck through next to the new date, and an optional note',
  tags: ['event', 'rescheduled', 'new date', 'update', 'meetup'],
  fields: [
    commonFields.title,
    { key: 'oldDate', label: 'Old Date', type: 'text', defaultValue: 'Thu, 6 Nov, 7 PM', placeholder: 'Optional, the date it was on', group: 'Content' },
    { key: 'newDate', label: 'New Date', type: 'text', defaultValue: DEFAULT_NEW_DATE, placeholder: 'Thu, 13 Nov, 7 PM', required: true, group: 'Content' },
    { key: 'note', label: 'Note', type: 'text', defaultValue: 'Same venue, your tickets still work', placeholder: 'Optional, one line for attendees', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: DEFAULT_TITLE,
    oldDate: 'Thu, 6 Nov, 7 PM',
    newDate: DEFAULT_NEW_DATE,
    note: 'Same venue, your tickets still work',
    bgColor: '#0b0f1a',
    accentColor: '#f59e0b',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const title = cleanText(params.title, 80) || DEFAULT_TITLE;
    const oldDate = cleanText(params.oldDate, 28);
    const newDate = cleanText(params.newDate, 28) || DEFAULT_NEW_DATE;
    const note = cleanText(params.note, 80);
    const bgColor = String(params.bgColor || '#0b0f1a');
    const accentColor = String(params.accentColor || '#f59e0b');
    const textColor = String(params.textColor || '#f8fafc');

    const titleSize = autoFontSize(title, [
      { maxLen: 18, size: 96 },
      { maxLen: 30, size: 80 },
      { maxLen: 46, size: 64 },
      { maxLen: 64, size: 52 },
      { maxLen: 80, size: 44 },
    ]);

    // Each date stays on one line: the new date is bold and the old one is smaller, so size
    // them together for the room they share. A single date can be larger.
    const OLD_SCALE = 0.75;
    const newWidth = 0.64 * newDate.length;
    const oldWidth = oldDate ? 0.55 * OLD_SCALE * oldDate.length : 0;
    const room = oldDate ? CONTENT_WIDTH - DATE_GAPS : CONTENT_WIDTH;
    const dateSize = Math.max(24, Math.min(oldDate ? 48 : 60, Math.floor(room / (newWidth + oldWidth))));

    // Neutral colors are mixed from the background and text colors, so the card reads the
    // same on dark and on light backgrounds.
    const lightBg = isLightColor(bgColor);
    const dimmedText = mixColors(bgColor, textColor, 0.55);
    const noteColor = mixColors(bgColor, textColor, 0.78);
    // An accent as light as the background (or as dark as it) is hard to read as text, so
    // pull it toward the text color. Otherwise it reads as it is.
    const accentText = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;
    const pillText = contrastText(accentColor);

    const dates: SatoriElement[] = [
      ...(oldDate
        ? [
            {
              type: 'span',
              props: {
                style: {
                  fontSize: `${Math.round(dateSize * OLD_SCALE)}px`,
                  fontWeight: 500,
                  color: dimmedText,
                  textDecoration: 'line-through',
                  whiteSpace: 'nowrap',
                },
                children: oldDate,
              },
            },
            { type: 'div', props: { style: { display: 'flex', margin: '0 26px', flexShrink: 0 }, children: arrowRightIcon(Math.round(dateSize * 0.8), accentText) } },
          ]
        : []),
      {
        type: 'span',
        props: {
          style: { fontSize: `${dateSize}px`, fontWeight: 700, color: accentText, whiteSpace: 'nowrap' },
          children: newDate,
        },
      },
    ];

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
          // Rescheduled pill
          {
            type: 'div',
            props: {
              style: { display: 'flex' },
              children: {
                type: 'div',
                props: {
                  style: { display: 'flex', padding: '10px 26px', borderRadius: '999px', background: accentColor },
                  children: {
                    type: 'span',
                    props: {
                      style: { fontSize: '24px', fontWeight: 700, color: pillText, letterSpacing: '0.12em', textTransform: 'uppercase' },
                      children: 'Rescheduled',
                    },
                  },
                },
              },
            },
          },
          // Event name and dates
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: `${titleSize}px`, fontWeight: 700, color: textColor, lineHeight: 1.1, letterSpacing: '-0.03em' },
                    children: title,
                  },
                },
                { type: 'div', props: { style: { display: 'flex', alignItems: 'center', marginTop: '36px' }, children: dates } },
              ],
            },
          },
          // Note
          ...(note
            ? [{ type: 'span', props: { style: { fontSize: '28px', fontWeight: 500, color: noteColor, lineHeight: 1.3 }, children: note } }]
            : []),
        ],
      },
    };
  },
};

export default template;
