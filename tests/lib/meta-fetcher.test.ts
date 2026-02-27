import { describe, it, expect } from 'vitest';

// We test the parseMetaTags logic by importing the module
// For now, test the meta-analyzer which doesn't need network access

describe('Meta Fetcher', () => {
  it('should exist as a module', async () => {
    const mod = await import('@/lib/meta-fetcher');
    expect(mod.fetchMetaTags).toBeDefined();
    expect(typeof mod.fetchMetaTags).toBe('function');
  });
});
