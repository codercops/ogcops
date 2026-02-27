import { describe, it, expect } from 'vitest';
import { ogQuerySchema } from '@/lib/api-validation';

describe('OG API Validation', () => {
  it('should validate valid params', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Hello World',
      template: 'blog-minimal-dark',
    });
    expect(result.success).toBe(true);
  });

  it('should require title', () => {
    const result = ogQuerySchema.safeParse({
      template: 'blog-minimal-dark',
    });
    expect(result.success).toBe(false);
  });

  it('should use defaults for optional params', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Test',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.template).toBe('blog-minimal-dark');
      expect(result.data.width).toBe(1200);
      expect(result.data.height).toBe(630);
    }
  });

  it('should coerce width and height to numbers', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Test',
      width: '800',
      height: '400',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.width).toBe(800);
      expect(result.data.height).toBe(400);
    }
  });

  it('should reject invalid dimensions', () => {
    const result = ogQuerySchema.safeParse({
      title: 'Test',
      width: '50', // too small
    });
    expect(result.success).toBe(false);
  });
});
