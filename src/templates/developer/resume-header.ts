import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'developer-resume-header',
  name: 'Resume Header',
  category: 'developer',
  description: 'Professional resume top-section style with name, title, contact info',
  tags: ['developer', 'resume', 'professional', 'header'],
  fields: [
    { key: 'name', label: 'Name', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', required: true, group: 'Content' as const },
    { key: 'role', label: 'Job Title', type: 'text' as const, defaultValue: '', placeholder: 'Senior Software Engineer', group: 'Content' as const },
    { key: 'email', label: 'Email', type: 'text' as const, defaultValue: '', placeholder: 'jane@example.com', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco, CA', group: 'Content' as const },
    { key: 'website', label: 'Website', type: 'text' as const, defaultValue: '', placeholder: 'janesmith.dev', group: 'Content' as const },
    { key: 'summary', label: 'Summary', type: 'textarea' as const, defaultValue: '', placeholder: 'Brief professional summary', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    name: 'Jane Smith',
    role: 'Senior Software Engineer',
    email: 'jane@example.com',
    location: 'San Francisco, CA',
    website: 'janesmith.dev',
    summary: '8+ years building scalable web applications. Passionate about clean architecture and developer experience.',
    bgColor: '#FFFFFF',
    accentColor: '#2D3748',
    textColor: '#1A202C',
  },
  render: (params) => {
    const name = String(params.name || 'Developer');
    const role = String(params.role || '');
    const email = String(params.email || '');
    const location = String(params.location || '');
    const website = String(params.website || '');
    const summary = params.summary ? truncate(String(params.summary), 160) : '';
    const bgColor = String(params.bgColor || '#FFFFFF');
    const accentColor = String(params.accentColor || '#2D3748');
    const textColor = String(params.textColor || '#1A202C');

    const contactItems = [email, location, website].filter(Boolean);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          // Accent top bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '1200px',
                height: '6px',
                background: accentColor,
              },
              children: '',
            },
          },
          // Content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                padding: '60px 80px',
              },
              children: [
                // Name
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: '56px',
                      fontWeight: 300,
                      color: textColor,
                      lineHeight: 1.1,
                      margin: 0,
                      letterSpacing: '0.02em',
                    },
                    children: name,
                  },
                },
                // Role
                ...(role
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 600,
                            color: accentColor,
                            marginTop: '8px',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          },
                          children: role,
                        },
                      },
                    ]
                  : []),
                // Divider
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      width: '80px',
                      height: '3px',
                      background: accentColor,
                      marginTop: '24px',
                      marginBottom: '24px',
                    },
                    children: '',
                  },
                },
                // Contact row
                ...(contactItems.length > 0
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '24px',
                            marginBottom: '28px',
                          },
                          children: contactItems.map((item, i) => ({
                            type: 'div',
                            props: {
                              style: {
                                display: 'flex',
                                alignItems: 'center',
                                gap: '24px',
                              },
                              children: [
                                ...(i > 0
                                  ? [
                                      {
                                        type: 'span',
                                        props: {
                                          style: { fontSize: '16px', color: `${textColor}33` },
                                          children: '|',
                                        },
                                      },
                                    ]
                                  : []),
                                {
                                  type: 'span',
                                  props: {
                                    style: { fontSize: '16px', color: `${textColor}88` },
                                    children: item,
                                  },
                                },
                              ],
                            },
                          })),
                        },
                      },
                    ]
                  : []),
                // Summary
                ...(summary
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: 'auto',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '12px',
                                  fontWeight: 700,
                                  color: `${textColor}55`,
                                  letterSpacing: '0.15em',
                                  textTransform: 'uppercase',
                                  marginBottom: '12px',
                                },
                                children: 'SUMMARY',
                              },
                            },
                            {
                              type: 'p',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  color: `${textColor}bb`,
                                  lineHeight: 1.6,
                                  margin: 0,
                                  maxWidth: '800px',
                                },
                                children: summary,
                              },
                            },
                          ],
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
