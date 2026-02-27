import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-curated-links',
  name: 'Curated Links',
  category: 'newsletter',
  description: '"This Week\'s Picks" with curated link items',
  tags: ['newsletter', 'curated', 'links', 'picks'],
  fields: [
    commonFields.title,
    { key: 'link1', label: 'Link 1', type: 'text', defaultValue: 'Why SQLite Is Taking Over', placeholder: 'Link title', group: 'Content' },
    { key: 'link2', label: 'Link 2', type: 'text', defaultValue: 'The State of CSS in 2026', placeholder: 'Link title', group: 'Content' },
    { key: 'link3', label: 'Link 3', type: 'text', defaultValue: 'Building with Edge Functions', placeholder: 'Link title', group: 'Content' },
    { key: 'link4', label: 'Link 4', type: 'text', defaultValue: 'Rust for Web Developers', placeholder: 'Link title', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: "This Week's Picks",
    link1: 'Why SQLite Is Taking Over',
    link2: 'The State of CSS in 2026',
    link3: 'Building with Edge Functions',
    link4: 'Rust for Web Developers',
    siteName: 'Dev Links Weekly',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || "This Week's Picks"), 50);
    const links = [
      String(params.link1 || ''),
      String(params.link2 || ''),
      String(params.link3 || ''),
      String(params.link4 || ''),
    ].filter(Boolean);
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

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
                marginBottom: '48px',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '48px',
                      fontWeight: 800,
                      color: textColor,
                      margin: 0,
                    },
                    children: title,
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 500,
                            color: `${textColor}66`,
                          },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Links list
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                gap: '0px',
              },
              children: links.map((link, i) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 0',
                    borderBottom: i < links.length - 1 ? `1px solid ${textColor}1A` : 'none',
                    gap: '20px',
                  },
                  children: [
                    // Number
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '20px',
                          fontWeight: 700,
                          color: accentColor,
                          fontFamily: 'JetBrains Mono, monospace',
                          width: '40px',
                        },
                        children: `0${i + 1}`,
                      },
                    },
                    // Arrow
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          color: accentColor,
                        },
                        children: '\u2192',
                      },
                    },
                    // Link text
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '24px',
                          fontWeight: 500,
                          color: `${textColor}DD`,
                        },
                        children: truncate(link, 50),
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
