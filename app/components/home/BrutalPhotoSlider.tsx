import { memo } from 'react';
import { Link, Image } from '@salla.sa/twilight-theme-engine/common';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { ScrollCarousel } from '../common/ScrollCarousel';

interface PhotoItem {
  id?: string | number;
  url?: string;
  link_type?: string;
  image?: string;
}

export interface BrutalPhotoSliderProps {
  data: {
    items?: PhotoItem[];
    position?: number;
    is_repeated?: boolean;
    [key: string]: unknown;
  };
}

/**
 * `brutal-photo-slider` home block, ported from the Twig theme's
 * `home/photos-slider.twig`.
 *
 * The Twig block was a Swiper carousel. This keeps the theme's newer
 * {@link ScrollCarousel} (drag, progress bar, arrows) with the chosen
 * 1200×500 frame: full-width on small screens, 80% from `lg`, and an
 * `object-contain` image with the old `rounded-neo` frame.
 *
 * `PhotosSlider` remains the default `photos-slider` block; this variant is
 * added to `twilight.json` as a separate merchant block.
 */
export const BrutalPhotoSlider = memo(function BrutalPhotoSlider({
  data,
}: BrutalPhotoSliderProps) {
  const { t } = useTranslation();
  const items = data.items || [];

  if (!items.length) return null;

  return (
    <ScrollCarousel
      prevLabel={t('blocks.home.reviews_prev', 'Previous')}
      nextLabel={t('blocks.home.reviews_next', 'Next')}
    >
      {items.map((item, index) => (
        <Link
          key={item.id ?? `${item.url ?? ''}:${item.image ?? ''}`}
          to={item.url || '#'}
          className="s-brutal-photo-slider__slide"
        >
          <Image
            src={item.image}
            className="w-full h-full object-contain rounded-neo"
            alt={`image-slider-${index}`}
            width={1200}
            height={500}
            priority={index === 0}
          />
        </Link>
      ))}
    </ScrollCarousel>
  );
});
