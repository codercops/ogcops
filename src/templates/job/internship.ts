import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'job-internship',
  name: 'Internship',
  category: 'job',
  description: 'An internship opening with an accent pill, the role, duration, start and stipend pills, and an application deadline',
  tags: ['job', 'internship', 'hiring', 'students', 'deadline'],
  fields: [
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'Acme Labs', placeholder: 'Company name', required: true, group: 'Content' },
    commonFields.title,
    { key: 'duration', label: 'Duration', type: 'text', defaultValue: '12 weeks', placeholder: '12 weeks', group: 'Content' },
    { key: 'start', label: 'Start', type: 'text', defaultValue: 'Starts May 2027', placeholder: 'Starts May 2027', group: 'Content' },
    { key: 'stipend', label: 'Stipend', type: 'text', defaultValue: 'Paid', placeholder: 'Paid', group: 'Content' },
    { key: 'deadline', label: 'Deadline', type: 'text', defaultValue: 'Apply by 15 November', placeholder: 'Apply by 15 November', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    company: 'Acme Labs',
    title: 'Frontend Engineering Intern',
    duration: '12 weeks',
    start: 'Starts May 2027',
    stipend: 'Paid',
    deadline: 'Apply by 15 November',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const company = truncate(String(params.company || 'Acme Labs').trim(), 40);
    const rawRole = String(params.title || 'Frontend Engineering Intern').trim() || 'Frontend Engineering Intern';
    const roleSize = autoFontSize(rawRole, [
      { maxLen: 26, size: 56 },
      { maxLen: 44, size: 46 },
      { maxLen: 70, size: 38 },
    ]);
    const role = truncate(rawRole, 70);
    const pills = [params.duration, params.start, params.stipend]
      .map((value) => truncate(String(value || '').trim(), 32))
      .filter(Boolean);
    const deadline = truncate(String(params.deadline || '').trim(), 48);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    // The pill keeps the accent as its background, so its label follows the accent's contrast.
    // The deadline is drawn in the accent on the page background, so it is darkened when that is light.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const pill = (text: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          padding: '8px 18px',
          backgroundColor: `${textColor}0F`,
          borderRadius: '100px',
          border: `1px solid ${textColor}1A`,
        },
        children: {
          type: 'span',
          props: {
            style: {
              fontSize: '17px',
              fontWeight: 500,
              color: `${textColor}CC`,
            },
            children: text,
          },
        },
      },
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px 80px',
        },
        children: [
          // Internship pill next to the company name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '8px 20px',
                      backgroundColor: accentColor,
                      borderRadius: '100px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '15px',
                          fontWeight: 800,
                          color: contrastText(accentColor),
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase' as const,
                        },
                        children: 'Internship',
                      },
                    },
                  },
                },
                ...(company
                  ? [{
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '22px',
                          fontWeight: 600,
                          color: textColor,
                        },
                        children: company,
                      },
                    }]
                  : []),
              ],
            },
          },
          // Role
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${roleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                marginTop: '26px',
              },
              children: role,
            },
          },
          // Duration, start and stipend pills
          ...(pills.length
            ? [{
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    marginTop: '34px',
                  },
                  children: pills.map(pill),
                },
              }]
            : []),
          // Deadline
          ...(deadline
            ? [{
                type: 'span',
                props: {
                  style: {
                    fontSize: '20px',
                    fontWeight: 600,
                    color: accentInk,
                    marginTop: '48px',
                  },
                  children: deadline,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
