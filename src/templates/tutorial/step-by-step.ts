import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-step-by-step',
  name: 'Step by Step',
  category: 'tutorial',
  description: 'Numbered steps (1, 2, 3) with tutorial title',
  tags: ['tutorial', 'steps', 'numbered', 'guide'],
  fields: [
    commonFields.title,
    { key: 'step1', label: 'Step 1', type: 'text', defaultValue: 'Set Up Your Environment', placeholder: 'Step 1', group: 'Content' },
    { key: 'step2', label: 'Step 2', type: 'text', defaultValue: 'Build the Core Logic', placeholder: 'Step 2', group: 'Content' },
    { key: 'step3', label: 'Step 3', type: 'text', defaultValue: 'Deploy to Production', placeholder: 'Step 3', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Build a Real-time Chat App',
    step1: 'Set Up Your Environment',
    step2: 'Build the Core Logic',
    step3: 'Deploy to Production',
    siteName: 'DevTutorials',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Build a Real-time Chat App'), 60);
    const steps = [
      String(params.step1 || ''),
      String(params.step2 || ''),
      String(params.step3 || ''),
    ].filter(Boolean);
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 60, size: 36 },
      { maxLen: 80, size: 30 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Header
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      fontWeight: 600,
                      color: accentColor,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase' as const,
                    },
                    children: 'STEP-BY-STEP TUTORIAL',
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '16px', color: `${textColor}55` },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '48px',
              },
              children: title,
            },
          },
          // Steps
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '24px',
                flex: 1,
                alignItems: 'flex-end',
              },
              children: steps.map((step, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    padding: '24px',
                    backgroundColor: `${textColor}08`,
                    borderRadius: '12px',
                    borderTop: `3px solid ${accentColor}`,
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '40px',
                          fontWeight: 800,
                          color: `${accentColor}44`,
                          fontFamily: 'JetBrains Mono, monospace',
                          marginBottom: '12px',
                        },
                        children: `${i + 1}`,
                      },
                    },
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 500,
                          color: `${textColor}CC`,
                          lineHeight: 1.4,
                        },
                        children: truncate(step, 40),
                      },
                    },
                  ],
                },
              })),
            },
          },
        ],
      },
    };
  },
};

export default template;
