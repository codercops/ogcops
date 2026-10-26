import type { TemplateDefinition } from '../types';
import { commonFields, isLightColor, mixColors, truncate } from '../utils';

const template: TemplateDefinition = {
  id: 'podcast-top-episodes',
  name: 'Top Episodes',
  category: 'podcast',
  description: 'Podcast show card with a ranked list of up to three popular episodes and their durations',
  tags: ['podcast', 'episodes', 'ranking', 'list', 'show'],
  fields: [
    { key: 'showName', label: 'Show Name', type: 'text' as const, defaultValue: 'The Signal', placeholder: 'Podcast name', group: 'Content' as const },
    commonFields.title,
    ...[1, 2, 3].flatMap((number) => [
      { key: `episode${number}`, label: `Episode ${number}`, type: 'text' as const, defaultValue: ['The Stories We Tell About Tomorrow', 'Inside the Cities of the Future', 'A Better Way to Build'][number - 1], placeholder: 'Episode title', group: 'Content' as const },
      { key: `duration${number}`, label: `Duration ${number}`, type: 'text' as const, defaultValue: ['48 min', '36 min', '52 min'][number - 1], placeholder: '48 min', group: 'Content' as const },
    ]),
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    showName: 'The Signal',
    title: 'Most Played This Month',
    episode1: 'The Stories We Tell About Tomorrow',
    duration1: '48 min',
    episode2: 'Inside the Cities of the Future',
    duration2: '36 min',
    episode3: 'A Better Way to Build',
    duration3: '52 min',
    bgColor: '#0d1117',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const showName = truncate(String(params.showName ?? '').trim(), 48);
    const title = truncate(String(params.title ?? '').trim() || 'Top Episodes', 54);
    const episodes = [1, 2, 3]
      .map((number) => ({
        title: String(params[`episode${number}`] ?? '').trim(),
        duration: String(params[`duration${number}`] ?? '').trim(),
      }))
      .filter((episode) => episode.title);
    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedColor = mixColors(bgColor, textColor, isLightColor(bgColor) ? 0.68 : 0.62);

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          padding: '64px 72px',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          ...(showName
            ? [{
                type: 'div',
                props: {
                  style: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' },
                  children: [
                    { type: 'div', props: { style: { display: 'flex', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: accentInk } } },
                    { type: 'span', props: { style: { display: 'flex', fontSize: '20px', fontWeight: 700, color: mutedColor, letterSpacing: '0.04em' }, children: showName } },
                  ],
                },
              }]
            : []),
          {
            type: 'h1',
            props: { style: { display: 'flex', margin: '0 0 34px', fontSize: '42px', lineHeight: 1.15, fontWeight: 700, color: textColor }, children: title },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 },
              children: episodes.map((episode, index) => ({
                type: 'div',
                props: {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    minHeight: '92px',
                    padding: '0 24px',
                    gap: '24px',
                    borderRadius: '16px',
                    backgroundColor: `${textColor}08`,
                    border: `1px solid ${textColor}16`,
                  },
                  children: [
                    { type: 'span', props: { style: { display: 'flex', width: '76px', flexShrink: 0, fontSize: '38px', fontWeight: 800, color: accentInk }, children: String(index + 1).padStart(2, '0') } },
                    { type: 'span', props: { style: { display: 'flex', flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', fontSize: '24px', fontWeight: 600, color: textColor }, children: truncate(episode.title, 56) } },
                    ...(episode.duration
                      ? [{ type: 'span', props: { style: { display: 'flex', justifyContent: 'flex-end', width: '120px', flexShrink: 0, whiteSpace: 'nowrap', fontSize: '18px', color: mutedColor }, children: truncate(episode.duration, 12) } }]
                      : []),
                  ],
                },
              })),
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '22px' },
              children: [
                { type: 'span', props: { style: { display: 'flex', fontSize: '15px', fontWeight: 700, color: accentInk }, children: `${episodes.length} ${episodes.length === 1 ? 'EPISODE' : 'EPISODES'}` } },
                { type: 'span', props: { style: { display: 'flex', fontSize: '15px', color: mutedColor }, children: '·' } },
                { type: 'span', props: { style: { display: 'flex', fontSize: '15px', color: mutedColor }, children: 'PODCAST CHART' } },
              ],
            },
          },
        ],
      },
    };
  },
};

export default template;
