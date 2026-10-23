import type { SatoriElement, TemplateDefinition } from '../types';
import { truncate, autoFontSize, mixColors, isLightColor, contrastText, commonFields } from '../utils';

const MAX_TOPICS = 4;

const template: TemplateDefinition = {
  id: 'event-call-for-speakers',
  name: 'Call for Speakers',
  category: 'event',
  description: 'A call for speakers with the event name, up to four topic chips, a deadline and a Submit a talk button',
  tags: ['event', 'speakers', 'cfp', 'conference', 'meetup'],
  fields: [
    commonFields.title,
    { key: 'topics', label: 'Topics (comma separated)', type: 'text', defaultValue: 'AI, Web, DevOps, Security', placeholder: 'AI, Web, DevOps', group: 'Content' },
    { key: 'deadline', label: 'Deadline', type: 'text', defaultValue: 'Nov 30, 2026', placeholder: 'Nov 30, 2026', group: 'Content' },
    { key: 'ctaText', label: 'Button Text', type: 'text', defaultValue: 'Submit a talk', placeholder: 'Submit a talk', group: 'Content' },
    commonFields.siteName,
    { ...commonFields.bgColor, defaultValue: '#0b1020' },
    { ...commonFields.accentColor, defaultValue: '#4f46e5' },
    { ...commonFields.textColor, defaultValue: '#f8fafc' },
  ],
  defaults: {
    title: 'DevConf 2027',
    topics: 'AI, Web, DevOps, Security',
    deadline: 'Nov 30, 2026',
    ctaText: 'Submit a talk',
    siteName: '',
    bgColor: '#0b1020',
    accentColor: '#4f46e5',
    textColor: '#f8fafc',
  },
  render: (params) => {
    const title = truncate(String(params.title || '').trim() || 'DevConf 2027', 60);
    // Empty entries are dropped, at most four chips show, and each is shortened.
    const topics = String(params.topics ?? '')
      .split(',')
      .map((topic) => topic.trim())
      .filter(Boolean)
      .slice(0, MAX_TOPICS)
      .map((topic) => truncate(topic, 22));
    const deadline = truncate(String(params.deadline ?? '').trim(), 24);
    const ctaText = truncate(String(params.ctaText ?? '').trim() || 'Submit a talk', 20);
    const siteName = truncate(String(params.siteName ?? '').trim(), 40);
    const bgColor = String(params.bgColor || '#0b1020');
    const accentColor = String(params.accentColor || '#4f46e5');
    const textColor = String(params.textColor || '#f8fafc');

    const titleSize = autoFontSize(title, [
      { maxLen: 16, size: 96 },
      { maxLen: 28, size: 80 },
      { maxLen: 44, size: 64 },
      { maxLen: 60, size: 52 },
    ]);

    // Neutral colors are mixed from the background and text colors, so the card reads
    // the same on dark and on light backgrounds.
    const lightBg = isLightColor(bgColor);
    const mutedText = mixColors(bgColor, textColor, 0.65);
    const secondaryText = mixColors(bgColor, textColor, 0.8);
    // An accent as light as the background (or as dark as it) is hard to read as text,
    // so pull it toward the text color. Otherwise it reads as it is.
    const accentText = isLightColor(accentColor) === lightBg ? mixColors(accentColor, textColor, 0.55) : accentColor;
    const buttonText = contrastText(accentColor);

    const chips: SatoriElement[] = topics.map((topic) => ({
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexShrink: 0,
          padding: '10px 24px',
          borderRadius: '999px',
          background: `${accentColor}22`,
          border: `2px solid ${accentColor}88`,
        },
        children: {
          type: 'span',
          props: { style: { fontSize: '26px', fontWeight: 600, color: accentText }, children: topic },
        },
      },
    }));

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
          padding: '60px 72px',
        },
        children: [
          // Label and site name
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: { fontSize: '24px', fontWeight: 700, color: accentText, letterSpacing: '0.14em', textTransform: 'uppercase' },
                    children: 'Call for speakers',
                  },
                },
                ...(siteName
                  ? [{ type: 'span', props: { style: { fontSize: '22px', color: mutedText }, children: siteName } }]
                  : []),
              ],
            },
          },
          // Spacer above the event name
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Event name
          {
            type: 'div',
            props: {
              style: { display: 'flex' },
              children: {
                type: 'span',
                props: {
                  style: { fontSize: `${titleSize}px`, fontWeight: 700, color: textColor, lineHeight: 1.1, letterSpacing: '-0.03em' },
                  children: title,
                },
              },
            },
          },
          // Topic chips
          ...(chips.length
            ? [
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', flexShrink: 0, flexWrap: 'wrap', gap: '14px', marginTop: '36px' },
                    children: chips,
                  },
                },
              ]
            : []),
          // Spacer below the chips
          { type: 'div', props: { style: { display: 'flex', flex: 1 }, children: [] } },
          // Deadline and button
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' },
              children: [
                // The deadline is left out when empty, and the button stays on the right
                ...(deadline
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', marginRight: '40px' },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: { fontSize: '20px', fontWeight: 600, color: mutedText, letterSpacing: '0.12em', textTransform: 'uppercase' },
                                children: 'Deadline',
                              },
                            },
                            {
                              type: 'span',
                              props: { style: { fontSize: '40px', fontWeight: 700, color: secondaryText, marginTop: '6px' }, children: deadline },
                            },
                          ],
                        },
                      },
                    ]
                  : [{ type: 'div', props: { style: { display: 'flex' }, children: [] } }]),
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '22px 44px', borderRadius: '16px', background: accentColor },
                    children: {
                      type: 'span',
                      props: { style: { fontSize: '30px', fontWeight: 700, color: buttonText }, children: ctaText },
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
