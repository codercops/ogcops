import type { AIProviderConfig, AIGenerateResponse, AIProvider } from './types';

// --- Response parsers ---

function parseOpenAIResponse(data: unknown): AIGenerateResponse {
  const d = data as any;
  const choice = d.choices?.[0];
  return {
    content: choice?.message?.content ?? '',
    model: d.model ?? '',
    usage: d.usage
      ? { inputTokens: d.usage.prompt_tokens ?? 0, outputTokens: d.usage.completion_tokens ?? 0 }
      : undefined,
  };
}

function parseAnthropicResponse(data: unknown): AIGenerateResponse {
  const d = data as any;
  const text = d.content?.[0]?.text ?? '';
  return {
    content: text,
    model: d.model ?? '',
    usage: d.usage
      ? { inputTokens: d.usage.input_tokens ?? 0, outputTokens: d.usage.output_tokens ?? 0 }
      : undefined,
  };
}

function parseGoogleResponse(data: unknown): AIGenerateResponse {
  const d = data as any;
  const text = d.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return {
    content: text,
    model: d.modelVersion ?? '',
    usage: d.usageMetadata
      ? {
          inputTokens: d.usageMetadata.promptTokenCount ?? 0,
          outputTokens: d.usageMetadata.candidatesTokenCount ?? 0,
        }
      : undefined,
  };
}

// --- OpenAI-compatible body formatter (shared by OpenAI, Groq, OpenRouter) ---

function openAICompatibleBody(baseUrl: string) {
  return (params: {
    model: string;
    prompt: string;
    systemPrompt?: string;
    maxTokens?: number;
    temperature?: number;
  }) => {
    const messages: Array<{ role: string; content: string }> = [];
    if (params.systemPrompt) {
      messages.push({ role: 'system', content: params.systemPrompt });
    }
    messages.push({ role: 'user', content: params.prompt });

    return {
      url: `${baseUrl}/chat/completions`,
      body: {
        model: params.model,
        messages,
        max_tokens: params.maxTokens ?? 300,
        temperature: params.temperature ?? 0.8,
      },
    };
  };
}

// --- Provider configs ---

const openai: AIProviderConfig = {
  id: 'openai',
  name: 'OpenAI',
  baseUrl: 'https://api.openai.com/v1',
  apiKeyUrl: 'https://platform.openai.com/api-keys',
  models: [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai', maxTokens: 4096, description: 'Most capable' },
    { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai', maxTokens: 4096, description: 'Fast, affordable' },
  ],
  headerBuilder: (apiKey) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  bodyFormatter: openAICompatibleBody('https://api.openai.com/v1'),
  responseParser: parseOpenAIResponse,
  validateRequest: (apiKey) => ({
    url: 'https://api.openai.com/v1/models',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  }),
};

const anthropic: AIProviderConfig = {
  id: 'anthropic',
  name: 'Anthropic',
  baseUrl: 'https://api.anthropic.com/v1',
  apiKeyUrl: 'https://console.anthropic.com/settings/keys',
  models: [
    { id: 'claude-sonnet-4-6', name: 'Claude Sonnet', provider: 'anthropic', maxTokens: 4096, description: 'Best writing quality' },
    { id: 'claude-haiku-4-5', name: 'Claude Haiku', provider: 'anthropic', maxTokens: 4096, description: 'Fast, affordable' },
  ],
  headerBuilder: (apiKey) => ({
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'Content-Type': 'application/json',
  }),
  bodyFormatter: (params) => ({
    url: 'https://api.anthropic.com/v1/messages',
    body: {
      model: params.model,
      max_tokens: params.maxTokens ?? 300,
      ...(params.systemPrompt ? { system: params.systemPrompt } : {}),
      messages: [{ role: 'user', content: params.prompt }],
      temperature: params.temperature ?? 0.8,
    },
  }),
  responseParser: parseAnthropicResponse,
  validateRequest: (apiKey) => ({
    url: 'https://api.anthropic.com/v1/messages',
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
  }),
};

const google: AIProviderConfig = {
  id: 'google',
  name: 'Google',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  apiKeyUrl: 'https://aistudio.google.com/apikey',
  models: [
    { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', provider: 'google', maxTokens: 4096, description: 'Fast, free tier' },
    { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', maxTokens: 4096, description: 'Most capable' },
  ],
  headerBuilder: () => ({
    'Content-Type': 'application/json',
  }),
  bodyFormatter: (params) => ({
    url: `https://generativelanguage.googleapis.com/v1beta/models/${params.model}:generateContent`,
    body: {
      contents: [
        {
          parts: [
            { text: params.systemPrompt ? `${params.systemPrompt}\n\n${params.prompt}` : params.prompt },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: params.maxTokens ?? 300,
        temperature: params.temperature ?? 0.8,
      },
    },
  }),
  responseParser: parseGoogleResponse,
  validateRequest: (apiKey) => ({
    url: `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    method: 'GET',
    headers: {},
  }),
};

const groq: AIProviderConfig = {
  id: 'groq',
  name: 'Groq',
  baseUrl: 'https://api.groq.com/openai/v1',
  apiKeyUrl: 'https://console.groq.com/keys',
  models: [
    { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', provider: 'groq', maxTokens: 4096, description: 'Very fast, free tier' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B', provider: 'groq', maxTokens: 4096, description: 'Fast, versatile' },
  ],
  headerBuilder: (apiKey) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }),
  bodyFormatter: openAICompatibleBody('https://api.groq.com/openai/v1'),
  responseParser: parseOpenAIResponse,
  validateRequest: (apiKey) => ({
    url: 'https://api.groq.com/openai/v1/models',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  }),
};

const openrouter: AIProviderConfig = {
  id: 'openrouter',
  name: 'OpenRouter',
  baseUrl: 'https://openrouter.ai/api/v1',
  apiKeyUrl: 'https://openrouter.ai/keys',
  models: [
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini (via OR)', provider: 'openrouter', maxTokens: 4096, description: 'Access any model' },
    { id: 'anthropic/claude-haiku-4-5', name: 'Claude Haiku (via OR)', provider: 'openrouter', maxTokens: 4096, description: 'One key, all models' },
  ],
  headerBuilder: (apiKey) => ({
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'https://og.codercops.com',
    'X-Title': 'OGCOPS',
  }),
  bodyFormatter: openAICompatibleBody('https://openrouter.ai/api/v1'),
  responseParser: parseOpenAIResponse,
  validateRequest: (apiKey) => ({
    url: 'https://openrouter.ai/api/v1/models',
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}` },
  }),
};

// --- Registry ---

const providerRegistry = new Map<AIProvider, AIProviderConfig>([
  ['openai', openai],
  ['anthropic', anthropic],
  ['google', google],
  ['groq', groq],
  ['openrouter', openrouter],
]);

export function getProvider(id: AIProvider): AIProviderConfig | undefined {
  return providerRegistry.get(id);
}

export function getAllProviders(): AIProviderConfig[] {
  return Array.from(providerRegistry.values());
}

export function getModelsForProvider(id: AIProvider): AIProviderConfig['models'] {
  return providerRegistry.get(id)?.models ?? [];
}

export function getDefaultModel(providerId: AIProvider): string | undefined {
  const provider = providerRegistry.get(providerId);
  return provider?.models[0]?.id;
}

export function isValidProvider(id: string): id is AIProvider {
  return providerRegistry.has(id as AIProvider);
}
