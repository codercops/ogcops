import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-poll',
  name: 'Reader Poll',
  category: 'newsletter',
  description: 'A newsletter reader poll with a question and up to four answer choices',
  tags: ['newsletter', 'poll', 'reader', 'question', 'email'],
  fields: [
    commonFields.siteName,
    { key: 'issue', label: 'Issue', type: 'text', defaultValue: 'Issue 42', placeholder: 'Issue 42', group: 'Content' },
    commonFields.title,
    { key: 'option1', label: 'Option 1', type: 'text', defaultValue: 'On my phone', placeholder: 'Answer option', group: 'Content' },
    { key: 'option2', label: 'Option 2', type: 'text', defaultValue: 'On my laptop', placeholder: 'Answer option', group: 'Content' },
    { key: 'option3', label: 'Option 3', type: 'text', defaultValue: 'Printed out', placeholder: 'Answer option', group: 'Content' },
    { key: 'option4', label: 'Option 4', type: 'text', defaultValue: 'I skim the subject line', placeholder: 'Answer option', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'The Friday Diff',
    issue: 'Issue 42',
    title: 'How do you read this newsletter?',
    option1: 'On my phone',
    option2: 'On my laptop',
    option3: 'Printed out',
    option4: 'I skim the subject line',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title || 'What do you think?').trim();
    const questionSize = autoFontSize(rawTitle, [
      { maxLen: 36, size: 58 },
      { maxLen: 64, size: 48 },
      { maxLen: 96, size: 40 },
      { maxLen: 140, size: 34 },
    ]);
    const title = truncate(rawTitle, 140);
    const siteName = truncate(String(params.siteName || '').trim(), 42);
    const issue = truncate(String(params.issue || '').trim(), 24);
    const answers = [params.option1, params.option2, params.option3, params.option4]
      .map((answer) => truncate(String(answer || '').trim(), 36))
      .filter(Boolean);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const pillBackground = mixColors(bgColor, textColor, lightBg ? 0.045 : 0.08);
    const pillBorder = mixColors(bgColor, textColor, lightBg ? 0.18 : 0.2);

    const optionPills: SatoriElement[] = answers.map((answer) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          width: '510px',
          height: '82px',
          boxSizing: 'border-box',
          padding: '18px 24px',
          gap: '18px',
          borderRadius: '16px',
          border: `1px solid ${pillBorder}`,
          backgroundColor: pillBackground,
          marginRight: '20px',
          marginBottom: '16px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexShrink: 0,
                width: '28px',
                height: '28px',
                boxSizing: 'border-box',
                borderRadius: '50%',
                border: `2px solid ${accentInk}`,
              },
              children: [],
            },
          },
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                minWidth: 0,
                fontSize: '22px',
                fontWeight: 600,
                lineHeight: 1.25,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                color: textColor,
              },
              children: answer,
            },
          },
        ],
      },
    }));

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          width: '1200px',
          height: '630px',
          padding: '54px 64px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                minHeight: '34px',
                marginBottom: '30px',
              },
              children: [
                ...(siteName
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '21px', fontWeight: 700, color: textColor },
                        children: siteName,
                      },
                    }]
                  : []),
                ...(issue
                  ? [{
                      type: 'span',
                      props: {
                        style: { fontSize: '17px', fontWeight: 600, color: mixColors(bgColor, textColor, 0.72) },
                        children: issue,
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
                alignItems: 'center',
                alignSelf: 'flex-start',
                padding: '8px 16px',
                marginBottom: '20px',
                borderRadius: '999px',
                border: `1px solid ${accentInk}55`,
                backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.16),
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '14px',
                    fontWeight: 700,
                    color: accentInk,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  },
                  children: 'Reader poll',
                },
              },
            },
          },
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                minHeight: '112px',
                maxHeight: '132px',
                margin: 0,
                marginBottom: '24px',
                fontSize: `${questionSize}px`,
                fontWeight: 700,
                lineHeight: 1.15,
                color: textColor,
              },
              children: title,
            },
          },
          ...(optionPills.length
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '1060px',
                  },
                  children: optionPills,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
