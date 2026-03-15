import { describe, it, expect } from 'vitest';
import { aiValidateSchema, aiGenerateSchema } from '@/lib/ai/validation';

describe('AI Validate Schema', () => {
  it('should accept valid input', () => {
    const result = aiValidateSchema.safeParse({
      provider: 'openai',
      apiKey: 'sk-test-123',
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing provider', () => {
    const result = aiValidateSchema.safeParse({
      apiKey: 'sk-test-123',
    });
    expect(result.success).toBe(false);
  });

  it('should reject missing apiKey', () => {
    const result = aiValidateSchema.safeParse({
      provider: 'openai',
    });
    expect(result.success).toBe(false);
  });

  it('should reject empty apiKey', () => {
    const result = aiValidateSchema.safeParse({
      provider: 'openai',
      apiKey: '',
    });
    expect(result.success).toBe(false);
  });

  it('should reject unknown provider', () => {
    const result = aiValidateSchema.safeParse({
      provider: 'unknown',
      apiKey: 'sk-test',
    });
    expect(result.success).toBe(false);
  });

  it('should accept all valid providers', () => {
    for (const provider of ['openai', 'anthropic', 'google', 'groq', 'openrouter']) {
      const result = aiValidateSchema.safeParse({ provider, apiKey: 'test-key' });
      expect(result.success).toBe(true);
    }
  });
});

describe('AI Generate Schema', () => {
  const validInput = {
    provider: 'openai',
    apiKey: 'sk-test-123',
    model: 'gpt-4o-mini',
    prompt: 'Generate a title for a blog post about REST APIs',
  };

  it('should accept valid input', () => {
    const result = aiGenerateSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('should accept input with all optional fields', () => {
    const result = aiGenerateSchema.safeParse({
      ...validInput,
      systemPrompt: 'You are a copywriter',
      maxTokens: 200,
      temperature: 0.7,
    });
    expect(result.success).toBe(true);
  });

  it('should reject missing provider', () => {
    const { provider, ...rest } = validInput;
    expect(aiGenerateSchema.safeParse(rest).success).toBe(false);
  });

  it('should reject missing apiKey', () => {
    const { apiKey, ...rest } = validInput;
    expect(aiGenerateSchema.safeParse(rest).success).toBe(false);
  });

  it('should reject missing model', () => {
    const { model, ...rest } = validInput;
    expect(aiGenerateSchema.safeParse(rest).success).toBe(false);
  });

  it('should reject missing prompt', () => {
    const { prompt, ...rest } = validInput;
    expect(aiGenerateSchema.safeParse(rest).success).toBe(false);
  });

  it('should reject empty prompt', () => {
    expect(aiGenerateSchema.safeParse({ ...validInput, prompt: '' }).success).toBe(false);
  });

  it('should reject prompt exceeding 10000 chars', () => {
    const longPrompt = 'a'.repeat(10001);
    expect(aiGenerateSchema.safeParse({ ...validInput, prompt: longPrompt }).success).toBe(false);
  });

  it('should reject maxTokens exceeding 4096', () => {
    expect(aiGenerateSchema.safeParse({ ...validInput, maxTokens: 5000 }).success).toBe(false);
  });

  it('should reject negative maxTokens', () => {
    expect(aiGenerateSchema.safeParse({ ...validInput, maxTokens: -1 }).success).toBe(false);
  });

  it('should reject temperature above 2', () => {
    expect(aiGenerateSchema.safeParse({ ...validInput, temperature: 2.5 }).success).toBe(false);
  });

  it('should reject negative temperature', () => {
    expect(aiGenerateSchema.safeParse({ ...validInput, temperature: -0.1 }).success).toBe(false);
  });

  it('should accept temperature at boundaries', () => {
    expect(aiGenerateSchema.safeParse({ ...validInput, temperature: 0 }).success).toBe(true);
    expect(aiGenerateSchema.safeParse({ ...validInput, temperature: 2 }).success).toBe(true);
  });

  it('should reject systemPrompt exceeding 5000 chars', () => {
    const longSystem = 'a'.repeat(5001);
    expect(aiGenerateSchema.safeParse({ ...validInput, systemPrompt: longSystem }).success).toBe(false);
  });
});
