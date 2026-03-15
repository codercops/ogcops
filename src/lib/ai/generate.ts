import type { GenerateContext } from './prompts';
import { getPromptForField } from './prompts';
import { getApiKey, getSelectedProvider, getSelectedModel } from './storage';
import { getDefaultModel } from './providers';

/**
 * Parse AI response text into an array of strings.
 * Handles: clean JSON, markdown-wrapped JSON, plain text fallback.
 */
export function parseAIResponse(text: string): string[] {
  const trimmed = text.trim();

  // Try parsing as-is
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === 'string');
  } catch {}

  // Try extracting JSON from markdown code block
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === 'string');
    } catch {}
  }

  // Try finding array pattern in the text
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) return parsed.filter((s) => typeof s === 'string');
    } catch {}
  }

  // Fallback: split by newlines, filter numbered list items
  return trimmed
    .split('\n')
    .map((line) => line.replace(/^\d+[\.\)]\s*/, '').replace(/^[-*]\s*/, '').replace(/^["']|["']$/g, '').trim())
    .filter((line) => line.length > 0 && line.length <= 100);
}

/**
 * Generate suggestions for a field by calling the AI proxy endpoint.
 */
export async function generateSuggestions(ctx: GenerateContext): Promise<string[]> {
  const provider = getSelectedProvider();
  if (!provider) throw new Error('No AI provider configured');

  const apiKey = getApiKey(provider);
  if (!apiKey) throw new Error('No API key configured');

  const model = getSelectedModel(provider) ?? getDefaultModel(provider);
  if (!model) throw new Error('No model selected');

  const { prompt, systemPrompt } = getPromptForField(ctx);

  const res = await fetch('/api/ai/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider,
      apiKey,
      model,
      prompt,
      systemPrompt,
      maxTokens: 300,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Generation failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const suggestions = parseAIResponse(data.content);

  if (suggestions.length === 0) {
    throw new Error('Could not parse AI response');
  }

  return suggestions;
}
