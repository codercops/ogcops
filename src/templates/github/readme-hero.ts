import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-readme-hero',
  name: 'README Hero',
  category: 'github',
  description: 'Banner-style image designed to be used in README.md files',
  tags: ['github', 'readme', 'banner', 'hero', 'header'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'Fast, reliable, modern', group: 'Content' },
    { key: 'badges', label: 'Badge Text', type: 'text', defaultValue: 'MIT License', placeholder: 'MIT, v2.0, etc.', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'My Awesome Project',
    description: 'A modern, fast, and reliable toolkit for building web applications.',
    tagline: 'Fast. Reliable. Modern.',
    badges: 'MIT License',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'My Awesome Project'), 50);
    const description = params.description ? truncate(String(params.description), 140) : '';
    const tagline = String(params.tagline || '');
    const badges = String(params.badges || '');
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');
    const titleSize = autoFontSize(title, [
      { maxLen: 15, size: 72 },
      { maxLen: 30, size: 58 },
      { maxLen: 50, size: 46 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: `linear-gradient(180deg, ${bgColor} 0%, #161b22 100%)`,
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Subtle grid pattern (top area)
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '0',
                left: '0',
                width: '1200px',
                height: '630px',
                backgroundImage: `linear-gradient(${textColor}06 1px, transparent 1px), linear-gradient(90deg, ${textColor}06 1px, transparent 1px)`,
                backgroundSize: '60px 60px',
              },
              children: [],
            },
          },
          // Glow behind title
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                width: '600px',
                height: '300px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`,
              },
              children: [],
            },
          },
          // Badge
          ...(badges
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '6px 16px',
                      borderRadius: '6px',
                      background: `${accentColor}15`,
                      border: `1px solid ${accentColor}33`,
                      marginBottom: '24px',
                      zIndex: 1,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '13px',
                          fontWeight: 600,
                          color: accentColor,
                          fontFamily: 'JetBrains Mono, monospace',
                        },
                        children: badges,
                      },
                    },
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
                textAlign: 'center',
                zIndex: 1,
              },
              children: title,
            },
          },
          // Tagline
          ...(tagline
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      color: accentColor,
                      marginTop: '16px',
                      letterSpacing: '0.05em',
                      zIndex: 1,
                    },
                    children: tagline,
                  },
                },
              ]
            : []),
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}77`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '16px',
                      textAlign: 'center',
                      maxWidth: '750px',
                      zIndex: 1,
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Bottom decorative line
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '80px',
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                borderRadius: '2px',
                marginTop: '36px',
                zIndex: 1,
              },
              children: [],
            },
          },
        ],
      },
    };
  },
};

export default template;
