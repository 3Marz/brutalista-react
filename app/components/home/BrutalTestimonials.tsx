import { memo } from 'react';
import { SallaReviews } from '@salla.sa/twilight-components-react/reviews';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

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
 * The storefront sends a localized string in `title`; the dev editor keeps
 * multilingual values under `ar` / `en`. Read both so the heading works in
 * preview as well as in production.
 */
function pickTitle(data: BrutalTestimonialsData, locale: string): string | undefined {
  const direct = typeof data.title === 'string' ? data.title.trim() : '';
  if (direct) return direct;

  const candidates = [locale, 'ar', 'en'];
  for (const key of candidates) {
    const value = data[key];
    const title =
      value && typeof value === 'object' ? (value as { title?: unknown }).title : undefined;
    if (typeof title === 'string' && title.trim()) return title.trim();
  }

  return undefined;
}

/**
 * `brutal_testimonials` home block — the store's reviews through the engine's
 * {@link SallaReviews}. SallaReviews owns the review cards and slider, but it
 * has no `title` prop; the theme renders the heading and the "View All" link
 * above it, and hides SallaReviews' own header.
 */
export const BrutalTestimonials = memo(function BrutalTestimonials({
  data,
}: {
  data: BrutalTestimonialsData;
}) {
  const { t, locale } = useTranslation();
  const title = pickTitle(data, locale);
  const {
    order_by: orderBy,
    hide_names: hideNames,
    limit,
    display_all_url: displayAllUrl,
  } = data;

  return (
    <div className="container overflow-hidden">
      {(title || displayAllUrl) && (
        <div className="s-block__title">
          <div className="right-side flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
            {title && <h2 className="!mb-0">{title}</h2>}
            {displayAllUrl && (
              <Link to="/testimonials" className="s-block__display-all">
                {t('blocks.home.display_all', 'View All')}
                <i className="sicon-arrow-left" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      )}

      <SallaReviews
        limit={limit !== undefined ? Number.parseInt(String(limit), 10) || 5 : 5}
        sort={SORT_MAP[orderBy || ''] ?? 'latest'}
        type="store"
        {...(hideNames ? { hideCustomerInfo: true } : {})}
      />
    </div>
  );
});
