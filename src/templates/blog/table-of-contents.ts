import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, isLightColor, mixColors, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'blog-table-of-contents',
  name: 'Table of Contents',
  category: 'blog',
  description: 'A table of contents card showing post sections with reading time and site branding',
  tags: ['blog', 'table-of-contents', 'toc', 'outline', 'sections'],
  fields: [
    commonFields.title,
    {
      key: 'section1',
      label: 'Section 1',
      type: 'text',
      defaultValue: 'Why micro-frontends fail at scale',
      placeholder: 'First section heading...',
      group: 'Content',
    },
    {
      key: 'section2',
      label: 'Section 2',
      type: 'text',
      defaultValue: 'The hidden cost of runtime integration',
      placeholder: 'Second section heading...',
      group: 'Content',
    },
    {
      key: 'section3',
      label: 'Section 3',
      type: 'text',
      defaultValue: 'Module federation vs build-time composition',
      placeholder: 'Third section heading...',
      group: 'Content',
    },
    {
      key: 'section4',
      label: 'Section 4',
      type: 'text',
      defaultValue: 'Migration playbook step-by-step',
      placeholder: 'Fourth section heading...',
      group: 'Content',
    },
    {
      key: 'section5',
      label: 'Section 5',
      type: 'text',
      defaultValue: 'Benchmarks and team impact',
      placeholder: 'Fifth section heading (optional)...',
      group: 'Content',
    },
    {
      key: 'readTime',
      label: 'Read Time',
      type: 'text',
      defaultValue: '12 min read',
      placeholder: '12 min read',
      group: 'Content',
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Architecture Patterns for Large-Scale Frontend Applications',
    section1: 'Why micro-frontends fail at scale',
    section2: 'The hidden cost of runtime integration',
    section3: 'Module federation vs build-time composition',
    section4: 'Migration playbook step-by-step',
    section5: 'Benchmarks and team impact',
    readTime: '12 min read',
    siteName: 'codercops.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = params.title !== undefined && params.title !== null
      ? String(params.title).trim()
      : 'Architecture Patterns for Large-Scale Frontend Applications';
    const fallbackTitle = 'Architecture Patterns for Large-Scale Frontend Applications';
    const titleText = rawTitle || fallbackTitle;
    const title = truncate(titleText, 90);

    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 44 },
      { maxLen: 50, size: 38 },
      { maxLen: 70, size: 32 },
      { maxLen: 90, size: 28 },
    ]);

    const rawSections = [
      params.section1,
      params.section2,
      params.section3,
      params.section4,
      params.section5,
    ].map((s) => (s !== undefined && s !== null ? String(s).trim() : ''));

    const sections = rawSections
      .filter((s) => s.length > 0)
      .map((s) => truncate(s, 70));

    const rawReadTime = params.readTime !== undefined
      ? String(params.readTime).trim()
      : '12 min read';
    const readTime = rawReadTime ? truncate(rawReadTime, 24) : '';

    const rawSiteName = params.siteName !== undefined
      ? String(params.siteName).trim()
      : 'codercops.com';
    const siteName = rawSiteName ? truncate(rawSiteName, 36) : '';

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const lightBg = isLightColor(bgColor);
    const accentInk = isLightColor(accentColor) === lightBg
      ? mixColors(accentColor, textColor, 0.55)
      : accentColor;

    const cardBg = mixColors(bgColor, textColor, lightBg ? 0.04 : 0.07);
    const cardBorder = mixColors(bgColor, textColor, lightBg ? 0.12 : 0.18);
    const numberCircleBg = mixColors(bgColor, accentInk, lightBg ? 0.1 : 0.18);
    const numberCircleBorder = mixColors(bgColor, accentInk, lightBg ? 0.25 : 0.35);
    const secondaryText = mixColors(bgColor, textColor, 0.7);

    const sectionRows: SatoriElement[] = sections.map((section, index) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          padding: '8px 18px',
          borderRadius: '12px',
          backgroundColor: cardBg,
          border: `1px solid ${cardBorder}`,
          marginBottom: index < sections.length - 1 ? '10px' : '0px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: numberCircleBg,
                border: `1px solid ${numberCircleBorder}`,
                marginRight: '16px',
                flexShrink: 0,
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '16px',
                    fontWeight: 700,
                    color: accentInk,
                  },
                  children: String(index + 1),
                },
              },
            },
          },
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: '20px',
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              children: section,
            },
          },
        ],
      },
    }));

    const hasFooter = Boolean(readTime || siteName);

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
          padding: '46px 64px',
          boxSizing: 'border-box',
        },
        children: [
          // Title
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.2,
                margin: 0,
                marginBottom: '14px',
                letterSpacing: '-0.02em',
              },
              children: title,
            },
          },
          // Accent-colored "in this post" label
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                padding: '5px 14px',
                borderRadius: '999px',
                backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.16),
                border: `1px solid ${accentInk}55`,
                marginBottom: '16px',
                alignSelf: 'flex-start',
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '13px',
                    fontWeight: 700,
                    color: accentInk,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  },
                  children: 'In this post',
                },
              },
            },
          },
          // Sequentially numbered list of section headings
          ...(sectionRows.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    },
                    children: sectionRows,
                  },
                },
              ]
            : []),
          // Bottom footer containing reading time and site name
          ...(hasFooter
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                      paddingTop: '16px',
                      borderTop: `1px solid ${textColor}1A`,
                    },
                    children: [
                      ...(readTime
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '6px 14px',
                                  borderRadius: '999px',
                                  backgroundColor: `${textColor}0F`,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '15px',
                                      fontWeight: 600,
                                      color: secondaryText,
                                    },
                                    children: readTime,
                                  },
                                },
                              },
                            },
                          ]
                        : []),
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flex: 1,
                          },
                          children: [],
                        },
                      },
                      ...(siteName
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  display: 'flex',
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: secondaryText,
                                  letterSpacing: '0.04em',
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
    };
  },
};

export default template;
