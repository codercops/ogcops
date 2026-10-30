import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, truncate } from '../utils';

// An omitted field falls back to its default, but a blank one is hidden.
function optionalText(value: unknown, fallback: string, maxLength: number): string {
  return truncate((value === undefined ? fallback : String(value)).trim(), maxLength);
}

const template: TemplateDefinition = {
  id: 'job-referral',
  name: 'Referral Bonus',
  category: 'job',
  description: 'Ask people to refer a friend for an open role, with the role, the company, a large referral bonus and how to refer',
  tags: ['job', 'referral', 'hiring', 'bonus', 'recruiting'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'Acme', placeholder: 'Company name', group: 'Content' },
    { key: 'bonus', label: 'Referral Bonus', type: 'text', defaultValue: '$2,000', placeholder: '$2,000', group: 'Content' },
    { key: 'bonusLabel', label: 'Bonus Label', type: 'text', defaultValue: 'referral bonus', placeholder: 'referral bonus', group: 'Content' },
    { key: 'note', label: 'How to Refer', type: 'text', defaultValue: 'Send their name to jobs@acme.com', placeholder: 'Send their name to jobs@acme.com', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Senior Backend Engineer',
    company: 'Acme',
    bonus: '$2,000',
    bonusLabel: 'referral bonus',
    note: 'Send their name to jobs@acme.com',
    siteName: 'acme.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawRole = String(params.title || 'Senior Backend Engineer').trim() || 'Senior Backend Engineer';
    const roleSize = autoFontSize(rawRole, [
      { maxLen: 22, size: 64 },
      { maxLen: 36, size: 54 },
      { maxLen: 50, size: 44 },
      { maxLen: 60, size: 38 },
    ]);
    const role = truncate(rawRole, 60);
    const company = optionalText(params.company, 'Acme', 40);
    const bonus = optionalText(params.bonus, '$2,000', 14);
    // The label is drawn inside the bonus row, so it goes when the bonus does.
    const bonusLabel = optionalText(params.bonusLabel, 'referral bonus', 24);
    const bonusSize = autoFontSize(bonus, [
      { maxLen: 8, size: 128 },
      { maxLen: 11, size: 104 },
      { maxLen: 14, size: 84 },
    ]);
    const note = optionalText(params.note, 'Send their name to jobs@acme.com', 70);
    const siteName = optionalText(params.siteName, 'acme.com', 50);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    // The label and the bonus are drawn in the accent on the page background,
    // so the accent is darkened when that background is light.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px 80px',
        },
        children: [
          // Label, role and company
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      fontWeight: 800,
                      color: accentInk,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase' as const,
                    },
                    children: 'Know someone?',
                  },
                },
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${roleSize}px`,
                      fontWeight: 700,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      marginTop: '16px',
                    },
                    children: role,
                  },
                },
                ...(company
                  ? [{
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '30px',
                          fontWeight: 500,
                          color: `${textColor}CC`,
                          marginTop: '12px',
                        },
                        children: `at ${company}`,
                      },
                    }]
                  : []),
              ],
            },
          },
          // Bonus, its label and how to refer
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
              },
              children: [
                ...(bonus
                  ? [{
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flexWrap: 'wrap' as const,
                          alignItems: 'baseline',
                          columnGap: '20px',
                        },
                        children: [
                          {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: `${bonusSize}px`,
                                fontWeight: 700,
                                color: accentInk,
                                lineHeight: 1,
                                fontFamily: 'JetBrains Mono, monospace',
                              },
                              children: bonus,
                            },
                          },
                          ...(bonusLabel
                            ? [{
                                type: 'span',
                                props: {
                                  style: {
                                    fontSize: '28px',
                                    fontWeight: 600,
                                    color: `${textColor}99`,
                                  },
                                  children: bonusLabel,
                                },
                              }]
                            : []),
                        ],
                      },
                    }]
                  : []),
                ...(note
                  ? [{
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '26px',
                          fontWeight: 500,
                          color: textColor,
                          marginTop: bonus ? '28px' : '0px',
                        },
                        children: note,
                      },
                    }]
                  : []),
              ],
            },
          },
          // Site name
          ...(siteName
            ? [{
                type: 'span',
                props: {
                  style: {
                    fontSize: '18px',
                    fontWeight: 600,
                    color: `${textColor}80`,
                    letterSpacing: '0.06em',
                  },
                  children: siteName,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
