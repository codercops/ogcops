import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-prerequisites',
  name: 'Prerequisites',
  category: 'tutorial',
  description: 'A "before you start" card for the top of a tutorial, with a short checklist and a time estimate',
  tags: ['tutorial', 'prerequisites', 'checklist', 'course', 'education'],
  fields: [
    commonFields.title,
    { key: 'item1', label: 'Prerequisite 1', type: 'text', defaultValue: 'Node 20 or newer', placeholder: 'Node 20 or newer', group: 'Content' },
    { key: 'item2', label: 'Prerequisite 2', type: 'text', defaultValue: 'Basic TypeScript', placeholder: 'Basic TypeScript', group: 'Content' },
    { key: 'item3', label: 'Prerequisite 3', type: 'text', defaultValue: 'A free Cloudflare account', placeholder: 'A free Cloudflare account', group: 'Content' },
    { key: 'duration', label: 'Time Estimate', type: 'text', defaultValue: 'About 45 minutes', placeholder: 'About 45 minutes', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Build a REST API with Hono',
    item1: 'Node 20 or newer',
    item2: 'Basic TypeScript',
    item3: 'A free Cloudflare account',
    duration: 'About 45 minutes',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Build a REST API with Hono').trim(), 70);
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 48, size: 44 },
      { maxLen: 70, size: 36 },
    ]);
    const items = [params.item1, params.item2, params.item3]
      .map((item) => truncate(String(item || '').trim(), 72))
      .filter(Boolean);
    const duration = truncate(String(params.duration || '').trim(), 40);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const rows = items.map((item) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          padding: '18px 24px',
          borderRadius: '16px',
          border: `1px solid ${textColor}1A`,
          backgroundColor: `${textColor}08`,
          gap: '18px',
        },
        children: [
          {
            type: 'svg',
            props: {
              width: 30,
              height: 30,
              viewBox: '0 0 30 30',
              style: { flexShrink: 0 },
              children: [
                {
                  type: 'circle',
                  props: {
                    cx: 15,
                    cy: 15,
                    r: 13,
                    fill: 'none',
                    stroke: accentInk,
                    strokeWidth: 2,
                  },
                },
                {
                  type: 'path',
                  props: {
                    d: 'm9 15 4 4 8-8',
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
                fontSize: '24px',
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.3,
                overflowWrap: 'anywhere',
              },
              children: item,
            },
          },
        ],
      },
    }));

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
          padding: '60px 64px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignSelf: 'flex-start',
                padding: '7px 18px',
                borderRadius: '100px',
                border: `1px solid ${accentInk}44`,
                backgroundColor: `${accentInk}1A`,
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '17px',
                    fontWeight: 700,
                    color: accentInk,
                    letterSpacing: '0.02em',
                  },
                  children: 'Before you start',
                },
              },
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                marginTop: '22px',
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
                    gap: '14px',
                    marginTop: '32px',
                  },
                  children: rows,
                },
              }]
            : []),
          ...(duration
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignSelf: 'flex-start',
                    marginTop: 'auto',
                    paddingTop: '18px',
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '20px',
                        fontWeight: 500,
                        color: `${textColor}B3`,
                      },
                      children: duration,
                    },
                  },
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
