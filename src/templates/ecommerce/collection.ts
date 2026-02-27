import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-collection',
  name: 'Collection',
  category: 'ecommerce',
  description: 'Collection name with 3 product placeholder squares',
  tags: ['ecommerce', 'collection', 'catalog', 'grid'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'itemCount', label: 'Item Count', type: 'text', defaultValue: '24 items', placeholder: '24 items', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Winter Collection 2026',
    description: 'Discover our curated selection of premium winter essentials.',
    itemCount: '24 items',
    siteName: 'StyleHouse',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Winter Collection 2026'), 50);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const itemCount = String(params.itemCount || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 55, size: 36 },
      { maxLen: 70, size: 30 },
    ]);

    const placeholders = [0, 1, 2].map((i) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '180px',
          height: '220px',
          backgroundColor: `${accentColor}${['15', '22', '10'][i]}`,
          borderRadius: '12px',
          border: `1px solid ${accentColor}33`,
        },
        children: {
          type: 'span',
          props: {
            style: { fontSize: '14px', color: `${textColor}33` },
            children: `${i + 1}`,
          },
        },
      },
    }));

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left content
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
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 600,
                            color: accentColor,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase' as const,
                            marginBottom: '20px',
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      marginBottom: '16px',
                    },
                    children: title,
                  },
                },
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '18px',
                            color: `${textColor}80`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginBottom: '24px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                ...(itemCount
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '8px 16px',
                            backgroundColor: `${accentColor}22`,
                            borderRadius: '100px',
                            alignSelf: 'flex-start',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: accentColor,
                              },
                              children: itemCount,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: product placeholders
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                gap: '16px',
                padding: '40px',
              },
              children: placeholders,
            },
          },
        ],
      },
    };
  },
};

export default template;
