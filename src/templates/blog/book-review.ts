import type { TemplateDefinition } from '../types';
import {
  autoFontSize,
  commonFields,
  contrastText,
  isLightColor,
  mixColors,
  normalizeStarRating,
  starIcon,
  truncate,
} from '../utils';

const template: TemplateDefinition = {
  id: 'blog-book-review',
  name: 'Book Review',
  category: 'blog',
  description: 'Book review card with a drawn cover, star rating, verdict, and reviewer byline',
  tags: ['blog', 'book', 'review', 'rating', 'reading'],
  fields: [
    commonFields.title,
    {
      key: 'bookAuthor',
      label: 'Book Author',
      type: 'text',
      defaultValue: 'Mira Okafor',
      placeholder: 'Book author',
      required: true,
      group: 'Content',
    },
    {
      key: 'rating',
      label: 'Rating (1-5)',
      type: 'number',
      defaultValue: 4,
      min: 1,
      max: 5,
      group: 'Content',
    },
    {
      key: 'verdict',
      label: 'Verdict',
      type: 'text',
      defaultValue: "The best book on maintenance I've read in years",
      placeholder: 'One-line verdict (optional)',
      group: 'Content',
    },
    {
      key: 'genre',
      label: 'Genre',
      type: 'text',
      defaultValue: 'Software craft',
      placeholder: 'Genre (optional)',
      group: 'Content',
    },
    commonFields.author,
    {
      key: 'coverColor',
      label: 'Cover Color',
      type: 'color',
      defaultValue: '#31465F',
      group: 'Style',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Quiet Codebase',
    bookAuthor: 'Mira Okafor',
    rating: 4,
    verdict: "The best book on maintenance I've read in years",
    genre: 'Software craft',
    author: 'Ari Chen',
    coverColor: '#31465F',
    siteName: 'codercops.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'The Quiet Codebase').trim() || 'The Quiet Codebase';
    const title = truncate(rawTitle, 88);
    const coverTitle = truncate(rawTitle, 68);
    const bookAuthor = truncate(String(params.bookAuthor ?? '').trim(), 42);
    const reviewer = truncate(String(params.author ?? '').trim(), 34);
    const verdict = truncate(String(params.verdict ?? '').trim(), 92);
    const genre = truncate(String(params.genre ?? '').trim(), 28);
    const siteName = truncate(String(params.siteName ?? '').trim(), 32);
    const coverColor = String(params.coverColor || '#31465F');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const rating = normalizeStarRating(params.rating, 4);

    const lightBg = isLightColor(bgColor);
    const coverInk = contrastText(coverColor);
    const coverMuted = mixColors(coverInk, coverColor, 0.28);
    const coverSpine = mixColors(coverColor, '#000000', isLightColor(coverColor) ? 0.12 : 0.24);
    const mutedText = mixColors(textColor, bgColor, lightBg ? 0.3 : 0.28);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.35) : accentColor;
    const genreBg = mixColors(bgColor, accentColor, lightBg ? 0.14 : 0.2);
    const emptyStar = mixColors(textColor, bgColor, lightBg ? 0.78 : 0.82);
    const footerBorder = mixColors(textColor, bgColor, lightBg ? 0.86 : 0.84);

    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 52 },
      { maxLen: 42, size: 44 },
      { maxLen: 64, size: 38 },
      { maxLen: 88, size: 32 },
    ]);
    const coverTitleSize = autoFontSize(coverTitle, [
      { maxLen: 14, size: 34 },
      { maxLen: 28, size: 30 },
      { maxLen: 48, size: 26 },
      { maxLen: 68, size: 22 },
    ]);

    const stars = Array.from({ length: 5 }, (_, index) =>
      starIcon(30, index < rating ? '#F5C518' : emptyStar)
    );

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '1200px',
          height: '630px',
          padding: '54px 64px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                flexShrink: 0,
                width: '320px',
                height: '522px',
                backgroundColor: coverColor,
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 24px 54px rgba(0, 0, 0, 0.32)',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexShrink: 0,
                      width: '18px',
                      height: '100%',
                      backgroundColor: coverSpine,
                    },
                    children: [],
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      flex: 1,
                      height: '100%',
                      padding: '42px 30px 34px',
                      boxSizing: 'border-box',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '44px',
                                  height: '4px',
                                  borderRadius: '2px',
                                  backgroundColor: coverMuted,
                                  marginBottom: '30px',
                                },
                                children: [],
                              },
                            },
                            {
                              type: 'h2',
                              props: {
                                style: {
                                  fontSize: `${coverTitleSize}px`,
                                  fontWeight: 700,
                                  fontFamily: 'Playfair Display, serif',
                                  color: coverInk,
                                  lineHeight: 1.18,
                                  margin: 0,
                                  overflowWrap: 'anywhere',
                                },
                                children: coverTitle,
                              },
                            },
                          ],
                        },
                      },
                      ...(bookAuthor
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: coverMuted,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase' as const,
                                  lineHeight: 1.3,
                                },
                                children: bookAuthor,
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
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                height: '100%',
                marginLeft: '56px',
                minWidth: 0,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      minWidth: 0,
                    },
                    children: [
                      ...(genre
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignSelf: 'flex-start',
                                  padding: '7px 16px',
                                  borderRadius: '999px',
                                  backgroundColor: genreBg,
                                  marginBottom: '20px',
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '15px',
                                      fontWeight: 700,
                                      color: accentInk,
                                      letterSpacing: '0.08em',
                                      textTransform: 'uppercase' as const,
                                    },
                                    children: genre,
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
                            lineHeight: 1.15,
                            margin: 0,
                            overflowWrap: 'anywhere',
                          },
                          children: title,
                        },
                      },
                      ...(bookAuthor
                        ? [
                            {
                              type: 'p',
                              props: {
                                style: {
                                  fontSize: '22px',
                                  color: mutedText,
                                  lineHeight: 1.35,
                                  margin: 0,
                                  marginTop: '12px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                },
                                children: `by ${bookAuthor}`,
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            gap: '6px',
                            marginTop: '24px',
                          },
                          children: stars,
                        },
                      },
                      ...(verdict
                        ? [
                            {
                              type: 'p',
                              props: {
                                style: {
                                  fontSize: '24px',
                                  fontStyle: 'italic',
                                  color: mutedText,
                                  lineHeight: 1.4,
                                  margin: 0,
                                  marginTop: '24px',
                                  maxWidth: '680px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                },
                                children: `\u201C${verdict}\u201D`,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                ...(reviewer || siteName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: reviewer && siteName ? 'space-between' : reviewer ? 'flex-start' : 'flex-end',
                            width: '100%',
                            paddingTop: '20px',
                            borderTop: `1px solid ${footerBorder}`,
                          },
                          children: [
                            ...(reviewer
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '17px',
                                        fontWeight: 600,
                                        color: textColor,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      },
                                      children: `Reviewed by ${reviewer}`,
                                    },
                                  },
                                ]
                              : []),
                            ...(siteName
                              ? [
                                  {
                                    type: 'span',
                                    props: {
                                      style: {
                                        fontSize: '15px',
                                        fontWeight: 600,
                                        color: mutedText,
                                        letterSpacing: '0.06em',
                                        textTransform: 'uppercase' as const,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      },
                                      children: siteName,
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
    };
  },
};

export default template;
