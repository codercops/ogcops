import { describe, expect, it } from 'vitest';
import glossary from '../../src/templates/tutorial/glossary';

const render = (overrides: Record<string, unknown> = {}) => glossary.render({ ...glossary.defaults, ...overrides });
const serialized = (overrides: Record<string, unknown> = {}) => JSON.stringify(render(overrides));

describe('tutorial-glossary', () => {
  it('renders the default term, definition, and example', () => {
    const tree = serialized();
    expect(tree).toContain('Idempotent');
    expect(tree).toContain('adjective');
    expect(tree).toContain('PUT /users/42 twice still leaves one user');
  });

  it('shrinks long terms and truncates long content', () => {
    const tree = serialized({ term: 'A very long technical term that needs to shrink', description: 'D'.repeat(220), example: 'E'.repeat(120) });
    expect(tree).toContain('…');
    expect(tree).toContain('"fontSize":"42px"');
  });

  it('hides optional values containing only spaces', () => {
    const tree = serialized({ partOfSpeech: '   ', example: '   ' });
    expect(tree).not.toContain('adjective');
    expect(tree).not.toContain('JetBrains Mono');
  });
});
