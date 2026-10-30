import { describe, expect, it } from 'vitest';
import podcastLiveRecording from '@/templates/podcast/live-recording';
import { podcastLiveRecording as podcastLiveRecordingExport } from '@/templates/podcast';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { mixColors } from '@/templates/utils';


function walk(node: any, visit: (node: any) => void): void {
  if (!node || typeof node !== 'object') return;

  visit(node);

  const children = node.props?.children;

  if (Array.isArray(children)) {
    children.forEach((child) => walk(child, visit));
  } else if (children && typeof children === 'object') {
    walk(children, visit);
  }
}


function textContent(element: any): string[] {
  const values: string[] = [];
  walk(element, (node) => {
    if (typeof node.props?.children === 'string') {
      values.push(node.props.children);
    }
  });
  return values;
}

describe('podcast-live-recording', () => {
  it('renders the live badge, show name, and episode topic', () => {
    const rendered = podcastLiveRecording.render(podcastLiveRecording.defaults);
    const text = textContent(rendered);

    expect(text).toContain('Recording live');
    expect(text).toContain('The Dev Show');
    expect(text).toContain('Shipping on Fridays: yes or no?');
    expect(rendered.props.style).toMatchObject({
      width: '1200px',
      height: '630px',
    });
  });

  it('hides blank optional show name and event details', () => {
    const rendered = podcastLiveRecording.render({
      ...podcastLiveRecording.defaults,
      showName: '   ',
      when: '   ',
      where: '',
    });
    const text = textContent(rendered);

    expect(text).toContain('Recording live');
    expect(text).not.toContain('The Dev Show');
    expect(text).not.toContain('When');
    expect(text).not.toContain('Where');
  });

  it('truncates long episode topics and reduces their font size', () => {
    const longTitle = 'A remarkably long episode topic '.repeat(8);
    const rendered = podcastLiveRecording.render({
      ...podcastLiveRecording.defaults,
      title: longTitle,
    });
    const text = textContent(rendered);

    expect(text).toContain(`${longTitle.slice(0, 159).trimEnd()}…`);

    let heading: any;
    walk(rendered, (node) => {
      if (node.type === 'h1') heading = node;
    });

    expect(heading).toBeDefined();
    expect(heading.props.style.fontSize).toBe('26px');
  });

  it('renders the live indicator as a plain circular dot', () => {
    const rendered = podcastLiveRecording.render(
      podcastLiveRecording.defaults,
    );

    let dot: any;
    walk(rendered, (node) => {
      if (
        node.props?.style?.width === '10px' &&
        node.props?.style?.height === '10px' &&
        node.props?.style?.borderRadius === '50%'
      ) {
        dot = node;
      }
    });

    expect(dot).toBeDefined();
    expect(dot.props.children).toBeUndefined();
  });

  it('darkens accent labels on a light background for readability', () => {
    const rendered = podcastLiveRecording.render(
      podcastLiveRecording.defaults,
    );

    const expectedColor = mixColors(
      podcastLiveRecording.defaults.accentColor as string,
      '#000000',
      0.45,
    );

    const labelColors: string[] = [];
    walk(rendered, (node) => {
      if (
        node.type === 'span' &&
        ['When', 'Where'].includes(node.props?.children)
      ) {
        labelColors.push(node.props.style.color);
      }
    });

    expect(labelColors).toEqual([expectedColor, expectedColor]);
  });

  it('exposes required fields and is exported and registered once', () => {
    for (const key of [
      'title',
      'showName',
      'when',
      'where',
      'bgColor',
      'accentColor',
      'textColor',
    ]) {
      expect(podcastLiveRecording.fields.some((field) => field.key === key)).toBe(true);
    }

    expect(podcastLiveRecordingExport).toBe(podcastLiveRecording);
    expect(getTemplate('podcast-live-recording')).toBe(podcastLiveRecording);
    expect(
      getTemplatesByCategory('podcast').filter(
        (template) => template.id === 'podcast-live-recording',
      ),
    ).toHaveLength(1);
  });
});