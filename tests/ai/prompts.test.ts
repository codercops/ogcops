import { describe, it, expect } from 'vitest';
import { buildTitlePrompt, buildSubtitlePrompt, buildGenericFieldPrompt, getPromptForField } from '@/lib/ai/prompts';

describe('buildTitlePrompt', () => {
  it('should include category in prompt', () => {
    const { prompt } = buildTitlePrompt({ fieldName: 'title', category: 'blog' });
    expect(prompt).toContain('blog');
  });

  it('should include character limit', () => {
    const { prompt } = buildTitlePrompt({ fieldName: 'title' });
    expect(prompt).toContain('60 characters');
  });

  it('should request JSON array format', () => {
    const { prompt } = buildTitlePrompt({ fieldName: 'title' });
    expect(prompt).toContain('JSON array');
  });

  it('should include existing fields as context', () => {
    const { prompt } = buildTitlePrompt({
      fieldName: 'title',
      currentValues: { author: 'John Doe', description: 'A blog post' },
    });
    expect(prompt).toContain('author: "John Doe"');
    expect(prompt).toContain('description: "A blog post"');
  });

  it('should use count parameter', () => {
    const { prompt } = buildTitlePrompt({ fieldName: 'title', count: 5 });
    expect(prompt).toContain('5');
  });
});

describe('buildSubtitlePrompt', () => {
  it('should reference the title when available', () => {
    const { prompt } = buildSubtitlePrompt({
      fieldName: 'subtitle',
      currentValues: { title: 'My Great Title' },
    });
    expect(prompt).toContain('My Great Title');
  });

  it('should handle missing title', () => {
    const { prompt } = buildSubtitlePrompt({ fieldName: 'subtitle' });
    expect(prompt).toContain('standalone subtitle');
  });

  it('should include 80 character limit', () => {
    const { prompt } = buildSubtitlePrompt({ fieldName: 'subtitle' });
    expect(prompt).toContain('80 characters');
  });
});

describe('buildGenericFieldPrompt', () => {
  it('should include field name', () => {
    const { prompt, systemPrompt } = buildGenericFieldPrompt({ fieldName: 'Author Name' });
    expect(prompt).toContain('Author Name');
    expect(systemPrompt).toContain('Author Name');
  });
});

describe('getPromptForField', () => {
  it('should use title prompt for title field', () => {
    const { prompt } = getPromptForField({ fieldName: 'Title' });
    expect(prompt).toContain('60 characters');
  });

  it('should use subtitle prompt for description field', () => {
    const { prompt } = getPromptForField({ fieldName: 'Description' });
    expect(prompt).toContain('80 characters');
  });

  it('should use subtitle prompt for subtitle field', () => {
    const { prompt } = getPromptForField({ fieldName: 'Subtitle' });
    expect(prompt).toContain('80 characters');
  });

  it('should use generic prompt for other fields', () => {
    const { prompt, systemPrompt } = getPromptForField({ fieldName: 'Author' });
    expect(prompt).toContain('"Author"');
    expect(systemPrompt).toContain('"Author"');
    // Should not contain title-specific or subtitle-specific wording
    expect(prompt).not.toContain('click-worthy');
    expect(prompt).not.toContain('Complement the title');
  });
});
