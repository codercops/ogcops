import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-gradient-mesh',
  name: 'Gradient Mesh',
  category: 'saas',
  description: 'Multi-color gradient mesh background with clean overlaid text',
  tags: ['gradient', 'mesh', 'colorful', 'saas', 'vibrant'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.siteName,
    { key: 'color1', label: 'Color 1', type: 'color', defaultValue: '#6366f1', group: 'Style' },
    { key: 'color2', label: 'Color 2', type: 'color', defaultValue: '#ec4899', group: 'Style' },
    { key: 'color3', label: 'Color 3', type: 'color', defaultValue: '#06b6d4', group: 'Style' },
    commonFields.textColor,
  ],
  defaults: {
    title: 'Build Something Amazing',
    description: 'The modern platform for teams that move fast.',
    siteName: '',
    color1: '#6366f1',
    color2: '#ec4899',
    color3: '#06b6d4',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Build Something Amazing'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const siteName = String(params.siteName || '');
    const color1 = String(params.color1 || '#6366f1');
    const color2 = String(params.color2 || '#ec4899');
    const color3 = String(params.color3 || '#06b6d4');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 72 },
      { maxLen: 40, size: 58 },
      { maxLen: 60, size: 46 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: '#0a0a12',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Mesh orb 1 - top left
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-80px',
                left: '-40px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color1}66 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Mesh orb 2 - center right
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '100px',
                right: '-100px',
                width: '450px',
                height: '450px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color2}55 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Mesh orb 3 - bottom center
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                bottom: '-120px',
                left: '300px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${color3}55 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Content overlay
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1,
                padding: '60px',
              },
              children: [
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 900,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      textAlign: 'center',
                      maxWidth: '1000px',
                    },
                    children: title,
                  },
                },
                // Description
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '22px',
                            color: `${textColor}88`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginTop: '20px',
                            textAlign: 'center',
                            maxWidth: '700px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Divider dots
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      gap: '8px',
                      marginTop: '36px',
                    },
                    children: [
                      { type: 'div', props: { style: { display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: color1 } } },
                      { type: 'div', props: { style: { display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: color2 } } },
                      { type: 'div', props: { style: { display: 'flex', width: '8px', height: '8px', borderRadius: '50%', background: color3 } } },
                    ],
                  },
                },
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44`, marginTop: '24px' },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
