import { describe, expect, it } from 'vitest';
import { containsLocalImage } from '../../src/components/editor/export-utils';

describe('editor export utilities', () => {
  it('detects local image data URLs', () => {
    expect(containsLocalImage({ imageUrl: 'data:image/png;base64,abc' })).toBe(true);
    expect(containsLocalImage({ imageUrl: 'https://example.com/photo.png' })).toBe(false);
  });

  it('ignores non-image data URLs and empty values', () => {
    expect(containsLocalImage({ imageUrl: 'data:text/plain;base64,abc', title: '' })).toBe(false);
    expect(containsLocalImage({ imageUrl: '   ' })).toBe(false);
  });
});
