import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-preview-text',
  name: 'Preview Text',
  category: 'newsletter',
  description: 'Email preview pane mockup with subject line and snippet',
  tags: ['newsletter', 'preview', 'email', 'inbox'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'sender', label: 'Sender Name', type: 'text', defaultValue: 'The Morning Brew', placeholder: 'Newsletter sender', group: 'Content' },
    commonFields.date,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your weekly dose of tech insights is here',
    description: 'This week we cover the latest in AI breakthroughs, a new CSS feature that changes everything, and why Rust is taking over backend development...',
    sender: 'The Morning Brew',
    date: 'Jan 15, 2026',
    bgColor: '#0f0f0f',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your weekly dose of tech insights is here'), 90);
    const description = params.description ? truncate(String(params.description), 160) : '';
    const sender = String(params.sender || 'Newsletter');
    const date = String(params.date || '');
    const bgColor = String(params.bgColor || '#0f0f0f');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Email preview card
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                backgroundColor: '#1a1a1a',
                borderRadius: '16px',
                border: `1px solid #333`,
                overflow: 'hidden',
              },
              children: [
                // Email header bar
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      padding: '20px 32px',
                      borderBottom: '1px solid #333',
                      gap: '16px',
                    },
                    children: [
                      // Avatar circle
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            backgroundColor: accentColor,
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '20px',
                                fontWeight: 700,
                                color: '#FFFFFF',
                              },
                              children: sender.charAt(0).toUpperCase(),
                            },
                          },
                        },
                      },
                      // Sender info
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: textColor,
                                },
                                children: sender,
                              },
                            },
                          ],
                        },
                      },
                      ...(date
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: `${textColor}66`,
                                },
                                children: date,
                              },
                            },
                          ]
                        : []),
                    ],
                  },
                },
                // Email body
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '32px',
                      gap: '16px',
                    },
                    children: [
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: '32px',
                            fontWeight: 700,
                            color: textColor,
                            lineHeight: 1.3,
                            margin: 0,
                          },
                          children: title,
                        },
                      },
                      ...(description
                        ? [
                            {
                              type: 'p',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  color: `${textColor}80`,
                                  lineHeight: 1.6,
                                  margin: 0,
                                },
                                children: description,
                              },
                            },
                          ]
                        : []),
                    ],
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
