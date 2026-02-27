import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'tutorial-certification',
  name: 'Certification',
  category: 'tutorial',
  description: 'Certificate border design with course name and completion details',
  tags: ['tutorial', 'certification', 'certificate', 'achievement'],
  fields: [
    commonFields.title,
    { key: 'platform', label: 'Platform', type: 'text', defaultValue: 'DevAcademy', placeholder: 'Platform name', group: 'Content' },
    { key: 'credential', label: 'Credential', type: 'text', defaultValue: 'Professional Certificate', placeholder: 'Certificate type', group: 'Content' },
    { key: 'skills', label: 'Skills', type: 'text', defaultValue: 'React, Node.js, AWS', placeholder: 'Skills covered', group: 'Content' },
    commonFields.accentColor,
  ],
  defaults: {
    title: 'Full-Stack Web Development',
    platform: 'DevAcademy',
    credential: 'Professional Certificate',
    skills: 'React, Node.js, AWS',
    accentColor: '#C5A55A',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Full-Stack Web Development'), 60);
    const platform = String(params.platform || '');
    const credential = String(params.credential || '');
    const skills = String(params.skills || '');
    const accentColor = String(params.accentColor || '#C5A55A');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 48 },
      { maxLen: 40, size: 40 },
      { maxLen: 60, size: 34 },
      { maxLen: 80, size: 28 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          backgroundColor: '#0a0a0a',
          fontFamily: 'Inter, sans-serif',
          padding: '32px',
        },
        children: [
          // Certificate card with border
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                border: `3px solid ${accentColor}`,
                borderRadius: '8px',
                padding: '48px',
                position: 'relative',
              },
              children: [
                // Inner border
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '100%',
                      border: `1px solid ${accentColor}44`,
                      borderRadius: '4px',
                      padding: '40px',
                    },
                    children: [
                      // Platform name
                      ...(platform
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  fontWeight: 600,
                                  color: accentColor,
                                  letterSpacing: '0.2em',
                                  textTransform: 'uppercase' as const,
                                  marginBottom: '12px',
                                },
                                children: platform,
                              },
                            },
                          ]
                        : []),
                      // Credential type
                      ...(credential
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '14px',
                                  color: '#888888',
                                  letterSpacing: '0.15em',
                                  textTransform: 'uppercase' as const,
                                  marginBottom: '24px',
                                },
                                children: credential,
                              },
                            },
                          ]
                        : []),
                      // Decorative line
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '80px',
                            height: '2px',
                            backgroundColor: accentColor,
                            marginBottom: '24px',
                          },
                          children: [],
                        },
                      },
                      // Course title
                      {
                        type: 'h1',
                        props: {
                          style: {
                            fontSize: `${titleSize}px`,
                            fontFamily: 'Playfair Display, serif',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            lineHeight: 1.2,
                            margin: 0,
                            textAlign: 'center',
                            marginBottom: '24px',
                          },
                          children: title,
                        },
                      },
                      // Decorative line
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            width: '80px',
                            height: '2px',
                            backgroundColor: accentColor,
                            marginBottom: '24px',
                          },
                          children: [],
                        },
                      },
                      // Skills
                      ...(skills
                        ? [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '16px',
                                  color: '#999999',
                                  textAlign: 'center',
                                },
                                children: skills,
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
