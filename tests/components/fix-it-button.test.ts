import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FixItButton } from '@/components/preview/FixItButton';

describe('FixItButton copy notification behavior', () => {
  let showToastMock: ReturnType<typeof vi.fn>;
  let mockExecCommand: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;
  let createdTextarea: { value: string; select: ReturnType<typeof vi.fn> } | null;

  beforeEach(() => {
    createdTextarea = null;
    showToastMock = vi.fn();
    mockExecCommand = vi.fn();
    mockAppendChild = vi.fn((el) => el);
    mockRemoveChild = vi.fn((el) => el);

    vi.stubGlobal('window', { showToast: showToastMock });
    vi.stubGlobal('navigator', {}); // Clipboard API unavailable by default
    vi.stubGlobal('document', {
      createElement: vi.fn((tag: string) => {
        if (tag === 'textarea') {
          createdTextarea = { value: '', select: vi.fn() };
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

  function getCopyButton(meta = { ogTitle: 'Test Title', ogDescription: 'Test Desc' }) {
    const tree = FixItButton({ meta });
    // Structure: div.fix-it-section -> [h3, p, div.fix-it-actions]
    const actionsDiv = tree.props.children[2];
    // actionsDiv children: [a.fix-it-btn-primary, button.fix-it-btn-ghost]
    const copyBtn = actionsDiv.props.children[1];
    return copyBtn;
  }

  it('shows error notification and never reports success when execCommand returns false', async () => {
    mockExecCommand.mockReturnValue(false);
    const copyBtn = getCopyButton();

    await copyBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Could not copy meta tags', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
  });

  it('shows error notification and never reports success when execCommand throws', async () => {
    mockExecCommand.mockImplementation(() => {
      throw new Error('execCommand copy disabled');
    });
    const copyBtn = getCopyButton();

    await copyBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Could not copy meta tags', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
  });

  it('shows success notification only when copy succeeds', async () => {
    mockExecCommand.mockReturnValue(true);
    const copyBtn = getCopyButton();

    await copyBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Recommended meta tags copied!', 'success');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'error');
  });
});
