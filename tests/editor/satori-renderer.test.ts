import { afterEach, describe, expect, it, vi } from 'vitest';

const hooks = vi.hoisted(() => ({ setters: [] as ReturnType<typeof vi.fn>[], effects: [] as (() => void)[] }));
const satori = vi.hoisted(() => vi.fn());
vi.mock('satori', () => ({ default: satori }));
// Exercise the hook's asynchronous callbacks without adding a DOM dependency.
vi.mock('react', () => ({
  useState: () => {
    const setter = vi.fn();
    hooks.setters.push(setter);
    return [null, setter];
  },
  useRef: (current: unknown) => ({ current }),
  useCallback: (callback: unknown) => callback,
  useEffect: (effect: () => void) => hooks.effects.push(effect),
}));

function deferred() {
  let resolve!: (value: string) => void;
  let reject!: (error: Error) => void;
  const promise = new Promise<string>((res, rej) => { resolve = res; reject = rej; });
  return { promise, resolve, reject };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
  hooks.setters.length = 0;
  hooks.effects.length = 0;
  satori.mockReset();
});

describe('useSatoriRenderer render ordering', () => {
  it.each(['success', 'failure'])('ignores an older %s that finishes after the latest render', async (outcome) => {
    vi.stubGlobal('fetch', vi.fn(async () => ({ arrayBuffer: async () => new ArrayBuffer(8) })));
    const { useSatoriRenderer } = await import('@/components/editor/useSatoriRenderer');
    const renderer = useSatoriRenderer();
    hooks.effects.forEach((effect) => effect());
    await vi.waitFor(() => expect(hooks.setters[1]).toHaveBeenCalledWith(false));
    const older = deferred();
    const latest = deferred();
    satori.mockReturnValueOnce(older.promise).mockReturnValueOnce(latest.promise);
    renderer.render({ logo: 'slow-logo.png' });
    renderer.render({ logo: '' });
    latest.resolve('<svg>latest</svg>');
    await vi.waitFor(() => expect(hooks.setters[0]).toHaveBeenCalledWith('<svg>latest</svg>'));
    if (outcome === 'success') older.resolve('<svg>old logo</svg>');
    else older.reject(new Error('Old logo failed'));
    await older.promise.catch(() => {});
    await Promise.resolve();
    expect(hooks.setters[0].mock.calls).toEqual([['<svg>latest</svg>']]);
    expect(hooks.setters[2].mock.calls).toEqual([[null]]);
  });
});
