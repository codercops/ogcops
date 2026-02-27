import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'ecommerce-brand-story',
  name: 'Brand Story',
  category: 'ecommerce',
  description: 'Brand name large with tagline and showcase area',
  tags: ['ecommerce', 'brand', 'story', 'hero'],
  fields: [
    commonFields.title,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: 'Crafted for those who demand excellence.', placeholder: 'Brand tagline', group: 'Content' },
    { key: 'established', label: 'Established', type: 'text', defaultValue: 'Est. 2020', placeholder: 'Est. 2020', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'AURORA',
    tagline: 'Crafted for those who demand excellence.',
    established: 'Est. 2020',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'AURORA'), 30);
    const tagline = String(params.tagline || '');
    const established = String(params.established || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 8, size: 120 },
      { maxLen: 15, size: 80 },
      { maxLen: 25, size: 60 },
      { maxLen: 35, size: 48 },
    ]);

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
          // Left: Brand info
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '650px',
                padding: '60px 80px',
              },
              children: [
                ...(established
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '14px',
                            fontWeight: 500,
                            color: `${textColor}55`,
                            letterSpacing: '0.2em',
                            textTransform: 'uppercase' as const,
                            marginBottom: '24px',
                          },
                          children: established,
                        },
                      },
                    ]
                  : []),
                // Brand name
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 900,
                      color: textColor,
                      lineHeight: 1,
                      margin: 0,
                      marginBottom: '24px',
                      letterSpacing: '0.05em',
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
                      width: '60px',
                      height: '3px',
                      backgroundColor: accentColor,
                      marginBottom: '24px',
                    },
                    children: [],
                  },
                },
                // Tagline
                ...(tagline
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 300,
                            color: `${textColor}AA`,
                            lineHeight: 1.5,
                            margin: 0,
                            maxWidth: '450px',
                          },
                          children: tagline,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: Showcase area
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                background: `linear-gradient(135deg, ${accentColor}11 0%, ${accentColor}22 100%)`,
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '250px',
                    height: '250px',
                    borderRadius: '50%',
                    border: `2px solid ${accentColor}33`,
                  },
                  children: {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '14px',
                        color: `${textColor}33`,
                      },
                      children: 'Showcase',
                    },
                  },
                },
              },
            },
          },
        ],
      },
    };
  },
};

export default template;
