import { getAllTemplates } from '@/templates/registry';

export interface TemplateRecommendation {
  id: string;
  score: number;
  reason: string;
}

/**
 * Build prompt for template recommendation based on natural language query.
 */
export function buildRecommenderPrompt(query: string): { prompt: string; systemPrompt: string } {
  const templates = getAllTemplates();
  const catalog = templates.map((t) => ({
    id: t.id,
    category: t.category,
    name: t.name,
    description: t.description,
    tags: t.tags.join(', '),
  }));

  return {
    systemPrompt: `You are an expert at matching user needs to OG image templates. Given a natural language description, find the best matching templates from the catalog. Always return valid JSON.`,
    prompt: `User is looking for: "${query}"

Available templates:
${JSON.stringify(catalog, null, 0)}

Return the top 5 best matching templates as a JSON array:
[{ "id": "template-id", "score": 95, "reason": "brief reason" }]

Score should be 0-100 based on how well the template matches. Only return valid JSON array.`,
  };
}

/**
 * Parse the recommender response from AI.
 */
export function parseRecommenderResponse(text: string): TemplateRecommendation[] {
  const trimmed = text.trim();

  // Try parsing as array
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return validateRecommendations(parsed);
  } catch {}

  // Try extracting from code block
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (Array.isArray(parsed)) return validateRecommendations(parsed);
    } catch {}
  }

  // Try finding array in text
  const arrayMatch = trimmed.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const parsed = JSON.parse(arrayMatch[0]);
      if (Array.isArray(parsed)) return validateRecommendations(parsed);
    } catch {}
  }

  return [];
}

function validateRecommendations(items: unknown[]): TemplateRecommendation[] {
  return items
    .filter((item): item is Record<string, unknown> =>
      typeof item === 'object' && item !== null && 'id' in item
    )
    .map((item) => ({
      id: String(item.id),
      score: typeof item.score === 'number' ? item.score : 50,
      reason: typeof item.reason === 'string' ? item.reason : '',
    }))
    .slice(0, 5);
}
