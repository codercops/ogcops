import { describe, it, expect } from 'vitest';
import { getProvider, getAllProviders, getModelsForProvider, getDefaultModel, isValidProvider } from '@/lib/ai/providers';
import { AI_PROVIDERS } from '@/lib/ai/types';
import type { AIProvider } from '@/lib/ai/types';

describe('AI Provider Registry', () => {
  it('should have all 5 providers registered', () => {
    const providers = getAllProviders();
    expect(providers).toHaveLength(5);
    expect(providers.map((p) => p.id).sort()).toEqual(
      ['anthropic', 'google', 'groq', 'openai', 'openrouter']
    );
  });

  it('should return correct config for each provider', () => {
    for (const id of AI_PROVIDERS) {
      const provider = getProvider(id);
      expect(provider).toBeDefined();
      expect(provider!.id).toBe(id);
      expect(provider!.name).toBeTruthy();
      expect(provider!.baseUrl).toMatch(/^https:\/\//);
      expect(provider!.apiKeyUrl).toMatch(/^https:\/\//);
    }
  });

  it('should return undefined for unknown provider', () => {
    expect(getProvider('nonexistent' as AIProvider)).toBeUndefined();
  });

  it('should have at least 2 models per provider', () => {
    for (const id of AI_PROVIDERS) {
      const models = getModelsForProvider(id);
      expect(models.length).toBeGreaterThanOrEqual(2);
      for (const model of models) {
        expect(model.id).toBeTruthy();
        expect(model.name).toBeTruthy();
        expect(model.provider).toBe(id);
        expect(model.maxTokens).toBeGreaterThan(0);
      }
    }
  });

  it('should return empty array for unknown provider models', () => {
    expect(getModelsForProvider('nonexistent' as AIProvider)).toEqual([]);
  });

  it('should return a default model for each provider', () => {
    for (const id of AI_PROVIDERS) {
      const defaultModel = getDefaultModel(id);
      expect(defaultModel).toBeTruthy();
      // Default model should be in the provider's model list
      const models = getModelsForProvider(id);
      expect(models.some((m) => m.id === defaultModel)).toBe(true);
    }
  });

  it('should return undefined for unknown provider default model', () => {
    expect(getDefaultModel('nonexistent' as AIProvider)).toBeUndefined();
  });

  it('should validate provider IDs correctly', () => {
    expect(isValidProvider('openai')).toBe(true);
    expect(isValidProvider('anthropic')).toBe(true);
    expect(isValidProvider('google')).toBe(true);
    expect(isValidProvider('groq')).toBe(true);
    expect(isValidProvider('openrouter')).toBe(true);
    expect(isValidProvider('nonexistent')).toBe(false);
    expect(isValidProvider('')).toBe(false);
  });
});

describe('AI Provider Header Builders', () => {
  it('should build OpenAI headers with Bearer token', () => {
    const provider = getProvider('openai')!;
    const headers = provider.headerBuilder('sk-test-key');
    expect(headers['Authorization']).toBe('Bearer sk-test-key');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should build Anthropic headers with x-api-key', () => {
    const provider = getProvider('anthropic')!;
    const headers = provider.headerBuilder('sk-ant-test-key');
    expect(headers['x-api-key']).toBe('sk-ant-test-key');
    expect(headers['anthropic-version']).toBe('2023-06-01');
    expect(headers['Content-Type']).toBe('application/json');
  });

  it('should build Google headers (key via query param, not header)', () => {
    const provider = getProvider('google')!;
    const headers = provider.headerBuilder('google-key');
    expect(headers['Content-Type']).toBe('application/json');
    expect(headers['Authorization']).toBeUndefined();
  });

  it('should build Groq headers with Bearer token', () => {
    const provider = getProvider('groq')!;
    const headers = provider.headerBuilder('gsk-test-key');
    expect(headers['Authorization']).toBe('Bearer gsk-test-key');
  });

  it('should build OpenRouter headers with referer', () => {
    const provider = getProvider('openrouter')!;
    const headers = provider.headerBuilder('sk-or-test-key');
    expect(headers['Authorization']).toBe('Bearer sk-or-test-key');
    expect(headers['HTTP-Referer']).toBeTruthy();
    expect(headers['X-Title']).toBe('OGCOPS');
  });
});

describe('AI Provider Body Formatters', () => {
  const baseParams = {
    model: 'test-model',
    prompt: 'Generate a title',
    systemPrompt: 'You are a helper',
    maxTokens: 200,
    temperature: 0.7,
  };

  it('should format OpenAI-style body (OpenAI)', () => {
    const provider = getProvider('openai')!;
    const { url, body } = provider.bodyFormatter(baseParams);
    expect(url).toContain('/chat/completions');
    const b = body as any;
    expect(b.model).toBe('test-model');
    expect(b.messages).toHaveLength(2);
    expect(b.messages[0]).toEqual({ role: 'system', content: 'You are a helper' });
    expect(b.messages[1]).toEqual({ role: 'user', content: 'Generate a title' });
    expect(b.max_tokens).toBe(200);
    expect(b.temperature).toBe(0.7);
  });

  it('should format OpenAI-style body without system prompt', () => {
    const provider = getProvider('openai')!;
    const { body } = provider.bodyFormatter({ ...baseParams, systemPrompt: undefined });
    const b = body as any;
    expect(b.messages).toHaveLength(1);
    expect(b.messages[0].role).toBe('user');
  });

  it('should format Anthropic-style body', () => {
    const provider = getProvider('anthropic')!;
    const { url, body } = provider.bodyFormatter(baseParams);
    expect(url).toContain('/v1/messages');
    const b = body as any;
    expect(b.model).toBe('test-model');
    expect(b.system).toBe('You are a helper');
    expect(b.messages).toHaveLength(1);
    expect(b.messages[0]).toEqual({ role: 'user', content: 'Generate a title' });
    expect(b.max_tokens).toBe(200);
    expect(b.temperature).toBe(0.7);
  });

  it('should format Anthropic body without system prompt', () => {
    const provider = getProvider('anthropic')!;
    const { body } = provider.bodyFormatter({ ...baseParams, systemPrompt: undefined });
    const b = body as any;
    expect(b.system).toBeUndefined();
  });

  it('should format Google Gemini body', () => {
    const provider = getProvider('google')!;
    const { url, body } = provider.bodyFormatter(baseParams);
    expect(url).toContain('generateContent');
    expect(url).toContain('test-model');
    const b = body as any;
    expect(b.contents[0].parts[0].text).toContain('Generate a title');
    expect(b.contents[0].parts[0].text).toContain('You are a helper');
    expect(b.generationConfig.maxOutputTokens).toBe(200);
    expect(b.generationConfig.temperature).toBe(0.7);
  });

  it('should format Groq body (OpenAI-compatible)', () => {
    const provider = getProvider('groq')!;
    const { url, body } = provider.bodyFormatter(baseParams);
    expect(url).toContain('groq.com');
    expect(url).toContain('/chat/completions');
    const b = body as any;
    expect(b.messages).toHaveLength(2);
  });

  it('should format OpenRouter body (OpenAI-compatible)', () => {
    const provider = getProvider('openrouter')!;
    const { url, body } = provider.bodyFormatter(baseParams);
    expect(url).toContain('openrouter.ai');
    expect(url).toContain('/chat/completions');
    const b = body as any;
    expect(b.messages).toHaveLength(2);
  });

  it('should use defaults when maxTokens and temperature are not provided', () => {
    const provider = getProvider('openai')!;
    const { body } = provider.bodyFormatter({ model: 'gpt-4o', prompt: 'hi' });
    const b = body as any;
    expect(b.max_tokens).toBe(300);
    expect(b.temperature).toBe(0.8);
  });
});

describe('AI Provider Response Parsers', () => {
  it('should parse OpenAI response', () => {
    const provider = getProvider('openai')!;
    const result = provider.responseParser({
      choices: [{ message: { content: 'Hello world' } }],
      model: 'gpt-4o-mini',
      usage: { prompt_tokens: 10, completion_tokens: 5 },
    });
    expect(result.content).toBe('Hello world');
    expect(result.model).toBe('gpt-4o-mini');
    expect(result.usage).toEqual({ inputTokens: 10, outputTokens: 5 });
  });

  it('should parse Anthropic response', () => {
    const provider = getProvider('anthropic')!;
    const result = provider.responseParser({
      content: [{ type: 'text', text: 'Hello from Claude' }],
      model: 'claude-sonnet-4-6',
      usage: { input_tokens: 15, output_tokens: 8 },
    });
    expect(result.content).toBe('Hello from Claude');
    expect(result.model).toBe('claude-sonnet-4-6');
    expect(result.usage).toEqual({ inputTokens: 15, outputTokens: 8 });
  });

  it('should parse Google Gemini response', () => {
    const provider = getProvider('google')!;
    const result = provider.responseParser({
      candidates: [{ content: { parts: [{ text: 'Hello from Gemini' }] } }],
      modelVersion: 'gemini-2.0-flash',
      usageMetadata: { promptTokenCount: 20, candidatesTokenCount: 10 },
    });
    expect(result.content).toBe('Hello from Gemini');
    expect(result.model).toBe('gemini-2.0-flash');
    expect(result.usage).toEqual({ inputTokens: 20, outputTokens: 10 });
  });

  it('should handle empty/malformed responses gracefully', () => {
    const provider = getProvider('openai')!;
    const result = provider.responseParser({});
    expect(result.content).toBe('');
    expect(result.model).toBe('');
    expect(result.usage).toBeUndefined();
  });

  it('should handle missing usage data', () => {
    const provider = getProvider('anthropic')!;
    const result = provider.responseParser({
      content: [{ text: 'test' }],
      model: 'claude-haiku-4-5',
    });
    expect(result.content).toBe('test');
    expect(result.usage).toBeUndefined();
  });
});

describe('AI Provider Validate Requests', () => {
  it('should build OpenAI validation request', () => {
    const provider = getProvider('openai')!;
    const req = provider.validateRequest('sk-test');
    expect(req.method).toBe('GET');
    expect(req.url).toContain('/v1/models');
    expect(req.headers['Authorization']).toBe('Bearer sk-test');
  });

  it('should build Anthropic validation request', () => {
    const provider = getProvider('anthropic')!;
    const req = provider.validateRequest('sk-ant-test');
    expect(req.method).toBe('POST');
    expect(req.url).toContain('/v1/messages');
    expect(req.headers['x-api-key']).toBe('sk-ant-test');
  });

  it('should build Google validation request with key in URL', () => {
    const provider = getProvider('google')!;
    const req = provider.validateRequest('google-key');
    expect(req.method).toBe('GET');
    expect(req.url).toContain('key=google-key');
  });

  it('should build Groq validation request', () => {
    const provider = getProvider('groq')!;
    const req = provider.validateRequest('gsk-test');
    expect(req.method).toBe('GET');
    expect(req.url).toContain('/models');
    expect(req.headers['Authorization']).toBe('Bearer gsk-test');
  });

  it('should build OpenRouter validation request', () => {
    const provider = getProvider('openrouter')!;
    const req = provider.validateRequest('sk-or-test');
    expect(req.method).toBe('GET');
    expect(req.url).toContain('/models');
    expect(req.headers['Authorization']).toBe('Bearer sk-or-test');
  });
});
