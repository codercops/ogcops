import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, contrastText, isLightColor, mixColors, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'job-open-roles',
  name: 'Open Roles',
  category: 'job',
  description: 'Hiring announcement card with an open-role count badge, role list with Apply pills, and a careers link',
  tags: ['job', 'hiring', 'open roles', 'careers', 'recruitment'],
  fields: [
    { ...commonFields.title, defaultValue: "We're hiring" },
    { key: 'company', label: 'Company', type: 'text' as const, defaultValue: 'Acme Corp', placeholder: 'Company name', required: true, group: 'Content' as const },
    { key: 'role1', label: 'Role 1', type: 'text' as const, defaultValue: 'Senior Frontend Engineer', placeholder: 'Role title', group: 'Content' as const },
    { key: 'role2', label: 'Role 2', type: 'text' as const, defaultValue: 'Product Designer', placeholder: 'Role title', group: 'Content' as const },
    { key: 'role3', label: 'Role 3', type: 'text' as const, defaultValue: 'DevOps Engineer', placeholder: 'Role title', group: 'Content' as const },
    { key: 'role4', label: 'Role 4', type: 'text' as const, defaultValue: 'Data Analyst', placeholder: 'Role title', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: 'Remote · Worldwide', placeholder: 'Location', group: 'Content' as const },
    { key: 'ctaText', label: 'Careers Link Text', type: 'text' as const, defaultValue: 'acme.com/careers', placeholder: 'acme.com/careers', group: 'Content' as const },
    commonFields.bgColor,
    { ...commonFields.accentColor, defaultValue: '#22C55E' },
    commonFields.textColor,
  ],
  defaults: {
    title: "We're hiring",
    company: 'Acme Corp',
    role1: 'Senior Frontend Engineer',
    role2: 'Product Designer',
    role3: 'DevOps Engineer',
    role4: 'Data Analyst',
    location: 'Remote · Worldwide',
    ctaText: 'acme.com/careers',
    bgColor: '#0a0a0a',
    accentColor: '#22C55E',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || "We're hiring"), 48);
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 56 },
      { maxLen: 32, size: 46 },
      { maxLen: 48, size: 38 },
    ]);
    const company = truncate(String(params.company || 'Company'), 30);
    const roles = [
      String(params.role1 || ''),
      String(params.role2 || ''),
      String(params.role3 || ''),
      String(params.role4 || ''),
    ]
      .map((r: string) => truncate(r.trim(), 40))
      .filter(Boolean);
    const roleCount = roles.length;
    const location = params.location ? truncate(String(params.location), 32) : '';
    const ctaText = params.ctaText ? truncate(String(params.ctaText), 32) : '';
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#22C55E');
    const textColor = String(params.textColor || '#FFFFFF');
    const onAccent = contrastText(accentColor);
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

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
          // Top row: company + open-roles badge
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '18px',
                    },
                    children: [
                      // Company initial square
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '26px',
                                fontWeight: 700,
                                color: onAccent,
                              },
                              children: company.charAt(0).toUpperCase(),
                            },
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '24px',
                            fontWeight: 700,
                            color: textColor,
                          },
                          children: company,
                        },
                      },
                    ],
                  },
                },
                // Open-roles count badge
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 22px',
                      borderRadius: '100px',
                      border: `1px solid ${accentColor}66`,
                      backgroundColor: `${accentColor}14`,
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '16px',
                            fontWeight: 700,
                            color: accentInk,
                            letterSpacing: '0.03em',
                          },
                          children: `${roleCount} open role${roleCount === 1 ? '' : 's'}`,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Headline
          {
            type: 'span',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1.15,
              },
              children: title,
            },
          },
          // Role rows
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginTop: '28px',
              },
              children: roles.map((role: string) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '14px 28px',
                    borderRadius: '16px',
                    border: `1px solid ${textColor}1A`,
                    backgroundColor: `${textColor}08`,
                  },
                  children: [
                    {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '21px',
                          fontWeight: 600,
                          color: textColor,
                        },
                        children: role,
                      },
                    },
                    {
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          padding: '9px 24px',
                          borderRadius: '100px',
                          backgroundColor: accentColor,
                        },
                        children: {
                          type: 'span',
                          props: {
                            style: {
                              fontSize: '15px',
                              fontWeight: 700,
                              color: onAccent,
                            },
                            children: 'Apply',
                          },
                        },
                      },
                    },
                  ],
                },
              })),
            },
          },
          // Footer: location + careers link
          ...(location || ctaText
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      marginTop: 'auto',
                      paddingTop: '16px',
                    },
                    children: [
                      ...(location
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '17px',
                                  color: `${textColor}77`,
                                },
                                children: location,
                              },
                            },
                          ]
                        : []),
                      ...(location && ctaText
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '17px',
                                  color: `${textColor}33`,
                                },
                                children: '·',
                              },
                            },
                          ]
                        : []),
                      ...(ctaText
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '17px',
                                  fontWeight: 600,
                                  color: accentInk,
                                },
                                children: ctaText,
                              },
                            },
                          ]
                        : []),
                    ],
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
