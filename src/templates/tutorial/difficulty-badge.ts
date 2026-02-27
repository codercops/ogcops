import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-difficulty-badge',
  name: 'Difficulty Badge',
  category: 'tutorial',
  description: 'Large difficulty indicator with course title and details',
  tags: ['tutorial', 'difficulty', 'badge', 'level'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'difficulty', label: 'Difficulty', type: 'select', defaultValue: 'Intermediate', options: [{ label: 'Beginner', value: 'Beginner' }, { label: 'Intermediate', value: 'Intermediate' }, { label: 'Advanced', value: 'Advanced' }], required: true, group: 'Content' },
    { key: 'duration', label: 'Duration', type: 'text', defaultValue: '6 hours', placeholder: '6 hours', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Advanced TypeScript Patterns',
    description: 'Master generics, conditional types, template literals, and advanced inference techniques.',
    difficulty: 'Advanced',
    duration: '6 hours',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Advanced TypeScript Patterns'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const difficulty = String(params.difficulty || 'Intermediate');
    const duration = String(params.duration || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 48 },
      { maxLen: 40, size: 40 },
      { maxLen: 60, size: 34 },
      { maxLen: 80, size: 28 },
    ]);

    const difficultyConfig: Record<string, { color: string; bars: number }> = {
      Beginner: { color: '#10B981', bars: 1 },
      Intermediate: { color: '#F59E0B', bars: 2 },
      Advanced: { color: '#EF4444', bars: 3 },
    };
    const config = difficultyConfig[difficulty] || difficultyConfig.Intermediate;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Left: difficulty indicator
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '360px',
                height: '630px',
                backgroundColor: `${config.color}11`,
                borderRight: `3px solid ${config.color}44`,
              },
              children: [
                // Bars
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '8px',
                      marginBottom: '24px',
                    },
                    children: [1, 2, 3].map((level) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          width: '24px',
                          height: `${level * 28}px`,
                          backgroundColor: level <= config.bars ? config.color : `${textColor}1A`,
                          borderRadius: '4px',
                        },
                        children: [],
                      },
                    })),
                  },
                },
                // Difficulty label
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '32px',
                      fontWeight: 800,
                      color: config.color,
                      letterSpacing: '0.05em',
                    },
                    children: difficulty,
                  },
                },
              ],
            },
          },
          // Right: content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px',
              },
              children: [
                // Title
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      marginBottom: '20px',
                    },
                    children: title,
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
                            color: `${textColor}80`,
                            lineHeight: 1.5,
                            margin: 0,
                            marginBottom: '32px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
                // Duration
                ...(duration
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            padding: '8px 20px',
                            backgroundColor: `${textColor}0F`,
                            borderRadius: '100px',
                            alignSelf: 'flex-start',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: { fontSize: '16px', color: `${textColor}AA` },
                              children: duration,
                            },
                          },
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
