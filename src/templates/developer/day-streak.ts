import type { SatoriElement, TemplateDefinition } from '../types';
import { isLightColor, mixColors, truncate, commonFields } from '../utils';

const DEFAULT_CURRENT_DAY = 42;
const DEFAULT_TOTAL_DAYS = 100;

const parseDayNumber = (value: unknown, fallback: number): number => {
  if (value === undefined || value === null || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number) : fallback;
};

const cell = (backgroundColor: string, border: string): SatoriElement => ({
  type: 'div',
  props: {
    style: {
      display: 'flex',
      width: '18px',
      height: '18px',
      borderRadius: '5px',
      backgroundColor,
      border,
      boxSizing: 'border-box',
    },
    children: '',
  },
});

const template: TemplateDefinition = {
  id: 'developer-day-streak',
  name: 'Day Streak',
  category: 'developer',
  description: 'Progress card for sharing a 100-day challenge or learning streak',
  tags: ['developer', 'streak', 'challenge', 'progress', '100 days'],
  fields: [
    commonFields.title,
    commonFields.author,
    { key: 'currentDay', label: 'Current Day', type: 'number', defaultValue: DEFAULT_CURRENT_DAY, min: 1, max: 100, group: 'Content' },
    { key: 'totalDays', label: 'Total Days', type: 'number', defaultValue: DEFAULT_TOTAL_DAYS, min: 1, max: 100, group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: '100 Days of AI Engineering',
    author: '',
    currentDay: DEFAULT_CURRENT_DAY,
    totalDays: DEFAULT_TOTAL_DAYS,
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || '100 Days of AI Engineering'), 48);
    const author = params.author ? truncate(String(params.author), 36) : '';
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const accentTextColor = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const textColor = String(params.textColor || '#FFFFFF');
    const totalDays = Math.min(100, Math.max(1, parseDayNumber(params.totalDays, DEFAULT_TOTAL_DAYS)));
    const currentDay = Math.min(totalDays, Math.max(1, parseDayNumber(params.currentDay, DEFAULT_CURRENT_DAY)));

    const rows = Array.from({ length: Math.ceil(totalDays / 10) }, (_, rowIndex) => ({
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'row', gap: '7px' },
        children: Array.from({ length: Math.min(10, totalDays - rowIndex * 10) }, (_, columnIndex) => {
          const day = rowIndex * 10 + columnIndex + 1;
          if (day > totalDays) return cell('transparent', '1px solid transparent');
          const isCurrent = day === currentDay;
          const isComplete = day <= currentDay;
          return cell(
            isComplete ? accentColor : `${accentColor}18`,
            isCurrent ? `3px solid ${textColor}` : `1px solid ${accentColor}66`,
          );
        }),
      },
    }));

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          padding: '64px 72px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          color: textColor,
          fontFamily: 'Inter, sans-serif',
          alignItems: 'center',
          gap: '72px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
              children: [
                { type: 'span', props: { style: { fontSize: '20px', color: accentTextColor, fontWeight: 700 }, children: 'THE CHALLENGE' } },
                { type: 'h1', props: { style: { fontSize: title.length > 32 ? '38px' : '46px', lineHeight: 1.15, margin: '18px 0 34px', color: textColor }, children: title } },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'baseline', gap: '14px' },
                    children: [
                      { type: 'span', props: { style: { fontSize: '88px', lineHeight: 1, fontWeight: 800, color: accentTextColor }, children: `Day ${currentDay}` } },
                      { type: 'span', props: { style: { fontSize: '24px', color: `${textColor}88` }, children: `of ${totalDays}` } },
                    ],
                  },
                },
                ...(author ? [{ type: 'span', props: { style: { marginTop: '26px', fontSize: '20px', color: `${textColor}aa` }, children: author } }] : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '7px', justifyContent: 'center', alignItems: 'flex-start' },
              children: rows,
            },
          },
        ],
      },
    };
  },
};

export default template;
