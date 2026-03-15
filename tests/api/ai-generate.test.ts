import { describe, it, expect } from 'vitest';
import { aiGenerateSchema } from '@/lib/ai/validation';

describe('AI Generate API Schema', () => {
  const valid = {
    provider: 'openai',
    apiKey: 'sk-test',
    model: 'gpt-4o-mini',
    prompt: 'Generate titles',
  };

  it('should accept valid generate request', () => {
    expect(aiGenerateSchema.safeParse(valid).success).toBe(true);
  });

  it('should accept with all optional fields', () => {
    expect(aiGenerateSchema.safeParse({
      ...valid,
      systemPrompt: 'You are a helper',
      maxTokens: 200,
      temperature: 0.7,
    }).success).toBe(true);
  });

  it('should reject missing required fields', () => {
    const { provider, ...noProvider } = valid;
    const { apiKey, ...noKey } = valid;
    const { model, ...noModel } = valid;
    const { prompt, ...noPrompt } = valid;
    expect(aiGenerateSchema.safeParse(noProvider).success).toBe(false);
    expect(aiGenerateSchema.safeParse(noKey).success).toBe(false);
    expect(aiGenerateSchema.safeParse(noModel).success).toBe(false);
    expect(aiGenerateSchema.safeParse(noPrompt).success).toBe(false);
  });

  it('should reject out-of-range values', () => {
    expect(aiGenerateSchema.safeParse({ ...valid, maxTokens: 5000 }).success).toBe(false);
    expect(aiGenerateSchema.safeParse({ ...valid, temperature: 3 }).success).toBe(false);
    expect(aiGenerateSchema.safeParse({ ...valid, prompt: 'a'.repeat(10001) }).success).toBe(false);
  });
});
