import { describe, it, expect } from 'vitest';
import { parseAutofillResponse } from '@/lib/ai/autofill';

describe('parseAutofillResponse', () => {
  it('should parse clean JSON response', () => {
    const result = parseAutofillResponse(JSON.stringify({
      templateId: 'blog-minimal-dark',
      fields: { title: 'Hello World', author: 'John' },
      colors: { bgColor: '#1a1a2e' },
    }));
    expect(result).not.toBeNull();
    expect(result!.templateId).toBe('blog-minimal-dark');
    expect(result!.fields.title).toBe('Hello World');
    expect(result!.colors?.bgColor).toBe('#1a1a2e');
  });

  it('should parse JSON from markdown code block', () => {
    const result = parseAutofillResponse('```json\n{"templateId":"blog-code-dark","fields":{"title":"Test"}}\n```');
    expect(result).not.toBeNull();
    expect(result!.templateId).toBe('blog-code-dark');
  });

  it('should extract JSON from surrounding text', () => {
    const result = parseAutofillResponse('Here is the result:\n{"templateId":"product-centered-hero","fields":{"title":"Launch"}}\nDone!');
    expect(result).not.toBeNull();
    expect(result!.templateId).toBe('product-centered-hero');
  });

  it('should return null for invalid JSON', () => {
    expect(parseAutofillResponse('not json at all')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(parseAutofillResponse('')).toBeNull();
  });

  it('should return null for JSON without templateId', () => {
    expect(parseAutofillResponse('{"fields":{"title":"test"}}')).toBeNull();
  });

  it('should return null for JSON without fields', () => {
    expect(parseAutofillResponse('{"templateId":"test"}')).toBeNull();
  });

  it('should handle response without colors', () => {
    const result = parseAutofillResponse('{"templateId":"blog-minimal-dark","fields":{"title":"Test"}}');
    expect(result).not.toBeNull();
    expect(result!.colors).toBeUndefined();
  });
});
