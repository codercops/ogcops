import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-listen-on',
  name: 'Listen On',
  category: 'podcast',
  description: 'Podcast episode announcement with links to listening platforms',
  tags: ['podcast', 'episode', 'listen', 'platforms', 'announcement'],
  fields: [
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: 'The Signal', placeholder: 'The Signal', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode Number', type: 'text' as const, defaultValue: '42', placeholder: '42', group: 'Content' as const },
    commonFields.title,
    { key: 'platform1', label: 'Platform 1', type: 'text' as const, defaultValue: 'Spotify', placeholder: 'Spotify', group: 'Content' as const },
    { key: 'platform2', label: 'Platform 2', type: 'text' as const, defaultValue: 'Apple Podcasts', placeholder: 'Apple Podcasts', group: 'Content' as const },
    { key: 'platform3', label: 'Platform 3', type: 'text' as const, defaultValue: 'YouTube', placeholder: 'YouTube', group: 'Content' as const },
    { key: 'tagline', label: 'Tagline', type: 'text' as const, defaultValue: 'Out now', placeholder: 'Out now', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    showName: 'The Signal',
    episodeNumber: '42',
    title: 'Why We Build for the Open Web',
    platform1: 'Spotify',
    platform2: 'Apple Podcasts',
    platform3: 'YouTube',
    tagline: 'Out now',
    bgColor: '#0d1117',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const showName = truncate(String(params.showName ?? '').trim(), 40);
    const episodeNumber = String(params.episodeNumber ?? '').trim();
    const title = truncate(String(params.title ?? '').trim() || 'Episode Title', 80);
    const tagline = String(params.tagline ?? '').trim();
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const accentTextColor = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const platformTextColor = contrastText(accentColor);
    const platforms = ['platform1', 'platform2', 'platform3']
      .map((key) => String(params[key] ?? '').trim())
      .filter(Boolean)
      .map((platform) => truncate(platform, 22));
    const titleSize = autoFontSize(title, [
      { maxLen: 28, size: 64 },
      { maxLen: 48, size: 54 },
      { maxLen: 68, size: 44 },
      { maxLen: 80, size: 36 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '1200px',
          height: '630px',
          padding: '72px 84px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minHeight: '32px',
              },
              children: [
                ...(showName
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '20px', fontWeight: 700, color: textColor },
                        children: showName,
                      },
                    }]
                  : []),
                ...(showName && episodeNumber
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '20px', fontWeight: 600, color: accentTextColor },
                        children: '·',
                      },
                    }]
                  : []),
                ...(episodeNumber
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '18px', fontWeight: 600, color: textColor },
                        children: `Episode ${truncate(episodeNumber, 20)}`,
                      },
                    }]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                alignItems: 'center',
                padding: '32px 0',
              },
              children: {
                type: 'h1',
                props: {
                  style: {
                    fontSize: `${titleSize}px`,
                    fontWeight: 700,
                    color: textColor,
                    lineHeight: 1.15,
                    margin: 0,
                    maxWidth: '960px',
                  },
                  children: title,
                },
              },
            },
          },
          ...(tagline || platforms.length
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '24px',
                    minHeight: '52px',
                  },
                  children: [
                    ...(tagline
                      ? [{
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '20px',
                              fontWeight: 700,
                              color: accentTextColor,
                              flexShrink: 0,
                            },
                            children: truncate(tagline, 32),
                          },
                        }]
                      : []),
                    ...(platforms.length
                      ? [{
                          type: 'div',
                          props: {
                            style: {
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              gap: '12px',
                              flex: 1,
                            },
                            children: platforms.map((platform) => ({
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  maxWidth: '250px',
                                  padding: '12px 18px',
                                  borderRadius: '100px',
                                  background: accentColor,
                                  color: platformTextColor,
                                  fontSize: '16px',
                                  fontWeight: 700,
                                  flexShrink: 0,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: { whiteSpace: 'nowrap' },
                                    children: platform,
                                  },
                                },
                              },
                            })),
                          },
                        }]
                      : []),
                  ],
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
