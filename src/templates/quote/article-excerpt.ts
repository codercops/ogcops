import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'quote-article-excerpt',
  name: 'Article Excerpt',
  category: 'quote',
  description: 'Excerpt with a thin left accent bar and a link-style source preview box',
  tags: ['quote', 'article', 'excerpt', 'blog', 'link', 'source'],
  fields: [
    {
      key: 'quote',
      label: 'Quote',
      type: 'textarea',
      defaultValue: 'Most of our outages started as a config change that looked too small to review.',
      placeholder: 'Enter quote or excerpt...',
      required: true,
      group: 'Content',
    },
    {
      ...commonFields.title,
      label: 'Article Title',
      defaultValue: 'What three years of incidents taught us',
      placeholder: 'Article title',
      required: false,
    },
    {
      ...commonFields.siteName,
      defaultValue: 'blog.example.com',
      placeholder: 'blog.example.com',
    },
    {
      ...commonFields.author,
      defaultValue: 'Priya Raman',
      placeholder: 'Author name',
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    quote: 'Most of our outages started as a config change that looked too small to review.',
    title: 'What three years of incidents taught us',
    siteName: 'blog.example.com',
    author: 'Priya Raman',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawQuote =
      String(params.quote ?? '').trim() ||
      'Most of our outages started as a config change that looked too small to review.';
    const quoteSize = autoFontSize(rawQuote, [
      { maxLen: 50, size: 52 },
      { maxLen: 90, size: 44 },
      { maxLen: 140, size: 36 },
      { maxLen: 200, size: 28 },
    ]);
    const quote = truncate(rawQuote, 200);

    const rawTitle = String(params.title ?? '').trim();
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 40, size: 28 },
      { maxLen: 70, size: 24 },
      { maxLen: 100, size: 20 },
    ]);
    const title = truncate(rawTitle, 100);

    const siteName = truncate(String(params.siteName ?? '').trim(), 60);
    const author = truncate(String(params.author ?? '').trim(), 60);
    const authorLine = author ? (author.toLowerCase().startsWith('by ') ? author : `by ${author}`) : '';

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const quoteColor = lightBg && isLightColor(textColor) ? '#000000' : textColor;
    const metaColor = isLightColor(quoteColor) ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)';
    const boxBg = lightBg ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.05)';
    const boxBorder = lightBg ? '1px solid rgba(0, 0, 0, 0.10)' : '1px solid rgba(255, 255, 255, 0.14)';

    const hasMeta = Boolean(siteName || authorLine);
    const hasBox = Boolean(title || siteName);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '72px 96px',
        },
        children: [
          // Excerpt row with accent bar down its left side
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'stretch',
                gap: '28px',
                width: '100%',
              },
              children: [
                // Plain shape accent bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '6px',
                      backgroundColor: accentInk,
                      borderRadius: '3px',
                      flexShrink: 0,
                    },
                    children: [],
                  },
                },
                // Excerpt
                {
                  type: 'p',
                  props: {
                    style: {
                      display: 'flex',
                      fontSize: `${quoteSize}px`,
                      fontWeight: 400,
                      color: quoteColor,
                      lineHeight: 1.4,
                      margin: 0,
                      maxWidth: '960px',
                    },
                    children: quote,
                  },
                },
              ],
            },
          },
          // Link-style preview box
          ...(hasBox
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      marginTop: '44px',
                      padding: '28px 36px',
                      borderRadius: '16px',
                      border: boxBorder,
                      backgroundColor: boxBg,
                    },
                    children: [
                      ...(title
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  fontSize: `${titleSize}px`,
                                  fontWeight: 600,
                                  color: quoteColor,
                                  lineHeight: 1.3,
                                },
                                children: title,
                              },
                            },
                          ]
                        : []),
                      ...(hasMeta
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  marginTop: title ? '16px' : '0px',
                                },
                                children: [
                                  ...(siteName
                                    ? [
                                        {
                                          type: 'span',
                                          props: {
                                            style: {
                                              fontSize: '17px',
                                              fontWeight: 600,
                                              color: accentInk,
                                              letterSpacing: '0.01em',
                                            },
                                            children: siteName,
                                          },
                                        },
                                      ]
                                    : []),
                                  ...(siteName && authorLine
                                    ? [
                                        {
                                          type: 'div',
                                          props: {
                                            style: {
                                              display: 'flex',
                                              width: '4px',
                                              height: '4px',
                                              borderRadius: '50%',
                                              backgroundColor: metaColor,
                                            },
                                            children: [],
                                          },
                                        },
                                      ]
                                    : []),
                                  ...(authorLine
                                    ? [
                                        {
                                          type: 'span',
                                          props: {
                                            style: {
                                              fontSize: '17px',
                                              color: metaColor,
                                            },
                                            children: authorLine,
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
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
