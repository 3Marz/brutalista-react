import { memo, type CSSProperties } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { scalar } from '../../lib/blockValue';

interface PhotoLink {
  name?: string;
  image?: string;
  url?: string;
}

export interface SquarePhotosData {
  title?: string;
  links?: PhotoLink[];
  [key: string]: unknown;
}

/**
 * `square-photos` home block — three photo tiles where the middle tile doubles
 * in size. Ported from the Twig theme's `home/square-photos.twig`. Overrides the
 * engine's own `home:square-photos`.
 */
export const SquarePhotos = memo(function SquarePhotos({ data }: { data: SquarePhotosData }) {
  const { theme } = useTwilight();
  const { title, links = [] } = data;

  if (!links.length) return null;

  const size = scalar(theme?.settings?.squar_photo_bg_image_size) || 'cover';

  return (
    <div className="container">
      {title ? (
        <div className="s-block__title">
          <div className="right-side">
            <h2>{title}</h2>
          </div>
        </div>
      ) : null}

      <div className="grid md:grid-cols-3 md:grid-flow-col gap-5">
        {links.map((link, index) => (
          <Link
            key={index}
            to={link.url || '#'}
            className={`flex group flex-col gap-2 w-full h-full min-w-0 min-h-0 ${
              index === 2 ? 'row-span-2 col-span-2' : ''
            }`}
          >
            <div className="w-full h-full rounded-neo overflow-hidden aspect-[4/3] border-2 border-bc shadow-neo">
              <img
                className="lazy w-full h-full transition group-hover:scale-105 duration-300"
                style={{ objectFit: size as CSSProperties['objectFit'] }}
                src={link.image}
                alt={link.name || ''}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="text-lg md:text-xl items-center flex gap-2">
              <p>{link.name}</p>
              <i className="group-hover:ltr:translate-x-1 group-hover:rtl:-translate-x-1 rtl:rotate-180 transition sicon-arrow-right" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
