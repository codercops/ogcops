import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

const cleanText = (value: unknown, maxLength: number) =>
  truncate(String(value ?? '').replace(/\s+/g, ' ').trim(), maxLength);

const template: TemplateDefinition = {
  id: 'newsletter-mailbag',
  name: 'Mailbag',
  category: 'newsletter',
  description: 'Newsletter mailbag issue with reader questions and who asked them',
  tags: ['newsletter', 'mailbag', 'questions', 'readers', 'qa', 'email'],
  fields: [
    { ...commonFields.siteName, defaultValue: 'The Friday Diff' },
    {
      key: 'issue',
      label: 'Issue',
      type: 'text',
      defaultValue: 'Issue 58',
      placeholder: 'Issue 58',
      group: 'Content',
    },
    {
      ...commonFields.title,
      defaultValue: 'Your questions about going freelance',
      placeholder: 'The issue title...',
    },
    {
      key: 'question1',
      label: 'Question 1',
      type: 'text',
      defaultValue: 'How did you find your first client?',
      placeholder: 'Question 1',
      group: 'Content',
    },
    {
      key: 'asker1',
      label: 'Asker 1',
      type: 'text',
      defaultValue: 'Sam, Lisbon',
      placeholder: 'Asker 1',
      group: 'Content',
    },
    {
      key: 'question2',
      label: 'Question 2',
      type: 'text',
      defaultValue: 'What do you charge for a small project?',
      placeholder: 'Question 2',
      group: 'Content',
    },
    {
      key: 'asker2',
      label: 'Asker 2',
      type: 'text',
      defaultValue: 'Priya',
      placeholder: 'Asker 2',
      group: 'Content',
    },
    {
      key: 'question3',
      label: 'Question 3',
      type: 'text',
      defaultValue: 'Do you still take full-time offers?',
      placeholder: 'Question 3',
      group: 'Content',
    },
    {
      key: 'asker3',
      label: 'Asker 3',
      type: 'text',
      defaultValue: 'A reader in Toronto',
      placeholder: 'Asker 3',
      group: 'Content',
    },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    siteName: 'The Friday Diff',
    issue: 'Issue 58',
    title: 'Your questions about going freelance',
    question1: 'How did you find your first client?',
    asker1: 'Sam, Lisbon',
    question2: 'What do you charge for a small project?',
    asker2: 'Priya',
    question3: 'Do you still take full-time offers?',
    asker3: 'A reader in Toronto',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = cleanText(params.title, 140);
    const titleSize = rawTitle
      ? autoFontSize(rawTitle, [
          { maxLen: 40, size: 46 },
          { maxLen: 65, size: 38 },
          { maxLen: 95, size: 32 },
          { maxLen: 140, size: 28 },
        ])
      : 40;
    const title = rawTitle;

    const siteName = cleanText(params.siteName, 42);
    const issue = cleanText(params.issue, 24);

    const rawQuestions = [
      { q: params.question1, a: params.asker1 },
      { q: params.question2, a: params.asker2 },
      { q: params.question3, a: params.asker3 },
    ];

    const questions = rawQuestions
      .map(({ q, a }) => ({
        question: cleanText(q, 120),
        asker: cleanText(a, 40),
      }))
      .filter((item) => Boolean(item.question));

    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const lightBg = isLightColor(bgColor);
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mainColor = lightBg && isLightColor(textColor) ? '#111111' : textColor;
    const mutedColor = mixColors(bgColor, mainColor, 0.65);
    const rowBackground = mixColors(bgColor, mainColor, lightBg ? 0.04 : 0.07);
    const rowBorder = mixColors(bgColor, mainColor, lightBg ? 0.15 : 0.18);

    const headerItems: SatoriElement[] = [
      ...(siteName
        ? [
            {
              type: 'span',
              props: {
                style: {
                  fontSize: '21px',
                  fontWeight: 700,
                  color: mainColor,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                children: siteName,
              },
            },
          ]
        : []),
      ...(issue
        ? [
            {
              type: 'span',
              props: {
                style: {
                  fontSize: '17px',
                  fontWeight: 600,
                  color: mutedColor,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
                children: issue,
              },
            },
          ]
        : []),
    ];

    const questionRows: SatoriElement[] = questions.map((item) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          width: '100%',
          padding: '16px 20px',
          marginBottom: '14px',
          borderRadius: '14px',
          border: `1px solid ${rowBorder}`,
          backgroundColor: rowBackground,
        },
        children: [
          // Q circle
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: `2px solid ${accentInk}`,
                color: accentInk,
                fontSize: '15px',
                fontWeight: 700,
                marginRight: '16px',
              },
              children: 'Q',
            },
          },
          // Question text
          {
            type: 'span',
            props: {
              style: {
                display: 'flex',
                flex: 1,
                minWidth: 0,
                fontSize: '20px',
                fontWeight: 600,
                lineHeight: 1.25,
                color: mainColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              children: item.question,
            },
          },
          // Asker (if present)
          ...(item.asker
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      display: 'flex',
                      flexShrink: 0,
                      maxWidth: '320px',
                      marginLeft: '24px',
                      fontSize: '16px',
                      fontWeight: 500,
                      color: mutedColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    children: item.asker,
                  },
                },
              ]
            : []),
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
          // Header row (siteName and issue)
          ...(headerItems.length
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent:
                        siteName && issue
                          ? 'space-between'
                          : siteName
                            ? 'flex-start'
                            : 'flex-end',
                      width: '100%',
                      marginBottom: '24px',
                    },
                    children: headerItems,
                  },
                },
              ]
            : []),
          // Mailbag pill
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'flex-start',
                padding: '7px 16px',
                marginBottom: '18px',
                borderRadius: '999px',
                border: `1px solid ${accentInk}55`,
                backgroundColor: mixColors(bgColor, accentInk, lightBg ? 0.08 : 0.16),
              },
              children: {
                type: 'span',
                props: {
                  style: {
                    fontSize: '13px',
                    fontWeight: 700,
                    color: accentInk,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  },
                  children: 'Mailbag',
                },
              },
            },
          },
          // Title
          ...(title
            ? [
                {
                  type: 'h1',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      margin: '0 0 24px 0',
                      fontSize: `${titleSize}px`,
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: mainColor,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    },
                    children: title,
                  },
                },
              ]
            : []),
          // Question rows
          ...(questionRows.length
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                    },
                    children: questionRows,
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
