import type { TemplateDefinition, SatoriElement } from '../types';
import { truncate, autoFontSize, commonFields, isLightColor, mixColors } from '../utils';

const AVATAR_PALETTE = [
  '#2563eb', // blue
  '#16a34a', // green
  '#7c3aed', // purple
  '#ea580c', // orange
  '#db2777', // pink
  '#0284c7', // sky
  '#ca8a04', // amber
  '#0d9488', // teal
];

const MAX_DISPLAYED_AVATARS = 15;

/**
 * Computes initials safely from a name string:
 * - strips leading @
 * - trims whitespace and collapses internal whitespace
 * - for one-word names, returns the first character uppercase without errors
 * - for multi-word names, returns first and last word initials uppercase
 */
export function getInitials(name: string): string {
  const cleaned = name.trim().replace(/^@/, '').replace(/\s+/g, ' ');
  if (!cleaned) return '';
  const parts = cleaned.split(' ').filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  const first = parts[0].charAt(0);
  const last = parts[parts.length - 1].charAt(0);
  return `${first}${last}`.toUpperCase();
}

/**
 * Splits comma- or newline-separated contributors list into clean trimmed non-empty names.
 */
export function parseContributors(input: unknown): string[] {
  if (typeof input !== 'string') return [];
  return input
    .split(/[\n,]+/)
    .map((name) => name.trim().replace(/\s+/g, ' '))
    .filter((name) => name.length > 0);
}

/**
 * Stable, deterministic name-based hash to select an avatar color from the palette.
 * Never uses Math.random() or date-dependent values.
 */
export function getAvatarColor(name: string): string {
  const normalized = name.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTE.length;
  return AVATAR_PALETTE[index];
}

const template: TemplateDefinition = {
  id: 'github-contributors-wall',
  name: 'Contributors Wall',
  category: 'github',
  description: 'A wall of circular contributor avatars with repository details and contributor count',
  tags: ['github', 'contributors', 'community', 'avatars', 'open-source'],
  fields: [
    {
      key: 'repoName',
      label: 'Repository',
      type: 'text',
      defaultValue: 'codercops/ogcops',
      placeholder: 'owner/repo',
      group: 'Content',
    },
    commonFields.description,
    {
      key: 'contributorCount',
      label: 'Contributor Count',
      type: 'text',
      defaultValue: '128',
      placeholder: '128',
      group: 'Content',
    },
    {
      key: 'contributors',
      label: 'Contributors',
      type: 'textarea',
      defaultValue:
        'Ada Lovelace, Linus Torvalds, Grace Hopper, Margaret Hamilton, Dan Abramov, Sophie Wilson, Radia Perlman, Tim Berners-Lee, Hedy Lamarr, Alan Turing, Katherine Johnson, Ken Thompson, Dennis Ritchie, Barbara Liskov, torvalds',
      placeholder: 'Comma-separated names',
      group: 'Content',
    },
    { ...commonFields.bgColor, defaultValue: '#0d1117' },
    commonFields.accentColor,
    { ...commonFields.textColor, defaultValue: '#e6edf3' },
  ],
  defaults: {
    repoName: 'codercops/ogcops',
    description: 'Thank you to all our amazing contributors who help make this project possible.',
    contributorCount: '128',
    contributors:
      'Ada Lovelace, Linus Torvalds, Grace Hopper, Margaret Hamilton, Dan Abramov, Sophie Wilson, Radia Perlman, Tim Berners-Lee, Hedy Lamarr, Alan Turing, Katherine Johnson, Ken Thompson, Dennis Ritchie, Barbara Liskov, torvalds',
    bgColor: '#0d1117',
    accentColor: '#58a6ff',
    textColor: '#e6edf3',
  },
  render: (params) => {
    const rawRepoName = String(params.repoName || '').trim();
    const repoName = rawRepoName ? truncate(rawRepoName, 40) : '';

    const rawDescription = String(params.description || '').trim();
    const description = rawDescription ? truncate(rawDescription, 160) : '';

    const rawCount = String(params.contributorCount || '').trim();
    const rawContributors = typeof params.contributors === 'string' ? params.contributors : '';

    const bgColor = String(params.bgColor || '#0d1117');
    const accentColor = String(params.accentColor || '#58a6ff');
    const textColor = String(params.textColor || '#e6edf3');

    const isLightBg = isLightColor(bgColor);
    const adaptedAccent = isLightBg ? mixColors(accentColor, '#000000', 0.25) : accentColor;
    const descColor = isLightBg ? mixColors(textColor, bgColor, 0.2) : `${textColor}aa`;

    // Parse contributor names
    const allContributors = parseContributors(rawContributors);
    const displayedContributors = allContributors.slice(0, MAX_DISPLAYED_AVATARS);

    // Parse count and determine overflow
    // Support formats like "128", "128 contributors", "1,250", etc.
    const countNumberMatch = rawCount.replace(/,/g, '').match(/\d+/);
    const parsedNumericCount = countNumberMatch ? parseInt(countNumberMatch[0], 10) : 0;
    const totalCount = parsedNumericCount > 0 ? parsedNumericCount : allContributors.length;

    const hasOverflow = displayedContributors.length > 0 && totalCount > displayedContributors.length;
    const overflowCount = hasOverflow ? totalCount - displayedContributors.length : 0;

    // Displayed count text and label for the left side
    let countNumber = rawCount;
    let countLabel = rawCount === '1' ? 'contributor' : 'contributors';
    if (rawCount) {
      const match = rawCount.match(/^([^\s]+)\s+(.+)$/);
      if (match) {
        countNumber = match[1];
        countLabel = match[2];
      }
    }

    const countSize = autoFontSize(countNumber, [
      { maxLen: 4, size: 76 },
      { maxLen: 7, size: 64 },
      { maxLen: 10, size: 52 },
      { maxLen: 14, size: 42 },
    ]);

    // Build avatar circle elements
    const avatarCircles: SatoriElement[] = displayedContributors.map((name) => {
      const initials = getInitials(name);
      const color = getAvatarColor(name);
      return {
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: color,
            border: `2px solid ${isLightBg ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.12)'}`,
          },
          children: {
            type: 'span',
            props: {
              style: {
                fontSize: initials.length > 1 ? '26px' : '30px',
                fontWeight: 700,
                color: '#ffffff',
                lineHeight: 1,
              },
              children: initials,
            },
          },
        },
      };
    });

    // Append overflow circle if contributor count exceeds displayed names
    if (hasOverflow) {
      const overflowText = `+${overflowCount}`;
      const overflowFontSize = overflowText.length > 4 ? '18px' : overflowText.length > 3 ? '20px' : '24px';
      avatarCircles.push({
        type: 'div',
        props: {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: `${textColor}15`,
            border: `2px solid ${textColor}33`,
          },
          children: {
            type: 'span',
            props: {
              style: {
                fontSize: overflowFontSize,
                fontWeight: 700,
                color: textColor,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              },
              children: overflowText,
            },
          },
        },
      });
    }

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          width: '1200px',
          height: '630px',
          background: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '60px 64px',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Background subtle ambient glow
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                position: 'absolute',
                top: '-100px',
                right: '-60px',
                width: '560px',
                height: '560px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${adaptedAccent}15 0%, transparent 65%)`,
              },
              children: [],
            },
          },
          // Left column: repo name, contributor count, description
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                width: '540px',
                paddingRight: '20px',
              },
              children: [
                // Repository badge
                ...(repoName
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px 18px',
                            borderRadius: '999px',
                            background: `${adaptedAccent}15`,
                            border: `1px solid ${adaptedAccent}33`,
                            alignSelf: 'flex-start',
                          },
                          children: [
                            {
                              type: 'div',
                              props: {
                                style: {
                                  display: 'flex',
                                  width: '8px',
                                  height: '8px',
                                  borderRadius: '50%',
                                  background: adaptedAccent,
                                },
                                children: [],
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '18px',
                                  fontWeight: 600,
                                  color: adaptedAccent,
                                  fontFamily: 'JetBrains Mono, monospace',
                                },
                                children: repoName,
                              },
                            },
                          ],
                        },
                      },
                    ]
                  : []),
                // Contributor count
                ...(rawCount
                  ? [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'baseline',
                            gap: '14px',
                            marginTop: '28px',
                            marginBottom: '20px',
                          },
                          children: [
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: `${countSize}px`,
                                  fontWeight: 700,
                                  color: textColor,
                                  lineHeight: 1.05,
                                  letterSpacing: '-0.02em',
                                },
                                children: countNumber,
                              },
                            },
                            {
                              type: 'span',
                              props: {
                                style: {
                                  fontSize: '32px',
                                  fontWeight: 600,
                                  color: adaptedAccent,
                                  lineHeight: 1,
                                },
                                children: countLabel,
                              },
                            },
                          ],
                        },
                      },
                    ]
                  : []),
                // Description
                ...(description
                  ? [
                      {
                        type: 'p',
                        props: {
                          style: {
                            fontSize: '22px',
                            fontWeight: 400,
                            color: descColor,
                            lineHeight: 1.5,
                            margin: 0,
                            maxWidth: '480px',
                          },
                          children: description,
                        },
                      },
                    ]
                  : []),
              ],
            },
          },
          // Right column: flex-wrapping avatar wall
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '16px',
                      width: '380px',
                    },
                    children: avatarCircles,
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
