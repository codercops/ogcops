import { describe, expect, it } from 'vitest';
import podcastTopEpisodes from '@/templates/podcast/top-episodes';
import { podcastTopEpisodes as podcastTopEpisodesExport } from '@/templates/podcast';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { isLightColor, mixColors } from '@/templates/utils';

function walk(node: any, visit: (node: any) => void): void {
  if (!node || typeof node !== 'object') return;
  visit(node);
  const children = node.props?.children;
  if (Array.isArray(children)) children.forEach((child) => walk(child, visit));
  else walk(children, visit);
}

function rows(element: any): any[] {
  return element.props.children[2].props.children;
}

function textContent(element: any): string[] {
  const values: string[] = [];
  walk(element, (node) => {
    if (typeof node.props?.children === 'string') values.push(node.props.children);
  });
  return values;
}

describe('podcast-top-episodes', () => {
  it('skips blank episode titles and keeps ranks consecutive', () => {
    const rendered = podcastTopEpisodes.render({
      ...podcastTopEpisodes.defaults,
      episode1: 'First episode',
      episode2: '   ',
      episode3: 'Third episode',
    });
    expect(rows(rendered)).toHaveLength(2);
    expect(rows(rendered).map((row) => row.props.children[0].props.children)).toEqual(['01', '02']);
    expect(textContent(rendered)).toContain('Third episode');
  });

  it('hides empty durations without hiding the episode', () => {
    const rendered = podcastTopEpisodes.render({ ...podcastTopEpisodes.defaults, duration1: '   ' });
    const firstRow = rows(rendered)[0];
    expect(firstRow.props.children).toHaveLength(2);
    expect(textContent(rendered)).toContain(podcastTopEpisodes.defaults.episode1);
  });

  it('truncates long titles on one line while retaining the duration column', () => {
    const longTitle = 'A remarkably long episode title '.repeat(8);
    const rendered = podcastTopEpisodes.render({
      ...podcastTopEpisodes.defaults,
      episode1: longTitle,
      duration1: '48 min',
    });
    const firstRow = rows(rendered)[0];
    expect(firstRow.props.children[1].props.children).toBe(`${longTitle.slice(0, 55).trimEnd()}…`);
    expect(firstRow.props.children[1].props.style).toMatchObject({ flex: 1, minWidth: 0, whiteSpace: 'nowrap' });
    expect(firstRow.props.children[2].props.children).toBe('48 min');
    expect(firstRow.props.children[2].props.style).toMatchObject({ width: '120px', flexShrink: 0 });
  });

  it('uses a readable darkened rank color on a light background with a pale accent', () => {
    const params = { ...podcastTopEpisodes.defaults, bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' };
    const rendered = podcastTopEpisodes.render(params);
    const rankColor = rows(rendered)[0].props.children[0].props.style.color;
    expect(isLightColor(params.bgColor)).toBe(true);
    expect(rankColor).toBe(mixColors(params.accentColor, '#000000', 0.45));
    expect(textContent(rendered)).toContain('Most Played This Month');
    walk(rendered, (node) => {
      if (node.type === 'div') expect(node.props.style.display).toBe('flex');
    });
    expect(rendered.props.style).toMatchObject({ width: '1200px', height: '630px' });
  });

  it('exposes required fields and is exported and registered once', () => {
    for (const key of ['showName', 'title', 'episode1', 'episode2', 'episode3', 'duration1', 'duration2', 'duration3', 'bgColor', 'accentColor', 'textColor']) {
      expect(podcastTopEpisodes.fields.some((field) => field.key === key)).toBe(true);
    }
    expect(podcastTopEpisodesExport).toBe(podcastTopEpisodes);
    expect(getTemplate('podcast-top-episodes')).toBe(podcastTopEpisodes);
    expect(getTemplatesByCategory('podcast').filter((template) => template.id === 'podcast-top-episodes')).toHaveLength(1);
  });
});
