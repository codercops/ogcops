import type { TemplateDefinition } from '../types';
import { truncate, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'event-countdown',
  name: 'Countdown',
  category: 'event',
  description: 'Large date numbers with registration CTA and event branding',
  tags: ['countdown', 'date', 'registration', 'cta', 'event'],
  fields: [
    commonFields.title,
    { key: 'day', label: 'Day', type: 'text' as const, defaultValue: '15', placeholder: '15', group: 'Content' as const },
    { key: 'month', label: 'Month', type: 'text' as const, defaultValue: 'MAR', placeholder: 'MAR', group: 'Content' as const },
    { key: 'year', label: 'Year', type: 'text' as const, defaultValue: '2026', placeholder: '2026', group: 'Content' as const },
    { key: 'ctaText', label: 'CTA Text', type: 'text' as const, defaultValue: 'Register Now', placeholder: 'Register Now', group: 'Content' as const },
    { key: 'location', label: 'Location', type: 'text' as const, defaultValue: '', placeholder: 'San Francisco', group: 'Content' as const },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'DevConf 2026',
    day: '15',
    month: 'MAR',
    year: '2026',
    ctaText: 'Register Now',
    location: 'San Francisco, CA',
    siteName: '',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Event Name'), 50);
    const day = String(params.day || '15');
    const month = String(params.month || 'MAR');
    const year = String(params.year || '2026');
    const ctaText = String(params.ctaText || 'Register Now');
    const location = String(params.location || '');
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
          width: '1200px',
          height: '630px',
          background: `linear-gradient(150deg, ${bgColor} 0%, #1a1a2e 100%)`,
          fontFamily: 'Inter, sans-serif',
          padding: '60px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Background large date
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                right: '-20px',
                bottom: '-40px',
                fontSize: '320px',
                fontWeight: 900,
                color: `${accentColor}08`,
                lineHeight: 0.8,
                fontFamily: 'Inter, sans-serif',
              },
              children: day,
            },
          },
          // Top: site name
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '16px',
                      fontWeight: 600,
                      color: accentColor,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                    },
                    children: title,
                  },
                },
                siteName
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '14px', color: `${textColor}44` },
                        children: siteName,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
              ],
            },
          },
          // Main: big date display
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'baseline',
                gap: '24px',
                marginTop: '40px',
              },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '180px',
                      fontWeight: 900,
                      color: textColor,
                      lineHeight: 1,
                      fontFamily: 'Inter, sans-serif',
                    },
                    children: day,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                    },
                    children: [
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '48px',
                            fontWeight: 800,
                            color: accentColor,
                            letterSpacing: '0.06em',
                            lineHeight: 1.2,
                          },
                          children: month,
                        },
                      },
                      {
                        type: 'span',
                        props: {
                          style: {
                            fontSize: '36px',
                            fontWeight: 300,
                            color: `${textColor}66`,
                            lineHeight: 1.2,
                          },
                          children: year,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Bottom: location + CTA
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 'auto',
              },
              children: [
                location
                  ? {
                      type: 'span',
                      props: {
                        style: { fontSize: '18px', color: `${textColor}77` },
                        children: location,
                      },
                    }
                  : { type: 'div', props: { children: '' } },
                // CTA button
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      padding: '16px 40px',
                      background: accentColor,
                      borderRadius: '12px',
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: {
                          fontSize: '18px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          letterSpacing: '0.04em',
                        },
                        children: ctaText,
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
