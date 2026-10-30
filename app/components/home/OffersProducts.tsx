import { memo, Suspense, useCallback } from 'react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { product } from '@salla.sa/twilight-theme-engine/api/product';
import { SallaSlider } from '@salla.sa/twilight-components-react/slider';
import { SallaProductsList, ProductsListSkeleton } from '@salla.sa/twilight-components-react';
import { DiscountProductCard } from './DiscountProductCard';
import { firstId } from '../../lib/blockValue';

interface Offer {
  title?: string;
  product?: unknown;
}

export interface OffersProductsData {
  offers?: Offer[];
  position?: number;
  [key: string]: unknown;
}

/**
 * `offers-products` home block — a centered slider where each slide pairs an
 * offer title with its product card.
 *
 * Uses {@link DiscountProductCard}, the React port of the Twig theme's
 * `<discount-product-card>` custom element, so each slide keeps the same wide
 * image + details card as `master`.
 */
export const OffersProducts = memo(function OffersProducts({
  data,
}: {
  data: OffersProductsData;
}) {
  const { offers = [], position = 0 } = data;

  const ids = offers
    .map((offer) => firstId(offer.product))
    .filter((id): id is number => id !== null);

  const loader = useCallback(
    () => product.list({ source: 'selected', sourceValue: ids, perPage: ids.length }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ids.join(',')]
  );

  if (!offers.length || !ids.length) return null;

  return (
    <div className="container overflow-hidden">
      <Suspense fallback={<ProductsListSkeleton />}>
        <SallaProductsList loader={loader}>
          {(items: Product[]) => (
            <SallaSlider
              type="fullwidth"
              centered
              className="discount-offer-slider"
              showControls
              id={`offers-products-slider-${position}`}
            >
              <div slot="items">
                {offers.map((offer, index) => {
                  const id = firstId(offer.product);
                  // List responses send product ids as numeric strings.
                  const item = items.find((entry) => Number(entry.id) === id);
                  return (
                    <div
                      key={index}
                      className="offer-product-swiper mx-3 md:mx-4 flex flex-col gap-4"
                    >
                      <h2 className="text-lg text-center underline underline-offset-8 md:text-xl font-bold">
                        {offer.title}
                      </h2>
                      {item ? <DiscountProductCard product={item} /> : null}
                    </div>
                  );
                })}
              </div>
            </SallaSlider>
          )}
        </SallaProductsList>
      </Suspense>
    </div>
  );
});
