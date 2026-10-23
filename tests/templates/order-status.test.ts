import { describe, expect, it } from 'vitest';
import ecommerceOrderStatus from '@/templates/ecommerce/order-status';
import { ecommerceOrderStatus as ecommerceOrderStatusExport } from '@/templates/ecommerce';
import { getTemplate, getTemplatesByCategory } from '@/templates/registry';
import { contrastText, isLightColor, mixColors } from '@/templates/utils';

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

function trackerSteps(element: any): any[] {
  return element.props.children[2].props.children.slice(2);
}

describe('ecommerce-order-status', () => {
  it.each([
    ['missing', undefined, 2],
    ['invalid string', 'abc', 2],
    ['empty string', '', 2],
    ['below range', '0', 1],
    ['above range', '5', 4],
    ['decimal', '2.6', 3],
    ['string number', '4', 4],
  ])('parses and clamps currentStep for %s input', (_label, currentStep, expectedStep) => {
    const rendered = ecommerceOrderStatus.render({ ...ecommerceOrderStatus.defaults, currentStep });
    const steps = trackerSteps(rendered);
    expect(steps).toHaveLength(4);
    expect(steps.map((step) => step.props.children[0].props.style.backgroundColor === ecommerceOrderStatus.defaults.accentColor))
      .toEqual([1, 2, 3, 4].map((step) => step <= expectedStep));
    expect(textContent(rendered)).toEqual(expect.arrayContaining(['Ordered', 'Shipped', 'Out for delivery', 'Delivered']));
  });

  it('hides order number and delivery estimate when they are empty', () => {
    const rendered = ecommerceOrderStatus.render({
      ...ecommerceOrderStatus.defaults,
      orderNumber: '',
      estimate: '',
    });
    const values = textContent(rendered);
    expect(values.some((value) => value.includes('Order '))).toBe(false);
    expect(values).not.toContain(ecommerceOrderStatus.defaults.estimate);
    expect(values).toContain(ecommerceOrderStatus.defaults.title);
  });

  it('hides whitespace-only order number and delivery estimate', () => {
    const rendered = ecommerceOrderStatus.render({
      ...ecommerceOrderStatus.defaults,
      orderNumber: '   ',
      estimate: '   ',
    });
    const values = textContent(rendered);
    expect(values.some((value) => value.includes('Order '))).toBe(false);
    expect(values).not.toContain('   ');
    expect(values).not.toContain(ecommerceOrderStatus.defaults.estimate);
  });

  it('adapts progress colors for a light background and keeps contrast on active steps', () => {
    const lightParams = {
      ...ecommerceOrderStatus.defaults,
      bgColor: '#ffffff',
      textColor: '#111111',
      accentColor: '#fde047',
    };
    const rendered = ecommerceOrderStatus.render(lightParams);
    const steps = trackerSteps(rendered);
    const progressColor = mixColors(lightParams.accentColor, '#000000', 0.45);

    expect(isLightColor(lightParams.bgColor)).toBe(true);
    expect(steps[0].props.children[0].props.style.backgroundColor).toBe(progressColor);
    expect(steps[0].props.children[0].props.style.color).toBe(contrastText(progressColor));
    expect(steps[0].props.children[1].props.style.color).toBe(progressColor);

    walk(rendered, (node) => {
      if (node.type === 'div') expect(node.props.style.display).toBe('flex');
    });
    expect(rendered.props.style).toMatchObject({ width: '1200px', height: '630px' });
  });

  it('truncates long product titles and exposes the requested fields', () => {
    const rendered = ecommerceOrderStatus.render({
      ...ecommerceOrderStatus.defaults,
      title: 'A'.repeat(120),
      currentStep: 'abc',
    });
    expect(textContent(rendered)).toContain(`${'A'.repeat(71)}…`);

    for (const field of ['siteName', 'title', 'orderNumber', 'currentStep', 'estimate', 'bgColor', 'accentColor', 'textColor']) {
      expect(ecommerceOrderStatus.fields.some((item) => item.key === field)).toBe(true);
    }
    expect(ecommerceOrderStatus.fields.find((field) => field.key === 'currentStep')).toMatchObject({
      type: 'number',
      min: 1,
      max: 4,
    });
  });

  it('is exported and registered exactly once in E-commerce', () => {
    expect(ecommerceOrderStatusExport).toBe(ecommerceOrderStatus);
    expect(getTemplate('ecommerce-order-status')).toBe(ecommerceOrderStatus);
    expect(getTemplatesByCategory('ecommerce').filter((template) => template.id === 'ecommerce-order-status')).toHaveLength(1);
  });
});
