export interface GenerateContext {
  fieldName: string;
  category?: string;
  currentValues?: Record<string, string>;
  count?: number;
}

export function buildTitlePrompt(ctx: GenerateContext): { prompt: string; systemPrompt: string } {
  const count = ctx.count ?? 3;
  const category = ctx.category || 'general';
  const existingContext = buildExistingFieldsContext(ctx.currentValues);

  return {
    systemPrompt: `You are an expert copywriter specializing in social media and OG image text. Generate compelling, click-worthy text options. Always return a JSON array of strings — no explanation, no markdown, just the array.`,
    prompt: `Generate ${count} compelling title options for an OG image.

Rules:
- Maximum 60 characters per title (OG images have limited space)
- Be specific and intriguing, avoid generic phrases
- Category: ${category}
${existingContext}
Return as a JSON array of strings. Example: ["Title One", "Title Two", "Title Three"]`,
  };
}

export function buildSubtitlePrompt(ctx: GenerateContext): { prompt: string; systemPrompt: string } {
  const count = ctx.count ?? 3;
  const category = ctx.category || 'general';
  const title = ctx.currentValues?.title || '';
  const existingContext = buildExistingFieldsContext(ctx.currentValues);

  return {
    systemPrompt: `You are an expert copywriter specializing in social media and OG image text. Generate compelling subtitle/description options. Always return a JSON array of strings — no explanation, no markdown, just the array.`,
    prompt: `Generate ${count} concise subtitle options for an OG image.

Rules:
- Maximum 80 characters per subtitle
${title ? `- Complement the title: "${title}"` : '- Create a standalone subtitle'}
- Add context without repeating the title
- Category: ${category}
${existingContext}
Return as a JSON array of strings. Example: ["Subtitle One", "Subtitle Two", "Subtitle Three"]`,
  };
}

export function buildGenericFieldPrompt(ctx: GenerateContext): { prompt: string; systemPrompt: string } {
  const count = ctx.count ?? 3;
  const category = ctx.category || 'general';
  const fieldName = ctx.fieldName;
  const existingContext = buildExistingFieldsContext(ctx.currentValues);

  return {
    systemPrompt: `You are an expert copywriter specializing in social media and OG image text. Generate options for the "${fieldName}" field. Always return a JSON array of strings — no explanation, no markdown, just the array.`,
    prompt: `Generate ${count} options for the "${fieldName}" field of an OG image.

Rules:
- Keep it concise (under 60 characters)
- Category: ${category}
${existingContext}
Return as a JSON array of strings.`,
  };
}

function buildExistingFieldsContext(values?: Record<string, string>): string {
  if (!values) return '';
  const relevant = Object.entries(values)
    .filter(([_, v]) => v && v.trim().length > 0)
    .map(([k, v]) => `  ${k}: "${v}"`)
    .join('\n');
  if (!relevant) return '';
  return `\nExisting fields for context:\n${relevant}\n`;
}

export function getPromptForField(ctx: GenerateContext): { prompt: string; systemPrompt: string } {
  const name = ctx.fieldName.toLowerCase();
  if (name === 'title') return buildTitlePrompt(ctx);
  if (name === 'subtitle' || name === 'description') return buildSubtitlePrompt(ctx);
  return buildGenericFieldPrompt(ctx);
}
