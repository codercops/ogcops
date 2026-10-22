import type { TemplateDefinition, SatoriElement } from '../types';
import { truncate, autoFontSize, commonFields, isLightColor, mixColors } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-conversation',
  name: 'Conversation',
  category: 'podcast',
  description: 'Two-person podcast conversation card with guest initials and episode branding',
  tags: ['podcast', 'conversation', 'interview', 'guests'],
  fields: [
    commonFields.title,
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: '', placeholder: 'The Dev Show', group: 'Content' as const },
    { key: 'episodeNumber', label: 'Episode #', type: 'text' as const, defaultValue: '', placeholder: '42', group: 'Content' as const },
    { key: 'guest1', label: 'Guest 1', type: 'text' as const, defaultValue: '', placeholder: 'Jane Smith', group: 'Content' as const },
    { key: 'guest1Role', label: 'Guest 1 Role', type: 'text' as const, defaultValue: '', placeholder: 'Host', group: 'Content' as const },
    { key: 'guest2', label: 'Guest 2', type: 'text' as const, defaultValue: '', placeholder: 'Alex Chen', group: 'Content' as const },
    { key: 'guest2Role', label: 'Guest 2 Role', type: 'text' as const, defaultValue: '', placeholder: 'Guest', group: 'Content' as const },
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'The Future of Developer Tools',
    showName: 'The Dev Show',
    episodeNumber: '42',
    guest1: 'Jane Smith',
    guest1Role: 'Host',
    guest2: 'Alex Chen',
    guest2Role: 'Guest',
    bgColor: '#0f0f23',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const title = truncate(String(params.title || 'Episode Title'), 80);
    const showName = truncate(String(params.showName || ''), 36);
    const episodeNumber = truncate(String(params.episodeNumber || ''), 12);
    const guest1 = truncate(String(params.guest1 || ''), 28);
    const guest1Role = truncate(String(params.guest1Role || ''), 38);
    const guest2 = truncate(String(params.guest2 || ''), 28);
    const guest2Role = truncate(String(params.guest2Role || ''), 38);
    const bgColor = String(params.bgColor || '#0f0f23');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const ink = (color: string) => (isLightColor(bgColor) ? mixColors(color, '#000000', 0.45) : color);
    const titleSize = autoFontSize(title, [
      { maxLen: 30, size: 36 },
      { maxLen: 50, size: 30 },
      { maxLen: 70, size: 26 },
      { maxLen: 100, size: 22 },
    ]);

    const guestCard = (name: string, role: string, color: string): SatoriElement => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '360px',
          maxWidth: '360px',
          textAlign: 'center',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '124px',
                height: '124px',
                borderRadius: '50%',
                background: `${color}22`,
                border: `4px solid ${color}`,
                marginBottom: '20px',
              },
              children: {
                type: 'span',
                props: {
                  style: { fontSize: '48px', fontWeight: 700, color },
                  children: name ? name.charAt(0).toUpperCase() : '?',
                },
              },
            },
          },
          {
            type: 'span',
            props: {
              style: {
                maxWidth: '360px',
                fontSize: '26px',
                fontWeight: 700,
                color: textColor,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              children: name || 'Guest',
            },
          },
          ...(role
            ? [{
                type: 'span',
                props: {
                  style: {
                    maxWidth: '360px',
                    fontSize: '15px',
                    color: `${textColor}77`,
                    marginTop: '8px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  },
                  children: role,
                },
              }]
            : []),
        ],
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
          padding: '52px 64px',
        },
        children: [
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
              },
              children: [
                ...(showName
                  ? [{
                      type: 'span',
                      props: { style: { fontSize: '18px', fontWeight: 700, color: ink(accentColor) }, children: showName },
                    }]
                  : [{ type: 'div', props: { children: '' } }]),
                ...(episodeNumber
                  ? [{
                      type: 'div',
                      props: {
                        style: { display: 'flex', padding: '6px 14px', background: `${textColor}0a`, borderRadius: '100px' },
                        children: { type: 'span', props: { style: { fontSize: '13px', fontWeight: 600, color: `${textColor}99` }, children: `EP ${episodeNumber}` } },
                      },
                    }]
                  : []),
              ],
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '24px' },
              children: [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'center' },
                    children: [
                      guestCard(guest1, guest1Role, ink(accentColor)),
                      { type: 'span', props: { style: { fontSize: '34px', fontWeight: 700, color: `${textColor}66`, marginTop: '41px' }, children: '&' } },
                      guestCard(guest2, guest2Role, ink('#7B61FF')),
                    ],
                  },
                },
              ],
            },
          },
          {
            type: 'h1',
            props: {
              style: { display: 'flex', justifyContent: 'center', width: '100%', fontSize: `${titleSize}px`, fontWeight: 700, color: textColor, textAlign: 'center', lineHeight: 1.2, margin: 0 },
              children: title,
            },
          },
        ],
      },
    };
  },
};

export default template;
