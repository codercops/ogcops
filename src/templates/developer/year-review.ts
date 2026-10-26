import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, mixColors, isLightColor, commonFields } from '../utils';

const MAX_STATS = 3;
const CONTENT_WIDTH = 1040;
const GAP = 24;
const CARD_PADDING = 28;
// Capitals are wider than lowercase letters, so size the values for a generous character width.
const VALUE_CHAR_WIDTH = 0.75;

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'developer-year-review',
  name: 'Year in Review',
  category: 'developer',
  description: 'A "my year in code" card with the year, a name, three big stats and an optional highlight',
  tags: ['developer', 'year in review', 'stats', 'wrapped', 'recap'],
  fields: [
    { key: 'name', label: 'Name', type: 'text', defaultValue: 'Alex Rivera', placeholder: 'Your name', group: 'Content' },
    { key: 'year', label: 'Year', type: 'text', defaultValue: '2026', placeholder: '2026', group: 'Content' },
    { key: 'stat1Value', label: 'Stat 1 Value', type: 'text', defaultValue: '1,248', placeholder: '1,248', group: 'Content' },
    { key: 'stat1Label', label: 'Stat 1 Label', type: 'text', defaultValue: 'commits', placeholder: 'commits', group: 'Content' },
    { key: 'stat2Value', label: 'Stat 2 Value', type: 'text', defaultValue: '86', placeholder: '86', group: 'Content' },
    { key: 'stat2Label', label: 'Stat 2 Label', type: 'text', defaultValue: 'pull requests', placeholder: 'pull requests', group: 'Content' },
    { key: 'stat3Value', label: 'Stat 3 Value', type: 'text', defaultValue: 'TypeScript', placeholder: 'TypeScript', group: 'Content' },
    { key: 'stat3Label', label: 'Stat 3 Label', type: 'text', defaultValue: 'top language', placeholder: 'top language', group: 'Content' },
    { key: 'highlight', label: 'Highlight', type: 'text', defaultValue: 'Shipped my first open source library', placeholder: 'Optional, one line about the year', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Alex Rivera',
    year: '2026',
    stat1Value: '1,248',
    stat1Label: 'commits',
    stat2Value: '86',
    stat2Label: 'pull requests',
    stat3Value: 'TypeScript',
    stat3Label: 'top language',
    highlight: 'Shipped my first open source library',
    bgColor: '#0b0f1a',
    accentColor: '#34d399',
    textColor: '#f1f5f9',
  },
  render: (params) => {
    const name = cleanText(params.name, 26);
    const year = cleanText(params.year, 10) || '2026';
    const highlight = cleanText(params.highlight, 80);
    const bgColor = String(params.bgColor || '#0b0f1a');
    const accentColor = String(params.accentColor || '#34d399');
    const textColor = String(params.textColor || '#f1f5f9');

    // A stat with no value is left out, and the others share the row.
    const stats = Array.from({ length: MAX_STATS }, (_, i) => ({
      value: cleanText(params[`stat${i + 1}Value`], 14),
      label: cleanText(params[`stat${i + 1}Label`], 28),
    })).filter((stat) => stat.value);

    // One size for every value, so the cards read as a set: the largest that fits the longest.
    const innerWidth = (CONTENT_WIDTH - GAP * (stats.length - 1)) / Math.max(stats.length, 1) - CARD_PADDING * 2;
    const longest = Math.max(1, ...stats.map((stat) => stat.value.length));
    const valueSize = Math.max(28, Math.min(84, Math.floor(innerWidth / (longest * VALUE_CHAR_WIDTH))));
    const yearSize = year.length <= 4 ? 150 : year.length <= 6 ? 110 : 76;

    // Neutral colors are mixed from the background and text colors, so the card reads the
    // same on dark and on light backgrounds.
    const lightBg = isLightColor(bgColor);
    const panelBg = mixColors(bgColor, textColor, lightBg ? 0.04 : 0.07);
    const panelBorder = mixColors(bgColor, textColor, 0.2);
    const labelColor = mixColors(bgColor, textColor, 0.72);
    // An accent as light as the background (or as dark as it) is hard to read as text, so
    // pull it toward the text color. Otherwise it reads as it is.
    const accentText = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;

    const card = (stat: { value: string; label: string }): SatoriElement => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          padding: `28px ${CARD_PADDING}px`,
          background: panelBg,
          border: `1px solid ${panelBorder}`,
          borderRadius: '20px',
        },
        children: [
          {
            type: 'span',
            props: {
              style: { fontSize: `${valueSize}px`, fontWeight: 700, color: accentText, lineHeight: 1.1, letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
              children: stat.value,
            },
          },
          ...(stat.label
            ? [{ type: 'span', props: { style: { marginTop: '10px', fontSize: '24px', fontWeight: 500, color: labelColor, lineHeight: 1.25 }, children: stat.label } }]
            : []),
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
          padding: '56px 80px',
        },
        children: [
          // The year, large, with the name next to it
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'flex-end' },
              children: [
                { type: 'span', props: { style: { flexShrink: 0, fontSize: `${yearSize}px`, fontWeight: 700, color: accentText, lineHeight: 1, letterSpacing: '-0.04em' }, children: year } },
                ...(name
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { marginLeft: '36px', marginBottom: '14px', fontSize: '44px', fontWeight: 600, color: textColor, lineHeight: 1.15 },
                          children: name,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Spacer above the stats
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // The stats, sharing the row
          ...(stats.length
            ? [{ type: 'div', props: { style: { display: 'flex', gap: `${GAP}px` }, children: stats.map(card) } }]
            : []),
          // Spacer below the stats
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Highlight
          ...(highlight
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center' },
                    children: [
                      { type: 'div', props: { style: { display: 'flex', width: '6px', height: '36px', borderRadius: '3px', background: accentColor, marginRight: '20px', flexShrink: 0 }, children: [] } },
                      { type: 'span', props: { style: { fontSize: '30px', fontWeight: 500, color: textColor, lineHeight: 1.25 }, children: highlight } },
                    ],
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
