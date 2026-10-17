import { memo } from 'react';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { SallaSlider } from '@salla.sa/twilight-components-react/slider';

interface Banner {
  image?: string;
  url?: string;
}

export interface BannersBrutalData {
  banners?: Banner[];
  rounded_banners?: boolean;
  position?: number;
  [key: string]: unknown;
}

/**
 * `banners_brutal` home block — a centered, looping banner carousel. Ported from
 * the Twig theme's `home/banners_brutal.twig`.
 */
export const BannersBrutal = memo(function BannersBrutal({ data }: { data: BannersBrutalData }) {
  const { store } = useTwilight();
  const { banners = [], rounded_banners: roundedBanners, position = 0 } = data;

  if (!banners.length) return null;

  return (
    <SallaSlider
      type="carousel"
      autoPlay
      pagination
      centered
      showControls={false}
      id={`brutal-banner-${position}`}
      className="banner-slider"
    >
      <div slot="items">
        {banners.map((banner, index) => (
          <div key={index} className="w-full !px-[0.625rem]">
            <a href={banner.url || '#'}>
              <img
                loading="eager"
                src={banner.image}
                className={`w-full object-contain ${roundedBanners ? 'rounded-xl' : ''}`}
                alt={`${store?.name || ''} banner-slider-${index}`}
              />
            </a>
          </div>
        ))}
      </div>
    </SallaSlider>
  );
});
