import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'job-benefits',
  name: 'Benefits',
  category: 'job',
  description: 'A hiring card that highlights the reasons people love working at a company',
  tags: ['job', 'hiring', 'benefits', 'perks', 'culture'],
  fields: [
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'Northstar', placeholder: 'Company name', group: 'Content' },
    commonFields.title,
    { key: 'perk1', label: 'Perk 1', type: 'text', defaultValue: 'Remote first', placeholder: 'A company benefit', group: 'Content' },
    { key: 'perk2', label: 'Perk 2', type: 'text', defaultValue: '$1,500 learning budget', placeholder: 'A company benefit', group: 'Content' },
    { key: 'perk3', label: 'Perk 3', type: 'text', defaultValue: '4-day weeks in August', placeholder: 'A company benefit', group: 'Content' },
    { key: 'perk4', label: 'Perk 4', type: 'text', defaultValue: 'Health cover for your family', placeholder: 'A company benefit', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    company: 'Northstar',
    title: 'Why people stay',
    perk1: 'Remote first',
    perk2: '$1,500 learning budget',
    perk3: '4-day weeks in August',
    perk4: 'Health cover for your family',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const company = truncate(String(params.company || '').trim(), 40);
    const title = truncate(String(params.title || 'Why people stay').trim(), 64);
    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 72 },
      { maxLen: 40, size: 60 },
      { maxLen: 64, size: 48 },
    ]);
    const perks = [params.perk1, params.perk2, params.perk3, params.perk4]
      .map((perk) => truncate(String(perk || '').trim(), 72))
      .filter(Boolean);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const rows = [];
    for (let index = 0; index < perks.length; index += 2) {
      rows.push({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'stretch',
            gap: '20px',
          },
          children: perks.slice(index, index + 2).map((perk) => ({
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                width: '48%',
                boxSizing: 'border-box',
                padding: '22px 24px',
                borderRadius: '18px',
                border: `1px solid ${textColor}1A`,
                backgroundColor: `${textColor}08`,
                gap: '18px',
              },
              children: [
                {
                  type: 'svg',
                  props: {
                    width: 34,
                    height: 34,
                    viewBox: '0 0 34 34',
                    style: { flexShrink: 0 },
                    children: [
                      {
                        type: 'circle',
                        props: {
                          cx: 17,
                          cy: 17,
                          r: 15,
                          fill: 'none',
                          stroke: accentInk,
                          strokeWidth: 2,
                        },
                      },
                      {
                        type: 'path',
                        props: {
                          d: 'm10 17 4.5 4.5L24 12',
                          fill: 'none',
                          stroke: accentInk,
                          strokeWidth: 2.5,
                          strokeLinecap: 'round',
                          strokeLinejoin: 'round',
                        },
                      },
                    ],
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: {
                      flex: 1,
                      minWidth: 0,
                      fontSize: '23px',
                      fontWeight: 600,
                      color: textColor,
                      lineHeight: 1.3,
                      overflowWrap: 'anywhere',
                    },
                    children: perk,
                  },
                },
              ],
            },
          })),
        },
      });
    }

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px',
        },
        children: [
          ...(company
            ? [{
                type: 'span',
                props: {
                  style: {
                    fontSize: '20px',
                    fontWeight: 700,
                    color: accentInk,
                    letterSpacing: '0.04em',
                    marginBottom: '20px',
                  },
                  children: company,
                },
              }]
            : []),
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                marginBottom: '42px',
              },
              children: title,
            },
          },
          ...(rows.length
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '18px',
                  },
                  children: rows,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
