import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

function downloadIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      fill: 'none',
      stroke: color,
      strokeWidth: '1.75',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        {
          type: 'path',
          props: {
            d: 'M2.5 10.5v2a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-2M8 2.5v7m-3-3l3 3 3-3',
          },
        },
      ],
    },
  };
}

function licenseIcon(size: number, color: string) {
  return {
    type: 'svg',
    props: {
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      fill: 'none',
      stroke: color,
      strokeWidth: '1.75',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      children: [
        {
          type: 'path',
          props: {
            d: 'M8 1.5l5.5 2v4.5c0 3.5-2.5 5.5-5.5 6.5-3-1-5.5-3-5.5-6.5V3.5l5.5-2z',
          },
        },
      ],
    },
  };
}

const template: TemplateDefinition = {
  id: 'github-package-card',
  name: 'Package Card',
  category: 'github',
  description: 'Published package announcement with registry badge, version pill, pitch, downloads, license, and install command',
  tags: ['github', 'package', 'npm', 'pypi', 'crates', 'open-source'],
  fields: [
    {
      ...commonFields.title,
      defaultValue: '@acme/csv-stream',
      placeholder: '@scope/package-name',
    },
    {
      ...commonFields.description,
      defaultValue: 'A streaming CSV parser for Node',
      placeholder: 'A streaming CSV parser for Node',
      required: false,
    },
    {
      key: 'registry',
      label: 'Registry',
      type: 'text' as const,
      defaultValue: 'npm',
      placeholder: 'npm',
      required: false,
      group: 'Content' as const,
    },
    {
      key: 'version',
      label: 'Version',
      type: 'text' as const,
      defaultValue: 'v2.4.1',
      placeholder: 'v2.4.1',
      required: false,
      group: 'Content' as const,
    },
    {
      key: 'downloads',
      label: 'Downloads',
      type: 'text' as const,
      defaultValue: '182k weekly downloads',
      placeholder: '182k weekly downloads',
      required: false,
      group: 'Content' as const,
    },
    {
      key: 'license',
      label: 'License',
      type: 'text' as const,
      defaultValue: 'MIT',
      placeholder: 'MIT',
      required: false,
      group: 'Content' as const,
    },
    {
      key: 'install',
      label: 'Install Command',
      type: 'text' as const,
      defaultValue: 'npm i @acme/csv-stream',
      placeholder: 'npm i @acme/csv-stream',
      required: false,
      group: 'Content' as const,
    },
    {
      ...commonFields.siteName,
      defaultValue: 'github.com/acme/csv-stream',
      placeholder: 'github.com/acme/csv-stream',
    },
    {
      ...commonFields.bgColor,
      defaultValue: '#0d1117',
    },
    {
      ...commonFields.accentColor,
      defaultValue: '#58a6ff',
    },
    {
      ...commonFields.textColor,
      defaultValue: '#e6edf3',
    },
  ],
  defaults: {
    title: '@acme/csv-stream',
    description: 'A streaming CSV parser for Node',
    registry: 'npm',
    version: 'v2.4.1',
    downloads: '182k weekly downloads',
    license: 'MIT',
    install: 'npm i @acme/csv-stream',
    siteName: 'github.com/acme/csv-stream',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? '').trim() || '@acme/csv-stream';
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 18, size: 52 },
      { maxLen: 28, size: 44 },
      { maxLen: 38, size: 36 },
      { maxLen: 50, size: 30 },
    ]);
    const title = truncate(rawTitle, 55);

    const rawDescription = params.description !== undefined && params.description !== null
      ? String(params.description).trim()
      : 'A streaming CSV parser for Node';
    const descriptionSize = autoFontSize(rawDescription, [
      { maxLen: 40, size: 24 },
      { maxLen: 70, size: 21 },
      { maxLen: 100, size: 19 },
      { maxLen: 140, size: 17 },
    ]);
    const description = rawDescription ? truncate(rawDescription, 140) : '';

    const rawRegistry = params.registry !== undefined && params.registry !== null
      ? String(params.registry).trim()
      : 'npm';
    const registry = rawRegistry ? truncate(rawRegistry, 30) : '';
    const labelText = registry
      ? registry.toLowerCase().endsWith('package')
        ? registry
        : `${registry} package`
      : '';

    const rawVersion = params.version !== undefined && params.version !== null
      ? String(params.version).trim()
      : 'v2.4.1';
    const version = rawVersion ? truncate(rawVersion, 25) : '';

    const rawDownloads = params.downloads !== undefined && params.downloads !== null
      ? String(params.downloads).trim()
      : '182k weekly downloads';
    const downloads = rawDownloads ? truncate(rawDownloads, 35) : '';

    const rawLicense = params.license !== undefined && params.license !== null
      ? String(params.license).trim()
      : 'MIT';
    const license = rawLicense ? truncate(rawLicense, 30) : '';

    const rawInstall = params.install !== undefined && params.install !== null
      ? String(params.install).trim()
      : 'npm i @acme/csv-stream';
    const installCmd = rawInstall ? truncate(rawInstall, 70) : '';

    const rawSiteName = params.siteName !== undefined && params.siteName !== null
      ? String(params.siteName).trim()
      : 'github.com/acme/csv-stream';
    const siteName = rawSiteName ? truncate(rawSiteName, 50) : '';

    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const cardBg = mixColors(bgColor, textColor, lightBg ? 0.04 : 0.06);
    const cardBorder = mixColors(bgColor, textColor, lightBg ? 0.12 : 0.16);

    const statsItems = [
      ...(downloads
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                },
                children: [
                  downloadIcon(18, accentInk),
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '17px',
                        fontWeight: 600,
                        color: textColor,
                        fontFamily: 'JetBrains Mono, monospace',
                      },
                      children: downloads,
                    },
                  },
                ],
              },
            },
          ]
        : []),
      ...(license
        ? [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  backgroundColor: cardBg,
                  border: `1px solid ${cardBorder}`,
                },
                children: [
                  licenseIcon(18, accentInk),
                  {
                    type: 'span',
                    props: {
                      style: {
                        fontSize: '17px',
                        fontWeight: 600,
                        color: textColor,
                        fontFamily: 'JetBrains Mono, monospace',
                      },
                      children: license,
                    },
                  },
                ],
              },
            },
          ]
        : []),
    ];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '48px 64px',
        },
        children: [
          // Header block
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
              },
              children: [
                ...(labelText
                  ? [
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
                                letterSpacing: '0.04em',
                              },
                              children: labelText,
                            },
                          },
                        },
                      },
                    ]
                  : []),
                // Package name + version pill
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1.15,
                            margin: 0,
                            fontFamily: 'JetBrains Mono, monospace',
                            letterSpacing: '-0.02em',
                          },
                          children: title,
                        },
                      },
                      ...(version
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  padding: '4px 14px',
                                  borderRadius: '999px',
                                  backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.16),
                                  border: `1px solid ${mixColors(bgColor, accentInk, lightBg ? 0.25 : 0.35)}`,
                                  flexShrink: 0,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '17px',
                                      fontWeight: 600,
                                      color: accentInk,
                                      fontFamily: 'JetBrains Mono, monospace',
                                    },
                                    children: version,
                                  },
                                },
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Pitch
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: `${descriptionSize}px`,
                            color: lightBg ? mixColors(bgColor, textColor, 0.7) : `${textColor}aa`,
                            lineHeight: 1.4,
                            margin: 0,
                            marginTop: '12px',
                            maxWidth: '960px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Stats row: downloads & license side by side
          ...(statsItems.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      marginTop: '22px',
                    },
                    children: statsItems,
                  },
                },
              ]
            : []),
          // Install command box
          ...(installCmd
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '16px 22px',
                      borderRadius: '12px',
                      backgroundColor: cardBg,
                      border: `1px solid ${cardBorder}`,
                      marginTop: '22px',
                      alignSelf: 'flex-start',
                      maxWidth: '960px',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 700,
                            color: accentInk,
                            marginRight: '12px',
                            fontFamily: 'JetBrains Mono, monospace',
                            flexShrink: 0,
                          },
                          children: '$',
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '18px',
                            fontWeight: 500,
                            color: textColor,
                            fontFamily: 'JetBrains Mono, monospace',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          children: installCmd,
                        },
                      },
                    ],
                  },
                },
              ]
            : []),
          // Spacer
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
          // Site name at bottom
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      paddingTop: '16px',
                      borderTop: `1px solid ${lightBg ? mixColors(bgColor, textColor, 0.12) : `${textColor}15`}`,
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '17px',
                            fontWeight: 500,
                            color: lightBg ? mixColors(bgColor, textColor, 0.6) : `${textColor}88`,
                            fontFamily: 'Inter, sans-serif',
                          },
                          children: siteName,
                        },
                      },
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
