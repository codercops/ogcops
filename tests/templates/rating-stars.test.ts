import { describe, expect, it } from 'vitest';
import productCard from '@/templates/ecommerce/product-card';
import reviewHighlight from '@/templates/ecommerce/review-highlight';
import platformBranded from '@/templates/tutorial/platform-branded';
import testimonialBanner from '@/templates/saas/testimonial-banner';
import type { TemplateDefinition } from '@/templates/types';

const filled = (template: TemplateDefinition, rating: unknown, color: string) =>
  JSON.stringify(template.render({ ...template.defaults, rating })).split(color).length - 1;

describe('rating stars', () => {
  it.each([
    ['product-card', productCard, '#F5C518'],
    ['review-highlight', reviewHighlight, '#F5C518'],
    ['platform-branded', platformBranded, '#F5C518'],
  ])('%s fills whole stars for a decimal rating', (_, template, gold) => {
    expect(filled(template, 4.1, gold)).toBe(4);
    expect(filled(template, '3.2', gold)).toBe(3);
    expect(filled(template, 4, gold)).toBe(4);
    expect(filled(template, 4.6, gold)).toBe(5);
  });

  it('testimonial-banner fills whole stars for a decimal rating', () => {
    const empty = (rating: unknown) => filled(testimonialBanner, rating, '#FFFFFF22');
    expect(empty(4.1)).toBe(1);
    expect(empty('3.2')).toBe(2);
    expect(empty(4)).toBe(1);
    expect(empty(4.6)).toBe(0);
  });
});
