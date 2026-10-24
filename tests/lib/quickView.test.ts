import { afterEach, describe, expect, it, vi } from 'vitest';
import { openQuickView, QUICK_VIEW_EVENT, type QuickViewDetail } from '../../app/lib/quickView';

describe('openQuickView', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('dispatches the product id through the shared window event', () => {
    const listener = vi.fn();
    window.addEventListener(QUICK_VIEW_EVENT, listener);

    openQuickView(42);

    expect(listener).toHaveBeenCalledTimes(1);
    const event = listener.mock.calls[0][0] as CustomEvent<QuickViewDetail>;
    expect(event.detail).toEqual({ productId: 42 });

    window.removeEventListener(QUICK_VIEW_EVENT, listener);
  });

  it('does nothing on the server', () => {
    const windowSpy = vi.spyOn(window, 'dispatchEvent');
    const originalWindow = globalThis.window;

    // Simulate the server branch without deleting the global for the rest of the suite.
    vi.stubGlobal('window', undefined);
    openQuickView(7);
    vi.stubGlobal('window', originalWindow);

    expect(windowSpy).not.toHaveBeenCalled();
  });
});
