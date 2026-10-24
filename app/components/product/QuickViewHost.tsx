import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useRouterState } from '@tanstack/react-router';
import { QUICK_VIEW_EVENT, type QuickViewDetail } from '../../lib/quickView';

const QuickViewModal = lazy(() =>
  import('./QuickViewModal').then((module) => ({ default: module.QuickViewModal }))
);

/**
 * Mounts the quick-view modal on demand.
 *
 * Product cards (and anything else) call `openQuickView(id)`, which dispatches
 * `theme::quick-view`; this host listens for it, then mounts the lazily-loaded
 * `QuickViewModal`. Nothing from the modal's own imports (slider, options,
 * add-to-cart) reaches the initial page bundle until the first open.
 */
export function QuickViewHost() {
  const [productId, setProductId] = useState<number | string | null>(null);
  const close = useCallback(() => setProductId(null), []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<QuickViewDetail>).detail;
      if (detail?.productId !== undefined && detail?.productId !== null) {
        setProductId(detail.productId);
      }
    };

    window.addEventListener(QUICK_VIEW_EVENT, onOpen);
    return () => window.removeEventListener(QUICK_VIEW_EVENT, onOpen);
  }, []);

  // The host outlives the page the modal was opened from, so close it whenever
  // the route changes (a link inside the modal, back/forward, the bottom bar).
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const initialPathname = useRef(pathname);
  useEffect(() => {
    if (initialPathname.current !== pathname) {
      initialPathname.current = pathname;
      setProductId(null);
    }
  }, [pathname]);

  if (productId === null) return null;

  return (
    <Suspense fallback={null}>
      <QuickViewModal key={String(productId)} productId={productId} onClose={close} />
    </Suspense>
  );
}
