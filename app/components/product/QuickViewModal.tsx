import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Modal } from '@salla.sa/twilight-theme-engine/modal';
import { product as productApi } from '@salla.sa/twilight-theme-engine/api/product';
import { getActiveCurrency } from '@salla.sa/twilight-theme-engine/api/client';
import { CurrencySymbol, Image, Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useWishlist } from '@salla.sa/twilight-theme-engine/hooks/useWishlist';
import type { Product, ProductImage } from '@salla.sa/twilight-theme-engine/types';
import { SallaAddProductButton } from '@salla.sa/twilight-components-react/add-product-button';
import { SallaInstallment } from '@salla.sa/twilight-components-react/installment';
// Eager (non-deferred) options: the modal mounts on a real user interaction, so
// the SDK is already ready and the deferred wrapper's in-view hydration only
// adds a skeleton flash.
import { SallaProductOptionsCore as SallaProductOptions } from '@salla.sa/twilight-components-react/product-options';
import { SallaSlider } from '@salla.sa/twilight-components-react/slider';
import { SallaSocialShare } from '@salla.sa/twilight-components-react/social-share';
import { WishlistHeartButton } from './WishlistHeartButton';

export interface QuickViewModalProps {
  productId: number | string;
  onClose: () => void;
}

/**
 * Quick view, reimplemented from the Twig theme's `<quick-view>` custom element
 * (`src/assets/js/partials/quick-view.js`) on top of the engine's controlled
 * `Modal`. It fetches the product details itself (`product.find`, same endpoint
 * and `with[]` list the Twig called through `salla.product.getDetails`), then
 * renders the gallery, price, options and add-to-cart in one panel.
 *
 * Mounted lazily by `QuickViewHost`; the fetch starts the moment it mounts.
 */
export function QuickViewModal({ productId, onClose }: QuickViewModalProps) {
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  // Monotonic id so a slow response for a previous product never overwrites the
  // current one (cards can be clicked one after another while the first loads).
  const requestRef = useRef(0);

  useEffect(() => {
    const request = ++requestRef.current;
    let active = true;
    setStatus('loading');
    setProduct(null);

    productApi
      .find(String(productId))
      .then((result) => {
        if (!active || request !== requestRef.current) return;
        if (!result) {
          setStatus('error');
          return;
        }
        setProduct(result);
        setStatus('ready');
      })
      .catch(() => {
        if (!active || request !== requestRef.current) return;
        setStatus('error');
      });

    return () => {
      active = false;
    };
  }, [productId, attempt]);

  const retry = useCallback(() => setAttempt((value) => value + 1), []);

  // The engine Modal sets role="dialog" on the portal wrapper but has no label
  // prop; name it with the product once the details arrive.
  const dialogLabel = product?.name ?? t('pages.products.quick_view', 'Quick view');
  useEffect(() => {
    const dialog = document.querySelector('.quick-view-modal')?.parentElement;
    if (!dialog) return;
    dialog.setAttribute('aria-label', dialogLabel);
    return () => dialog.removeAttribute('aria-label');
  }, [dialogLabel]);

  return (
    <Modal
      isOpen
      onClose={onClose}
      size="full"
      position="center"
      className="quick-view-modal !max-w-5xl"
    >
      <button
        type="button"
        className="quick-view__close"
        onClick={onClose}
        aria-label={t('common.close', 'Close')}
      >
        <i className="sicon-cancel" aria-hidden="true" />
      </button>

      <div className="quick-view">
        {status === 'loading' && (
          <QuickViewLoading
            label={t('pages.products.quick_view_loading', 'Loading product...')}
          />
        )}

        {status === 'error' && (
          <QuickViewError
            message={t(
              'pages.products.quick_view_error',
              'Could not load the product. Please try again.'
            )}
            retryLabel={t('common.elements.try_again', 'Try again')}
            onRetry={retry}
          />
        )}

        {status === 'ready' && product && <QuickViewContent product={product} />}
      </div>
    </Modal>
  );
}

function QuickViewLoading({ label }: { label: string }) {
  return (
    <div className="quick-view__loading" role="status" aria-live="polite" aria-label={label}>
      <div className="quick-view__skeleton aspect-square" />
      <div className="flex flex-col gap-4">
        <div className="quick-view__skeleton h-6 w-2/3" />
        <div className="quick-view__skeleton h-4 w-full" />
        <div className="quick-view__skeleton h-4 w-5/6" />
        <div className="quick-view__skeleton mt-2 h-11 w-full" />
      </div>
    </div>
  );
}

function QuickViewError({
  message,
  retryLabel,
  onRetry,
}: {
  message: string;
  retryLabel: string;
  onRetry: () => void;
}) {
  return (
    <div className="quick-view__error" role="alert">
      <p>{message}</p>
      <button type="button" className="quick-view__retry" onClick={onRetry}>
        {retryLabel}
      </button>
    </div>
  );
}

function QuickViewContent({ product }: { product: Product }) {
  return (
    <>
      <div className="quick-view__gallery">
        <QuickViewGallery product={product} />
      </div>

      <div className="quick-view__details">
        <QuickViewActions product={product} />

        {product.category && (
          <Link to={product.category.url} className="text-lg text-text-color opacity-60">
            {product.category.name}
          </Link>
        )}

        <Link to={product.url} className="text-2xl font-bold text-text-color hover:text-primary">
          {product.name}
        </Link>

        {product.description && (
          <article
            className="article article--main quick-view__description"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        )}

        <QuickViewForm product={product} />
      </div>
    </>
  );
}

function QuickViewActions({ product }: { product: Product }) {
  const { t } = useTranslation();
  const wishlist = useWishlist();
  const productId = Number(product.id);
  const inWishlist = wishlist.has(productId);

  return (
    <div className="quick-view__actions">
      <SallaSocialShare
        className="inline-flex"
        url={product.url}
        urlName={product.name}
        aria-label={t('pages.wishlist.share', 'Share')}
      />
      <WishlistHeartButton
        productId={productId}
        color={inWishlist ? 'danger' : 'dark'}
        ariaLabel={t('pages.products.add_to_wishlist', 'Add to wishlist')}
        className={`btn--wishlist animated ${inWishlist ? 'is-added' : 'not-added'}`}
        onClick={() => {
          void wishlist.toggle(productId);
        }}
      />
    </div>
  );
}

function imageKey(image: ProductImage, index: number): string {
  return String(image.id ?? image.three_d_image_url ?? image.video_url ?? image.url ?? index);
}

function QuickViewGallery({ product }: { product: Product }) {
  const { t } = useTranslation();
  const images = useMemo<ProductImage[]>(
    () =>
      product.images && product.images.length > 0
        ? product.images
        : product.image?.url
          ? [product.image]
          : [],
    [product.images, product.image]
  );

  if (images.length === 0) {
    // Keep the gallery column occupied so the details don't slide into a
    // half-width first grid cell on products with no image.
    return <div className="quick-view__image-placeholder" aria-hidden="true" />;
  }

  const hasMany = images.length > 1;

  return (
    <SallaSlider
      id={`quick-view-slider-${product.id}`}
      className="details-slider modal-slider image-slider"
      type="thumbs"
      loop={false}
      autoHeight
      pagination={hasMany}
      showThumbsControls={false}
      listenToThumbnailsOption
      sliderConfig={{ watchOverflow: true, autoHeight: true }}
      thumbsConfig={{ slidesPerView: 'auto', spaceBetween: 8 }}
    >
      {product.promotion_title && <div className="promotion-title">{product.promotion_title}</div>}

      {product.calories ? (
        <div className="absolute end-4 top-4 z-[3] flex h-20 w-20 flex-col items-center justify-center rounded-neo border-2 border-bc bg-base-50 shadow-neo md:h-24 md:w-24">
          <span className="text-xl leading-none font-bold text-red-500">{product.calories}</span>
          <span className="text-xs text-my-gray">
            {t('pages.products.calories', 'Calories')}
          </span>
        </div>
      ) : null}

      <div slot="items">
        {images.map((image, index) => (
          <div
            key={imageKey(image, index)}
            className="swiper-slide quick-view__slide"
            data-img-id={image.id}
            data-slid-index={index}
          >
            {image.three_d_image_url ? (
              <model-viewer
                style={{ minHeight: '420px' }}
                className="model-entry h-full w-full"
                loading="eager"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                poster={image.url || undefined}
                src={image.three_d_image_url}
                shadow-intensity="1"
                alt={image.alt || product.name}
              ></model-viewer>
            ) : (
              <Image
                src={image.url}
                alt={image.alt || product.name}
                className="h-full w-full object-cover"
                aspectRatio="1/1"
                priority={index === 0}
                noWrapper
              />
            )}
          </div>
        ))}
      </div>

      {hasMany && (
        <div slot="thumbs" className="hidden md:block">
          {images.map((image, index) => (
            <div key={imageKey(image, index)} className="slide--one-fourth">
              <Image
                src={image.url}
                alt={image.alt || ''}
                className="h-full w-full object-cover"
                noWrapper
              />
            </div>
          ))}
        </div>
      )}
    </SallaSlider>
  );
}

function QuickViewPrice({ product }: { product: Product }) {
  const { t } = useTranslation();
  // The API converts the amounts but still labels them in the store's own currency.
  const currency = getActiveCurrency(product.currency);

  return (
    <div className="price-wrapper flex items-center gap-4 whitespace-nowrap py-2">
      <div
        className={`price_is_on_sale space-x-2 whitespace-nowrap rtl:space-x-reverse ${
          product.is_on_sale ? '' : 'hidden'
        }`}
      >
        <p className="total-price inline-block text-xl font-bold text-red-800">
          {product.sale_price} <CurrencySymbol currency={currency} />
        </p>
        <span className="before-price text-my-gray line-through">
          {product.regular_price} <CurrencySymbol currency={currency} />
        </span>
      </div>

      <div
        className={`starting-or-normal-price gap-4 ${product.is_on_sale ? 'hidden' : 'flex'}`}
      >
        {product.starting_price ? (
          <span className="starting-price-title">
            {t('pages.products.starting_price', 'Starting from')}
          </span>
        ) : null}
        <p className="total-price inline-block text-xl font-bold">
          {product.starting_price ?? product.price} <CurrencySymbol currency={currency} />
        </p>
      </div>
    </div>
  );
}

/** Out-of-stock products show the availability control when the store offers it. */
function quickViewAddStatus(product: Product): 'sale' | 'out' | 'out-and-notify' {
  if (product.status === 'out-and-notify') return 'out-and-notify';
  if (product.is_out_of_stock || product.status === 'out' || product.status === 'hidden') {
    return product.notify_availability ? 'out-and-notify' : 'out';
  }
  return 'sale';
}

function notifyAvailabilityProps(product: Product) {
  const notify = product.notify_availability;
  if (!notify) return {};

  return {
    channels: (notify.channels ?? []).join(','),
    ...(notify.subscribed ? { isSubscribed: true } : {}),
    ...(notify.subscribed_options
      ? { subscribedOptions: JSON.stringify(notify.subscribed_options) }
      : {}),
    ...(notify.options ? { notifyOptionsAvailability: true } : {}),
  };
}

/** Submits the quick-view form through the SDK, like the Twig `salla.form.onSubmit`
 *  and the product page: the form submit path is what carries the selected
 *  options, donation amount and quantity (the quick-add path sends only the id). */
function handleQuickViewSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  const button = event.currentTarget
    .querySelector('.quick-view__add')
    ?.querySelector('salla-button') as
    | (HTMLElement & { load?: () => void; stop?: () => void })
    | null;
  button?.load?.();
  // Safety net: cart events stop the spinner on a real response; this covers a
  // silent validation bail.
  window.setTimeout(() => button?.stop?.(), 8000);
  window.salla?.form.onSubmit('cart.addItem', event);
}

function QuickViewForm({ product }: { product: Product }) {
  const { t } = useTranslation();
  const options = product.options ?? [];
  const basePrice = product.base_currency_price;
  const installmentPrice = basePrice
    ? String(
        typeof basePrice === 'object' ? basePrice.amount : basePrice
      )
    : '';

  // `salla-product-options` reads its `options` prop only in its constructor (no
  // @Watch), and its fallback fetch uses `page.id` from that same moment. Seed
  // both before mounting it, then restore the page id when the modal closes.
  const optionsRef = useCallback(
    (el: { setOptionsData?: (data: never[]) => void } | null) => {
      if (!product.options?.length) return;
      void el?.setOptionsData?.(product.options as never[]);
    },
    [product.options]
  );

  const [optionsReady, setOptionsReady] = useState(false);
  useEffect(() => {
    if (!options.length) {
      setOptionsReady(true);
      return;
    }

    const salla = window.salla;
    const previousPageId = salla?.config.get('page.id');
    salla?.config.set('page.id', product.id);
    setOptionsReady(true);

    return () => {
      // Don't stomp a page.id that the route we just navigated to has already
      // set while the modal was unmounting.
      if (salla && String(salla.config.get('page.id')) === String(product.id)) {
        salla.config.set('page.id', previousPageId);
      }
    };
  }, [options.length, product.id]);

  const addLabel =
    product.add_to_cart_label ||
    (product.has_preorder_campaign
      ? t('pages.products.pre_order_now', 'Pre-order now')
      : product.status === 'sale' && product.type === 'booking'
        ? t('pages.cart.book_now', 'Book now')
        : product.status === 'sale'
          ? t('pages.cart.add_to_cart', 'Add to Cart')
          : product.type !== 'donating'
            ? t('pages.products.out_of_stock', 'Out of Stock')
            : t('pages.products.donation_exceed', 'Donation amount exceeded'));

  return (
    <form
      className="quick-view__form product-form"
      encType="multipart/form-data"
      method="post"
      onSubmit={handleQuickViewSubmit}
    >
      <input type="hidden" name="id" value={product.id} />

      <QuickViewPrice product={product} />

      {optionsReady && options.length > 0 && (
        <SallaProductOptions
          key={String(product.id)}
          ref={optionsRef}
          options={JSON.stringify(options)}
          productId={product.id}
          productAvailable={!product.is_out_of_stock}
          className="quick-view__options"
          noPadding
        />
      )}

      <SallaAddProductButton
        width="wide"
        className="quick-view__add"
        productId={product.id}
        productStatus={quickViewAddStatus(product)}
        productType={product.type}
        loaderPosition="end"
        type="submit"
        hasPreOrder={Boolean(product.has_preorder_campaign)}
        {...notifyAvailabilityProps(product)}
      >
        {product.status === 'sale' ? (
          <i
            className={`text-base mx-2 sicon-${
              product.type === 'booking' ? 'calendar-time' : 'shopping-bag'
            }`}
          />
        ) : null}
        <span>{addLabel}</span>
      </SallaAddProductButton>

      <SallaInstallment price={installmentPrice} />
    </form>
  );
}
