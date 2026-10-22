import type { TemplateDefinition, SatoriElement } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-quiz-card',
  name: 'Quiz Card',
  category: 'tutorial',
  description: 'A daily quiz question with four choices and an optional revealed answer',
  tags: ['quiz', 'question', 'learning', 'education', 'answers'],
  fields: [
    commonFields.title,
    { key: 'optionA', label: 'Option A', type: 'text', defaultValue: 'A closure', placeholder: 'Answer option A', required: true, group: 'Content' },
    { key: 'optionB', label: 'Option B', type: 'text', defaultValue: 'A promise', placeholder: 'Answer option B', required: true, group: 'Content' },
    { key: 'optionC', label: 'Option C', type: 'text', defaultValue: 'A callback', placeholder: 'Answer option C', required: true, group: 'Content' },
    { key: 'optionD', label: 'Option D', type: 'text', defaultValue: 'A module', placeholder: 'Answer option D', required: true, group: 'Content' },
    { key: 'correctOption', label: 'Correct Option', type: 'select', defaultValue: 'A', options: [{ label: 'A', value: 'A' }, { label: 'B', value: 'B' }, { label: 'C', value: 'C' }, { label: 'D', value: 'D' }], required: true, group: 'Content' },
    { key: 'showAnswer', label: 'Show Answer', type: 'toggle', defaultValue: false, group: 'Content' },
    commonFields.category,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Which JavaScript feature lets a function remember variables from its outer scope?',
    optionA: 'A closure',
    optionB: 'A promise',
    optionC: 'A callback',
    optionD: 'A module',
    correctOption: 'A',
    showAnswer: false,
    category: 'JavaScript',
    bgColor: '#0f172a',
    accentColor: '#38bdf8',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your quiz question'), 110);
    const options = [
      ['A', String(params.optionA || 'Option A')],
      ['B', String(params.optionB || 'Option B')],
      ['C', String(params.optionC || 'Option C')],
      ['D', String(params.optionD || 'Option D')],
    ] as const;
    const correctOption = String(params.correctOption || 'A').toUpperCase();
    const showAnswer = params.showAnswer === true || params.showAnswer === 'true' || params.showAnswer === '1';
    const category = truncate(String(params.category || ''), 28);
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#38bdf8');
    const textColor = String(params.textColor || '#f8fafc');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = isLightColor(bgColor) ? '#475569' : '#94a3b8';
    const questionSize = autoFontSize(title, [
      { maxLen: 48, size: 42 },
      { maxLen: 76, size: 36 },
      { maxLen: 110, size: 30 },
    ]);

    const optionCard = ([letter, value]: readonly [string, string]): SatoriElement => {
      const isCorrect = showAnswer && correctOption === letter;
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            width: '520px',
            height: '112px',
            boxSizing: 'border-box',
            padding: '20px 24px',
            gap: '18px',
            borderRadius: '16px',
            border: `2px solid ${isCorrect ? accentColor : `${textColor}26`}`,
            backgroundColor: isCorrect ? accentColor : `${textColor}0A`,
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: isCorrect ? `${contrastText(accentColor)}22` : `${accentColor}22`,
                },
                children: {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 700,
                      color: isCorrect ? contrastText(accentColor) : accentInk,
                    },
                    children: letter,
                  },
                },
              },
            },
            {
              type: 'span',
              props: {
                style: {
                  display: 'flex',
                  flex: 1,
                  fontSize: '21px',
                  lineHeight: 1.25,
                  fontWeight: isCorrect ? 700 : 500,
                  color: isCorrect ? contrastText(accentColor) : textColor,
                },
                children: truncate(value, 40),
              },
            },
            ...(isCorrect
              ? [{
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '6px 10px',
                      borderRadius: '100px',
                      backgroundColor: `${contrastText(accentColor)}22`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { fontSize: '13px', fontWeight: 700, color: contrastText(accentColor) },
                        children: 'Correct',
                      },
                    },
                  },
                }]
              : []),
          ],
        },
      };
    };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          padding: '42px 64px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '12px', height: '40px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', padding: '8px 16px', borderRadius: '100px', backgroundColor: accentColor },
                    children: { type: 'span', props: { style: { fontSize: '14px', fontWeight: 700, color: contrastText(accentColor), letterSpacing: '0.08em', textTransform: 'uppercase' }, children: 'Quiz' } },
                  },
                },
                ...(category
                  ? [{
                      type: 'div',
                      props: {
                        style: { display: 'flex', padding: '8px 16px', borderRadius: '100px', backgroundColor: `${textColor}12` },
                        children: { type: 'span', props: { style: { fontSize: '14px', fontWeight: 600, color: textColor }, children: category } },
                      },
                    }]
                  : []),
              ],
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                height: '126px',
                margin: '16px 0 20px',
                fontSize: `${questionSize}px`,
                lineHeight: 1.2,
                fontWeight: 700,
                color: textColor,
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexWrap: 'wrap',
                width: '1072px',
                gap: '16px',
              },
              children: options.map(optionCard),
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' },
              children: [
                { type: 'span', props: { style: { fontSize: '15px', fontWeight: 600, color: mutedColor }, children: 'Choose the best answer' } },
                ...(showAnswer
                  ? [{ type: 'span', props: { style: { fontSize: '14px', fontWeight: 700, color: accentInk }, children: 'Answer revealed' } }]
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
