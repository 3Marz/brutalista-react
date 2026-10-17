import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { scalar } from '../../lib/blockValue';

interface Banner {
  image?: string;
  url?: string;
  title?: string;
}

export interface SquareBannerBrutalData {
  banners?: Banner[];
  [key: string]: unknown;
}

/**
 * `square-banner-brutal` home block — a mosaic of 6 background-image tiles with
 * a floating caption chip. Ported from the Twig theme's
 * `home/square-banner-brutal.twig`; the object-fit setting is shared with
 * `squar_photo_bg_image_size`.
 */
export const SquareBannerBrutal = memo(function SquareBannerBrutal({
  data,
}: {
  data: SquareBannerBrutalData;
}) {
  const { theme } = useTwilight();
  const banners = data.banners ?? [];

  if (!banners.length) return null;

  const size = scalar(theme?.settings?.squar_photo_bg_image_size) || 'cover';

  return (
    <div className="container">
      {/* Big screens: 3×3 mosaic, tiles 0/2/3 span two rows. */}
      <div className="hidden md:grid w-full h-[40rem] grid-cols-3 grid-rows-3 gap-4">
        {banners.map((banner, index) => (
          <Link
            key={index}
            to={banner.url || '#'}
            className={`text-text-color p-4 group flex justify-center items-end rounded-neo border-2 border-bc bg-center bg-no-repeat ${
              index === 0 || index === 2 || index === 3 ? 'row-span-2' : ''
            }`}
            style={{
              backgroundImage: banner.image ? `url(${banner.image})` : undefined,
              backgroundSize: size,
            }}
          >
            <div className="p-2 border border-bc rounded-neo bg-base-100 transition group-hover:-translate-y-2 shadow-neo">
              <p className="text-base font-bold">{banner.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Small screens: 2×5 mosaic, tiles 0/2/3/4 span two rows. */}
      <div className="grid md:hidden w-full h-[45rem] grid-cols-2 grid-rows-5 gap-3">
        {banners.map((banner, index) => (
          <Link
            key={index}
            to={banner.url || '#'}
            className={`text-text-color p-2 group flex justify-center items-end rounded-neo border-2 border-bc bg-center bg-no-repeat ${
              index === 0 || index === 2 || index === 3 || index === 4 ? 'row-span-2' : ''
            }`}
            style={{
              backgroundImage: banner.image ? `url(${banner.image})` : undefined,
              backgroundSize: size,
            }}
          >
            <div className="p-2 border border-bc rounded-neo bg-base-100 transition group-hover:-translate-y-2">
              <p className="text-xs font-bold sm:text-sm">{banner.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
