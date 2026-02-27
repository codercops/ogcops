import type { TemplateDefinition } from '../types';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'product-centered-hero',
  name: 'Centered Hero',
  category: 'product',
  description: 'Product name centered with tagline and CTA pill button',
  tags: ['centered', 'hero', 'product', 'launch', 'cta'],
  fields: [
    commonFields.title,
    commonFields.description,
    { key: 'tagline', label: 'Tagline', type: 'text', defaultValue: '', placeholder: 'The future of...', group: 'Content' },
    { key: 'cta', label: 'CTA Text', type: 'text', defaultValue: 'Get Started', placeholder: 'Try Free, Learn More...', group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Your Product Name',
    description: 'A short description of what your product does and why it matters.',
    tagline: 'The future of productivity',
    cta: 'Get Started',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Your Product Name'), 60);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const tagline = String(params.tagline || '');
    const cta = String(params.cta || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 20, size: 72 },
      { maxLen: 40, size: 60 },
      { maxLen: 60, size: 48 },
    ]);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '1200px',
          height: '630px',
          background: `radial-gradient(ellipse at center, ${bgColor}ee 0%, ${bgColor} 70%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Tagline
          ...(tagline
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '6px 18px',
                      borderRadius: '100px',
                      border: `1px solid ${accentColor}66`,
                      background: `${accentColor}15`,
                      marginBottom: '24px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '16px',
                          fontWeight: 500,
                          color: accentColor,
                          letterSpacing: '0.02em',
                        },
                        children: tagline,
                      },
                    },
                  },
                },
              ]
            : []),
          // Title
          {
            type: 'h1',
            props: {
              style: {
                fontSize: `${titleSize}px`,
                fontWeight: 800,
                color: textColor,
                lineHeight: 1.15,
                margin: 0,
                textAlign: 'center',
                fontFamily: 'Playfair Display, serif',
              },
              children: title,
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'p',
                  props: {
                    style: {
                      fontSize: '22px',
                      color: `${textColor}99`,
                      lineHeight: 1.5,
                      margin: 0,
                      marginTop: '20px',
                      textAlign: 'center',
                      maxWidth: '800px',
                    },
                    children: description,
                  },
                },
              ]
            : []),
          // CTA pill
          ...(cta
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      marginTop: '36px',
                      padding: '14px 40px',
                      background: accentColor,
                      borderRadius: '100px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 600,
                          color: '#FFFFFF',
                        },
                        children: cta,
                      },
                    },
                  },
                },
              ]
            : []),
          // Site name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '14px',
                      color: `${textColor}44`,
                      marginTop: '40px',
                      letterSpacing: '0.05em',
                    },
                    children: siteName,
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
