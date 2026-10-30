import type { TemplateDefinition } from '../types';
import { autoFontSize, commonFields, contrastText, isLightColor, mixColors, truncate } from '../utils';

// An omitted field falls back to its default, but a blank one is hidden.
function optionalText(value: unknown, fallback: string, maxLength: number): string {
  return truncate((value === undefined ? fallback : String(value)).trim(), maxLength);
}

// The first letter or digit of the first and of the last word ("Priya Sharma" -> "PS",
// one letter for a one-word name). Leading punctuation, "@" and emoji are skipped, and
// a character is taken by code point so an astral letter is never cut in half.
function initialsOf(name: string): string {
  const letters = name
    .split(/\s+/)
    .map((word) => Array.from(word).find((ch) => /[\p{L}\p{N}]/u.test(ch)) ?? '')
    .filter(Boolean);
  if (letters.length === 0) return '';
  const first = letters[0];
  return (letters.length === 1 ? first : first + letters[letters.length - 1]).toUpperCase();
}

const template: TemplateDefinition = {
  id: 'job-new-hire',
  name: 'New Hire',
  category: 'job',
  description: 'Welcome a new teammate with an initials avatar, their name and role, the team, the start date and a short note',
  tags: ['job', 'new hire', 'welcome', 'onboarding', 'team'],
  fields: [
    { ...commonFields.title, label: 'Name', defaultValue: 'Priya Sharma', placeholder: 'Priya Sharma' },
    { key: 'role', label: 'Role', type: 'text', defaultValue: 'Senior Backend Engineer', placeholder: 'Senior Backend Engineer', group: 'Content' },
    { key: 'team', label: 'Team', type: 'text', defaultValue: 'Platform team', placeholder: 'Platform team', group: 'Content' },
    { key: 'startDate', label: 'Start Date', type: 'text', defaultValue: 'Starts Nov 3', placeholder: 'Starts Nov 3', group: 'Content' },
    { ...commonFields.description, label: 'Note', type: 'text', defaultValue: 'Excited to help build the payments stack', placeholder: 'Excited to help build the payments stack' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Priya Sharma',
    role: 'Senior Backend Engineer',
    team: 'Platform team',
    startDate: 'Starts Nov 3',
    description: 'Excited to help build the payments stack',
    siteName: 'acme.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawName = String(params.title || 'Priya Sharma').trim() || 'Priya Sharma';
    const nameSize = autoFontSize(rawName, [
      { maxLen: 18, size: 64 },
      { maxLen: 26, size: 54 },
      { maxLen: 36, size: 46 },
      { maxLen: 48, size: 38 },
    ]);
    const name = truncate(rawName, 48);
    const initials = initialsOf(rawName);
    const rawRole = optionalText(params.role, 'Senior Backend Engineer', 200);
    const roleSize = autoFontSize(rawRole, [
      { maxLen: 30, size: 30 },
      { maxLen: 46, size: 26 },
      { maxLen: 60, size: 22 },
    ]);
    const role = truncate(rawRole, 60);
    const team = optionalText(params.team, 'Platform team', 32);
    const startDate = optionalText(params.startDate, 'Starts Nov 3', 32);
    const rawNote = optionalText(params.description, 'Excited to help build the payments stack', 400);
    const noteSize = autoFontSize(rawNote, [
      { maxLen: 60, size: 28 },
      { maxLen: 90, size: 24 },
      { maxLen: 120, size: 22 },
    ]);
    const note = truncate(rawNote, 120);
    const siteName = optionalText(params.siteName, 'acme.com', 50);
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    // The label, the circle and the start date are drawn in the accent on the page
    // background, so the accent is darkened when that background is light.
    const accentInk = isLightColor(bgColor) ? mixColors(accentColor, '#000000', 0.45) : accentColor;

    const details = [
      ...(team
        ? [{
            type: 'span',
            props: { style: { fontSize: '26px', fontWeight: 600, color: textColor }, children: team },
          }]
        : []),
      ...(team && startDate
        ? [{
            type: 'span',
            props: { style: { fontSize: '26px', fontWeight: 600, color: `${textColor}66` }, children: '·' },
          }]
        : []),
      ...(startDate
        ? [{
            type: 'span',
            props: { style: { fontSize: '26px', fontWeight: 600, color: accentInk }, children: startDate },
          }]
        : []),
    ];

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex',
          flexDirection: 'column',
          width: '1200px',
          height: '630px',
          boxSizing: 'border-box',
          backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
          padding: '64px 80px',
        },
        children: [
          // Label, initials circle, name and role
          {
            type: 'div',
            props: {
              style: { display: 'flex', flexDirection: 'column' },
              children: [
                {
                  type: 'span',
                  props: {
                    style: {
                      fontSize: '20px',
                      fontWeight: 800,
                      color: accentInk,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase' as const,
                    },
                    children: 'Welcome to the team',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: { display: 'flex', alignItems: 'center', marginTop: '28px' },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            width: '128px',
                            height: '128px',
                            borderRadius: '64px',
                            backgroundColor: accentInk,
                            marginRight: '36px',
                          },
                          children: {
                            type: 'span',
                            props: {
                              style: {
                                fontSize: '52px',
                                fontWeight: 700,
                                color: contrastText(accentInk),
                              },
                              children: initials,
                            },
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: { display: 'flex', flexDirection: 'column', flexGrow: 1, flexShrink: 1, minWidth: 0 },
                          children: [
                            {
                              type: 'h1',
                              props: {
                                style: {
                                  fontSize: `${nameSize}px`,
                                  fontWeight: 700,
                                  color: textColor,
                                  lineHeight: 1.1,
                                  margin: 0,
                                },
                                children: name,
                              },
                            },
                            ...(role
                              ? [{
                                  type: 'span',
                                  props: {
                                    style: {
                                      fontSize: `${roleSize}px`,
                                      fontWeight: 500,
                                      color: `${textColor}CC`,
                                      marginTop: '10px',
                                    },
                                    children: role,
                                  },
                                }]
                              : []),
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          // Team, start date and note
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                justifyContent: 'center',
              },
              children: [
                ...(details.length
                  ? [{
                      type: 'div',
                      props: {
                        style: { display: 'flex', alignItems: 'center', columnGap: '16px' },
                        children: details,
                      },
                    }]
                  : []),
                ...(note
                  ? [{
                      type: 'span',
                      props: {
                        style: {
                          fontSize: `${noteSize}px`,
                          fontWeight: 400,
                          color: `${textColor}99`,
                          marginTop: details.length ? '22px' : '0px',
                        },
                        children: note,
                      },
                    }]
                  : []),
              ],
            },
          },
          // Site name
          ...(siteName
            ? [{
                type: 'span',
                props: {
                  style: {
                    fontSize: '18px',
                    fontWeight: 600,
                    color: `${textColor}80`,
                    letterSpacing: '0.06em',
                  },
                  children: siteName,
                },
              }]
            : []),
        ],
      },
    };
  },
};

export default template;
