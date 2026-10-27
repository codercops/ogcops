import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, isLightColor, mixColors, contrastText, commonFields } from '../utils';

const DEFAULT_TITLE = 'A practical guide to React Server Components';
const DEFAULT_PUBLISHED = 'First published Mar 3, 2024';
const DEFAULT_UPDATED = 'Updated Oct 27, 2026';

// Collapse runs of whitespace so a field padded with spaces reads as empty.
const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'blog-updated-post',
  name: 'Updated Post',
  category: 'blog',
  description: 'A refreshed post card with an Updated label, the publish and update dates, and a short list of what changed',
  tags: ['blog', 'updated', 'changelog', 'post', 'revision'],
  fields: [
    commonFields.title,
    { key: 'published', label: 'First Published', type: 'text', defaultValue: DEFAULT_PUBLISHED, placeholder: 'Optional, e.g. First published Mar 3, 2024', group: 'Content' },
    { key: 'updated', label: 'Updated', type: 'text', defaultValue: DEFAULT_UPDATED, placeholder: 'Optional, e.g. Updated Oct 27, 2026', group: 'Content' },
    { key: 'change1', label: 'Change 1', type: 'text', defaultValue: 'Covers React 19', placeholder: 'Optional, what changed', group: 'Content' },
    { key: 'change2', label: 'Change 2', type: 'text', defaultValue: 'New section on server actions', placeholder: 'Optional, what changed', group: 'Content' },
    { key: 'change3', label: 'Change 3', type: 'text', defaultValue: 'Fixed the broken examples', placeholder: 'Optional, what changed', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: DEFAULT_TITLE,
    published: DEFAULT_PUBLISHED,
    updated: DEFAULT_UPDATED,
    change1: 'Covers React 19',
    change2: 'New section on server actions',
    change3: 'Fixed the broken examples',
    siteName: 'codercops.com',
    bgColor: '#0b0f1a',
    accentColor: '#7dd3a0',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const title = cleanText(params.title, 84) || DEFAULT_TITLE;
    // A blank or omitted date hides on its own, so the line never renders a stray separator.
    const published = cleanText(params.published, 40);
    const updated = cleanText(params.updated, 40);
    const siteName = cleanText(params.siteName, 36);

    const changes = [params.change1, params.change2, params.change3]
      .map((change) => cleanText(change, 64))
      .filter((change) => change.length > 0);

    const bgColor = String(params.bgColor || '#0b0f1a');
    const accentColor = String(params.accentColor || '#7dd3a0');
    const textColor = String(params.textColor || '#f8fafc');

    const titleSize = autoFontSize(title, [
      { maxLen: 24, size: 72 },
      { maxLen: 40, size: 60 },
      { maxLen: 56, size: 52 },
      { maxLen: 72, size: 46 },
      { maxLen: 84, size: 40 },
    ]);

    // Neutral colors are mixed from the background and text colors, so the card reads the
    // same on dark and on light backgrounds.
    const lightBg = isLightColor(bgColor);
    const secondaryText = mixColors(bgColor, textColor, 0.62);
    // An accent as light as the background (or as dark as it) is hard to read as text, so
    // pull it toward the text color. Otherwise it reads as it is.
    const accentText = isLightColor(accentColor) === lightBg
      ? mixColors(accentColor, textColor, 0.55)
      : accentColor;
    const pillText = contrastText(accentColor);

    const dates: SatoriElement[] = [
      ...(published
        ? [
            {
              type: 'span',
              props: {
                style: { fontSize: '22px', fontWeight: 500, color: secondaryText, whiteSpace: 'nowrap' },
                children: published,
              },
            },
          ]
        : []),
      ...(published && updated
        ? [
            {
              type: 'div',
              props: {
                style: { display: 'flex', margin: '0 14px', flexShrink: 0 },
                children: {
                  type: 'span',
                  props: {
                    style: { fontSize: '22px', fontWeight: 500, color: secondaryText },
                    children: '·',
                  },
                },
              },
            },
          ]
        : []),
      ...(updated
        ? [
            {
              type: 'span',
              props: {
                style: { fontSize: '22px', fontWeight: 600, color: accentText, whiteSpace: 'nowrap' },
                children: updated,
              },
            },
          ]
        : []),
    ];

    const changeRows: SatoriElement[] = changes.map((change, index) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          marginBottom: index < changes.length - 1 ? '14px' : '0px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: accentText,
                marginRight: '18px',
                flexShrink: 0,
              },
              children: [],
            },
          },
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                fontSize: '26px',
                fontWeight: 500,
                color: textColor,
                lineHeight: 1.3,
              },
              children: change,
            },
          },
        ],
      },
    }));

    // Title, dates and changes share the space between the pill and the footer, so a card
    // with only a few lines stays centred instead of leaving a gap at the bottom.
    const body: SatoriElement = {
      type: 'div',
      props: {
        style: { display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' },
        children: [
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.12,
                letterSpacing: '-0.03em',
                margin: 0,
                marginBottom: '20px',
              },
              children: title,
            },
          },
          ...(dates.length > 0
            ? [{
                type: 'div',
                props: {
                  // No trailing gap when there is no change list underneath.
                  style: { display: 'flex', alignItems: 'center', marginBottom: changes.length > 0 ? '40px' : '0px' },
                  children: dates,
                },
              }]
            : []),
          ...(changes.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexDirection: 'column' },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 700,
                            color: accentText,
                            letterSpacing: '0.14em',
                            textTransform: 'uppercase',
                            marginBottom: '18px',
                          },
                          children: 'What changed',
                        },
                      },
                      ...changeRows,
                    ],
                  },
                },
              ]
            : []),
        ],
      },
    };

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
          padding: '60px 80px',
          boxSizing: 'border-box',
        },
        children: [
          // Updated pill
          {
            type: 'div',
            props: {
              style: { display: 'flex', marginBottom: '26px' },
              children: {
                type: 'div',
                props: {
                  style: { display: 'flex', padding: '9px 24px', borderRadius: '999px', backgroundColor: accentColor },
                  children: {
                    type: 'span',
                    props: {
                      style: { fontSize: '20px', fontWeight: 700, color: pillText, letterSpacing: '0.12em', textTransform: 'uppercase' },
                      children: 'Updated',
                    },
                  },
                },
              },
            },
          },
          body,
          // Site name
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      // Keeps a floor between the last change line and the rule once the
                      // body above is centred in the leftover space.
                      marginTop: '32px',
                      paddingTop: '20px',
                      borderTop: `1px solid ${textColor}1A`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '17px', fontWeight: 600, color: secondaryText, letterSpacing: '0.04em' },
                        children: siteName,
                      },
                    },
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
