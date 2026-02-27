import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-video-thumbnail',
  name: 'Video Thumbnail',
  category: 'podcast',
  description: 'YouTube-style thumbnail with large play button triangle, title, and channel info',
  tags: ['podcast', 'video', 'youtube', 'thumbnail'],
  fields: [
    commonFields.title,
    { key: 'channelName', label: 'Channel Name', type: 'text' as const, defaultValue: '', placeholder: 'DevTube', group: 'Content' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const, defaultValue: '', placeholder: '45:32', group: 'Content' as const },
    { key: 'subtitle', label: 'Subtitle', type: 'text' as const, defaultValue: '', placeholder: 'with Jane Smith', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Building Production-Ready AI Apps',
    channelName: 'DevTube',
    duration: '1:24:08',
    subtitle: 'with Jane Smith',
    bgColor: '#0d1117',
    accentColor: '#FF0000',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Video Title'), 60);
    const channelName = String(params.channelName || '');
    const duration = String(params.duration || '');
    const subtitle = String(params.subtitle || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#FF0000');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 52 },
      { maxLen: 40, size: 44 },
      { maxLen: 55, size: 38 },
      { maxLen: 70, size: 32 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(135deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Large play button center
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                right: '100px',
                top: '120px',
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: accentColor,
              },
              children: {
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    width: 0,
                    height: 0,
                    borderTop: '22px solid transparent',
                    borderBottom: '22px solid transparent',
                    borderLeft: '36px solid #FFFFFF',
                    marginLeft: '8px',
                  },
                  children: '',
                },
              },
            },
          },
          // Content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '60px',
                justifyContent: 'flex-end',
              },
              children: [
                // Channel name
                ...(channelName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            marginBottom: '20px',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  background: accentColor,
                                },
                                children: {
                                  type: 'span',
                                  props: {
                                    style: { fontSize: '16px', fontWeight: 700, color: '#FFFFFF' },
                                    children: channelName.charAt(0).toUpperCase(),
                                  },
                                },
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '16px', fontWeight: 600, color: `${textColor}aa` },
                                children: channelName,
                              },
                            },
                          ],
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
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.15,
                      margin: 0,
                      maxWidth: '800px',
                    },
                    children: title,
                  },
                },
                // Subtitle
                ...(subtitle
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '20px',
                            color: `${textColor}77`,
                            marginTop: '12px',
                          },
                          children: subtitle,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Duration badge (bottom right)
          ...(duration
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      position: 'absolute',
                      right: '24px',
                      bottom: '24px',
                      padding: '6px 12px',
                      background: '#000000cc',
                      borderRadius: '6px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                          fontFamily: 'JetBrains Mono, monospace',
                        },
                        children: duration,
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
