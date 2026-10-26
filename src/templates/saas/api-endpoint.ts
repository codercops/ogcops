import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const METHODS = {
  GET: '#86efac',
  POST: '#93c5fd',
  PUT: '#fcd34d',
  PATCH: '#fcd34d',
  DELETE: '#fca5a5',
};

const template: TemplateDefinition = {
  id: 'saas-api-endpoint',
  name: 'API Endpoint',
  category: 'saas',
  description: 'Announce an API endpoint with its HTTP method, path and example response',
  tags: ['saas', 'api', 'endpoint', 'http', 'docs', 'changelog'],
  fields: [
    commonFields.siteName,
    {
      key: 'method', label: 'HTTP Method', type: 'select', defaultValue: 'GET',
      options: Object.keys(METHODS).map((method) => ({ label: method, value: method })),
      group: 'Content',
    },
    {
      key: 'path', label: 'Endpoint Path', type: 'text', defaultValue: '/v1/invoices/{id}',
      placeholder: '/v1/invoices/{id}', required: true, group: 'Content',
    },
    commonFields.description,
    {
      key: 'responseStatus', label: 'Response Status', type: 'text', defaultValue: '200 OK',
      placeholder: '200 OK', group: 'Content',
    },
    {
      key: 'responseExample', label: 'Response Example', type: 'text', defaultValue: '',
      placeholder: '{ "id": "inv_123", "status": "paid" }', group: 'Content',
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'Acme API',
    method: 'GET',
    path: '/v1/invoices/{id}',
    description: 'Retrieve an invoice and its payment details with one simple request.',
    responseStatus: '200 OK',
    responseExample: '',
    bgColor: '#0b1220',
    accentColor: '#60a5fa',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const siteName = truncate(String(params.siteName || 'Acme API'), 36);
    const rawMethod = String(params.method || 'GET').toUpperCase();
    const method = Object.hasOwn(METHODS, rawMethod) ? rawMethod as keyof typeof METHODS : 'GET';
    const path = truncate(String(params.path || '/v1/invoices/{id}'), 64);
    const description = truncate(String(params.description ?? ''), 84);
    const responseStatus = truncate(String(params.responseStatus ?? '200 OK').trim(), 40);
    const responseExample = truncate(String(params.responseExample ?? '').trim(), 72);
    const bgColor = String(params.bgColor || '#0b1220');
    const accentColor = String(params.accentColor || '#60a5fa');
    const accentTextColor = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const textColor = String(params.textColor || '#f8fafc');
    const pathSize = autoFontSize(path, [
      { maxLen: 26, size: 48 },
      { maxLen: 38, size: 36 },
      { maxLen: 50, size: 28 },
      { maxLen: 64, size: 22 },
    ]);
    const descriptionSize = autoFontSize(description, [
      { maxLen: 72, size: 28 },
      { maxLen: 84, size: 24 },
    ]);
    const nameSize = autoFontSize(siteName, [
      { maxLen: 24, size: 28 },
      { maxLen: 36, size: 24 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          width: '1200px', height: '630px', padding: '64px',
          background: bgColor, color: textColor, fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'span',
            props: { style: { fontSize: `${nameSize}px`, fontWeight: 600, color: accentTextColor }, children: siteName },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1, gap: '28px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', gap: '24px', width: '100%' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex', alignItems: 'center', padding: '14px 22px', borderRadius: '999px',
                            background: METHODS[method], color: '#0b1220', flexShrink: 0,
                            fontFamily: 'JetBrains Mono, monospace', fontSize: '28px', fontWeight: 700,
                          },
                          children: method,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontFamily: 'JetBrains Mono, monospace', fontSize: `${pathSize}px`,
                            fontWeight: 700, whiteSpace: 'nowrap',
                          },
                          children: path,
                        },
                      },
                    ],
                  },
                },
                ...(description ? [{
                  type: 'span',
                  props: {
                    style: { fontSize: `${descriptionSize}px`, lineHeight: 1.45, width: '1000px', wordBreak: 'break-word' },
                    children: description,
                  },
                }] : []),
              ],
            },
          },
          ...(responseStatus || responseExample ? [{
            type: 'div',
            props: {
              style: {
                display: 'flex', flexDirection: 'column', gap: '12px', padding: '24px 28px',
                background: mixColors(bgColor, textColor, 0.07), borderRadius: '12px',
                fontFamily: 'JetBrains Mono, monospace',
              },
              children: [
                ...(responseStatus ? [{
                  type: 'span', props: { style: { fontSize: '22px', fontWeight: 700 }, children: responseStatus },
                }] : []),
                ...(responseExample ? [{
                  type: 'span', props: { style: { fontSize: '22px' }, children: responseExample },
                }] : []),
              ],
            },
          }] : []),
        ],
      },
    };
  },
};

export default template;
