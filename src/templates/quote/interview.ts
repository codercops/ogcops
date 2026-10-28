import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'quote-interview',
  name: 'Interview Q&A',
  category: 'quote',
  description: 'Highlight a question and answer from an interview with the speaker and publication',
  tags: ['quote', 'interview', 'question', 'answer', 'q&a'],
  fields: [
    { key: 'question', label: 'Question', type: 'text', defaultValue: 'What would you tell yourself on day one?', placeholder: 'Ask a question...', group: 'Content' },
    { key: 'answer', label: 'Answer', type: 'textarea', defaultValue: 'Ship the small version first, then listen.', placeholder: 'Enter the answer...', required: true, group: 'Content' },
    { ...commonFields.author, defaultValue: 'Priya Raman', placeholder: 'Person name' },
    { key: 'role', label: 'Role', type: 'text', defaultValue: 'Staff Engineer at Acme', placeholder: 'Role or organization', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    question: 'What would you tell yourself on day one?',
    answer: 'Ship the small version first, then listen.',
    author: 'Priya Raman',
    role: 'Staff Engineer at Acme',
    siteName: 'THE BUILDER NOTES',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawQuestion = String(params.question ?? '').replace(/\s+/g, ' ').trim();
    const questionSize = autoFontSize(rawQuestion, [
      { maxLen: 38, size: 38 },
      { maxLen: 76, size: 32 },
      { maxLen: 120, size: 28 },
      { maxLen: 160, size: 24 },
    ]);
    const question = truncate(rawQuestion, 160);
    const rawAnswer = String(params.answer ?? 'Ship the small version first, then listen.')
      .replace(/\s+/g, ' ').trim() || 'Ship the small version first, then listen.';
    const answerSize = autoFontSize(rawAnswer, [
      { maxLen: 60, size: 54 },
      { maxLen: 120, size: 46 },
      { maxLen: 200, size: 38 },
      { maxLen: 300, size: 32 },
    ]);
    const answer = truncate(rawAnswer, 300);
    const author = cleanText(params.author, 48);
    const role = cleanText(params.role, 64);
    const siteName = cleanText(params.siteName, 48);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const answerColor = lightBg && isLightColor(textColor) ? '#111111' : textColor;
    const mutedColor = mixColors(bgColor, answerColor, 0.68);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          padding: '66px 84px 54px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          ...(question ? [{
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'flex-start', gap: '20px', minHeight: '76px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      width: '48px', height: '48px', borderRadius: '50%',
                      border: `2px solid ${accentInk}`, color: accentInk,
                      fontSize: '22px', fontWeight: 700, marginTop: '2px',
                    },
                    children: 'Q',
                  },
                },
                {
                  type: 'span',
                  props: {
                    style: { display: 'flex', flex: 1, minWidth: 0, fontSize: `${questionSize}px`, lineHeight: 1.2, fontWeight: 600, color: accentInk },
                    children: question,
                  },
                },
              ],
            },
          }] : []),
          {
            type: 'div',
            props: {
              style: {
                display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1,
                minHeight: 0, marginTop: question ? '20px' : 0,
                borderTop: question ? `1px solid ${mutedColor}55` : 'none',
              },
              children: [
                { type: 'span', props: { style: { display: 'flex', fontSize: '22px', lineHeight: 1, fontWeight: 700, color: accentInk, marginBottom: '18px' }, children: 'A' } },
                { type: 'span', props: { style: { display: 'flex', fontSize: `${answerSize}px`, lineHeight: 1.2, fontWeight: 600, color: answerColor }, children: answer } },
              ],
            },
          },
          ...(author || role || siteName ? [{
            type: 'div',
            props: {
              style: {
                display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px',
                minHeight: '56px', borderTop: `1px solid ${mutedColor}55`, paddingTop: '18px',
              },
              children: [
                ...(author || role ? [{
                  type: 'div',
                  props: {
                    style: { display: 'flex', flex: '1 1 auto', flexDirection: 'column', gap: '4px', minWidth: 0 },
                    children: [
                      ...(author ? [{ type: 'span', props: { style: { fontSize: '20px', fontWeight: 700, color: answerColor }, children: author } }] : []),
                      ...(role ? [{ type: 'span', props: { style: { fontSize: '16px', color: mutedColor }, children: role } }] : []),
                    ],
                  },
                }] : []),
                ...(siteName ? [{ type: 'span', props: { style: { display: 'flex', flexShrink: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '18px', fontWeight: 600, color: mutedColor, letterSpacing: '0.06em' }, children: siteName } }] : []),
              ],
            },
          }] : []),
        ],
      },
    };
  },
};

export default template;
