import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, contrastText, isLightColor, mixColors, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-interview-process',
  name: 'Interview Process',
  category: 'job',
  description: 'Hiring process overview with the company name, a headline, four numbered interview steps connected by a timeline, and an optional duration',
  tags: ['job', 'interview', 'hiring', 'process', 'recruitment'],
  fields: [
    { key: 'company', label: 'Company', type: 'text' as const, defaultValue: 'Acme Corp', placeholder: 'Company name', required: true, group: 'Content' as const },
    commonFields.title,
    { key: 'step1', label: 'Step 1', type: 'text' as const, defaultValue: 'Application Review', placeholder: 'Step 1', group: 'Content' as const },
    { key: 'step2', label: 'Step 2', type: 'text' as const, defaultValue: 'Recruiter Screen', placeholder: 'Step 2', group: 'Content' as const },
    { key: 'step3', label: 'Step 3', type: 'text' as const, defaultValue: 'Team Interview', placeholder: 'Step 3', group: 'Content' as const },
    { key: 'step4', label: 'Step 4', type: 'text' as const, defaultValue: 'Offer & Onboarding', placeholder: 'Step 4', group: 'Content' as const },
    { key: 'duration', label: 'Duration', type: 'text' as const, defaultValue: '3-4 weeks', placeholder: '3-4 weeks', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    company: 'Acme Corp',
    title: 'How We Hire',
    step1: 'Application Review',
    step2: 'Recruiter Screen',
    step3: 'Team Interview',
    step4: 'Offer & Onboarding',
    duration: '3-4 weeks',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const company = truncate(String(params.company ?? '').trim(), 32);
    const title = truncate(String(params.title ?? '').trim() || 'How We Hire', 60);
    const duration = truncate(String(params.duration ?? '').trim(), 40);
    const steps = [
      String(params.step1 ?? ''),
      String(params.step2 ?? ''),
      String(params.step3 ?? ''),
      String(params.step4 ?? ''),
    ]
      .map((step) => truncate(step.trim(), 60))
      .filter(Boolean);

    // The accent as text drops below a readable contrast on a light background.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const onAccent = contrastText(accentColor);
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 54 },
      { maxLen: 34, size: 46 },
      { maxLen: 48, size: 40 },
      { maxLen: 60, size: 34 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px',
        },
        children: [
          ...(company
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '22px',
                      fontWeight: 700,
                      color: accentInk,
                      letterSpacing: '0.04em',
                      marginBottom: '18px',
                    },
                    children: company,
                  },
                },
              ]
            : []),
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                color: textColor,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                margin: 0,
                marginBottom: '56px',
              },
              children: title,
            },
          },
          ...(steps.length > 0
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginTop: 'auto',
                      marginBottom: 'auto',
                      width: '100%',
                    },
                    children: steps.map((step, i) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          flex: 1,
                          flexDirection: 'column',
                          alignItems: 'center',
                        },
                        children: [
                          {
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                width: '100%',
                              },
                              children: [
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      flex: 1,
                                      height: '2px',
                                      backgroundColor: i === 0 ? 'transparent' : `${textColor}33`,
                                    },
                                  },
                                },
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      width: '64px',
                                      height: '64px',
                                      borderRadius: '50%',
                                      backgroundColor: accentColor,
                                    },
                                    children: {
                                      type: 'span',
                                      props: {
                                        style: {
                                          fontSize: '24px',
                                          fontWeight: 800,
                                          color: onAccent,
                                        },
                                        children: `${i + 1}`,
                                      },
                                    },
                                  },
                                },
                                {
                                  type: 'div',
                                  props: {
                                    style: {
                                      display: 'flex',
                                      flex: 1,
                                      height: '2px',
                                      backgroundColor: i === steps.length - 1 ? 'transparent' : `${textColor}33`,
                                    },
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: 'span',
                            props: {
                              style: {
                                padding: '0 16px',
                                marginTop: '24px',
                                fontSize: '20px',
                                fontWeight: 600,
                                color: `${textColor}DD`,
                                lineHeight: 1.35,
                                textAlign: 'center' as const,
                                wordBreak: 'break-word' as const,
                              },
                              children: step,
                            },
                          },
                        ],
                      },
                    })),
                  },
                },
              ]
            : []),
          ...(duration
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      justifyContent: 'center',
                      width: '100%',
                      marginTop: 'auto',
                      paddingTop: '32px',
                    },
                    children: {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '10px 24px',
                          borderRadius: '100px',
                          backgroundColor: `${accentColor}1A`,
                          border: `1px solid ${accentColor}55`,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '17px',
                              fontWeight: 600,
                              color: accentInk,
                            },
                            children: `Duration · ${duration}`,
                          },
                        },
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
