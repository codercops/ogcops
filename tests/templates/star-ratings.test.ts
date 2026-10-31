import { describe, it, expect } from 'vitest';
import productCard from '@/templates/ecommerce/product-card';
import reviewHighlight from '@/templates/ecommerce/review-highlight';
import testimonialBanner from '@/templates/saas/testimonial-banner';
import platformBranded from '@/templates/tutorial/platform-branded';
import type { SatoriElement } from '@/templates/types';

function starFills(node: unknown): string[] {
  if (Array.isArray(node)) return node.flatMap(starFills);
  if (node && typeof node === 'object' && 'props' in node) {
    const el = node as SatoriElement;
    if (el.type === 'svg' && el.props.viewBox === '0 0 24 24' && el.props.children?.type === 'path') {
      return [el.props.children.props.fill];
    }
    return starFills(el.props.children);
  }
  return [];
}

describe.each([productCard, reviewHighlight, testimonialBanner, platformBranded])('$id ratings', (template) => {
  const filledColor = template === testimonialBanner ? String(template.defaults.accentColor) : '#F5C518';
  const count = (rating: unknown) => {
    const fills = starFills(template.render({ ...template.defaults, rating }));
    expect(fills).toHaveLength(5);
    return fills.filter((fill) => fill === filledColor).length;
  };

  it.each([
    [0, 1], ['0', 1], ['0.0', 1], [-2, 1], ['-2', 1], [0.2, 1],
    [1, 1], ['3', 3], [3.4, 3], ['3.5', 4], [5, 5], ['10', 5],
  ])('renders rating %j as %i filled stars', (rating, expected) => {
    expect(count(rating)).toBe(expected);
  });

  it.each([undefined, null, '', '   ', 'invalid', NaN])('uses the template default for missing or invalid rating %j', (rating) => {
    expect(count(rating)).toBe(template.defaults.rating);
  });
});
