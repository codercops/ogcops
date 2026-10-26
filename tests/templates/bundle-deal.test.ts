import { describe, expect, it } from 'vitest';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import type { SatoriElement } from '@/templates/types';

const template = getTemplate('ecommerce-bundle-deal');
if (!template) throw new Error('Template not found: ecommerce-bundle-deal');

function isSatoriElement(value: unknown): value is SatoriElement {
  return typeof value === 'object' && value !== null && 'type' in value && 'props' in value;
}

function getChildren(element: SatoriElement): SatoriElement[] {
  const children = element.props.children;
  return Array.isArray(children)
    ? children.filter(isSatoriElement)
    : isSatoriElement(children)
      ? [children]
      : [];
}

function getAllElements(element: SatoriElement): SatoriElement[] {
  return [element, ...getChildren(element).flatMap(getAllElements)];
}

function getTextElements(element: SatoriElement): string[] {
  return getAllElements(element)
    .filter((child) => child.type === 'span' && typeof child.props.children === 'string')
    .map((child) => child.props.children);
}

describe('ecommerce-bundle-deal', () => {
  it('is registered as an E-commerce template', () => {
    expect(template.category).toBe('ecommerce');
    expect(getTemplatesByCategory('ecommerce')).toContain(template);
  });

  it('shows at most three non-empty products with plus signs only between them', () => {
    const element = template.render({
      ...template.defaults,
      products: 'Keyboard\n\nDesk Lamp\nTravel Mug\nIgnored Product',
    });
    const text = getTextElements(element);

    expect(text).toContain('Keyboard');
    expect(text).toContain('Desk Lamp');
    expect(text).toContain('Travel Mug');
    expect(text).not.toContain('Ignored Product');
    expect(text.filter((value) => value === '+')).toHaveLength(2);
  });

  it('truncates long product names', () => {
    const element = template.render({
      ...template.defaults,
      products: 'A'.repeat(60),
    });

    expect(getTextElements(element)).toContain(`${'A'.repeat(35)}…`);
  });

  it('truncates displayed prices and fits the bundle total to its length', () => {
    const element = template.render({
      ...template.defaults,
      oldPrice: '$999,999.99 USD after tax',
      newPrice: '$999,999.99 USD after tax',
    });
    const elements = getAllElements(element);
    const displayPrices = elements.filter((child) => child.props.children === '$999,999.99 U…');

    expect(displayPrices).toHaveLength(2);
    expect(displayPrices[0].props.style?.fontSize).toBe('42px');
    expect(displayPrices[1].props.style?.fontSize).toBe(52);
  });

  it('calculates the floored savings percentage from currency prices', () => {
    const element = template.render({
      ...template.defaults,
      oldPrice: '$120',
      newPrice: '$89',
    });

    expect(getTextElements(element)).toContain('Save 25%');
  });

  it.each([
    ['$120 sale', '$89'],
    ['$89', '$120'],
    ['$120', '$120'],
    ['$0', '$0'],
  ])('hides the savings badge for invalid or non-saving prices (%s, %s)', (oldPrice, newPrice) => {
    const element = template.render({
      ...template.defaults,
      oldPrice,
      newPrice,
    });

    expect(getTextElements(element).some((value) => value.startsWith('Save '))).toBe(false);
  });

  it('darkens the accent for price text on light backgrounds only', () => {
    const darkElement = template.render(template.defaults);
    const lightElement = template.render({
      ...template.defaults,
      bgColor: '#FFFFFF',
    });
    const findBundleTotal = (element: SatoriElement) =>
      getAllElements(element).find((child) => child.props.children === '$89');
    const findPlusSigns = (element: SatoriElement) =>
      getAllElements(element).filter((child) => child.props.children === '+');

    expect(findBundleTotal(darkElement)?.props.style?.color).toBe('#E07A5F');
    expect(findBundleTotal(darkElement)?.props.style?.fontSize).toBe(72);
    expect(findBundleTotal(lightElement)?.props.style?.color).toBe('#7b4334');
    expect(findPlusSigns(darkElement).every((child) => child.props.style?.color === '#E07A5F')).toBe(true);
    expect(findPlusSigns(lightElement).every((child) => child.props.style?.color === '#7b4334')).toBe(true);
  });

  it('uses flex layout for every div', () => {
    const element = template.render(template.defaults);

    expect(
      getAllElements(element)
        .filter((child) => child.type === 'div')
        .every((child) => child.props.style?.display === 'flex'),
    ).toBe(true);
  });
});
