import { describe, it, expect } from 'vitest';
import { buildOgQuery } from '@/lib/url-builder';

describe('buildOgQuery', () => {
  const defaults = { title: 'Weekly Dev', subscriberCount: '12,400', frequency: '' };

  it('puts the template first and keeps filled-in values', () => {
    const query = buildOgQuery('newsletter-subscribe-card', { title: 'Hello', subscriberCount: '900' }, defaults);
    expect(query).toBe('template=newsletter-subscribe-card&title=Hello&subscriberCount=900');
  });

  it('keeps a cleared field as key= when its default is not empty', () => {
    const query = buildOgQuery('newsletter-subscribe-card', { title: 'Hello', subscriberCount: '' }, defaults);
    expect(new URLSearchParams(query).has('subscriberCount')).toBe(true);
    expect(new URLSearchParams(query).get('subscriberCount')).toBe('');
  });

  it('leaves out empty values whose default is empty too, and null or undefined ones', () => {
    const query = buildOgQuery('newsletter-subscribe-card', { title: 'Hello', frequency: '', extra: undefined, other: null }, defaults);
    expect(query).toBe('template=newsletter-subscribe-card&title=Hello');
  });

  it('without defaults, leaves every empty value out like before', () => {
    expect(buildOgQuery('blog-minimal-dark', { title: 'Hi', description: '' })).toBe('template=blog-minimal-dark&title=Hi');
  });
});
