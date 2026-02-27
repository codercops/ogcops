import { describe, it, expect } from 'vitest';
import { getAllTemplates, getTemplate, getTemplatesByCategory, getTemplateCount } from '@/templates/registry';
import { ALL_CATEGORIES } from '@/templates/types';

describe('Template Registry', () => {
  it('should have templates registered', () => {
    const count = getTemplateCount();
    expect(count).toBeGreaterThan(0);
  });

  it('should return all templates', () => {
    const templates = getAllTemplates();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0]).toHaveProperty('id');
    expect(templates[0]).toHaveProperty('name');
    expect(templates[0]).toHaveProperty('category');
    expect(templates[0]).toHaveProperty('render');
  });

  it('should look up a template by ID', () => {
    const template = getTemplate('blog-minimal-dark');
    expect(template).toBeDefined();
    expect(template!.id).toBe('blog-minimal-dark');
    expect(template!.category).toBe('blog');
  });

  it('should return undefined for unknown template', () => {
    const template = getTemplate('nonexistent-template');
    expect(template).toBeUndefined();
  });

  it('should get templates by category', () => {
    const blogTemplates = getTemplatesByCategory('blog');
    expect(blogTemplates.length).toBeGreaterThan(0);
    blogTemplates.forEach((t) => {
      expect(t.category).toBe('blog');
    });
  });

  it('every template should have required fields', () => {
    const templates = getAllTemplates();
    for (const t of templates) {
      expect(t.id).toBeTruthy();
      expect(t.name).toBeTruthy();
      expect(ALL_CATEGORIES).toContain(t.category);
      expect(t.description).toBeTruthy();
      expect(Array.isArray(t.tags)).toBe(true);
      expect(Array.isArray(t.fields)).toBe(true);
      expect(typeof t.defaults).toBe('object');
      expect(typeof t.render).toBe('function');
    }
  });

  it('every template should render without error using defaults', () => {
    const templates = getAllTemplates();
    for (const t of templates) {
      expect(() => {
        const element = t.render(t.defaults);
        expect(element).toHaveProperty('type');
        expect(element).toHaveProperty('props');
        expect(element.props).toHaveProperty('style');
        expect(element.props.style).toHaveProperty('width', '1200px');
        expect(element.props.style).toHaveProperty('height', '630px');
      }).not.toThrow();
    }
  });

  it('template IDs should be unique', () => {
    const templates = getAllTemplates();
    const ids = templates.map((t) => t.id);
    const uniqueIds = new Set(ids);
    expect(ids.length).toBe(uniqueIds.size);
  });
});
