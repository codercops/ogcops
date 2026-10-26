import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields, contrastText, isLightColor, mixColors } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-listen-on',
  name: 'Listen On',
  category: 'podcast',
  description: 'Podcast release card with show name, episode number, title, tagline, and platform links',
  tags: ['podcast', 'listen', 'platforms', 'episode', 'audio'],
  fields: [
    commonFields.title,
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: 'The Dev Show', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '42', placeholder: '42', group: 'Content' as const },
    { key: 'tagline', label: 'Tagline', type: 'text' as const, defaultValue: 'Out now', placeholder: 'Out now', group: 'Content' as const },
    { key: 'platform1', label: 'Platform 1', type: 'text' as const, defaultValue: 'Spotify', placeholder: 'Spotify', group: 'Content' as const },
    { key: 'platform2', label: 'Platform 2', type: 'text' as const, defaultValue: 'Apple Podcasts', placeholder: 'Apple Podcasts', group: 'Content' as const },
    { key: 'platform3', label: 'Platform 3', type: 'text' as const, defaultValue: 'YouTube', placeholder: 'YouTube', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Building Developer Tools That Scale',
    showName: 'The Dev Show',
    episodeNumber: '42',
    tagline: 'Out now',
    platform1: 'Spotify',
    platform2: 'Apple Podcasts',
    platform3: 'YouTube',
    bgColor: '#0d1117',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title ?? '').trim() || 'Episode Title', 80);
    const showName = truncate(String(params.showName ?? '').trim(), 40);
    const episodeNumber = truncate(String(params.episodeNumber ?? '').trim(), 12);
    const taglineRaw = params.tagline !== undefined ? String(params.tagline).trim() : 'Out now';
    const tagline = truncate(taglineRaw, 40);

    const p1 = params.platform1 !== undefined ? String(params.platform1).trim() : 'Spotify';
    const p2 = params.platform2 !== undefined ? String(params.platform2).trim() : 'Apple Podcasts';
    const p3 = params.platform3 !== undefined ? String(params.platform3).trim() : 'YouTube';

    const platforms = [p1, p2, p3]
      .filter((p) => p.length > 0)
      .slice(0, 3)
      .map((p) => truncate(p, 28));

    const bgColorRaw = String(params.bgColor || '#0d1117');
    const accentColorRaw = String(params.accentColor || '#E07A5F');
    const textColorRaw = String(params.textColor || '#FFFFFF');

    const bgColor = bgColorRaw.startsWith('#') ? bgColorRaw : `#${bgColorRaw}`;
    const accentColor = accentColorRaw.startsWith('#') ? accentColorRaw : `#${accentColorRaw}`;
    const textColor = textColorRaw.startsWith('#') ? textColorRaw : `#${textColorRaw}`;

    const lightBg = isLightColor(bgColor);
    const lightAccent = isLightColor(accentColor);

    // Ensure pill text remains readable for any accent color against the background
    const pillText = lightAccent === lightBg
      ? mixColors(accentColor, textColor, 0.6)
      : accentColor;

    const pillBg = lightAccent === lightBg
      ? `${pillText}18`
      : `${accentColor}18`;

    const pillBorder = lightAccent === lightBg
      ? `${pillText}44`
      : `${accentColor}55`;

    const bgEnd = lightBg
      ? mixColors(bgColor, textColor, 0.05)
      : mixColors(bgColor, '#000000', 0.35);

    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 52 },
      { maxLen: 50, size: 44 },
      { maxLen: 70, size: 36 },
      { maxLen: 100, size: 30 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(160deg, ${bgColor} 0%, ${bgEnd} 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 70px',
        },
        children: [
          // Top: Show name + episode badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '32px',
              },
              children: [
                // Podcast icon badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      background: accentColor,
                      flexShrink: 0,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '22px', color: contrastText(accentColor) },
                        children: '\u266A',
                      },
                    },
                  },
                },
                ...(showName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            fontWeight: 700,
                            color: `${textColor}cc`,
                            maxWidth: '700px',
                            whiteSpace: 'nowrap' as const,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          },
                          children: showName,
                        },
                      },
                    ]
                  : []),
                ...(episodeNumber
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            padding: '4px 14px',
                            background: pillBg,
                            borderRadius: '100px',
                            border: `1px solid ${pillBorder}`,
                            flexShrink: 0,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '14px',
                                fontWeight: 600,
                                color: pillText,
                              },
                              children: `EP ${episodeNumber}`,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Middle: Title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
              },
              children: {
                type: 'h1',
                props: {
                  style: {
                    display: 'flex',
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.25,
                    margin: 0,
                    maxWidth: '1060px',
                  },
                  children: title,
                },
              },
            },
          },
          // Bottom: Tagline + platform pills
          ...(tagline || platforms.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      marginTop: 'auto',
                      paddingTop: '24px',
                      borderTop: `1px solid ${textColor}15`,
                    },
                    children: [
                      ...(tagline
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '15px',
                                  fontWeight: 600,
                                  color: lightBg
                                    ? mixColors(textColor, bgColor, 0.4)
                                    : `${textColor}88`,
                                  letterSpacing: '0.08em',
                                  textTransform: 'uppercase' as const,
                                  marginBottom: platforms.length > 0 ? '16px' : '0px',
                                },
                                children: tagline,
                              },
                            },
                          ]
                        : []),
                      ...(platforms.length > 0
                        ? [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '14px',
                                  flexWrap: 'nowrap' as const,
                                },
                                children: platforms.map((name) => ({
                                  type: 'div',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                      padding: '10px 22px',
                                      borderRadius: '100px',
                                      background: pillBg,
                                      border: `1.5px solid ${pillBorder}`,
                                      maxWidth: '320px',
                                    },
                                    children: {
                                      type: 'span',
                                      props: {
                                        style: {
                                          fontSize: '16px',
                                          fontWeight: 600,
                                          color: pillText,
                                          whiteSpace: 'nowrap' as const,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                        },
                                        children: name,
                                      },
                                    },
                                  },
                                })),
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
