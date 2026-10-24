/**
 * Quick-view bridge.
 *
 * The Twig theme rendered a `<quick-view>` custom element in `master.twig` and
 * product cards called `#quick-view-modal.loadProduct(id)` on it. In React the
 * modal is mounted on demand by `QuickViewHost` (in `ThemeLayout`), so cards only
 * announce what to show: a window event the host listens for. Keeping it as an
 * event means any component can open quick view without sharing React state.
 */

export const QUICK_VIEW_EVENT = 'theme::quick-view';

export interface QuickViewDetail {
  productId: number | string;
}

/** Opens the global quick-view modal for a product id. No-op on the server. */
export function openQuickView(productId: number | string): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<QuickViewDetail>(QUICK_VIEW_EVENT, {
      detail: { productId },
    })
  );
}
