import type { SatoriElement, TemplateDefinition } from '../types';
import { autoFontSize, commonFields, isLightColor, mixColors, normalizeStarRating, starIcon, truncate } from '../utils';

const COUNT_KEYS = [5, 4, 3, 2, 1] as const;
const STAR_GOLD = '#F5C518';

const template: TemplateDefinition = {
  id: 'ecommerce-rating-breakdown',
  name: 'Rating Breakdown',
  category: 'ecommerce',
  description: 'Overall star score with five horizontal bars showing how reviews split across star ratings',
  tags: ['ecommerce', 'rating', 'reviews', 'stars', 'breakdown'],
  fields: [
    commonFields.title,
    { key: 'count5', label: '5-star Reviews', type: 'number', defaultValue: 742, placeholder: '742', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'count4', label: '4-star Reviews', type: 'number', defaultValue: 351, placeholder: '351', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'count3', label: '3-star Reviews', type: 'number', defaultValue: 110, placeholder: '110', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'count2', label: '2-star Reviews', type: 'number', defaultValue: 44, placeholder: '44', min: 0, max: 1_000_000_000, group: 'Content' },
    { key: 'count1', label: '1-star Reviews', type: 'number', defaultValue: 37, placeholder: '37', min: 0, max: 1_000_000_000, group: 'Content' },
    commonFields.siteName,
    commonFields.bgColor,
    commonFields.accentColor,
    commonFields.textColor,
  ],
  defaults: {
    title: 'Trail Runner 2',
    count5: 742,
    count4: 351,
    count3: 110,
    count2: 44,
    count1: 37,
    siteName: 'codercops.com',
    bgColor: '#0a0a0a',
    accentColor: '#E07A5F',
    textColor: '#FFFFFF',
  },
  render: (params) => {
    const rawTitle = String(params.title ?? template.defaults.title).replace(/\s+/g, ' ').trim();
    const title = truncate(rawTitle || String(template.defaults.title), 120);
    const titleSize = autoFontSize(title, [
      { maxLen: 36, size: 46 },
      { maxLen: 60, size: 40 },
      { maxLen: 90, size: 34 },
      { maxLen: 120, size: 28 },
    ]);

    // Blank, negative or non-numeric counts count as 0 so the score,
    // the percentages and the review count always agree with each other.
    const counts = COUNT_KEYS.map((stars) => {
      const raw = params[`count${stars}`];
      if (raw === undefined || raw === null || String(raw).trim() === '') return { stars, value: 0 };
      const value = Number(raw);
      return { stars, value: Number.isFinite(value) && value >= 0 ? value : 0 };
    });
    const total = counts.reduce((sum, { value }) => sum + value, 0);
    const weighted = counts.reduce((sum, { stars, value }) => sum + stars * value, 0);
    const hasReviews = total > 0;
    const scoreText = hasReviews ? (weighted / total).toFixed(1) : '';
    // Derive the stars from the score actually displayed so the two can never disagree.
    const starCount = hasReviews ? normalizeStarRating(Number(scoreText), 5) : 0;
    const reviewText = hasReviews
      ? `${new Intl.NumberFormat('en-US').format(total)} ${total === 1 ? 'review' : 'reviews'}`
      : '';
    const reviewSize = autoFontSize(reviewText, [
      { maxLen: 14, size: 26 },
      { maxLen: 20, size: 22 },
      { maxLen: 30, size: 18 },
    ]);
    const percentages = counts.map(({ value }) => (hasReviews ? Math.round((value / total) * 100) : 0));

    const siteName = String(params.siteName ?? '').replace(/\s+/g, ' ').trim();
    const bgColor = String(params.bgColor || '#0a0a0a');
    const accentColor = String(params.accentColor || '#E07A5F');
    const textColor = String(params.textColor || '#FFFFFF');
    const lightBg = isLightColor(bgColor);
    const foregroundColor = lightBg && isLightColor(textColor) ? '#111111' : textColor;
    const accentInk = lightBg ? mixColors(accentColor, '#000000', 0.45) : accentColor;
    const mutedText = mixColors(bgColor, foregroundColor, lightBg ? 0.68 : 0.62);
    const trackColor = mixColors(bgColor, foregroundColor, lightBg ? 0.13 : 0.2);
    const litStar = lightBg ? mixColors(STAR_GOLD, '#000000', 0.35) : STAR_GOLD;
    const emptyStar = mixColors(bgColor, foregroundColor, lightBg ? 0.5 : 0.42);

    const scoreElements: SatoriElement[] = hasReviews
      ? [
          {
            type: 'span',
            props: {
              style: {
                display: 'flex', color: foregroundColor, fontSize: '96px',
                fontWeight: 800, lineHeight: 1, letterSpacing: '-0.03em',
              },
              children: scoreText,
            },
          },
          {
            type: 'div',
            props: {
              style: { display: 'flex', alignItems: 'center', gap: '8px' },
              children: Array.from({ length: 5 }, (_, index) =>
                starIcon(30, index < starCount ? litStar : emptyStar)),
            },
          },
          {
            type: 'span',
            props: {
              style: {
                display: 'flex', color: mutedText, fontSize: `${reviewSize}px`,
                fontWeight: 600, maxWidth: '100%', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              },
              children: reviewText,
            },
          },
        ]
      : [
          {
            type: 'span',
            props: {
              style: { display: 'flex', color: foregroundColor, fontSize: '40px', fontWeight: 700 },
              children: 'No reviews yet',
            },
          },
        ];

    const rows: SatoriElement[] = counts.map(({ stars }, index) => {
      const percentage = percentages[index];
      return {
        type: 'div',
        props: {
          style: { display: 'flex', alignItems: 'center', gap: '16px', width: '100%' },
          children: [
            {
              type: 'span',
              props: {
                style: {
                  display: 'flex', flexShrink: 0, width: '64px', minWidth: 0,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  fontSize: '17px', fontWeight: 600, color: mutedText,
                },
                children: `${stars} star${stars === 1 ? '' : 's'}`,
              },
            },
            {
              type: 'div',
              props: {
                style: {
                  display: 'flex', flex: 1, minWidth: 0, height: '14px',
                  overflow: 'hidden', borderRadius: '999px', backgroundColor: trackColor,
                },
                children: [
                  {
                    type: 'div',
                    props: {
                      style: {
                        display: 'flex', width: `${percentage}%`, height: '100%',
                        borderRadius: '999px', backgroundColor: accentInk,
                      },
                      children: [],
                    },
                  },
                ],
              },
            },
            {
              type: 'span',
              props: {
                style: {
                  display: 'flex', justifyContent: 'flex-end', flexShrink: 0,
                  width: '56px', minWidth: 0, fontSize: '17px', fontWeight: 700,
                  color: foregroundColor,
                },
                children: `${percentage}%`,
              },
            },
          ],
        },
      };
    });

    return {
      type: 'div',
      props: {
        style: {
          display: 'flex', flexDirection: 'column', width: '1200px', height: '630px',
          boxSizing: 'border-box', padding: '52px 64px 42px', backgroundColor: bgColor,
          fontFamily: 'Inter, sans-serif',
        },
        children: [
          {
            type: 'h1',
            props: {
              style: {
                display: 'flex', width: '100%', margin: 0, color: foregroundColor,
                fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.18,
                letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              children: title,
            },
          },
          {
            type: 'div',
            props: {
              style: {
                display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '56px',
                width: '100%', marginTop: 'auto', marginBottom: 'auto',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: '16px', flexShrink: 0, width: '340px', minWidth: 0,
                    },
                    children: scoreElements,
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', flexDirection: 'column', justifyContent: 'center',
                      gap: '16px', flex: 1, minWidth: 0,
                    },
                    children: rows,
                  },
                },
              ],
            },
          },
          ...(siteName
            ? [
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex', justifyContent: 'flex-end', marginTop: 'auto',
                      paddingTop: '14px', borderTop: `1px solid ${trackColor}`,
                    },
                    children: {
                      type: 'span',
                      props: {
                        style: { display: 'flex', fontSize: '16px', fontWeight: 600, color: mutedText },
                        children: truncate(siteName, 48),
                      },
                    },
                  },
                },
              ]
            : []),
        ],
      },
    };
  },
};

export default template;
