import { describe, it, expect } from 'vitest';
import { getAllTemplates } from '@/templates/registry';

describe('Templates API', () => {
  it('should return templates list', () => {
    const templates = getAllTemplates();
    expect(templates.length).toBeGreaterThan(0);
  });

  it('templates should have thumbnailUrl-compatible IDs', () => {
    const templates = getAllTemplates();
    for (const t of templates) {
      // IDs should be URL-safe
      expect(t.id).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it('every template should have at least one field', () => {
    const templates = getAllTemplates();
    for (const t of templates) {
      expect(t.fields.length).toBeGreaterThan(0);
    }
  });
});
