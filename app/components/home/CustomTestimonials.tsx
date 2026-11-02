import { memo } from 'react';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { SallaRatingStars } from '@salla.sa/twilight-components-react/rating-stars';
import { TestimonialsCarousel, type TestimonialItem } from '../common/TestimonialsCarousel';

export interface CustomTestimonialsProps {
  data: {
    items: TestimonialItem[];
    title?: string;
    description?: string;
    position?: number;
    [key: string]: unknown;
  };
}

/**
 * The engine's `salla-reviews` markup is styled by the web component, so the
 * brutal review card is rendered here instead. It follows the Twig
 * `home/custom-testimonials.twig` card: a bordered, shadowed card with the
 * avatar straddling the top edge, a quote mark, the review text, stars and name.
 */
function BrutalTestimonialCard({ item, index }: { item: TestimonialItem; index: number }) {
  const name = item.name?.trim();

  return (
    <article className="s-reviews-testimonial" data-testimonial-card>
      <span className="s-reviews-testimonial__icon" aria-hidden="true">
        <i className="sicon-quote" />
      </span>

      {item.avatar && (
        <div className="s-reviews-testimonial__avatar">
          <img
            src={item.avatar}
            alt={name || `testimonial-${index}`}
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        </div>
      )}

      <div className="s-reviews-testimonial__inner">
        <div className="s-reviews-testimonial__text">
          <p>{item.text}</p>
          <div className="s-reviews-testimonial__name_wrapper">
            <div className="s-reviews-testimonial__rating">
              <SallaRatingStars value={Number(item.stars) || 0} />
            </div>
            <div className="s-reviews-testimonial__info">
              <h2>{name}</h2>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * `custom-testimonials` home block — merchant-authored reviews. The shared
 * {@link TestimonialsCarousel} handles the horizontal scroller and controls;
 * this block supplies the brutal card markup so it can be styled by the theme
 * (the engine-owned `salla-reviews` internals cannot).
 */
export const CustomTestimonials = memo(function CustomTestimonials({
  data,
}: CustomTestimonialsProps) {
  const { t } = useTranslation();
  const { items, title, description } = data;

  if (!items?.length) return null;

  return (
    <TestimonialsCarousel
      items={items}
      title={title || t('blocks.home.testimonials', 'Customer reviews')}
      description={description}
      renderItem={(item, index) => <BrutalTestimonialCard item={item} index={index} />}
    />
  );
});
