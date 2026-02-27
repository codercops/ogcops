import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-social-proof',
  name: 'Social Proof',
  category: 'saas',
  description: 'Customer logos area with headline and trust indicator',
  tags: ['social-proof', 'logos', 'trust', 'saas', 'customers'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'company1', label: 'Company 1', type: 'text', defaultValue: 'Stripe', placeholder: 'Company name', group: 'Content' },
    { key: 'company2', label: 'Company 2', type: 'text', defaultValue: 'Vercel', placeholder: 'Company name', group: 'Content' },
    { key: 'company3', label: 'Company 3', type: 'text', defaultValue: 'Linear', placeholder: 'Company name', group: 'Content' },
    { key: 'company4', label: 'Company 4', type: 'text', defaultValue: 'Notion', placeholder: 'Company name', group: 'Content' },
    { key: 'company5', label: 'Company 5', type: 'text', defaultValue: 'Figma', placeholder: 'Company name', group: 'Content' },
    { key: 'trustText', label: 'Trust Text', type: 'text', defaultValue: 'Trusted by 10,000+ teams worldwide', placeholder: 'Trust statement', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Used by the Best Teams',
    description: 'Join thousands of companies building better products.',
    company1: 'Stripe',
    company2: 'Vercel',
    company3: 'Linear',
    company4: 'Notion',
    company5: 'Figma',
    trustText: 'Trusted by 10,000+ teams worldwide',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#6366f1',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Used by the Best Teams'), 50);
    const description = params.description ? truncate(String(params.description), 100) : '';
    const companies = [
      String(params.company1 || 'Stripe'),
      String(params.company2 || 'Vercel'),
      String(params.company3 || 'Linear'),
      String(params.company4 || 'Notion'),
      String(params.company5 || 'Figma'),
    ];
    const trustText = String(params.trustText || 'Trusted by 10,000+ teams worldwide');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#6366f1');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 52 },
      { maxLen: 35, size: 44 },
      { maxLen: 50, size: 36 },
    ]);

    const companyLogo = (name: string) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '14px 28px',
          borderRadius: '12px',
          background: `${textColor}06`,
          border: `1px solid ${textColor}10`,
        },
        children: {
          type: 'span',
          props: {
            style: {
              fontSize: '16px',
              fontWeight: 600,
              color: `${textColor}55`,
              letterSpacing: '0.02em',
            },
            children: name,
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
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '56px',
        },
        children: [
          // Title + site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              },
              children: [
                {
                  type: 'h1',
                  props: {
                    style: {
                      fontSize: `${titleSize}px`,
                      fontWeight: 800,
                      color: textColor,
                      lineHeight: 1.2,
                      margin: 0,
                      maxWidth: '800px',
                    },
                    children: title,
                  },
                },
                ...(siteName
                  ? [
                      {
                        type: 'span',
                        props: {
                          style: { fontSize: '14px', color: `${textColor}44`, marginTop: '8px' },
                          children: siteName,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '20px',
                      color: `${textColor}66`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '12px',
                      maxWidth: '700px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // Spacer
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Trust text
          {
            type: 'span',
            props: {
              style: {
                fontSize: '13px',
                fontWeight: 500,
                color: `${textColor}44`,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                marginBottom: '20px',
              },
              children: trustText,
            },
          },
          // Company logos row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                gap: '16px',
                flexWrap: 'wrap',
              },
              children: companies.map((c) => companyLogo(c)),
            },
          },
          // Bottom accent line
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                width: '60px',
                height: '3px',
                background: accentColor,
                borderRadius: '2px',
                marginTop: '28px',
              },
              children: [],
            },
          },
        ],
      },
    };
  },
};

export default template;
