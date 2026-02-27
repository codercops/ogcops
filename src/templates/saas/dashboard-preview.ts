import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-dashboard-preview',
  name: 'Dashboard Preview',
  category: 'saas',
  description: 'Faux dashboard UI with metric cards and a headline overlay',
  tags: ['dashboard', 'metrics', 'saas', 'analytics', 'data'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'metric1Label', label: 'Metric 1 Label', type: 'text', defaultValue: 'Revenue', placeholder: 'Revenue, Users, etc.', group: 'Content' },
    { key: 'metric1Value', label: 'Metric 1 Value', type: 'text', defaultValue: '$48.2K', placeholder: '$48.2K', group: 'Content' },
    { key: 'metric2Label', label: 'Metric 2 Label', type: 'text', defaultValue: 'Growth', placeholder: 'Growth, Signups, etc.', group: 'Content' },
    { key: 'metric2Value', label: 'Metric 2 Value', type: 'text', defaultValue: '+24%', placeholder: '+24%', group: 'Content' },
    { key: 'metric3Label', label: 'Metric 3 Label', type: 'text', defaultValue: 'Users', placeholder: 'Users, Sales, etc.', group: 'Content' },
    { key: 'metric3Value', label: 'Metric 3 Value', type: 'text', defaultValue: '12.4K', placeholder: '12.4K', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your SaaS Dashboard',
    description: 'Real-time analytics at your fingertips.',
    metric1Label: 'Revenue',
    metric1Value: '$48.2K',
    metric2Label: 'Growth',
    metric2Value: '+24%',
    metric3Label: 'Users',
    metric3Value: '12.4K',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#3b82f6',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your SaaS Dashboard'), 50);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const metrics = [
      { label: String(params.metric1Label || 'Revenue'), value: String(params.metric1Value || '$48.2K') },
      { label: String(params.metric2Label || 'Growth'), value: String(params.metric2Value || '+24%') },
      { label: String(params.metric3Label || 'Users'), value: String(params.metric3Value || '12.4K') },
    ];
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#3b82f6');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 48 },
      { maxLen: 40, size: 40 },
      { maxLen: 50, size: 34 },
    ]);

    const metricCard = (label: string, value: string, index: number) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '20px 24px',
          borderRadius: '12px',
          background: `${textColor}08`,
          border: `1px solid ${textColor}12`,
        },
        children: [
          {
            type: 'span',
            props: {
              style: {
                fontSize: '12px',
                fontWeight: 500,
                color: `${textColor}55`,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              },
              children: label,
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 700,
                color: index === 0 ? accentColor : textColor,
                fontFamily: 'JetBrains Mono, monospace',
              },
              children: value,
            },
          },
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
          padding: '48px',
        },
        children: [
          // Top: title + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                marginBottom: '12px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.15,
                      margin: 0,
                      maxWidth: '800px',
                    },
                    children: title,
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44`, marginTop: '8px' },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: `${textColor}66`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginBottom: '32px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Metric cards row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '16px',
                marginBottom: '24px',
              },
              children: metrics.map((m, i) => metricCard(m.label, m.value, i)),
            },
          },
          // Faux chart area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                borderRadius: '12px',
                background: `${textColor}05`,
                border: `1px solid ${textColor}10`,
                padding: '24px',
                alignItems: 'flex-end',
                gap: '12px',
              },
              children: [
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '40%', borderRadius: '4px 4px 0 0', background: `${accentColor}22` } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '65%', borderRadius: '4px 4px 0 0', background: `${accentColor}33` } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '45%', borderRadius: '4px 4px 0 0', background: `${accentColor}22` } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '80%', borderRadius: '4px 4px 0 0', background: `${accentColor}44` } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '55%', borderRadius: '4px 4px 0 0', background: `${accentColor}33` } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '70%', borderRadius: '4px 4px 0 0', background: `${accentColor}38` } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '90%', borderRadius: '4px 4px 0 0', background: accentColor } } },
                { type: 'div', props: { style: { display: 'flex', flex: 1, height: '75%', borderRadius: '4px 4px 0 0', background: `${accentColor}44` } } },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
