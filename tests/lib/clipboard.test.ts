import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { copyToClipboard } from '@/lib/clipboard';

describe('copyToClipboard', () => {
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;
  let mockExecCommand: ReturnType<typeof vi.fn>;
  let mockSelect: ReturnType<typeof vi.fn>;
  let createdTextarea: { value: string; select: ReturnType<typeof vi.fn> } | null;

  beforeEach(() => {
    createdTextarea = null;
    mockAppendChild = vi.fn((el) => el);
    mockRemoveChild = vi.fn((el) => el);
    mockExecCommand = vi.fn();
    mockSelect = vi.fn();

    vi.stubGlobal('document', {
      createElement: vi.fn((tag: string) => {
        if (tag === 'textarea') {
          createdTextarea = { value: '', select: mockSelect };
          return createdTextarea;
        }
        return {};
      }),
      body: {
        appendChild: mockAppendChild,
        removeChild: mockRemoveChild,
      },
      execCommand: mockExecCommand,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('when navigator.clipboard is available and succeeds', () => {
    it('uses navigator.clipboard.writeText and does not use fallback', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined);
      vi.stubGlobal('navigator', { clipboard: { writeText } });

      const result = await copyToClipboard('test text');

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith('test text');
      expect(mockExecCommand).not.toHaveBeenCalled();
      expect(mockAppendChild).not.toHaveBeenCalled();
    });
  });

  describe('fallback when navigator.clipboard is unavailable', () => {
    beforeEach(() => {
      vi.stubGlobal('navigator', {});
    });

    it('returns true when document.execCommand succeeds', async () => {
      mockExecCommand.mockReturnValue(true);

      const result = await copyToClipboard('fallback text');

      expect(result).toBe(true);
      expect(createdTextarea?.value).toBe('fallback text');
      expect(mockSelect).toHaveBeenCalled();
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockAppendChild).toHaveBeenCalledWith(createdTextarea);
      expect(mockRemoveChild).toHaveBeenCalledWith(createdTextarea);
    });

    it('returns false and cleans up textarea when document.execCommand returns false', async () => {
      mockExecCommand.mockReturnValue(false);

      const result = await copyToClipboard('fallback text');

      expect(result).toBe(false);
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockAppendChild).toHaveBeenCalledWith(createdTextarea);
      expect(mockRemoveChild).toHaveBeenCalledWith(createdTextarea);
    });

    it('returns false and cleans up textarea when document.execCommand throws', async () => {
      mockExecCommand.mockImplementation(() => {
        throw new Error('execCommand copy failed');
      });

      const result = await copyToClipboard('fallback text');

      expect(result).toBe(false);
      expect(mockAppendChild).toHaveBeenCalledWith(createdTextarea);
      expect(mockRemoveChild).toHaveBeenCalledWith(createdTextarea);
    });
  });

  describe('fallback when navigator.clipboard.writeText rejects', () => {
    it('falls back to execCommand and returns false when execCommand returns false', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      mockExecCommand.mockReturnValue(false);

      const result = await copyToClipboard('fallback text');

      expect(result).toBe(false);
      expect(writeText).toHaveBeenCalledWith('fallback text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockAppendChild).toHaveBeenCalledWith(createdTextarea);
      expect(mockRemoveChild).toHaveBeenCalledWith(createdTextarea);
    });

    it('falls back to execCommand and returns false when execCommand throws', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      mockExecCommand.mockImplementation(() => {
        throw new Error('execCommand threw');
      });

      const result = await copyToClipboard('fallback text');

      expect(result).toBe(false);
      expect(writeText).toHaveBeenCalledWith('fallback text');
      expect(mockAppendChild).toHaveBeenCalledWith(createdTextarea);
      expect(mockRemoveChild).toHaveBeenCalledWith(createdTextarea);
    });

    it('falls back to execCommand and returns true when execCommand succeeds', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('Permission denied'));
      vi.stubGlobal('navigator', { clipboard: { writeText } });
      mockExecCommand.mockReturnValue(true);

      const result = await copyToClipboard('fallback text');

      expect(result).toBe(true);
      expect(writeText).toHaveBeenCalledWith('fallback text');
      expect(mockExecCommand).toHaveBeenCalledWith('copy');
      expect(mockAppendChild).toHaveBeenCalledWith(createdTextarea);
      expect(mockRemoveChild).toHaveBeenCalledWith(createdTextarea);
    });
  });

  it('returns false when neither clipboard nor document is available', async () => {
    vi.stubGlobal('navigator', undefined);
    vi.stubGlobal('document', undefined);

    const result = await copyToClipboard('test');
    expect(result).toBe(false);
  });
});
