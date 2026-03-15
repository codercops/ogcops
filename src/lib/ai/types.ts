export type AIProvider = 'openai' | 'anthropic' | 'google' | 'groq' | 'openrouter';

export interface AIModel {
  id: string;
  name: string;
  provider: AIProvider;
  maxTokens: number;
  description: string;
}

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  baseUrl: string;
  models: AIModel[];
  apiKeyUrl: string;
  /** Build auth headers from the user's API key */
  headerBuilder: (apiKey: string) => Record<string, string>;
  /** Format the request body for this provider's API */
  bodyFormatter: (params: {
    model: string;
    prompt: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  }) => { url: string; body: unknown };
  /** Parse the provider's response into a common format */
  responseParser: (data: unknown) => AIGenerateResponse;
  /** Build the validation request (lightweight key check) */
  validateRequest: (apiKey: string) => { url: string; method: string; headers: Record<string, string> };
}

export interface AIGenerateRequest {
  provider: AIProvider;
  apiKey: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIGenerateResponse {
  content: string;
  model: string;
  usage?: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIValidationResult {
  valid: boolean;
  error?: string;
  provider: AIProvider;
}

export const AI_PROVIDERS: AIProvider[] = ['openai', 'anthropic', 'google', 'groq', 'openrouter'];
