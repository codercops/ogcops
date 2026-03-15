import { describe, it, expect } from 'vitest';
import { parseAIResponse } from '@/lib/ai/generate';

describe('parseAIResponse', () => {
  it('should parse clean JSON array', () => {
    const result = parseAIResponse('["Title One", "Title Two", "Title Three"]');
    expect(result).toEqual(['Title One', 'Title Two', 'Title Three']);
  });

  it('should parse JSON with whitespace', () => {
    const result = parseAIResponse('  \n["Title One", "Title Two"]  \n');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should parse markdown-wrapped JSON', () => {
    const result = parseAIResponse('```json\n["Title One", "Title Two"]\n```');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should parse markdown without json tag', () => {
    const result = parseAIResponse('```\n["Title One", "Title Two"]\n```');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should extract JSON array from surrounding text', () => {
    const result = parseAIResponse('Here are some titles:\n["Title One", "Title Two"]\nHope these help!');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should filter out non-string values', () => {
    const result = parseAIResponse('[1, "Title One", null, "Title Two", true]');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should fallback to newline splitting for plain text', () => {
    const result = parseAIResponse('Title One\nTitle Two\nTitle Three');
    expect(result).toEqual(['Title One', 'Title Two', 'Title Three']);
  });

  it('should handle numbered list fallback', () => {
    const result = parseAIResponse('1. Title One\n2. Title Two\n3. Title Three');
    expect(result).toEqual(['Title One', 'Title Two', 'Title Three']);
  });

  it('should handle bullet list fallback', () => {
    const result = parseAIResponse('- Title One\n- Title Two\n- Title Three');
    expect(result).toEqual(['Title One', 'Title Two', 'Title Three']);
  });

  it('should strip surrounding quotes in fallback', () => {
    const result = parseAIResponse('"Title One"\n"Title Two"');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should filter empty lines in fallback', () => {
    const result = parseAIResponse('Title One\n\n\nTitle Two');
    expect(result).toEqual(['Title One', 'Title Two']);
  });

  it('should handle completely empty response', () => {
    const result = parseAIResponse('');
    expect(result).toEqual([]);
  });
});
