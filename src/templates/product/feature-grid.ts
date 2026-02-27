import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-feature-grid',
  name: 'Feature Grid',
  category: 'product',
  description: '2x2 feature grid with icons, tagline and product name',
  tags: ['features', 'grid', 'product', 'icons', 'organized'],
  fields: [
    commonFields.title,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Everything you need', group: 'Content' },
    { key: 'feature1', label: 'Feature 1', type: 'text', defaultValue: 'Lightning Fast', placeholder: 'Feature name', group: 'Content' },
    { key: 'feature2', label: 'Feature 2', type: 'text', defaultValue: 'Secure by Default', placeholder: 'Feature name', group: 'Content' },
    { key: 'feature3', label: 'Feature 3', type: 'text', defaultValue: 'Easy Integration', placeholder: 'Feature name', group: 'Content' },
    { key: 'feature4', label: 'Feature 4', type: 'text', defaultValue: 'Real-time Sync', placeholder: 'Feature name', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Product',
    tagline: 'Everything you need',
    feature1: 'Lightning Fast',
    feature2: 'Secure by Default',
    feature3: 'Easy Integration',
    feature4: 'Real-time Sync',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#06b6d4',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product'), 40);
    const tagline = String(params.tagline || '');
    const features = [
      String(params.feature1 || 'Lightning Fast'),
      String(params.feature2 || 'Secure by Default'),
      String(params.feature3 || 'Easy Integration'),
      String(params.feature4 || 'Real-time Sync'),
    ];
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#06b6d4');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 52 },
      { maxLen: 30, size: 44 },
      { maxLen: 40, size: 36 },
    ]);

    const featureIcons = ['///', '***', '< >', ':::'];

    const featureCard = (name: string, icon: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '240px',
          padding: '24px',
          borderRadius: '16px',
          background: `${accentColor}08`,
          border: `1px solid ${accentColor}22`,
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${accentColor}20`,
                marginBottom: '14px',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '14px',
                    fontFamily: 'JetBrains Mono, monospace',
                    color: accentColor,
                    fontWeight: 700,
                  },
                  children: icon,
                },
              },
            },
          },
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                fontWeight: 600,
                color: textColor,
              },
              children: truncate(name, 24),
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
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: title + tagline
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '540px',
                padding: '60px',
              },
              children: [
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            marginBottom: '16px',
                          },
                          children: tagline,
                        },
                      },
                    ]
                  : []),
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
                // Accent line
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '48px',
                      height: '4px',
                      background: accentColor,
                      borderRadius: '2px',
                      marginTop: '24px',
                    },
                    children: [],
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
          // Right: 2x2 grid
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                width: '660px',
                gap: '16px',
                padding: '40px',
              },
              children: features.map((f, i) => featureCard(f, featureIcons[i])),
            },
          },
        ],
      },
    };
  },
};

export default template;
