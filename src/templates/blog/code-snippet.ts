import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-code-snippet',
  name: 'Code Snippet',
  category: 'blog',
  description: 'Faux code editor window with title bar dots, JetBrains Mono font, dark background',
  tags: ['code', 'editor', 'developer', 'dark', 'blog'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.category,
    commonFields.siteName,
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    description: '',
    author: '',
    category: '',
    siteName: '',
    accentColor: '#E07A5F',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 70);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const author = String(params.author || '');
    const category = String(params.category || '');
    const siteName = String(params.siteName || '');
    const accentColor = String(params.accentColor || '#E07A5F');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 36 },
      { maxLen: 45, size: 30 },
      { maxLen: 65, size: 24 },
      { maxLen: 100, size: 20 },
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
          background: 'linear-gradient(145deg, #0D1117 0%, #161B22 50%, #0D1117 100%)',
          fontFamily: 'JetBrains Mono, monospace',
          padding: '40px',
        },
        children: [
          // Site name above editor
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginBottom: '24px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 500,
                          color: '#8B949E',
                          letterSpacing: '0.05em',
                        },
                        children: siteName,
                      },
                    },
                  },
                },
              ]
            : []),
          // Editor window
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '1040px',
                borderRadius: '12px',
                border: '1px solid #30363D',
                overflow: 'hidden',
                background: '#0D1117',
              },
              children: [
                // Title bar with 3 dots
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      height: '48px',
                      padding: '0 20px',
                      background: '#161B22',
                      borderBottom: '1px solid #30363D',
                      gap: '8px',
                    },
                    children: [
                      // Red dot
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#FF5F57',
                          },
                          children: '',
                        },
                      },
                      // Yellow dot
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#FEBC2E',
                          },
                          children: '',
                        },
                      },
                      // Green dot
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: '#28C840',
                          },
                          children: '',
                        },
                      },
                      // File name tab
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            marginLeft: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '13px',
                                color: '#8B949E',
                              },
                              children: category ? `${category.toLowerCase().replace(/\s+/g, '-')}.md` : 'blog-post.md',
                            },
                          },
                        },
                      },
                    ],
                  },
                },
                // Code content area
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '36px 32px',
                      gap: '12px',
                    },
                    children: [
                      // Line: comment with category
                      ...(category
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', gap: '12px' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#484F58', minWidth: '32px', textAlign: 'right' },
                                      children: '1',
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#6A737D' },
                                      children: `// ${category}`,
                                    },
                                  },
                                ],
                              },
                            },
                          ]
                        : []),
                      // Line: title as string assignment
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', gap: '12px' },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', color: '#484F58', minWidth: '32px', textAlign: 'right' },
                                children: category ? '2' : '1',
                              },
                            },
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', flexWrap: 'wrap' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#FF7B72' },
                                      children: 'const ',
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#79C0FF' },
                                      children: 'title',
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#C9D1D9' },
                                      children: ' = ',
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#A5D6FF' },
                                      children: `"${title}"`,
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      // Blank line
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', gap: '12px', height: '24px' },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '16px', color: '#484F58', minWidth: '32px', textAlign: 'right' },
                              children: category ? '3' : '2',
                            },
                          },
                        },
                      },
                      // Description line
                      ...(description
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', gap: '12px' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#484F58', minWidth: '32px', textAlign: 'right' },
                                      children: category ? '4' : '3',
                                    },
                                  },
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '15px', color: '#6A737D', maxWidth: '900px' },
                                      children: `// ${description}`,
                                    },
                                  },
                                ],
                              },
                            },
                          ]
                        : []),
                      // Author line
                      ...(author
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: { display: 'flex', gap: '12px' },
                                children: [
                                  {
                                    type: 'span',
                                    props: {
                                      style: { fontSize: '16px', color: '#484F58', minWidth: '32px', textAlign: 'right' },
                                      children: category ? (description ? '5' : '4') : (description ? '4' : '3'),
                                    },
                                  },
                                  {
                                    type: 'div',
                                    props: {
                                      style: { display: 'flex' },
                                      children: [
                                        {
                                          type: 'span',
                                          props: {
                                            style: { fontSize: '16px', color: '#FF7B72' },
                                            children: 'const ',
                                          },
                                        },
                                        {
                                          type: 'span',
                                          props: {
                                            style: { fontSize: '16px', color: '#79C0FF' },
                                            children: 'author',
                                          },
                                        },
                                        {
                                          type: 'span',
                                          props: {
                                            style: { fontSize: '16px', color: '#C9D1D9' },
                                            children: ' = ',
                                          },
                                        },
                                        {
                                          type: 'span',
                                          props: {
                                            style: { fontSize: '16px', color: '#A5D6FF' },
                                            children: `"${author}"`,
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ],
            },
          },
          // Accent line below editor
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '120px',
                height: '3px',
                background: accentColor,
                borderRadius: '2px',
                marginTop: '24px',
              },
              children: '',
            },
          },
        ],
      },
    };
  },
};

export default template;
