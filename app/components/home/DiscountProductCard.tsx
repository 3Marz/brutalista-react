import { memo } from 'react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { SallaAddProductButton } from '@salla.sa/twilight-components-react/add-product-button';
import { SallaButton } from '@salla.sa/twilight-components-react/button';
import { SallaCountDown } from '@salla.sa/twilight-components-react/count-down';
import { openQuickView } from '../../lib/quickView';

/**
 * `new Date(...)` → `YYYY-M-D`, matching the Twig `discount-product-card`
 * countdown. `discount_ends` is normally an ISO string, but older API
 * payloads send a Unix timestamp (seconds), which the Twig card multiplied
 * by 1000. Support both.
 */
function countdownDate(value: string): string {
  const numeric = /^\d+$/.test(value) ? Number(value) : null;
  const date = numeric ? new Date(numeric * 1000) : new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export interface DiscountProductCardProps {
  product: Product;
}

/**
 * Port of the Twig theme's `discount-product-card` custom element
 * (`src/assets/js/partials/discount-product-card.js`).
 *
 * The `offers-products` block renders one of these per offer: a wide
 * horizontal card with the image on one side and the title, price, optional
 * countdown, add-to-cart and quick-view buttons centred on the other. Kept
 * separate from {@link BrutalProductCard} because the offer card has its own
 * fixed `md:h-96` layout and no wishlist/badge actions.
 */
export const DiscountProductCard = memo(function DiscountProductCard({
  product,
}: DiscountProductCardProps) {
  const { format } = useMoney();
  const { store } = useTwilight();
  const { t } = useTranslation();

  const showDash = store?.settings?.product?.show_price_as_dash;
  const formatPrice = (price: number | string | null | undefined) => {
    if (price == null || price === '' || Number(price) === 0) return showDash ? '-' : '';
    return format(price);
  };

  // Same label precedence as the Twig custom element.
  const addButtonLabel =
    product.add_to_cart_label ||
    (product.status === 'sale' && product.type === 'booking'
      ? t('pages.cart.book_now', 'Book now')
      : product.status === 'sale'
        ? t('pages.cart.add_to_cart', 'Add to Cart')
        : product.type !== 'donating'
          ? t('pages.products.out_of_stock', 'Out of Stock')
          : t('pages.products.donation_exceed', 'Donation amount exceeded'));

  const price = product.is_on_sale ? (
    <div className="s-product-card-sale-price">
      <h4>{formatPrice(product.sale_price)}</h4>
      <span>{formatPrice(product.regular_price)}</span>
    </div>
  ) : product.starting_price ? (
    <div className="s-product-card-starting-price">
      <p>{t('pages.products.starting_price', 'Starting from')}</p>
      <h4>{formatPrice(product.starting_price)}</h4>
    </div>
  ) : (
    <h4 className="s-product-card-price">{formatPrice(product.price)}</h4>
  );

  // List responses normally have `image.url`; the Twig card also fell back to
  // the legacy `thumbnail` field.
  const image =
    product.image?.url || (product as Product & { thumbnail?: string }).thumbnail;

  return (
    <div className="discount-product-card my-6 overflow-hidden flex flex-col md:flex-row w-full md:h-96 border-2 border-bc rounded-neo shadow-neo">
      <a
        href={product.url}
        className="w-full h-80 md:h-auto border-b-2 md:border-b-0 md:ltr:border-r-2 md:rtl:border-l-2 border-bc"
      >
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={product.image?.alt ?? product.name}
          loading="lazy"
          decoding="async"
        />
      </a>

      <div className="w-full h-72 md:h-auto p-3 md:p-0 flex flex-col gap-2 md:gap-3 justify-center items-center">
        <a
          href={product.url}
          className="text-base md:text-lg font-normal hover:underline underline-offset-4"
        >
          {product.name}
        </a>

        {price}

        {product.discount_ends ? (
          <div className="w-full text-center">
            <SallaCountDown
              className="*:!my-0"
              size="sm"
              date={countdownDate(product.discount_ends)}
              boxed={false}
              labeled
            />
          </div>
        ) : null}

        <div className="discount-product-card__actions">
          <SallaAddProductButton
            className=""
            width="wide"
            productId={product.id}
            productStatus={product.status}
            productType={product.type}
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

          <SallaButton
            size="medium"
            shape="icon"
            color="light"
            name={`product-name-${product.id}`}
            ariaLabel={t('pages.products.quick_view', 'Quick view product')}
            className="no-background quick-view-offer"
            onClick={() => openQuickView(Number(product.id))}
          >
            <i className="sicon-eye" />
          </SallaButton>
        </div>
      </div>
    </div>
  );
});
