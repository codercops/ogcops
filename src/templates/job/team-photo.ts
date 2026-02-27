import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-team-photo',
  name: 'Team Photo',
  category: 'job',
  description: 'Team placeholder area with "Join Us" CTA and role name',
  tags: ['job', 'team', 'photo', 'join-us'],
  fields: [
    commonFields.title,
    { key: 'company', label: 'Company', type: 'text', defaultValue: 'TeamFirst', placeholder: 'Company name', group: 'Content' },
    { key: 'cta', label: 'CTA Text', type: 'text', defaultValue: 'Join Our Team', placeholder: 'Join Us', group: 'Content' },
    { key: 'teamSize', label: 'Team Size', type: 'text', defaultValue: '200+ team members', placeholder: 'Team size', group: 'Content' },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Engineering Manager',
    company: 'TeamFirst',
    cta: 'Join Our Team',
    teamSize: '200+ team members',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Engineering Manager'), 50);
    const company = String(params.company || '');
    const cta = String(params.cta || 'Join Our Team');
    const teamSize = String(params.teamSize || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 48 },
      { maxLen: 35, size: 40 },
      { maxLen: 50, size: 34 },
      { maxLen: 70, size: 28 },
    ]);

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
          // Left: team area placeholder
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '500px',
                height: '630px',
                background: `linear-gradient(180deg, ${accentColor}22 0%, ${accentColor}0A 100%)`,
              },
              children: [
                // Avatar grid (3x2)
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '12px',
                      justifyContent: 'center',
                      maxWidth: '280px',
                    },
                    children: [0, 1, 2, 3, 4, 5].map((i) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          backgroundColor: `${accentColor}${['22', '33', '44', '28', '38', '18'][i]}`,
                        },
                        children: [],
                      },
                    })),
                  },
                },
                ...(teamSize
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            color: `${textColor}55`,
                            marginTop: '24px',
                          },
                          children: teamSize,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right: info
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
                // Company
                ...(company
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 600,
                            color: `${textColor}66`,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase' as const,
                            marginBottom: '16px',
                          },
                          children: company,
                        },
                      },
                    ]
                  : []),
                // CTA
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '28px',
                      fontWeight: 300,
                      color: `${textColor}88`,
                      marginBottom: '12px',
                    },
                    children: cta,
                  },
                },
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
                      marginBottom: '32px',
                    },
                    children: title,
                  },
                },
                // Apply button mock
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '14px 36px',
                      backgroundColor: accentColor,
                      borderRadius: '8px',
                      alignSelf: 'flex-start',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                        },
                        children: 'Apply Now',
                      },
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
