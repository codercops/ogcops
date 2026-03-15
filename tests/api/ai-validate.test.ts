import { describe, it, expect } from 'vitest';
import { aiValidateSchema } from '@/lib/ai/validation';

describe('AI Validate API Schema', () => {
  it('should accept valid validate request', () => {
    expect(aiValidateSchema.safeParse({ provider: 'openai', apiKey: 'sk-test' }).success).toBe(true);
    expect(aiValidateSchema.safeParse({ provider: 'anthropic', apiKey: 'sk-ant-test' }).success).toBe(true);
    expect(aiValidateSchema.safeParse({ provider: 'google', apiKey: 'key' }).success).toBe(true);
    expect(aiValidateSchema.safeParse({ provider: 'groq', apiKey: 'gsk-test' }).success).toBe(true);
    expect(aiValidateSchema.safeParse({ provider: 'openrouter', apiKey: 'sk-or-test' }).success).toBe(true);
  });

  it('should reject missing fields', () => {
    expect(aiValidateSchema.safeParse({}).success).toBe(false);
    expect(aiValidateSchema.safeParse({ provider: 'openai' }).success).toBe(false);
    expect(aiValidateSchema.safeParse({ apiKey: 'test' }).success).toBe(false);
  });

  it('should reject invalid provider', () => {
    expect(aiValidateSchema.safeParse({ provider: 'invalid', apiKey: 'test' }).success).toBe(false);
  });
});
