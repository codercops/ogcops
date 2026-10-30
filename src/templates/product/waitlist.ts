import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'product-waitlist',
  name: 'Waitlist',
  category: 'product',
  description: 'Pre-launch waitlist card with the product name, a one-line pitch, the number of people waiting and an optional launch window',
  tags: ['product', 'waitlist', 'launch', 'signups', 'pre-launch'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'count', label: 'Waitlist Count', type: 'text', defaultValue: '2,148', placeholder: '2,148', group: 'Content' },
    { key: 'countLabel', label: 'Count Label', type: 'text', defaultValue: 'people on the list', placeholder: 'people on the list', group: 'Content' },
    { key: 'launchWindow', label: 'Launch Window', type: 'text', defaultValue: 'Opening in November', placeholder: 'Opening in November', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Notewell',
    description: 'Notes that link themselves',
    count: '2,148',
    countLabel: 'people on the list',
    launchWindow: 'Opening in November',
    siteName: 'notewell.app',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'Notewell').trim() || 'Notewell';
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 16, size: 88 },
      { maxLen: 28, size: 72 },
      { maxLen: 42, size: 60 },
    ]);
    const title = truncate(rawTitle, 42);
    const rawDescription = String(params.description || '').trim();
    const descriptionSize = autoFontSize(rawDescription, [
      { maxLen: 34, size: 30 },
      { maxLen: 60, size: 26 },
      { maxLen: 90, size: 22 },
    ]);
    const description = truncate(rawDescription, 90);
    const count = truncate(String(params.count || '').trim(), 12);
    // The label describes the number, so it goes with it rather than standing on its own.
    const countLabel = count ? truncate(String(params.countLabel || '').trim(), 32) : '';
    const launchWindow = truncate(String(params.launchWindow || '').trim(), 40);
    const siteName = truncate(String(params.siteName || '').trim(), 40);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    // The label and the launch window are drawn in the accent on the page background,
    // so they are darkened when that background is light.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px 80px',
        },
        children: [
          // "Join the waitlist" label
          {
            type: 'span',
            props: {
              style: {
                fontSize: '16px',
                fontWeight: 700,
                color: accentInk,
                letterSpacing: '0.16em',
                textTransform: 'uppercase' as const,
              },
              children: 'Join the waitlist',
            },
          },
          // Product name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                marginTop: '18px',
              },
              children: title,
            },
          },
          // One-line pitch
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: `${descriptionSize}px`,
                      fontWeight: 500,
                      color: `${textColor}B3`,
                      lineHeight: 1.4,
                      margin: 0,
                      marginTop: '14px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Count and its label
          ...(count
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '14px',
                      marginTop: '52px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '64px',
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1,
                            fontFamily: 'JetBrains Mono, monospace',
                          },
                          children: count,
                        },
                      },
                      ...(countLabel
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '22px',
                                  fontWeight: 500,
                                  color: `${textColor}99`,
                                },
                                children: countLabel,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
              ]
            : []),
          // Launch window and site name
          ...(launchWindow || siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: '44px',
                    },
                    children: [
                      ...(launchWindow
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: accentInk,
                                },
                                children: launchWindow,
                              },
                            },
                          ]
                        : []),
                      ...(launchWindow && siteName
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '4px',
                                  height: '4px',
                                  borderRadius: '50%',
                                  backgroundColor: `${textColor}44`,
                                },
                                children: [],
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
                                  fontSize: '18px',
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
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
