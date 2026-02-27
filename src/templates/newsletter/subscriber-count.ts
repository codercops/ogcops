import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'newsletter-subscriber-count',
  name: 'Subscriber Count',
  category: 'newsletter',
  description: 'Large subscriber count number with newsletter name',
  tags: ['newsletter', 'subscribers', 'growth', 'social-proof'],
  fields: [
    commonFields.title,
    { key: 'subscriberCount', label: 'Subscriber Count', type: 'text', defaultValue: '50,000+', placeholder: '50,000+', group: 'Content' },
    commonFields.description,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Join the Community',
    subscriberCount: '50,000+',
    description: 'developers get our weekly newsletter',
    siteName: 'CodeWeekly',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Join the Community'), 60);
    const subscriberCount = String(params.subscriberCount || '50,000+');
    const description = String(params.description || '');
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');

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
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
        },
        children: [
          // Newsletter name
          ...(siteName
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '18px',
                      fontWeight: 700,
                      color: accentColor,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase' as const,
                      marginBottom: '48px',
                    },
                    children: siteName,
                  },
                },
              ]
            : []),
          // Large subscriber number
          {
            type: 'span',
            props: {
              style: {
                fontSize: '120px',
                fontWeight: 900,
                color: textColor,
                lineHeight: 1,
                fontFamily: 'JetBrains Mono, monospace',
              },
              children: subscriberCount,
            },
          },
          // Description
          ...(description
            ? [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '24px',
                      color: `${textColor}80`,
                      marginTop: '16px',
                    },
                    children: description,
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
                width: '60px',
                height: '3px',
                backgroundColor: accentColor,
                marginTop: '40px',
                marginBottom: '24px',
              },
              children: [],
            },
          },
          // CTA title
          {
            type: 'span',
            props: {
              style: {
                fontSize: '28px',
                fontWeight: 600,
                color: textColor,
              },
              children: title,
            },
          },
        ],
      },
    };
  },
};

export default template;
