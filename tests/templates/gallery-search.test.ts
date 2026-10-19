import { describe, it, expect } from 'vitest';
import { getAllTemplates } from '@/templates/registry';
import { ALL_CATEGORIES, type TemplateCategory } from '@/templates/types';

interface GalleryCardData {
  category: string;
  name: string;
  description?: string;
  tags?: string;
}

/**
 * Gallery card matching logic mirroring src/pages/templates.astro
 */
function matchesGalleryCard(
  card: GalleryCardData,
  activeFilter: string,
  rawQuery: string | null | undefined
): boolean {
  const query = (rawQuery || '').toLowerCase().trim();
  const category = card.category;
  const name = (card.name || '').toLowerCase();
  const description = (card.description || '').toLowerCase();
  const tags = (card.tags || '').toLowerCase();
  const matchesCategory = activeFilter === 'all' || category === activeFilter;
  const matchesSearch =
    !query ||
    name.includes(query) ||
    description.includes(query) ||
    tags.includes(query);

  return matchesCategory && matchesSearch;
}

/**
 * Editor matching logic from src/components/editor/TemplatePanel.tsx
 */
function matchesEditorTemplate(
  template: { name: string; description: string; tags: string[]; category: TemplateCategory },
  category: TemplateCategory | 'all',
  searchQuery: string
): boolean {
  if (category !== 'all' && template.category !== category) {
    return false;
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    return (
      template.name.toLowerCase().includes(q) ||
      template.description.toLowerCase().includes(q) ||
      template.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }
  return true;
}

/**
 * Category validation helper mirroring setCategory in templates.astro
 */
function resolveInitialCategory(
  catParam: string | null,
  validCategories: readonly string[]
): { activeCategory: string; isValid: boolean } {
  if (!catParam) {
    return { activeCategory: 'all', isValid: false };
  }
  const isValid = catParam === 'all' || validCategories.includes(catParam);
  return {
    activeCategory: isValid ? catParam : 'all',
    isValid,
  };
}

describe('Gallery Search & Filter Logic', () => {
  const allTemplates = getAllTemplates();
  const galleryCards: GalleryCardData[] = allTemplates.map((t) => ({
    category: t.category,
    name: t.name,
    description: t.description,
    tags: (t.tags || []).join(' '),
  }));

  describe('Search matching scenarios', () => {
    it('1. matches by exact template name', () => {
      const target = allTemplates[0];
      const matched = galleryCards.filter((card) =>
        matchesGalleryCard(card, 'all', target.name)
      );
      expect(matched.length).toBeGreaterThan(0);
      expect(matched.some((c) => c.name === target.name)).toBe(true);
    });

    it('2. matches by partial template name', () => {
      const matched = galleryCards.filter((card) =>
        matchesGalleryCard(card, 'all', 'minimal')
      );
      expect(matched.length).toBeGreaterThan(0);
      expect(matched.every((c) => c.name.toLowerCase().includes('minimal') || (c.description || '').toLowerCase().includes('minimal') || (c.tags || '').toLowerCase().includes('minimal'))).toBe(true);
    });

    it('3. matches by description text when name does not contain the query', () => {
      const cardWithDescOnly = galleryCards.find((c) => {
        const words = (c.description || '').split(/\s+/);
        return words.some(
          (w) => w.length > 5 && !c.name.toLowerCase().includes(w.toLowerCase()) && !(c.tags || '').toLowerCase().includes(w.toLowerCase())
        );
      });
      expect(cardWithDescOnly).toBeDefined();

      const words = (cardWithDescOnly!.description || '').split(/\s+/);
      const uniqueWord = words.find(
        (w) => w.length > 5 && !cardWithDescOnly!.name.toLowerCase().includes(w.toLowerCase()) && !(cardWithDescOnly!.tags || '').toLowerCase().includes(w.toLowerCase())
      )!;

      const matched = galleryCards.filter((c) => matchesGalleryCard(c, 'all', uniqueWord));
      expect(matched.length).toBeGreaterThan(0);
      expect(matched.some((c) => c.name === cardWithDescOnly!.name)).toBe(true);
    });

    it('4. matches by tag when neither name nor description contains the tag query', () => {
      const cardWithTagOnly = galleryCards.find((c) => {
        const tags = (c.tags || '').split(' ');
        return tags.some(
          (t) => t.length > 3 && !c.name.toLowerCase().includes(t.toLowerCase()) && !(c.description || '').toLowerCase().includes(t.toLowerCase())
        );
      });
      expect(cardWithTagOnly).toBeDefined();

      const tags = (cardWithTagOnly!.tags || '').split(' ');
      const uniqueTag = tags.find(
        (t) => t.length > 3 && !cardWithTagOnly!.name.toLowerCase().includes(t.toLowerCase()) && !(cardWithTagOnly!.description || '').toLowerCase().includes(t.toLowerCase())
      )!;

      const matched = galleryCards.filter((c) => matchesGalleryCard(c, 'all', uniqueTag));
      expect(matched.length).toBeGreaterThan(0);
      expect(matched.some((c) => c.name === cardWithTagOnly!.name)).toBe(true);
    });

    it('5. performs case-insensitive matching', () => {
      const lower = galleryCards.filter((c) => matchesGalleryCard(c, 'all', 'dark'));
      const upper = galleryCards.filter((c) => matchesGalleryCard(c, 'all', 'DARK'));
      const mixed = galleryCards.filter((c) => matchesGalleryCard(c, 'all', 'DaRk'));

      expect(lower.length).toBeGreaterThan(0);
      expect(upper.length).toBe(lower.length);
      expect(mixed.length).toBe(lower.length);
    });

    it('6. handles query with leading and trailing whitespace', () => {
      const trimmed = galleryCards.filter((c) => matchesGalleryCard(c, 'all', 'terminal'));
      const withSpaces = galleryCards.filter((c) => matchesGalleryCard(c, 'all', '   terminal   '));

      expect(trimmed.length).toBeGreaterThan(0);
      expect(withSpaces.length).toBe(trimmed.length);
    });

    it('7. shows all cards allowed by active category when query is empty or whitespace', () => {
      const emptyMatches = galleryCards.filter((c) => matchesGalleryCard(c, 'all', ''));
      const whitespaceMatches = galleryCards.filter((c) => matchesGalleryCard(c, 'all', '   '));
      const nullMatches = galleryCards.filter((c) => matchesGalleryCard(c, 'all', null));

      expect(emptyMatches.length).toBe(galleryCards.length);
      expect(whitespaceMatches.length).toBe(galleryCards.length);
      expect(nullMatches.length).toBe(galleryCards.length);
    });

    it('8. returns 0 results for non-matching queries (triggers empty state)', () => {
      const matched = galleryCards.filter((c) =>
        matchesGalleryCard(c, 'all', 'nonexistentquery_xyz_12345')
      );
      expect(matched.length).toBe(0);
    });

    it('9. clearing query restores full category results', () => {
      const filtered = galleryCards.filter((c) => matchesGalleryCard(c, 'blog', 'dark'));
      const restored = galleryCards.filter((c) => matchesGalleryCard(c, 'blog', ''));
      const allBlog = galleryCards.filter((c) => c.category === 'blog');

      expect(filtered.length).toBeLessThanOrEqual(restored.length);
      expect(restored.length).toBe(allBlog.length);
    });

    it('10. handles missing descriptions or tags gracefully without error', () => {
      const incompleteCard: GalleryCardData = {
        category: 'blog',
        name: 'Incomplete Template',
        description: undefined,
        tags: undefined,
      };

      expect(() => matchesGalleryCard(incompleteCard, 'all', 'test')).not.toThrow();
      expect(matchesGalleryCard(incompleteCard, 'all', 'incomplete')).toBe(true);
      expect(matchesGalleryCard(incompleteCard, 'all', 'other')).toBe(false);
    });

    it('11. safely handles quotes, apostrophes, Unicode, and punctuation in metadata', () => {
      const specialCard: GalleryCardData = {
        category: 'saas',
        name: "Founder's \"Special\" OG",
        description: "It's a high-impact template — with 🚀 Unicode & symbols: <test>!",
        tags: "founder's-pick og:image ⚡",
      };

      expect(matchesGalleryCard(specialCard, 'all', "founder's")).toBe(true);
      expect(matchesGalleryCard(specialCard, 'all', '"special"')).toBe(true);
      expect(matchesGalleryCard(specialCard, 'all', '🚀')).toBe(true);
      expect(matchesGalleryCard(specialCard, 'all', '⚡')).toBe(true);
      expect(matchesGalleryCard(specialCard, 'all', '<test>')).toBe(true);
    });
  });

  describe('Query string parsing and initialization', () => {
    it('12. /templates?q=dark reads q parameter and filters results', () => {
      const params = new URLSearchParams('?q=dark');
      const q = params.get('q');
      expect(q).toBe('dark');

      const filtered = galleryCards.filter((c) => matchesGalleryCard(c, 'all', q));
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((c) => (
        c.name.toLowerCase().includes('dark') ||
        (c.description || '').toLowerCase().includes('dark') ||
        (c.tags || '').toLowerCase().includes('dark')
      ))).toBe(true);
    });

    it('13. handles URL-encoded query parameters (?q=dark%20mode and ?q=dark+mode)', () => {
      const paramsPercent = new URLSearchParams('?q=dark%20mode');
      expect(paramsPercent.get('q')).toBe('dark mode');

      const paramsPlus = new URLSearchParams('?q=dark+mode');
      expect(paramsPlus.get('q')).toBe('dark mode');
    });

    it('14. empty or missing q behaves sensibly', () => {
      const missingParams = new URLSearchParams('');
      expect(missingParams.get('q')).toBeNull();

      const emptyParams = new URLSearchParams('?q=');
      expect(emptyParams.get('q')).toBe('');

      expect(galleryCards.filter((c) => matchesGalleryCard(c, 'all', missingParams.get('q'))).length).toBe(galleryCards.length);
      expect(galleryCards.filter((c) => matchesGalleryCard(c, 'all', emptyParams.get('q'))).length).toBe(galleryCards.length);
    });

    it('15. composes search parameter and category parameter together', () => {
      const params = new URLSearchParams('?category=github&q=terminal');
      const catParam = params.get('category');
      const qParam = params.get('q');

      const { activeCategory } = resolveInitialCategory(catParam, ALL_CATEGORIES);
      expect(activeCategory).toBe('github');

      const matched = galleryCards.filter((c) => matchesGalleryCard(c, activeCategory, qParam));
      expect(matched.length).toBeGreaterThan(0);
      expect(matched.every((c) => c.category === 'github')).toBe(true);
      expect(matched.every((c) => (
        c.name.toLowerCase().includes('terminal') ||
        (c.description || '').toLowerCase().includes('terminal') ||
        (c.tags || '').toLowerCase().includes('terminal')
      ))).toBe(true);
    });
  });

  describe('Category and result count behavior', () => {
    it('16. category filtering isolates category cards', () => {
      ALL_CATEGORIES.forEach((cat) => {
        const inCategory = galleryCards.filter((c) => matchesGalleryCard(c, cat, ''));
        expect(inCategory.length).toBeGreaterThan(0);
        expect(inCategory.every((c) => c.category === cat)).toBe(true);
      });
    });

    it('17. search plus category filter produces intersection', () => {
      const categoryOnly = galleryCards.filter((c) => matchesGalleryCard(c, 'developer', ''));
      const combined = galleryCards.filter((c) => matchesGalleryCard(c, 'developer', 'code'));

      expect(combined.length).toBeLessThanOrEqual(categoryOnly.length);
      expect(combined.every((c) => c.category === 'developer')).toBe(true);
    });

    it('18. result counts (visible of total) remain accurate', () => {
      const totalCount = galleryCards.length;
      const visible = galleryCards.filter((c) => matchesGalleryCard(c, 'blog', 'minimal')).length;
      const countString = `Showing <strong>${visible}</strong> of ${totalCount} templates`;

      expect(visible).toBeGreaterThan(0);
      expect(visible).toBeLessThan(totalCount);
      expect(countString).toContain(`${visible}`);
      expect(countString).toContain(`${totalCount}`);
    });

    it('19. unknown category falls back gracefully to all', () => {
      const { activeCategory, isValid } = resolveInitialCategory('invalid-cat-name', ALL_CATEGORIES);
      expect(isValid).toBe(false);
      expect(activeCategory).toBe('all');

      const matched = galleryCards.filter((c) => matchesGalleryCard(c, activeCategory, ''));
      expect(matched.length).toBe(galleryCards.length);
    });
  });

  describe('Alignment with editor search behavior (Issue #82 core motivation)', () => {
    it('gallery search finds matching templates for "dark" and "terminal" just like the editor', () => {
      const queries = ['dark', 'terminal', 'minimal', 'clean', 'modern', 'developer'];

      for (const q of queries) {
        const editorResults = allTemplates.filter((t) =>
          matchesEditorTemplate(t, 'all', q)
        );
        const galleryResults = galleryCards.filter((c) =>
          matchesGalleryCard(c, 'all', q)
        );

        expect(galleryResults.length).toBe(editorResults.length);
        expect(galleryResults.length).toBeGreaterThan(0);
      }
    });
  });
});
