import { describe, it, expect } from 'vitest';
import { parseRecommenderResponse } from '@/lib/ai/recommender';

describe('parseRecommenderResponse', () => {
  it('should parse clean JSON array', () => {
    const result = parseRecommenderResponse(JSON.stringify([
      { id: 'blog-minimal-dark', score: 95, reason: 'Perfect match' },
      { id: 'blog-code-dark', score: 80, reason: 'Good for code' },
    ]));
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('blog-minimal-dark');
    expect(result[0].score).toBe(95);
    expect(result[0].reason).toBe('Perfect match');
  });

  it('should parse markdown-wrapped JSON', () => {
    const result = parseRecommenderResponse('```json\n[{"id":"test","score":90,"reason":"match"}]\n```');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('test');
  });

  it('should extract array from surrounding text', () => {
    const result = parseRecommenderResponse('Here are the results:\n[{"id":"test","score":85,"reason":"good"}]\nHope this helps!');
    expect(result).toHaveLength(1);
  });

  it('should limit to 5 results', () => {
    const items = Array.from({ length: 10 }, (_, i) => ({ id: `t${i}`, score: 90 - i, reason: 'match' }));
    const result = parseRecommenderResponse(JSON.stringify(items));
    expect(result).toHaveLength(5);
  });

  it('should handle missing score', () => {
    const result = parseRecommenderResponse('[{"id":"test","reason":"good"}]');
    expect(result[0].score).toBe(50); // default
  });

  it('should handle missing reason', () => {
    const result = parseRecommenderResponse('[{"id":"test","score":90}]');
    expect(result[0].reason).toBe('');
  });

  it('should filter out items without id', () => {
    const result = parseRecommenderResponse('[{"score":90,"reason":"no id"},{"id":"valid","score":80}]');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('valid');
  });

  it('should return empty array for invalid input', () => {
    expect(parseRecommenderResponse('not json')).toEqual([]);
  });

  it('should return empty array for empty string', () => {
    expect(parseRecommenderResponse('')).toEqual([]);
  });
});
