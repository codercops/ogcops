import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-series-part',
  name: 'Series Part',
  category: 'blog',
  description: 'Multi-part article template with visual progress bar and series indicator',
  tags: ['series', 'part', 'progress', 'blog', 'article'],
  fields: [
    commonFields.title,
    {
      key: 'seriesName',
      label: 'Series Name',
      type: 'text',
      defaultValue: 'Building Modern Web Apps',
      placeholder: 'Series name...',
      group: 'Content',
    },
    {
      key: 'part',
      label: 'Part',
      type: 'number',
      defaultValue: 2,
      min: 1,
      max: 12,
      group: 'Content',
    },
    {
      key: 'totalParts',
      label: 'Total Parts',
      type: 'number',
      defaultValue: 5,
      min: 1,
      max: 12,
      group: 'Content',
    },
    commonFields.author,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Blog Post Title',
    seriesName: 'Building Modern Web Apps',
    part: 2,
    totalParts: 5,
    author: '',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Blog Post Title'), 90);
    const seriesName = params.seriesName ? truncate(String(params.seriesName), 60) : '';
    const author = params.author ? truncate(String(params.author), 40) : '';
    const siteName = params.siteName ? truncate(String(params.siteName), 35) : '';
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    // Parse and clamp part and totalParts safely
    const parseNumber = (val: unknown, fallback: number): number => {
      if (val === undefined || val === null || val === '') return fallback;
      const num = Number(val);
      if (!Number.isFinite(num)) return fallback;
      return Math.round(num);
    };

    const rawTotal = parseNumber(params.totalParts, 5);
    const totalParts = Math.min(12, Math.max(1, rawTotal));

    const rawPart = parseNumber(params.part, 2);
    const clampedPart = Math.min(12, Math.max(1, rawPart));
    const part = Math.min(clampedPart, totalParts);

    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 56 },
      { maxLen: 50, size: 48 },
      { maxLen: 70, size: 40 },
      { maxLen: 90, size: 34 },
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
          padding: '72px 80px',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        },
        children: [
          // Hero section: Series name in small caps above post title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              },
              children: [
                ...(seriesName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '20px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 700,
                                color: accentColor,
                                letterSpacing: '0.12em',
                                textTransform: 'uppercase',
                              },
                              children: seriesName,
                            },
                          },
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
                      maxWidth: '1040px',
                    },
                    children: title,
                  },
                },
              ],
            },
          },
          // Bottom area: Progress row + Footer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '32px',
                width: '100%',
              },
              children: [
                // Progress row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      width: '100%',
                    },
                    children: [
                      // Progress segments
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flex: 1,
                            alignItems: 'center',
                            gap: '8px',
                          },
                          children: Array.from({ length: totalParts }, (_, i) => ({
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                flex: 1,
                                height: '8px',
                                borderRadius: '4px',
                                backgroundColor: i < part ? accentColor : `${accentColor}33`,
                              },
                              children: '',
                            },
                          })),
                        },
                      },
                      // Part X of Y at the end of the progress row
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 600,
                            color: `${textColor}cc`,
                            whiteSpace: 'nowrap',
                          },
                          children: `Part ${part} of ${totalParts}`,
                        },
                      },
                    ],
                  },
                },
                // Footer: author / site name
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    },
                    children: [
                      author
                        ? {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                              },
                              children: [
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      width: '8px',
                                      height: '8px',
                                      borderRadius: '50%',
                                      backgroundColor: accentColor,
                                    },
                                    children: '',
                                  },
                                },
                                {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '18px',
                                      fontWeight: 500,
                                      color: `${textColor}cc`,
                                    },
                                    children: author,
                                  },
                                },
                              ],
                            },
                          }
                        : { type: 'div', props: { style: { display: 'flex' }, children: '' } },
                      siteName
                        ? {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '18px',
                                fontWeight: 500,
                                color: `${textColor}88`,
                              },
                              children: siteName,
                            },
                          }
                        : { type: 'div', props: { style: { display: 'flex' }, children: '' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
