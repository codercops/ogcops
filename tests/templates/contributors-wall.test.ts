import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import contributorsWall, {
  getInitials,
  parseContributors,
  getAvatarColor,
} from '@/templates/github/contributors-wall';
import { getTemplate } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const fontFiles: [file: string, name: string, weight: 400 | 500 | 600 | 700][] = [
  ['Inter-Regular.woff', 'Inter', 400],
  ['Inter-Medium.woff', 'Inter', 500],
  ['Inter-SemiBold.woff', 'Inter', 600],
  ['Inter-Bold.woff', 'Inter', 700],
  ['PlayfairDisplay-Regular.woff', 'Playfair Display', 400],
  ['PlayfairDisplay-Bold.woff', 'Playfair Display', 700],
  ['JetBrainsMono-Regular.woff', 'JetBrains Mono', 400],
  ['JetBrainsMono-Bold.woff', 'JetBrains Mono', 700],
];

const fonts = fontFiles.map(([file, name, weight]) => ({
  name,
  data: readFileSync(join(process.cwd(), 'public/fonts', file)),
  weight,
  style: 'normal' as const,
}));

const renderSvg = (element: unknown) =>
  satori(element as any, { width: 1200, height: 630, fonts });

/** Recursively collects every element in the tree. */
function elements(node: unknown): SatoriElement[] {
  if (Array.isArray(node)) return node.flatMap(elements);
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    return [el, ...elements(el.props.children)];
  }
  return [];
}

/** Recursively collects every string rendered anywhere in the element tree. */
function texts(node: unknown): string[] {
  if (typeof node === 'string') return [node];
  if (Array.isArray(node)) return node.flatMap(texts);
  if (node && typeof node === 'object' && 'props' in node) {
    return texts((node as SatoriElement).props.children);
  }
  return [];
}

const tree = (overrides: Record<string, unknown> = {}) =>
  contributorsWall.render({ ...contributorsWall.defaults, ...overrides });

describe('github-contributors-wall', () => {
  it('is registered in the github category', () => {
    const t = getTemplate('github-contributors-wall');
    expect(t).toBeDefined();
    expect(t?.category).toBe('github');
    expect(t?.id).toBe('github-contributors-wall');
    expect(t?.tags.length).toBeGreaterThanOrEqual(4);
    expect(t?.tags.length).toBeLessThanOrEqual(6);
  });

  it('renders a 1200x630 card', () => {
    const { style } = tree().props;
    expect(style.width).toBe('1200px');
    expect(style.height).toBe('630px');
  });

  it('ensures every div has display: flex', () => {
    const allDivs = elements(tree()).filter((el) => el.type === 'div');
    for (const div of allDivs) {
      expect(div.props.style?.display).toBe('flex');
    }
  });

  describe('getInitials', () => {
    it('handles one-word names safely without error', () => {
      expect(getInitials('torvalds')).toBe('T');
      expect(getInitials('dan')).toBe('D');
      expect(getInitials('X')).toBe('X');
    });

    it('derives sensible initials from multi-word names', () => {
      expect(getInitials('Ada Lovelace')).toBe('AL');
      expect(getInitials('Dan Abramov')).toBe('DA');
      expect(getInitials('Grace Brewster Murray Hopper')).toBe('GH');
      expect(getInitials('Tim Berners-Lee')).toBe('TB');
    });

    it('trims extra whitespace and ignores leading @ symbol', () => {
      expect(getInitials('   Dan    Abramov   ')).toBe('DA');
      expect(getInitials('@octocat')).toBe('O');
      expect(getInitials('@torvalds')).toBe('T');
    });

    it('returns empty string for empty inputs', () => {
      expect(getInitials('')).toBe('');
      expect(getInitials('   ')).toBe('');
    });
  });

  describe('parseContributors', () => {
    it('parses comma- and newline-separated names while ignoring empty entries', () => {
      const input = 'Ada Lovelace, Linus Torvalds, , \n Dan Abramov,   \n\n Grace Hopper';
      expect(parseContributors(input)).toEqual([
        'Ada Lovelace',
        'Linus Torvalds',
        'Dan Abramov',
        'Grace Hopper',
      ]);
    });

    it('handles non-string inputs gracefully', () => {
      expect(parseContributors(null)).toEqual([]);
      expect(parseContributors(undefined)).toEqual([]);
      expect(parseContributors(123)).toEqual([]);
    });
  });

  describe('deterministic colors', () => {
    it('returns the same color for the same name every time', () => {
      const color1 = getAvatarColor('Linus Torvalds');
      const color2 = getAvatarColor('Linus Torvalds');
      expect(color1).toBe(color2);
    });

    it('is case-insensitive for stable hashing', () => {
      expect(getAvatarColor('Ada Lovelace')).toBe(getAvatarColor('ada lovelace'));
    });
  });

  describe('overflow calculation', () => {
    it('appends +113 when contributorCount is 128 and 15 names are displayed', () => {
      const rendered = texts(tree({ contributorCount: '128' }));
      expect(rendered).toContain('+113');
    });

    it('appends +118 when contributorCount is 128 and 10 names are displayed', () => {
      const tenNames =
        'Alice, Bob, Charlie, David, Eve, Frank, Grace, Heidi, Ivan, Judy';
      const rendered = texts(tree({ contributorCount: '128', contributors: tenNames }));
      expect(rendered).toContain('+118');
    });

    it('does not append overflow circle when contributorCount equals displayed count', () => {
      const fiveNames = 'Alice, Bob, Charlie, David, Eve';
      const rendered = texts(tree({ contributorCount: '5', contributors: fiveNames }));
      expect(rendered.some((t) => t.startsWith('+'))).toBe(false);
    });

    it('calculates overflow from list length when contributorCount is not a number or empty', () => {
      const eighteenNames = Array.from({ length: 18 }, (_, i) => `Person ${i + 1}`).join(', ');
      const rendered = texts(tree({ contributorCount: '', contributors: eighteenNames }));
      // 18 total - 15 displayed = 3 overflow
      expect(rendered).toContain('+3');
    });
  });

  describe('graceful handling of empty, long, and white background inputs', () => {
    it('renders cleanly with all optional text fields empty', async () => {
      const rendered = tree({
        repoName: '',
        contributorCount: '',
        contributors: '',
        description: '',
      });
      expect(rendered.type).toBe('div');
      expect(rendered.props.style?.width).toBe('1200px');
      const svg = await renderSvg(rendered);
      expect(svg).toMatch(/^<svg/);
    });

    it('renders cleanly with long inputs without error', async () => {
      const rendered = tree({
        repoName: 'very-long-org/a-very-long-project-name-that-might-overflow',
        contributorCount: '1,250,000 active contributors',
        description:
          'Thank you to everyone in our community who opened pull requests, reported issues, improved our documentation, and helped us make open source better for the world.',
        contributors: Array.from({ length: 30 }, (_, i) => `Contributor ${i + 1}`).join(', '),
      });
      const svg = await renderSvg(rendered);
      expect(svg).toMatch(/^<svg/);
    });

    it('truncates long repository name to 40 characters', () => {
      const longRepo = 'GoogleCloudPlatform/kubernetes-engine-samples';
      const rendered = texts(tree({ repoName: longRepo }));
      expect(rendered).toContain('GoogleCloudPlatform/kubernetes-engine-s…');
    });

    it('does not set alignContent on the avatar wall container', () => {
      const wallContainer = elements(tree()).find(
        (el) => el.type === 'div' && el.props.style?.width === '380px'
      );
      expect(wallContainer).toBeDefined();
      expect(wallContainer?.props.style?.alignContent).toBeUndefined();
    });

    it('renders cleanly on a white background with dark text', async () => {
      const rendered = tree({
        bgColor: '#ffffff',
        textColor: '#111827',
        accentColor: '#0969da',
      });
      expect(rendered.type).toBe('div');
      expect(rendered.props.style?.background).toBe('#ffffff');
      const svg = await renderSvg(rendered);
      expect(svg).toMatch(/^<svg/);
    });
  });
});
