import type { TemplateDefinition } from '../types';
import { getAvatarColor, getInitials } from '../github/contributors-wall';
import { truncate, autoFontSize, commonFields } from '../utils';

const template: TemplateDefinition = {
  id: 'saas-integration',
  name: 'Integration Announcement',
  category: 'saas',
  description: 'Announce an integration between two products with app initials and a headline',
  tags: ['saas', 'integration', 'announcement', 'partnership', 'products'],
  fields: [
    { key: 'appOne', label: 'First App', type: 'text', defaultValue: 'Slack', placeholder: 'Slack', group: 'Content' },
    { key: 'appTwo', label: 'Second App', type: 'text', defaultValue: 'Linear', placeholder: 'Linear', group: 'Content' },
    commonFields.title,
    commonFields.description,
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    appOne: 'Slack',
    appTwo: 'Linear',
    title: 'Linear now works with Slack',
    description: 'Bring your workflows together with a seamless integration.',
    siteName: '',
    bgColor: '#0f172a',
    accentColor: '#8b5cf6',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const appOne = String(params.appOne || 'Slack').trim();
    const appTwo = String(params.appTwo || 'Linear').trim();
    const title = truncate(String(params.title || 'Linear now works with Slack'), 50);
    const description = params.description ? truncate(String(params.description), 120) : '';
    const siteName = String(params.siteName || '');
    const bgColor = String(params.bgColor || '#0f172a');
    const accentColor = String(params.accentColor || '#8b5cf6');
    const textColor = String(params.textColor || '#FFFFFF');
    const titleSize = autoFontSize(title, [
      { maxLen: 25, size: 48 },
      { maxLen: 40, size: 40 },
      { maxLen: 50, size: 34 },
    ]);

    const appCard = (name: string) => {
      const label = name ? truncate(name, 18) : '';
      const color = getAvatarColor(name);

      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '220px',
          },
          children: [
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '112px',
                  height: '112px',
                  borderRadius: '26px',
                  background: color,
                  boxShadow: `0 12px 28px ${color}44`,
                },
                children: {
                  type: 'span',
                  props: {
                    style: { fontSize: '42px', fontWeight: 800, color: '#FFFFFF' },
                    children: getInitials(name),
                  },
                },
              },
            },
            ...(label
              ? [{
                  type: 'span',
                  props: {
                    style: {
                      maxWidth: '210px',
                      marginTop: '14px',
                      overflow: 'hidden',
                      fontSize: '16px',
                      fontWeight: 600,
                      color: `${textColor}BB`,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    },
                    children: label,
                  },
                }]
              : []),
          ],
        },
      };
    };

    const connector = {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          alignItems: 'center',
          flex: 1,
          minWidth: '100px',
          margin: '0 14px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1, height: '2px' },
              children: Array.from({ length: 10 }, (_, index) => ({
                type: 'div',
                props: { style: { display: 'flex', flex: 1, height: '2px', marginRight: '6px', background: index % 2 === 0 ? `${textColor}44` : 'transparent' } },
              })),
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                width: '38px',
                height: '38px',
                margin: '0 12px',
                borderRadius: '50%',
                background: `${accentColor}22`,
                border: `1px solid ${accentColor}66`,
              },
              children: { type: 'span', props: { style: { fontSize: '22px', fontWeight: 500, color: accentColor }, children: '+' } },
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flex: 1, height: '2px' },
              children: Array.from({ length: 10 }, (_, index) => ({
                type: 'div',
                props: { style: { display: 'flex', flex: 1, height: '2px', marginRight: '6px', background: index % 2 === 0 ? `${textColor}44` : 'transparent' } },
              })),
            },
          },
        ],
      },
    };

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '1200px',
          height: '630px',
          padding: '48px 64px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          overflow: 'hidden',
        },
        children: [
          {
            type: 'div',
            props: {
              style: { display: 'flex', padding: '8px 16px', borderRadius: '999px', background: `${accentColor}22`, border: `1px solid ${accentColor}55` },
              children: { type: 'span', props: { style: { fontSize: '14px', fontWeight: 700, color: accentColor, letterSpacing: '0.08em', textTransform: 'uppercase' }, children: 'New integration' } },
            },
          },
          ...(siteName ? [{ type: 'span', props: { style: { marginTop: '14px', fontSize: '13px', color: `${textColor}55` }, children: siteName } }] : []),
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', width: '100%', marginTop: '42px' },
              children: [appCard(appOne), connector, appCard(appTwo)],
            },
          },
          {
            type: 'h1',
            props: { style: { maxWidth: '900px', margin: '34px 0 0', fontSize: `${titleSize}px`, fontWeight: 800, lineHeight: 1.1, textAlign: 'center', color: textColor }, children: title },
          },
          ...(description ? [{ type: 'p', props: { style: { maxWidth: '760px', margin: '16px 0 0', fontSize: '19px', lineHeight: 1.45, textAlign: 'center', color: `${textColor}77` }, children: description } }] : []),
        ],
      },
    };
  },
};

export default template;
