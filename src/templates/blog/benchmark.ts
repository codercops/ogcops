import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

type BenchmarkRow = { name: string; value: number };

const template: TemplateDefinition = {
  id: 'blog-benchmark',
  name: 'Benchmark',
  category: 'blog',
  description: 'Compare performance or size measurements with scaled horizontal bars',
  tags: ['blog', 'benchmark', 'performance', 'comparison', 'stats'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'name1', label: 'Name 1', type: 'text', defaultValue: 'Bun', placeholder: 'Bun', group: 'Content' },
    { key: 'value1', label: 'Value 1', type: 'number', defaultValue: 112000, placeholder: '112000', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'name2', label: 'Name 2', type: 'text', defaultValue: 'Deno', placeholder: 'Deno', group: 'Content' },
    { key: 'value2', label: 'Value 2', type: 'number', defaultValue: 71000, placeholder: '71000', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'name3', label: 'Name 3', type: 'text', defaultValue: 'Node', placeholder: 'Node', group: 'Content' },
    { key: 'value3', label: 'Value 3', type: 'number', defaultValue: 48000, placeholder: '48000', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'name4', label: 'Name 4', type: 'text', defaultValue: '', placeholder: 'Optional comparison', group: 'Content' },
    { key: 'value4', label: 'Value 4', type: 'number', defaultValue: '', placeholder: 'Optional value', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'unit', label: 'Unit', type: 'text', defaultValue: 'req/s', placeholder: 'req/s', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Bun vs Deno vs Node: HTTP throughput',
    description: 'Requests per second, higher is better',
    name1: 'Bun', value1: 112000,
    name2: 'Deno', value2: 71000,
    name3: 'Node', value3: 48000,
    name4: '', value4: '',
    unit: 'req/s',
    siteName: 'codercops.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? template.defaults.title).replace(/\s+/g, ' ').trim();
    const title = truncate(rawTitle || String(template.defaults.title), 120);
    const titleSize = autoFontSize(title, [
      { maxLen: 36, size: 46 },
      { maxLen: 60, size: 40 },
      { maxLen: 90, size: 34 },
      { maxLen: 120, size: 28 },
    ]);
    const rawDescription = String(params.description ?? '').replace(/\s+/g, ' ').trim();
    const description = truncate(rawDescription, 120);
    const descriptionSize = autoFontSize(description, [
      { maxLen: 40, size: 20 },
      { maxLen: 75, size: 18 },
      { maxLen: 120, size: 15 },
    ]);
    const rows: BenchmarkRow[] = [1, 2, 3, 4].flatMap((index) => {
      const name = String(params[`name${index}`] ?? '').replace(/\s+/g, ' ').trim();
      const rawValue = params[`value${index}`];
      if (!name || rawValue === undefined || rawValue === null || String(rawValue).trim() === '') return [];

      const value = Number(rawValue);
      return Number.isFinite(value) && value >= 0 ? [{ name: truncate(name, 80), value }] : [];
    });
    const maxValue = rows.reduce((max, row) => Math.max(max, row.value), 0);
    const largestIndex = rows.findIndex(({ value }) => value === maxValue);
    const unit = String(params.unit ?? 'req/s').replace(/\s+/g, ' ').trim();
    const valueLabels = rows.map(({ value }) => {
      const formattedValue = new Intl.NumberFormat('en-US', { maximumFractionDigits: 3 }).format(value);
      return `${formattedValue}${unit ? ` ${unit}` : ''}`;
    });
    const longestValueLabel = valueLabels.reduce((longest, label) =>
      label.length > longest.length ? label : longest, '');
    const displayLongestValueLabel = truncate(longestValueLabel, 36);
    const valueSize = autoFontSize(displayLongestValueLabel, [
      { maxLen: 18, size: 20 },
      { maxLen: 26, size: 17 },
      { maxLen: 36, size: 14 },
    ]);
    const valueColumnWidth = Math.min(360, Math.max(220, Math.ceil(displayLongestValueLabel.length * valueSize * 0.9 + 12)));
    const siteName = String(params.siteName ?? '').replace(/\s+/g, ' ').trim();
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const foregroundColor = lightBg && isLightColor(textColor) ? '#111111' : textColor;
    const mutedText = mixColors(bgColor, foregroundColor, lightBg ? 0.68 : 0.62);
    const trackColor = mixColors(bgColor, foregroundColor, lightBg ? 0.13 : 0.2);

    const rowElements: SatoriElement[] = rows.map(({ name, value }, index) => {
      const nameSize = autoFontSize(name, [
        { maxLen: 16, size: 22 },
        { maxLen: 28, size: 19 },
        { maxLen: 48, size: 16 },
        { maxLen: 80, size: 14 },
      ]);
      const fillColor = index === largestIndex ? accentInk : mixColors(bgColor, foregroundColor, lightBg ? 0.3 : 0.36);
      const width = maxValue > 0 ? (value / maxValue) * 100 : 0;
      const displayValue = truncate(valueLabels[index], 36);

      return {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: '22px', width: '100%', minHeight: '68px' },
          children: [
            {
              type: 'span',
              props: {
                style: {
                  display: 'flex', flexShrink: 0, width: '190px', minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontSize: `${nameSize}px`, fontWeight: 600, color: foregroundColor,
                },
                children: name,
              },
            },
            {
              type: 'div',
              props: {
                style: { display: 'flex', flex: 1, minWidth: 0, height: '16px', overflow: 'hidden', borderRadius: '999px', backgroundColor: trackColor },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: { display: 'flex', width: `${width}%`, height: '100%', borderRadius: '999px', backgroundColor: fillColor },
                      children: [],
                    },
                  },
                ],
              },
            },
            {
              type: 'span',
              props: {
                style: {
                  display: 'flex', justifyContent: 'flex-end', flexShrink: 0, width: `${valueColumnWidth}px`, minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontSize: `${valueSize}px`, fontWeight: 700, color: foregroundColor,
                },
                children: displayValue,
              },
            },
          ],
        },
      };
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', flexDirection: 'column', width: '1200px', height: '630px',
          boxSizing: 'border-box', padding: '52px 64px 42px', backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignSelf: 'flex-start', padding: '8px 16px', marginBottom: '18px', borderRadius: '999px', backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.17), border: `1px solid ${accentInk}66` },
              children: {
                type: 'span',
                props: { style: { display: 'flex', color: accentInk, fontSize: '14px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }, children: 'Benchmark' },
              },
            },
          },
          {
            type: 'h1',
            props: {
              style: { display: 'flex', width: '100%', margin: 0, color: foregroundColor, fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.18, letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
              children: title,
            },
          },
          ...(description ? [{
            type: 'span',
            props: {
              style: { display: 'flex', marginTop: '10px', color: mutedText, fontSize: `${descriptionSize}px`, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
              children: description,
            },
          }] : []),
          ...(rowElements.length ? [{
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', width: '100%', gap: '14px', marginTop: 'auto', marginBottom: 'auto' },
              children: rowElements,
            },
          }] : []),
          ...(siteName ? [{
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '14px', borderTop: `1px solid ${trackColor}` },
              children: { type: 'span', props: { style: { display: 'flex', fontSize: '16px', fontWeight: 600, color: mutedText }, children: truncate(siteName, 48) } },
            },
          }] : []),
        ],
      },
    };
  },
};

export default template;
