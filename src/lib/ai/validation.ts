import { z } from 'zod';

const aiProviderEnum = z.enum(['openai', 'anthropic', 'google', 'groq', 'openrouter']);

export const aiValidateSchema = z.object({
  provider: aiProviderEnum,
  apiKey: z.string().min(1, 'API key is required'),
});

export const aiGenerateSchema = z.object({
  provider: aiProviderEnum,
  apiKey: z.string().min(1, 'API key is required'),
  model: z.string().min(1, 'Model is required'),
  prompt: z.string().min(1, 'Prompt is required').max(10000, 'Prompt too long'),
  systemPrompt: z.string().max(5000).optional(),
  maxTokens: z.number().int().min(1).max(4096).optional(),
  temperature: z.number().min(0).max(2).optional(),
});

export type AIValidateInput = z.infer<typeof aiValidateSchema>;
export type AIGenerateInput = z.infer<typeof aiGenerateSchema>;
