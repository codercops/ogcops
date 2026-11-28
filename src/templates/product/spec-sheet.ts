import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'product-spec-sheet',
  name: 'Spec Sheet',
  category: 'product',
  description: 'Launch page for hardware products featuring technical specifications, pricing, and key features.',
  tags: ['product', 'hardware', 'specs', 'launch', 'specifications'],
  fields: [
    commonFields.title,
    {
      key: 'pitch',
      label: 'Pitch',
      type: 'text' as const,
      defaultValue: 'Studio-grade audio recording anywhere you go',
      placeholder: 'One-line pitch',
      group: 'Content' as const,
    },
    {
      key: 'priceLine',
      label: 'Price Line',
      type: 'text' as const,
      defaultValue: '$299',
      placeholder: '$299 (optional)',
      group: 'Content' as const,
    },
    {
      key: 'label1',
      label: 'Label 1',
      type: 'text' as const,
      defaultValue: 'Recording',
      placeholder: 'Recording',
      group: 'Content' as const,
    },
    {
      key: 'value1',
      label: 'Value 1',
      type: 'text' as const,
      defaultValue: '32-bit float, 192 kHz',
      placeholder: '32-bit float, 192 kHz',
      group: 'Content' as const,
    },
    {
      key: 'label2',
      label: 'Label 2',
      type: 'text' as const,
      defaultValue: 'Battery',
      placeholder: 'Battery',
      group: 'Content' as const,
    },
    {
      key: 'value2',
      label: 'Value 2',
      type: 'text' as const,
      defaultValue: '18 hours',
      placeholder: '18 hours',
      group: 'Content' as const,
    },
    {
      key: 'label3',
      label: 'Label 3',
      type: 'text' as const,
      defaultValue: 'Storage',
      placeholder: 'Storage',
      group: 'Content' as const,
    },
    {
      key: 'value3',
      label: 'Value 3',
      type: 'text' as const,
      defaultValue: '128 GB + microSD',
      placeholder: '128 GB + microSD',
      group: 'Content' as const,
    },
    {
      key: 'label4',
      label: 'Label 4',
      type: 'text' as const,
      defaultValue: 'Weight',
      placeholder: 'Weight',
      group: 'Content' as const,
    },
    {
      key: 'value4',
      label: 'Value 4',
      type: 'text' as const,
      defaultValue: '140 g',
      placeholder: '140 g',
      group: 'Content' as const,
    },
    {
      key: 'label5',
      label: 'Label 5',
      type: 'text' as const,
      defaultValue: 'Connection',
      placeholder: 'Connection',
      group: 'Content' as const,
    },
    {
      key: 'value5',
      label: 'Value 5',
      type: 'text' as const,
      defaultValue: 'USB-C, Bluetooth',
      placeholder: 'USB-C, Bluetooth',
      group: 'Content' as const,
    },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Field Recorder Pro',
    pitch: 'Studio-grade audio recording anywhere you go',
    priceLine: '$299',
    label1: 'Recording',
    value1: '32-bit float, 192 kHz',
    label2: 'Battery',
    value2: '18 hours',
    label3: 'Storage',
    value3: '128 GB + microSD',
    label4: 'Weight',
    value4: '140 g',
    label5: 'Connection',
    value5: 'USB-C, Bluetooth',
    siteName: 'acmeaudio.io',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'Field Recorder Pro').trim();
    const titleSize = autoFontSize(rawTitle, [
      { maxLen: 16, size: 54 },
      { maxLen: 28, size: 44 },
      { maxLen: 42, size: 36 },
      { maxLen: 60, size: 28 },
    ]);
    const title = truncate(rawTitle, 60);

    const pitch = truncate(String(params.pitch ?? '').trim(), 80);
    const priceLine = truncate(String(params.priceLine ?? '').trim(), 36);
    const siteName = truncate(String(params.siteName ?? '').trim(), 36);

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.35) : accentColor;
    const labelColor = lightBg ? mixColors(textColor, bgColor, 0.4) : mixColors(textColor, bgColor, 0.35);
    const valueColor = textColor;
    const pitchColor = lightBg ? mixColors(textColor, bgColor, 0.25) : mixColors(textColor, bgColor, 0.2);
    const mutedColor = mixColors(textColor, bgColor, lightBg ? 0.45 : 0.4);
    const dividerColor = mixColors(bgColor, textColor, lightBg ? 0.16 : 0.14);
    const panelBg = mixColors(bgColor, textColor, lightBg ? 0.03 : 0.05);
    const panelBorder = mixColors(bgColor, textColor, lightBg ? 0.12 : 0.18);

    const rawRows = [
      { label: String(params.label1 ?? '').trim(), value: String(params.value1 ?? '').trim() },
      { label: String(params.label2 ?? '').trim(), value: String(params.value2 ?? '').trim() },
      { label: String(params.label3 ?? '').trim(), value: String(params.value3 ?? '').trim() },
      { label: String(params.label4 ?? '').trim(), value: String(params.value4 ?? '').trim() },
      { label: String(params.label5 ?? '').trim(), value: String(params.value5 ?? '').trim() },
    ];

    const rows = rawRows
      .filter((r) => r.value.length > 0)
      .map((r) => ({
        label: truncate(r.label, 20),
        value: truncate(r.value, 36),
      }));

    const hasRows = rows.length > 0;
    const rowPadding = rows.length <= 3 ? '24px 0' : '18px 0';

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '1200px',
          height: '630px',
          padding: '60px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Left side
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: hasRows ? '500px' : '100%',
                height: '100%',
                boxSizing: 'border-box',
              },
              children: [
                // Main product text group
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
                      // Product name
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontWeight: 800,
                            color: textColor,
                            lineHeight: 1.15,
                            margin: 0,
                            fontFamily: 'Inter, sans-serif',
                            overflowWrap: 'break-word',
                          },
                          children: title,
                        },
                      },
                      // Pitch
                      ...(pitch
                        ? [
                            {
                              type: 'p',
                              props: {
                                style: {
                                  fontSize: '20px',
                                  lineHeight: 1.4,
                                  color: pitchColor,
                                  margin: 0,
                                  marginTop: '16px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                },
                                children: pitch,
                              },
                            },
                          ]
                        : []),
                      // Price line
                      ...(priceLine
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  marginTop: '22px',
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: '22px',
                                      fontWeight: 700,
                                      color: accentInk,
                                      fontFamily: 'Inter, sans-serif',
                                    },
                                    children: priceLine,
                                  },
                                },
                              },
                            },
                          ]
                        : []),
                    ],
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
                            marginTop: '24px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '15px',
                                fontWeight: 600,
                                color: mutedColor,
                                letterSpacing: '0.04em',
                                textTransform: 'uppercase',
                                fontFamily: 'Inter, sans-serif',
                              },
                              children: siteName,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right side (spec table)
          ...(hasRows
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      flex: 1,
                      marginLeft: '50px',
                      height: '100%',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexDirection: 'column',
                          width: '100%',
                          backgroundColor: panelBg,
                          border: `1px solid ${panelBorder}`,
                          borderRadius: '16px',
                          padding: '8px 28px',
                          boxSizing: 'border-box',
                        },
                        children: rows.map((row, index) => ({
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              flexDirection: 'row',
                              alignItems: 'center',
                              width: '100%',
                              padding: rowPadding,
                              boxSizing: 'border-box',
                              borderBottom:
                                index < rows.length - 1 ? `1px solid ${dividerColor}` : 'none',
                            },
                            children: [
                              ...(row.label
                                ? [
                                    {
                                      type: 'span',
                                      props: {
                                        style: {
                                          display: 'flex',
                                          width: '150px',
                                          flexShrink: 0,
                                          marginRight: '20px',
                                          fontSize: '15px',
                                          fontWeight: 600,
                                          color: labelColor,
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.04em',
                                          fontFamily: 'Inter, sans-serif',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                        },
                                        children: row.label,
                                      },
                                    },
                                  ]
                                : []),
                              {
                                type: 'span',
                                props: {
                                  style: {
                                    display: 'flex',
                                    flex: 1,
                                    minWidth: 0,
                                    fontSize: '17px',
                                    fontWeight: 600,
                                    color: valueColor,
                                    fontFamily: 'Inter, sans-serif',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                  },
                                  children: row.value,
                                },
                              },
                            ],
                          },
                        })),
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
