import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const hooks = vi.hoisted(() => ({
  copied: null as string | null,
  setCopied: vi.fn(),
  effects: [] as (() => void)[],
}));

vi.mock('react', () => ({
  default: {
    createElement: (type: any, props: any, ...children: any[]) => ({ type, props: { ...props, children } }),
  },
  useState: (initial: any) => [initial, hooks.setCopied],
  useRef: (current: unknown) => ({ current }),
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void) => {
    hooks.effects.push(effect);
  },
}));

const { ExportBar } = await import('@/components/editor/ExportBar');

describe('ExportBar copy notifications and fallback failure', () => {
  let showToastMock: ReturnType<typeof vi.fn>;
  let mockExecCommand: ReturnType<typeof vi.fn>;
  let mockAppendChild: ReturnType<typeof vi.fn>;
  let mockRemoveChild: ReturnType<typeof vi.fn>;
  let keydownListeners: ((e: any) => void)[];
  let createdTextarea: { value: string; select: ReturnType<typeof vi.fn> } | null;

  beforeEach(() => {
    createdTextarea = null;
    showToastMock = vi.fn();
    mockExecCommand = vi.fn();
    mockAppendChild = vi.fn((el) => el);
    mockRemoveChild = vi.fn((el) => el);
    keydownListeners = [];
    hooks.setCopied.mockClear();
    hooks.effects.length = 0;

    vi.stubGlobal('window', { showToast: showToastMock });
    vi.stubGlobal('navigator', {}); // Modern clipboard unavailable
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
      addEventListener: vi.fn((event: string, listener: (e: any) => void) => {
        if (event === 'keydown') keydownListeners.push(listener);
      }),
      removeEventListener: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function renderBar() {
    const tree = ExportBar({
      apiUrl: 'https://example.com/api/og?title=Test',
      downloadUrl: 'https://example.com/api/og?title=Test',
      params: { title: 'Test' },
      templateId: 'saas-maintenance',
      svg: null,
    });
    hooks.effects.forEach((effect) => effect());
    // Structure: div.export-bar -> div.export-buttons -> [downloadBtn, copyUrlBtn, copyMetaBtn]
    const buttonsContainer = tree.props.children;
    const buttons = buttonsContainer.props.children;
    return {
      copyUrlBtn: buttons[1],
      copyMetaBtn: buttons[2],
    };
  }

  it('shows error notification and never reports success when execCommand returns false on Copy Image URL', async () => {
    mockExecCommand.mockReturnValue(false);
    const { copyUrlBtn } = renderBar();

    await copyUrlBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Could not copy URL', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
    expect(hooks.setCopied).not.toHaveBeenCalledWith('url');
  });

  it('shows error notification and never reports success when execCommand throws on Copy Image URL', async () => {
    mockExecCommand.mockImplementation(() => {
      throw new Error('execCommand copy disabled');
    });
    const { copyUrlBtn } = renderBar();

    await copyUrlBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Could not copy URL', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
    expect(hooks.setCopied).not.toHaveBeenCalledWith('url');
  });

  it('shows error notification and never reports success when execCommand returns false on Copy Meta Tags', async () => {
    mockExecCommand.mockReturnValue(false);
    const { copyMetaBtn } = renderBar();

    await copyMetaBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Could not copy meta tags', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
    expect(hooks.setCopied).not.toHaveBeenCalledWith('meta');
  });

  it('shows error notification and never reports success when execCommand throws on Copy Meta Tags', async () => {
    mockExecCommand.mockImplementation(() => {
      throw new Error('execCommand copy disabled');
    });
    const { copyMetaBtn } = renderBar();

    await copyMetaBtn.props.onClick();

    expect(showToastMock).toHaveBeenCalledWith('Could not copy meta tags', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
    expect(hooks.setCopied).not.toHaveBeenCalledWith('meta');
  });

  it('handles Ctrl/Cmd+Shift+C keyboard shortcut when fallback fails', async () => {
    mockExecCommand.mockReturnValue(false);
    renderBar();

    const event = {
      key: 'C',
      shiftKey: true,
      ctrlKey: true,
      metaKey: false,
      preventDefault: vi.fn(),
    };
    for (const listener of keydownListeners) {
      listener(event);
    }
    await Promise.resolve();

    expect(event.preventDefault).toHaveBeenCalled();
    expect(showToastMock).toHaveBeenCalledWith('Could not copy URL', 'error');
    expect(showToastMock).not.toHaveBeenCalledWith(expect.anything(), 'success');
    expect(hooks.setCopied).not.toHaveBeenCalledWith('url');
  });

  it('reports success when copy succeeds', async () => {
    mockExecCommand.mockReturnValue(true);
    const { copyUrlBtn, copyMetaBtn } = renderBar();

    await copyUrlBtn.props.onClick();
    expect(showToastMock).toHaveBeenCalledWith('URL copied to clipboard!', 'success');
    expect(hooks.setCopied).toHaveBeenCalledWith('url');

    showToastMock.mockClear();
    hooks.setCopied.mockClear();

    await copyMetaBtn.props.onClick();
    expect(showToastMock).toHaveBeenCalledWith('Meta tags copied!', 'success');
    expect(hooks.setCopied).toHaveBeenCalledWith('meta');
  });
});
