import { describe, expect, it } from 'vitest';
import ecommerceGiftCard from '@/templates/ecommerce/gift-card';
import { ecommerceGiftCard as ecommerceGiftCardExport } from '@/templates/ecommerce';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { contrastText } from '@/templates/utils';

function walk(node: any, visit: (node: any) => void): void {
  if (!node || typeof node !== 'object') return;
  visit(node);
  const children = node.props?.children;
  if (Array.isArray(children)) children.forEach((child) => walk(child, visit));
  else walk(children, visit);
}

function textContent(element: any): string[] {
  const values: string[] = [];
  walk(element, (node) => {
    if (typeof node.props?.children === 'string') values.push(node.props.children);
  });
  return values;
}

function findByText(element: any, text: string): any {
  let found: any;
  walk(element, (node) => {
    if (!found && node.props?.children === text) found = node;
  });
  return found;
}

describe('ecommerce-gift-card', () => {
  it('is exported and registered exactly once in E-commerce', () => {
    expect(ecommerceGiftCardExport).toBe(ecommerceGiftCard);
    expect(ecommerceGiftCard.category).toBe('ecommerce');
    expect(getTemplate('ecommerce-gift-card')).toBe(ecommerceGiftCard);
    expect(getTemplatesByCategory('ecommerce').filter((template) => template.id === 'ecommerce-gift-card')).toHaveLength(1);
  });

  it('exposes the requested fields with a $50 amount default', () => {
    for (const field of ['siteName', 'title', 'amount', 'note', 'bgColor', 'accentColor', 'textColor']) {
      expect(ecommerceGiftCard.fields.some((item) => item.key === field)).toBe(true);
    }
    expect(ecommerceGiftCard.fields.find((field) => field.key === 'amount')).toMatchObject({
      type: 'text',
      defaultValue: '$50',
    });
  });

  it('hides an empty or whitespace-only note', () => {
    for (const note of ['', '   ']) {
      const rendered = ecommerceGiftCard.render({ ...ecommerceGiftCard.defaults, note });
      expect(textContent(rendered)).not.toContain(ecommerceGiftCard.defaults.note);
      expect(textContent(rendered)).not.toContain(note);
    }
  });

  it('shows the note when provided', () => {
    const rendered = ecommerceGiftCard.render({
      ...ecommerceGiftCard.defaults,
      note: 'Delivered instantly by email',
    });
    expect(textContent(rendered)).toContain('Delivered instantly by email');
  });

  it('uses contrast text for every card label on any accent color', () => {
    const accentColor = '#fde047';
    const rendered = ecommerceGiftCard.render({
      ...ecommerceGiftCard.defaults,
      accentColor,
    });
    const cardTextColor = contrastText(accentColor);

    for (const text of [String(ecommerceGiftCard.defaults.siteName), 'Gift card', String(ecommerceGiftCard.defaults.amount)]) {
      expect(findByText(rendered, text)?.props.style.color).toBe(cardTextColor);
    }
  });

  it('truncates long headlines and amounts', () => {
    const rendered = ecommerceGiftCard.render({
      ...ecommerceGiftCard.defaults,
      title: 'A'.repeat(120),
      amount: 'B'.repeat(120),
    });
    const values = textContent(rendered);

    expect(values).toContain(`${'A'.repeat(49)}…`);
    expect(values).toContain(`${'B'.repeat(13)}…`);
  });

  it('uses flex layout for every div and the required canvas size', () => {
    const rendered = ecommerceGiftCard.render(ecommerceGiftCard.defaults);

    expect(rendered.props.style).toMatchObject({ width: '1200px', height: '630px' });
    walk(rendered, (node) => {
      if (node.type === 'div') expect(node.props.style.display).toBe('flex');
    });
  });
});
