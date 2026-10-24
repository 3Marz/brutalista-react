import { beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { QuickViewHost } from '../../../app/components/product/QuickViewHost';
import { openQuickView } from '../../../app/lib/quickView';

const routerState = vi.hoisted(() => ({ pathname: '/en' }));

vi.mock('@tanstack/react-router', () => ({
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => unknown;
  }) => select({ location: { pathname: routerState.pathname } }),
}));

vi.mock('../../../app/components/product/QuickViewModal', () => ({
  QuickViewModal: ({
    productId,
    onClose,
  }: {
    productId: number | string;
    onClose: () => void;
  }) => (
    <div data-testid="quick-view-modal">
      <span>{String(productId)}</span>
      <button type="button" onClick={onClose}>
        close
      </button>
    </div>
  ),
}));

describe('QuickViewHost', () => {
  beforeEach(() => {
    routerState.pathname = '/en';
  });

  it('mounts the lazy modal for the requested product and closes it', async () => {
    render(<QuickViewHost />);
    expect(screen.queryByTestId('quick-view-modal')).toBeNull();

    act(() => {
      openQuickView(42);
    });

    expect(await screen.findByTestId('quick-view-modal')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'close' }));
    expect(screen.queryByTestId('quick-view-modal')).toBeNull();
  });

  it('closes when the route changes', async () => {
    const { rerender } = render(<QuickViewHost />);
    act(() => {
      openQuickView(42);
    });
    await screen.findByTestId('quick-view-modal');

    act(() => {
      routerState.pathname = '/en/cart';
      rerender(<QuickViewHost />);
    });

    expect(screen.queryByTestId('quick-view-modal')).toBeNull();
  });
});
