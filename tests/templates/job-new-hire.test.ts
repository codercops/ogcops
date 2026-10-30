import { describe, expect, it } from 'vitest';
import newHire from '@/templates/job/new-hire';
import { getInitials } from '@/templates/github/contributors-wall';
import { getTemplate } from '@/templates/registry';
import { contrastText, isLightColor, mixColors } from '@/templates/utils';
import type { SatoriElement } from '@/templates/types';

function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (!node || typeof node !== 'object' || !('type' in node)) return [];

  const element = node as SatoriElement;
  return [element, ...elements(element.props.children)];
}

function textContent(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(textContent);
  if (node && typeof node === 'object' && 'props' in node) {
    return textContent((node as SatoriElement).props.children);
  }
  return [];
}

const render = (overrides: Record<string, unknown> = {}) =>
  newHire.render({ ...newHire.defaults, ...overrides });

const span = (tree: SatoriElement, text: string) =>
  elements(tree).find((element) => element.type === 'span' && textContent(element)[0] === text);

// The circle is the one div with a fixed, equal width and height.
const circle = (tree: SatoriElement) =>
  elements(tree).find((element) => element.type === 'div' && element.props.style?.borderRadius === '64px');

const initialsOf = (title: string) => textContent(circle(render({ title })))[0] ?? '';

describe('job-new-hire', () => {
  it('is registered in the job category and re-exported', async () => {
    expect(getTemplate('job-new-hire')?.category).toBe('job');
    const exports = await import('@/templates/job');
    expect(exports.jobNewHire.id).toBe('job-new-hire');
  });

  it('has the fields the issue asks for, with the defaults it names', () => {
    expect(newHire.fields.map((field) => field.key)).toEqual([
      'title', 'role', 'team', 'startDate', 'description', 'siteName', 'bgColor', 'accentColor', 'textColor',
    ]);
    expect(newHire.defaults).toMatchObject({
      title: 'Priya Sharma',
      role: 'Senior Backend Engineer',
      team: 'Platform team',
      startDate: 'Starts Nov 3',
      description: 'Excited to help build the payments stack',
    });
  });

  it('is 1200 by 630 and every div is flex', () => {
    const tree = render();
    expect(tree.props.style).toMatchObject({ width: '1200px', height: '630px' });
    for (const element of elements(tree).filter((el) => el.type === 'div')) {
      expect(element.props.style?.display).toBe('flex');
    }
  });

  it('renders the label, initials, name, role, team, start date, note and site name in order', () => {
    expect(textContent(render())).toEqual([
      'Welcome to the team',
      'PS',
      'Priya Sharma',
      'Senior Backend Engineer',
      'Platform team',
      '·',
      'Starts Nov 3',
      'Excited to help build the payments stack',
      'acme.com',
    ]);
  });

  it('hides a blank role, team, start date, note or site name, and one of only spaces', () => {
    expect(textContent(render({ role: '' }))).not.toContain('Senior Backend Engineer');
    expect(textContent(render({ role: '   ' }))).not.toContain('Senior Backend Engineer');
    expect(textContent(render({ description: '  ' }))).not.toContain('Excited to help build the payments stack');
    expect(textContent(render({ siteName: ' ' }))).not.toContain('acme.com');
    expect(textContent(render({ siteName: '' }))).not.toContain('acme.com');
  });

  it('drops the separator together with whichever of team and start date is blank', () => {
    expect(textContent(render({ team: ' ' }))).toEqual([
      'Welcome to the team', 'PS', 'Priya Sharma', 'Senior Backend Engineer',
      'Starts Nov 3', 'Excited to help build the payments stack', 'acme.com',
    ]);
    expect(textContent(render({ startDate: '' }))).toEqual([
      'Welcome to the team', 'PS', 'Priya Sharma', 'Senior Backend Engineer',
      'Platform team', 'Excited to help build the payments stack', 'acme.com',
    ]);
    expect(textContent(render({ team: '', startDate: '' }))).not.toContain('·');
  });

  it('leaves no gap where an optional block is hidden', () => {
    const noDetails = render({ team: '', startDate: '' });
    const note = span(noDetails, 'Excited to help build the payments stack');
    expect(note?.props.style?.marginTop).toBe('0px');
    const withDetails = span(render(), 'Excited to help build the payments stack');
    expect(withDetails?.props.style?.marginTop).toBe('22px');

    const name = elements(render({ role: '' })).find((element) => element.type === 'h1');
    const roleless = elements(render({ role: '' })).filter((element) => element.type === 'span' &&
      element.props.style?.marginTop === '10px');
    expect(textContent(name)[0]).toBe('Priya Sharma');
    expect(roleless).toHaveLength(0);
  });

  it('renders only the label, the initials and the name when every optional field is blank', () => {
    expect(textContent(render({ role: '', team: '', startDate: '', description: '', siteName: '' }))).toEqual([
      'Welcome to the team',
      'PS',
      'Priya Sharma',
    ]);
  });

  it('falls back to the defaults when optional fields are omitted, and to the default name when the title is blank', () => {
    expect(textContent(newHire.render({}))).toEqual(textContent(render()));
    expect(textContent(render({ title: '   ' }))[2]).toBe('Priya Sharma');
  });

  describe('initials', () => {
    it('are the first letters of the first and the last word', () => {
      expect(initialsOf('Priya Sharma')).toBe('PS');
      expect(initialsOf('priya sharma')).toBe('PS');
      expect(initialsOf('Mary Jane Watson')).toBe('MW');
      expect(initialsOf('  Priya   Sharma  ')).toBe('PS');
    });

    it('are one letter for a one-word name', () => {
      expect(initialsOf('Madonna')).toBe('M');
    });

    it('agree with getInitials for ordinary names', () => {
      for (const name of ['Priya Sharma', 'Madonna', 'Mary Jane Watson', 'élan vital', 'Ada Lovelace']) {
        expect(initialsOf(name)).toBe(getInitials(name));
      }
    });

    it('skip leading punctuation, @ and emoji instead of drawing a broken glyph', () => {
      expect(initialsOf('@octocat')).toBe('O');
      expect(initialsOf("(Priya) O'Neil")).toBe('PO');
      expect(initialsOf('\u{1F600} Smith')).toBe('S');
      expect(initialsOf('\u{1F600}')).toBe('');
    });

    it('keep non-Latin and astral letters whole', () => {
      expect(initialsOf('李雷 王')).toBe('李王');
      expect(initialsOf('\u{20BB7}野 家')).toBe('\u{20BB7}家');
    });

    it('never contain half of a surrogate pair', () => {
      for (const name of ['\u{1F600} \u{1F601}', '\u{20BB7}野', '\u{1D54F}ander Smith']) {
        for (const ch of Array.from(initialsOf(name))) {
          const cp = ch.codePointAt(0) as number;
          expect(cp >= 0xd800 && cp <= 0xdfff).toBe(false);
        }
      }
    });

    it('sit in a circle of the same size, centered, for any name', () => {
      for (const title of ['Madonna', 'Priya Sharma', 'Alexandria Montgomery-Featherstonehaugh III', '\u{1F600}']) {
        const style = circle(render({ title }))?.props.style;
        expect(style).toMatchObject({
          width: '128px',
          height: '128px',
          borderRadius: '64px',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        });
      }
    });
  });

  it('shrinks a long name, role and note with autoFontSize and then truncates them', () => {
    const sizeOf = (tree: SatoriElement, text: string) =>
      elements(tree).find((element) => textContent(element)[0] === text && element.props.style?.fontSize)?.props.style?.fontSize;

    const nameTree = (title: string) => elements(render({ title })).find((element) => element.type === 'h1');
    expect(nameTree('Priya Sharma')?.props.style?.fontSize).toBe('64px');
    expect(nameTree('Alexandria Montgomery-Smith')?.props.style?.fontSize).toBe('46px');
    // Each band ends on its maxLen: 18 -> 64, 26 -> 54, 36 -> 46, then 38.
    const bands: [number, string][] = [[18, '64px'], [19, '54px'], [26, '54px'], [27, '46px'], [36, '46px'], [37, '38px']];
    for (const [length, size] of bands) {
      expect(nameTree('A'.repeat(length))?.props.style?.fontSize).toBe(size);
    }

    const longName = 'Alexandria Montgomery-Featherstonehaugh III of the Northern Reaches';
    const heading = nameTree(longName);
    expect(textContent(heading)[0].length).toBeLessThanOrEqual(48);
    expect(textContent(heading)[0]).toMatch(/…$/);
    expect(heading?.props.style?.fontSize).toBe('38px');

    const longRole = 'Principal Distributed Systems Reliability Engineer, Payments Platform and Fraud';
    const role = span(render({ role: longRole }), `${longRole.slice(0, 59).trimEnd()}…`);
    expect(role).toBeDefined();
    expect(role?.props.style?.fontSize).toBe('22px');
    expect(span(render({ role: 'Engineer' }), 'Engineer')?.props.style?.fontSize).toBe('30px');

    const longNote = 'Excited to help build the payments stack and to work with the fraud, risk, identity and compliance teams on the next generation of the platform';
    const note = elements(render({ description: longNote })).find((element) => element.type === 'span' &&
      textContent(element)[0].startsWith('Excited'));
    expect(textContent(note)[0].length).toBeLessThanOrEqual(120);
    expect(textContent(note)[0]).toMatch(/…$/);
    expect(note?.props.style?.fontSize).toBe('22px');
    expect(sizeOf(render({ description: 'Welcome aboard' }), 'Welcome aboard')).toBe('28px');
  });

  it('truncates a long team and start date', () => {
    const texts = textContent(render({
      team: 'The Extremely Long Platform Engineering Team',
      startDate: 'Starts on the third of November 2026',
    }));
    const team = texts[4];
    const start = texts[6];
    expect(team.length).toBeLessThanOrEqual(32);
    expect(team).toMatch(/…$/);
    expect(start.length).toBeLessThanOrEqual(32);
    expect(start).toMatch(/…$/);
  });

  it('keeps the label, the circle and the start date readable on a light background', () => {
    const dark = render();
    expect(span(dark, 'Welcome to the team')?.props.style?.color).toBe('#E07A5F');
    expect(circle(dark)?.props.style?.backgroundColor).toBe('#E07A5F');
    expect(span(dark, 'Starts Nov 3')?.props.style?.color).toBe('#E07A5F');

    const light = render({ bgColor: '#ffffff', textColor: '#111111', accentColor: '#fde047' });
    expect(isLightColor('#ffffff')).toBe(true);
    const ink = mixColors('#fde047', '#000000', 0.45);
    expect(ink).toBe('#8b7b27');
    expect(span(light, 'Welcome to the team')?.props.style?.color).toBe(ink);
    expect(span(light, 'Starts Nov 3')?.props.style?.color).toBe(ink);
    expect(circle(light)?.props.style?.backgroundColor).toBe(ink);

    const initials = elements(circle(light)).find((element) => element.type === 'span');
    expect(initials?.props.style?.color).toBe(contrastText(ink));
    const darkInitials = elements(circle(dark)).find((element) => element.type === 'span');
    expect(darkInitials?.props.style?.color).toBe(contrastText('#E07A5F'));

    expect(elements(light).find((element) => element.type === 'h1')?.props.style?.color).toBe('#111111');
    expect(span(light, 'Platform team')?.props.style?.color).toBe('#111111');
  });
});
