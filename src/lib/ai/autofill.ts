import { getAllTemplates } from '@/templates/registry';

export interface AutofillResult {
  templateId: string;
  fields: Record<string, string>;
  colors?: {
    bgColor?: string;
    accentColor?: string;
    textColor?: string;
  };
}

/**
 * Build the prompt for Smart Autofill — given page content, pick the best template and fill fields.
 */
export function buildAutofillPrompt(pageContent: {
  title?: string;
  description?: string;
  headings?: string[];
  bodyText?: string;
  ogTags?: Record<string, string>;
  themeColor?: string;
}): { prompt: string; systemPrompt: string } {
  // Build a compact template catalog
  const templates = getAllTemplates();
  const catalog = templates.map((t) => ({
    id: t.id,
    category: t.category,
    name: t.name,
    fields: t.fields.map((f) => f.key).join(', '),
  }));

  const systemPrompt = `You are an expert at analyzing web pages and generating OG image content. Given page content and a list of available templates, select the best matching template and generate field values. Always return valid JSON.`;

  const prompt = `Analyze this page content and select the best OG image template.

PAGE CONTENT:
Title: ${pageContent.title || '(none)'}
Description: ${pageContent.description || '(none)'}
${pageContent.headings?.length ? `Headings: ${pageContent.headings.slice(0, 5).join(', ')}` : ''}
${pageContent.bodyText ? `Content preview: ${pageContent.bodyText.slice(0, 1500)}` : ''}
${pageContent.themeColor ? `Theme color: ${pageContent.themeColor}` : ''}

AVAILABLE TEMPLATES:
${JSON.stringify(catalog, null, 0)}

Return JSON with this exact shape:
{
  "templateId": "the-best-template-id",
  "fields": { "title": "...", "description": "...", "author": "...", ... },
  "colors": { "bgColor": "#hex", "accentColor": "#hex" }
}

Rules:
- Pick the template whose category best matches the page content type
- Title max 60 chars, description max 80 chars
- Extract author name if visible
- Detect brand colors from the page if possible
- Only include field keys that exist in the template's field list
- Return ONLY the JSON object, no explanation`;

  return { prompt, systemPrompt };
}

/**
 * Parse the autofill response from AI.
 */
export function parseAutofillResponse(text: string): AutofillResult | null {
  const trimmed = text.trim();

  // Try parsing directly
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed.templateId && parsed.fields) return parsed as AutofillResult;
  } catch {}

  // Try extracting from code block
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      const parsed = JSON.parse(codeBlockMatch[1].trim());
      if (parsed.templateId && parsed.fields) return parsed as AutofillResult;
    } catch {}
  }

  // Try finding JSON object in text
  const objectMatch = trimmed.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      const parsed = JSON.parse(objectMatch[0]);
      if (parsed.templateId && parsed.fields) return parsed as AutofillResult;
    } catch {}
  }

  return null;
}
