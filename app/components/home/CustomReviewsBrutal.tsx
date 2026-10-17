import { memo } from 'react';
import { SallaSlider } from '@salla.sa/twilight-components-react/slider';
import { SallaRatingStars } from '@salla.sa/twilight-components-react/rating-stars';

interface CustomReview {
  profile_img?: string;
  name?: string;
  text?: string;
  stars?: number | string;
}

export interface CustomReviewsBrutalData {
  title?: string;
  reviews?: CustomReview[];
  position?: number;
  [key: string]: unknown;
}

/**
 * `custom-reviews-brutal` home block — merchant-authored testimonials in the
 * brutal card style (avatar chip, quote marks, stars). Ported from the Twig
 * theme's `home/custom-reviews-brutal.twig`.
 */
export const CustomReviewsBrutal = memo(function CustomReviewsBrutal({
  data,
}: {
  data: CustomReviewsBrutalData;
}) {
  const { title, reviews = [], position = 0 } = data;

  if (!reviews.length) return null;

  return (
    <div className="container">
      <SallaSlider
        id={`brutal-reviews-custom-${position}`}
        type="fullwidth"
        className="brutal-reviews-slider"
        showControls
        blockTitle={title}
        autoPlay
      >
        <div slot="items">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="mx-6 flex rounded-neo shadow-neo min-h-80 border-2 border-bc bg-base-50 w-[80%] md:w-1/2 xl:w-1/3 relative"
            >
              <div className="border-2 rounded-full border-bc w-20 h-20 md:w-24 md:h-24 absolute overflow-hidden -translate-x-1/2 -translate-y-1/2 top-0 left-1/2">
                <img
                  className="w-full h-full object-cover"
                  src={review.profile_img}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </div>

              <div className="w-full flex flex-col text-center gap-5 justify-between px-4 py-6">
                <div className="w-full h-10 flex justify-between px-6">
                  <i className="sicon-quote text-bc text-3xl ltr:rotate-180" />
                  <i className="sicon-quote text-bc text-3xl rtl:rotate-180" />
                </div>
                <div className="h-full flex justify-center items-center">
                  <p className="text-base text-text-color opacity-80 line-clamp-5">
                    {review.text}
                  </p>
                </div>
                <div className="flex flex-col">
                  <SallaRatingStars value={Number(review.stars) || 0} />
                  <span className="text-lg">{review.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SallaSlider>
    </div>
  );
});
