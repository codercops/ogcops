import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-feature-spotlight',
  name: 'Feature Spotlight',
  category: 'saas',
  description: 'Single feature highlighted with large icon, title and description',
  tags: ['feature', 'spotlight', 'saas', 'single', 'focused'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'featureIcon', label: 'Icon Symbol', type: 'text', defaultValue: '\u26A1', placeholder: 'Emoji or symbol', group: 'Content' },
    { key: 'featureLabel', label: 'Feature Label', type: 'text', defaultValue: 'NEW FEATURE', placeholder: 'Label above title', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Instant Collaboration',
    description: 'Work together in real-time with your entire team. See changes as they happen with zero lag.',
    featureIcon: '\u26A1',
    featureLabel: 'NEW FEATURE',
    siteName: '',
    bgColor: '#09090b',
    accentColor: '#3b82f6',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Instant Collaboration'), 50);
    const description = params.description ? truncate(String(params.description), 150) : '';
    const featureIcon = String(params.featureIcon || '\u26A1');
    const featureLabel = String(params.featureLabel || 'NEW FEATURE');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#09090b');
    const accentColor = String(params.accentColor || '#3b82f6');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 56 },
      { maxLen: 35, size: 46 },
      { maxLen: 50, size: 38 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Background glow
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '50px',
                left: '80px',
                width: '300px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Left: icon area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '360px',
                height: '630px',
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '160px',
                    height: '160px',
                    borderRadius: '32px',
                    background: `linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}08 100%)`,
                    border: `1px solid ${accentColor}33`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: { fontSize: '72px' },
                      children: featureIcon,
                    },
                  },
                },
              },
            },
          },
          // Right: text content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px 60px 60px 0',
              },
              children: [
                // Feature label
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignSelf: 'flex-start',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      background: `${accentColor}18`,
                      marginBottom: '20px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '12px',
                          fontWeight: 700,
                          color: accentColor,
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                        },
                        children: featureLabel,
                      },
                    },
                  },
                },
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.15,
                      margin: 0,
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
                            fontSize: '18px',
                            color: `${textColor}77`,
                            lineHeight: 1.6,
                            margin: 0,
                            marginTop: '16px',
                            maxWidth: '600px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Site name
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '13px', color: `${textColor}44`, marginTop: '32px' },
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
