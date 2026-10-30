import { memo, useCallback, type CSSProperties } from 'react';
import type { ProductCardProps } from '@salla.sa/twilight-theme-engine/product';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { useAsset } from '@salla.sa/twilight-theme-engine/hooks/useAsset';
import { useWishlist } from '@salla.sa/twilight-theme-engine/hooks/useWishlist';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { SallaAddProductButton } from '@salla.sa/twilight-components-react/add-product-button';
import { SallaButton } from '@salla.sa/twilight-components-react/button';
import { SallaCountDown } from '@salla.sa/twilight-components-react/count-down';
import { openQuickView as dispatchQuickView } from '../../lib/quickView';
import { WishlistHeartButton } from './WishlistHeartButton';

export interface BrutalProductCardProps extends ProductCardProps {
  /** Caption above the special card's countdown (Twig's `deadline-text`). */
  deadlineText?: string;
  /** Render the countdown unboxed (Twig's `notBoxedCountDown`). */
  notBoxedCountDown?: boolean;
}

/** `new Date(...)` → `YYYY-M-D`, exactly as the Twig card formatted `discount_ends`. */
function countdownDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/** `product.preorder.label` is an untyped JSON field. */
function preorderLabel(preorder: unknown): string {
  if (!preorder || typeof preorder !== 'object') return '';
  const label = (preorder as { label?: unknown }).label;
  return typeof label === 'string' ? label : '';
}

/**
 * Product card ported from the Twig theme's `custom-salla-product-card`
 * (`src/assets/js/partials/product-card.js`).
 *
 * Registered on the engine's `product:card` key, so every product grid, slider
 * and listing renders it. It keeps the Twig markup/utility classes and reads
 * data through the React hooks the engine exposes (`useMoney`, `useWishlist`,
 * `useTwilight`, …) instead of the `salla.*` globals. Styling lives in
 * `04-components/product.scss`; the boxed countdown reuses the same
 * `salla-count-down` rules as the rest of the theme.
 */
export const BrutalProductCard = memo(function BrutalProductCard({
  product,
  layout = 'vertical',
  className = '',
  withShadow = false,
  withoutAddButton = false,
  index = 0,
  imagePriority = false,
  sizes,
  deadlineText,
  notBoxedCountDown = false,
}: BrutalProductCardProps) {
  const { format } = useMoney();
  const { isPlaceholder } = useAsset();
  const { store, theme } = useTwilight();
  const { t } = useTranslation();
  const wishlist = useWishlist();

  const isHorizontal = layout === 'horizontal';
  const isFullImage = layout === 'fullImage';
  const isMinimal = layout === 'minimal';
  const isSpecial = layout === 'special';
  // Twig adds `s-product-card-vertical` whenever the card is neither horizontal,
  // full-image nor minimal — which includes the special/offer card.
  const isStacked = !isHorizontal && !isFullImage && !isMinimal;

  const productId = Number(product.id);
  const inWishlist = wishlist.has(productId);
  const handleWishlistToggle = useCallback(
    () => wishlist.toggle(productId),
    [wishlist, productId]
  );

  const fitImageHeight = store?.settings?.product?.fit_type as string | undefined;
  const objectFit = (isPlaceholder(product.image?.url)
    ? 'contain'
    : fitImageHeight || 'cover') as CSSProperties['objectFit'];

  const showDash = store?.settings?.product?.show_price_as_dash;
  const formatPrice = (price: number | string | null | undefined) => {
    if (price == null || price === '' || Number(price) === 0) return showDash ? '-' : '';
    return format(price);
  };

  const notifyInCard = theme?.settings?.notify_when_available_in_card !== false;
  const addButtonStatus =
    notifyInCard &&
    product.is_out_of_stock &&
    product.type !== 'donating' &&
    product.type !== 'financial_support'
      ? 'out-and-notify'
      : product.status;

  const addButtonLabel =
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

  const preorder = preorderLabel(product.preorder);

  const cardClassName = [
    's-product-card',
    's-product-card-entry',
    // Marker for the theme's `ProductCard` wrapper: it portals a wishlist
    // button into the engine footer / forces the engine button's fill, neither
    // of which applies to this card.
    's-product-card--brutal',
    'h-full',
    'w-full',
    'flex',
    isMinimal || isHorizontal ? 'flex-row' : 'flex-col',
    'gap-3',
    'group',
    'overflow-visible',
    'relative',
    isFullImage ? 'px-0' : 'px-0.5',
    isFullImage ? 'pb-8' : 'pb-5',
    isStacked ? 's-product-card-vertical' : '',
    isHorizontal ? 's-product-card-horizontal' : '',
    fitImageHeight && !isSpecial && !isFullImage && !isMinimal
      ? 's-product-card-fit-height'
      : '',
    isSpecial ? 's-product-card-special' : '',
    isMinimal ? 's-product-card-minimal' : '',
    product.donation ? 's-product-card-donation' : '',
    withShadow ? 's-product-card-shadow' : '',
    product.is_out_of_stock ? 's-product-card-out-of-stock' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const imageClassName = [
    'group/img',
    isFullImage ? 'h-full' : 'aspect-square',
    'w-full',
    'border-2 border-bc shadow-neo rounded-neo overflow-hidden relative',
    // Makes the image box obey `product_card_img_ratio` (the existing
    // `.s-product-card-image` rules in this stylesheet).
    isStacked && !isFullImage ? 's-product-card-image' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // The Twig card called `#quick-view-modal.loadProduct(id)`; the React modal is
  // mounted on demand, so announce the id through the shared event instead.
  const handleQuickView = useCallback(() => dispatchQuickView(productId), [productId]);

  // Twig suppresses the badge only on the horizontal / minimal cards.
  const badge = isMinimal || isHorizontal ? null : preorder ? (
    <div className="promotion-title pointer-events-none">{preorder}</div>
  ) : product.promotion_title ? (
    <div className="promotion-title pointer-events-none">{product.promotion_title}</div>
  ) : product.is_out_of_stock ? (
    <div className="absolute top-0 end-0 z-[3] w-32 h-32 overflow-hidden flex items-center justify-center pointer-events-none">
      <span className="text-center outline-2 outline outline-[#7a0000] border-y-2 border-yellow-50 border-dashed text-xs md:text-sm ltr:rotate-45 rtl:-rotate-45 ltr:translate-x-6 rtl:-translate-x-6 -translate-y-6 px-4 py-1 w-[200%] bg-[#7a0000] text-yellow-50 absolute">
        {t('pages.products.out_of_stock', 'Out of Stock')}
      </span>
    </div>
  ) : null;

  const price =
    product.is_on_sale && product.sale_price ? (
      <div className="s-product-card-sale-price">
        <h4>{formatPrice(product.sale_price)}</h4>
        <span className={isFullImage ? '!text-base-100' : ''}>
          {formatPrice(product.regular_price)}
        </span>
      </div>
    ) : product.starting_price ? (
      <div className="s-product-card-starting-price">
        <p>{t('pages.products.starting_price', 'Starting from')}</p>
        <h4>{formatPrice(product.starting_price)}</h4>
      </div>
    ) : (
      <h4 className={`s-product-card-price ${isFullImage ? '!text-base-100' : ''}`}>
        {formatPrice(product.price)}
      </h4>
    );

  return (
    <div
      id={String(product.id)}
      className={cardClassName}
      data-product-id={product.id}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {badge}

      <div className={imageClassName}>
        <a
          className="w-full h-full flex items-center justify-center overflow-hidden"
          href={product.url}
          aria-label={product.name}
        >
          <img
            className={`${
              isFullImage ? 'brightness-75 ' : ''
            }s-product-card-img group-hover/img:scale-110 transition-transform w-full h-full duration-500`}
            src={product.image?.url}
            alt={product.image?.alt ?? product.name}
            loading={imagePriority ? 'eager' : 'lazy'}
            decoding="async"
            sizes={sizes ?? (isFullImage || isMinimal ? '100vw' : '(min-width: 768px) 25vw, 50vw')}
            style={{ objectFit }}
          />
        </a>

        <div
          className={`s-product-card-actions absolute ${
            isFullImage ? 'top-2' : 'bottom-2'
          } start-1 flex flex-col gap-2 group-hover:opacity-100 md:opacity-0 transition`}
        >
          <div className="group-hover:pointer-events-auto duration-300 pointer-events-none group-hover:translate-x-0 ltr:md:-translate-x-8 rtl:md:translate-x-8 transition-all">
            <WishlistHeartButton
              productId={productId}
              color={inWishlist ? 'danger' : 'dark'}
              ariaLabel={t('pages.wishlist.toggle', 'Add or remove to wishlist')}
              onClick={handleWishlistToggle}
              className={`s-product-card-wishlist-btn animated ${
                inWishlist
                  ? 's-product-card-wishlist-added pulse-anime'
                  : 'not-added un-favorited'
              }`}
            />
          </div>

          <div className="group-hover:pointer-events-auto duration-300 pointer-events-none group-hover:translate-x-0 ltr:md:-translate-x-16 rtl:md:translate-x-16 transition-all">
            <SallaButton
              size="medium"
              shape="icon"
              fill="outline"
              color="dark"
              name={`product-name-${product.id}`}
              ariaLabel={t('pages.products.quick_view', 'Quick view product')}
              onClick={handleQuickView}
            >
              <i className="sicon-eye" />
            </SallaButton>
          </div>
        </div>
      </div>

      <div
        className={`${
          isFullImage ? 'absolute bottom-0 p-4' : ''
        } flex flex-grow justify-between w-full flex-col gap-3`}
      >
        <div className={`h-full w-full flex flex-col gap-2 ${isSpecial ? 'lg:gap-4' : ''} px-2`}>
          <h5 className={isSpecial ? 'lg:text-xl' : ''}>
            <a
              className={`hover:underline underline-offset-2 ${
                isFullImage ? 'text-base-100' : 'text-text-color'
              }`}
              href={product.url}
            >
              {product.name}
            </a>
          </h5>
          {isSpecial && product.subtitle ? (
            <p className="text-sm opacity-80">{product.subtitle}</p>
          ) : null}
          {price}
        </div>

        {isSpecial && product.discount_ends ? (
          <div className="h-full w-full text-center">
            <p className="text-sm opacity-65">
              {deadlineText ?? t('pages.product_card.discount_ends', 'Discount ends in')}
            </p>
            <SallaCountDown
              size="sm"
              date={countdownDate(product.discount_ends)}
              boxed={!notBoxedCountDown}
              labeled
            />
          </div>
        ) : null}

        {withoutAddButton ? null : (
          <div className="w-full custom-add-to-cart-button">
            <SallaAddProductButton
              width="wide"
              className="no-background"
              productId={product.id}
              productStatus={addButtonStatus}
              productType={product.type}
              hasPreOrder={product.has_preorder_campaign}
            >
              {product.status === 'sale' ? (
                <i
                  className={`text-base mx-2 sicon-${
                    product.type === 'booking' ? 'calendar-time' : 'shopping-bag'
                  }`}
                />
              ) : null}
              <span>{addButtonLabel}</span>
            </SallaAddProductButton>
          </div>
        )}
      </div>
    </div>
  );
});
