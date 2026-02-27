import { describe, it, expect } from 'vitest';
import { previewQuerySchema } from '@/lib/api-validation';

describe('Preview API Validation', () => {
  it('should validate a valid URL', () => {
    const result = previewQuerySchema.safeParse({
      url: 'https://example.com',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing URL', () => {
    const result = previewQuerySchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('should reject invalid URL', () => {
    const result = previewQuerySchema.safeParse({
      url: 'not-a-url',
    });
    expect(result.success).toBe(false);
  });
});
