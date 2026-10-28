import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import satori, { type SatoriNode } from 'satori';
import pricingHighlight from '@/templates/saas/pricing-highlight';

const fonts = ['Inter-Regular', 'Inter-SemiBold', 'Inter-Bold'].map((file) => ({
  name: 'Inter',
  data: readFileSync(`public/fonts/${file}.woff`),
  weight: (file.endsWith('SemiBold') ? 600 : file.endsWith('Bold') ? 700 : 400) as 400 | 600 | 700,
  style: 'normal' as const,
}));

async function layout(price: string) {
  const nodes: SatoriNode[] = [];
  await satori(pricingHighlight.render({ ...pricingHighlight.defaults, price }) as any, {
    width: 1200, height: 630, fonts, onNodeDetected: (node) => nodes.push(node),
  });
  const priceNode = nodes.find((node) => node.props.style?.flexShrink === 0)!;
  const period = nodes.find((node) => node.textContent === '/month')!;
  const card = nodes.find((node) => node.props.style?.width === '380px')!;
  return { priceNode, period, innerRight: card.left + card.width - 40 };
}

describe('saas-pricing-highlight', () => {
  it('keeps the default price at 56px', async () => {
    expect((await layout('$29')).priceNode.props.style.fontSize).toBe('56px');
  });

  it.each(['$1,299.00', '$12,499.99', '$1,234,567.89'])('fits %s and the period inside the card', async (price) => {
    const { priceNode, period, innerRight } = await layout(price);
    expect(parseInt(priceNode.props.style.fontSize)).toBeLessThan(56);
    expect(period.left).toBeGreaterThanOrEqual(priceNode.left + priceNode.width);
    expect(period.left + period.width).toBeLessThanOrEqual(innerRight);
  });
});
