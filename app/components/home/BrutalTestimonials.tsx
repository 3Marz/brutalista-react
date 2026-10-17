import { memo } from 'react';
import { SallaReviews } from '@salla.sa/twilight-components-react/reviews';

const SORT_MAP: Record<string, 'top_rating' | 'random' | 'latest'> = {
  highest: 'top_rating',
  random: 'random',
  newest: 'latest',
};

export interface BrutalTestimonialsData {
  title?: string;
  order_by?: string;
  hide_names?: boolean;
  limit?: number | string;
  display_all_url?: boolean;
  [key: string]: unknown;
}

/**
 * `brutal_testimonials` home block — the store's reviews in a slider.
 *
 * Replaces the Twig theme's `<brutal-reviews>` custom element with the engine's
 * {@link SallaReviews} (which itself renders a `salla-slider`), styled to the
 * brutal card look by `.s-block--brutal_testimonials` in
 * `04-components/home-blocks.scss`.
 */
export const BrutalTestimonials = memo(function BrutalTestimonials({
  data,
}: {
  data: BrutalTestimonialsData;
}) {
  const {
    title,
    order_by: orderBy,
    hide_names: hideNames,
    limit,
    display_all_url: displayAllUrl,
  } = data;

  return (
    <div className="container overflow-hidden">
      {title ? (
        <div className="s-block__title">
          <div className="right-side">
            <h2>{title}</h2>
          </div>
        </div>
      ) : null}

      <SallaReviews
        limit={limit !== undefined ? Number.parseInt(String(limit), 10) || 5 : 5}
        sort={SORT_MAP[orderBy || ''] ?? 'latest'}
        type="store"
        {...(hideNames ? { hideCustomerInfo: true } : {})}
        {...(displayAllUrl ? { displayAllLink: true } : {})}
      />
    </div>
  );
});
