import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import satori, { type SatoriNode } from 'satori';
import ticketCta from '@/templates/event/ticket-cta';

const fonts = ['Inter-Regular', 'Inter-Bold', 'PlayfairDisplay-Bold'].map((file) => ({
  name: file.startsWith('Inter') ? 'Inter' : 'Playfair Display',
  data: readFileSync(`public/fonts/${file}.woff`),
  weight: (file.endsWith('Bold') ? 700 : 400) as 400 | 700,
  style: 'normal' as const,
}));

async function layout(price: string) {
  const nodes: SatoriNode[] = [];
  await satori(ticketCta.render({ ...ticketCta.defaults, price }) as any, {
    width: 1200, height: 630, fonts, onNodeDetected: (node) => nodes.push(node),
  });
  const priceNode = nodes.find((node) => node.props.style?.marginBottom === '24px' && node.props.style?.lineHeight === 1)!;
  const column = nodes.find((node) => node.props.style?.width === '300px')!;
  return { priceNode, left: column.left + 48, right: column.left + column.width - 48 };
}

describe('event-ticket-cta', () => {
  it('keeps the default price at 64px', async () => {
    expect((await layout('$99')).priceNode.props.style.fontSize).toBe('64px');
  });

  it.each(['$1,299.00', '$12,499.99', 'From $149 / person'])('fits %s inside the price column', async (price) => {
    const { priceNode, left, right } = await layout(price);
    expect(parseInt(priceNode.props.style.fontSize)).toBeLessThan(64);
    expect(priceNode.left).toBeGreaterThanOrEqual(left);
    expect(priceNode.left + priceNode.width).toBeLessThanOrEqual(right);
  });

  it('truncates a very long price', () => {
    const text = JSON.stringify(ticketCta.render({ ...ticketCta.defaults, price: 'x'.repeat(40) }));
    expect(text).toContain('x'.repeat(23) + '…');
  });
});
