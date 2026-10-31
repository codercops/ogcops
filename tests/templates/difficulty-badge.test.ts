import { describe, expect, it } from 'vitest';
import difficultyBadge from '@/templates/tutorial/difficulty-badge';

describe('tutorial-difficulty-badge', () => {
  it("doesn't offer an accent color it never uses", () => {
    expect(difficultyBadge.fields.map((f) => f.key)).not.toContain('accentColor');
    expect(difficultyBadge.defaults).not.toHaveProperty('accentColor');
  });
});
