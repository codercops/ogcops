import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields, linearGradient, mixColors } from '../utils';

const CARD_WIDTH = 1088;
const COVER_WIDTH = Math.round(CARD_WIDTH * 0.38);

/** "Priya Sharma" -> "PS", "Priya" -> "P". Empty when there is no name. */
function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '';
  const first = Array.from(words[0])[0] ?? '';
  const last = words.length > 1 ? Array.from(words[words.length - 1])[0] ?? '' : '';
  return (first + last).toUpperCase();
}

const template: TemplateDefinition = {
  id: 'blog-summary-card',
  name: 'Summary Card',
  category: 'blog',
  description: 'A white card on a light background with an accent cover panel, category pill, title, short excerpt, author initials and a reading-time pill',
  tags: ['blog', 'card', 'light', 'excerpt', 'reading-time'],
  fields: [
    commonFields.title,
    commonFields.description,
    commonFields.author,
    commonFields.date,
    commonFields.category,
    { key: 'readTime', label: 'Read Time', type: 'text', defaultValue: '6 min read', placeholder: '6 min read', group: 'Content' },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#F4F1EC' },
    commonFields.accentColor,
    { ...commonFields.textColor, defaultValue: '#1F2937' },
  ],
  defaults: {
    title: 'How we cut our build times in half with incremental caching',
    description: 'The cache keys we picked, the invalidation bugs we hit, and the numbers before and after.',
    author: 'Priya Sharma',
    date: 'Oct 21, 2026',
    category: 'Engineering',
    readTime: '6 min read',
    siteName: 'codercops.com',
    bgColor: '#F4F1EC',
    accentColor: '#E07A5F',
    textColor: '#1F2937',
  },
  render: (params) => {
    const title = truncate(String(params.title || '').trim() || 'How we cut our build times in half with incremental caching', 80);
    // A line in the right column holds about 50 characters at 20px, so 96 fits in two
    // with room for word wrapping. The box below also clips at two lines.
    const excerpt = truncate(String(params.description ?? '').trim(), 96);
    // Short enough that "Author · Date" stays on one line next to the read-time pill.
    const author = truncate(String(params.author ?? '').trim(), 20);
    const date = truncate(String(params.date ?? '').trim(), 14);
    const category = truncate(String(params.category ?? '').trim(), 24);
    const readTime = truncate(String(params.readTime ?? '').trim(), 16);
    const siteName = truncate(String(params.siteName ?? '').trim(), 30);
    const bgColor = String(params.bgColor || '#F4F1EC');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#1F2937');

    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 48 },
      { maxLen: 50, size: 42 },
      { maxLen: 65, size: 36 },
      { maxLen: 80, size: 32 },
    ]);
    const coverSize = autoFontSize(category, [
      { maxLen: 10, size: 60 },
      { maxLen: 16, size: 48 },
      { maxLen: 24, size: 38 },
    ]);
    const authorInitials = initials(author);
    const byline = [author, date].filter(Boolean).join(' · ');
    const hasFooter = Boolean(byline || readTime);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: {
          // The card
          type: 'div',
          props: {
            style: {
              display: 'flex',
              width: `${CARD_WIDTH}px`,
              height: '518px',
              backgroundColor: '#FFFFFF',
              borderRadius: '28px',
              boxShadow: '0 24px 60px rgba(31, 41, 55, 0.14)',
              overflow: 'hidden',
            },
            children: [
              // Cover panel: the left 38%
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    width: `${COVER_WIDTH}px`,
                    height: '100%',
                    padding: '44px 40px',
                    backgroundImage: linearGradient(140, accentColor, mixColors(accentColor, '#000000', 0.35)),
                  },
                  children: [
                    // The category in large type, or nothing: the gradient alone still reads as a cover.
                    {
                      type: 'div',
                      props: {
                        style: { display: 'flex' },
                        children: category
                          ? {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: `${coverSize}px`,
                                  fontWeight: 700,
                                  fontFamily: 'Playfair Display, serif',
                                  color: '#FFFFFF',
                                  lineHeight: 1.1,
                                },
                                children: category,
                              },
                            }
                          : [],
                      },
                    },
                    ...(siteName
                      ? [
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '16px',
                                fontWeight: 600,
                                color: 'rgba(255, 255, 255, 0.8)',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase' as const,
                              },
                              children: siteName,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },
              // Right side
              {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '48px 52px 44px',
                  },
                  children: [
                    // Category pill
                    ...(category
                      ? [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignSelf: 'flex-start',
                                padding: '6px 16px',
                                borderRadius: '999px',
                                backgroundColor: `${accentColor}1F`,
                                marginBottom: '20px',
                              },
                              children: {
                                type: 'span',
                                props: {
                                  style: {
                                    fontSize: '15px',
                                    fontWeight: 600,
                                    color: mixColors(accentColor, '#000000', 0.25),
                                    letterSpacing: '0.06em',
                                    textTransform: 'uppercase' as const,
                                  },
                                  children: category,
                                },
                              },
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
                          fontWeight: 700,
                          color: textColor,
                          lineHeight: 1.2,
                          margin: 0,
                        },
                        children: title,
                      },
                    },
                    // Excerpt, at most two lines
                    ...(excerpt
                      ? [
                          {
                            type: 'p',
                            props: {
                              style: {
                                fontSize: '20px',
                                color: `${textColor}A6`,
                                lineHeight: 1.5,
                                maxHeight: '60px',
                                overflow: 'hidden',
                                margin: 0,
                                marginTop: '18px',
                              },
                              children: excerpt,
                            },
                          },
                        ]
                      : []),
                    // Spacer
                    { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
                    // Footer: initials, "Author · Date", reading time
                    ...(hasFooter
                      ? [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '14px',
                                paddingTop: '22px',
                                borderTop: `1px solid ${textColor}1A`,
                              },
                              children: [
                                ...(authorInitials
                                  ? [
                                      {
                                        type: 'div',
                                        props: {
                                          style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '44px',
                                            height: '44px',
                                            borderRadius: '50%',
                                            backgroundColor: accentColor,
                                          },
                                          children: {
                                            type: 'span',
                                            props: {
                                              style: { fontSize: '17px', fontWeight: 700, color: '#FFFFFF' },
                                              children: authorInitials,
                                            },
                                          },
                                        },
                                      },
                                    ]
                                  : []),
                                ...(byline
                                  ? [
                                      {
                                        type: 'span',
                                        props: {
                                          style: { fontSize: '18px', fontWeight: 500, color: `${textColor}CC` },
                                          children: byline,
                                        },
                                      },
                                    ]
                                  : []),
                                { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
                                ...(readTime
                                  ? [
                                      {
                                        type: 'div',
                                        props: {
                                          style: {
                                            display: 'flex',
                                            padding: '8px 16px',
                                            borderRadius: '999px',
                                            backgroundColor: `${textColor}0F`,
                                          },
                                          children: {
                                            type: 'span',
                                            props: {
                                              style: { fontSize: '16px', fontWeight: 600, color: `${textColor}B3` },
                                              children: readTime,
                                            },
                                          },
                                        },
                                      },
                                    ]
                                  : []),
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
      },
    };
  },
};

export default template;
