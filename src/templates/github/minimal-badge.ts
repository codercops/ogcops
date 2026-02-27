import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'github-minimal-badge',
  name: 'Minimal Badge',
  category: 'github',
  description: 'Clean minimal design with icon, project name, and tagline',
  tags: ['github', 'minimal', 'badge', 'clean', 'simple'],
  fields: [
    { key: 'repoName', label: 'Repository', type: 'text', defaultValue: 'my-project', placeholder: 'repo-name', group: 'Content' },
    commonFields.description,
    { key: 'icon', label: 'Icon/Emoji', type: 'text', defaultValue: '\u2B21', placeholder: 'Emoji or symbol', group: 'Content' },
    { key: 'badge', label: 'Badge Text', type: 'text', defaultValue: 'Open Source', placeholder: 'Badge label', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    repoName: 'my-project',
    description: 'A lightweight, zero-dependency utility library.',
    icon: '\u2B21',
    badge: 'Open Source',
    bgColor: '#fafafa',
    accentColor: '#0969da',
    textColor: '#1f2328',
  },
  render: (params) => {
    const repoName = String(params.repoName || 'my-project');
    const description = params.description ? truncate(String(params.description), 100) : '';
    const icon = String(params.icon || '\u2B21');
    const badge = String(params.badge || '');
    const bgColor = String(params.bgColor || '#fafafa');
    const accentColor = String(params.accentColor || '#0969da');
    const textColor = String(params.textColor || '#1f2328');
    const nameSize = autoFontSize(repoName, [
      { maxLen: 12, size: 56 },
      { maxLen: 20, size: 46 },
      { maxLen: 35, size: 38 },
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
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Icon in circle
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: `${accentColor}10`,
                border: `2px solid ${accentColor}25`,
                marginBottom: '28px',
              },
              children: {
                type: 'span',
                props: {
                  style: { fontSize: '36px', color: accentColor },
                  children: icon,
                },
              },
            },
          },
          // Repo name
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${nameSize}px`,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.1,
                margin: 0,
                textAlign: 'center',
                letterSpacing: '-0.02em',
              },
              children: repoName,
            },
          },
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
                      marginTop: '14px',
                      textAlign: 'center',
                      maxWidth: '650px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Badge
          ...(badge
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '6px 18px',
                      borderRadius: '100px',
                      background: `${accentColor}10`,
                      border: `1px solid ${accentColor}25`,
                      marginTop: '28px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '14px',
                          fontWeight: 600,
                          color: accentColor,
                        },
                        children: badge,
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
