import { memo } from 'react';
import { SallaButton } from '@salla.sa/twilight-components-react/button';

export interface PhotoAndTextData {
  image?: string;
  main_title?: string;
  sub_text?: string;
  link_title?: string;
  link_url?: string;
  [key: string]: unknown;
}

/**
 * `photo-and-text` home block — a split card (photo + copy) with an optional
 * call-to-action. Ported from the Twig theme's `home/photo-and-text.twig`.
 */
export const PhotoAndText = memo(function PhotoAndText({ data }: { data: PhotoAndTextData }) {
  const {
    image,
    main_title: mainTitle,
    sub_text: subText,
    link_title: linkTitle,
    link_url: linkUrl,
  } = data;

  return (
    <div className="container">
      <div className="flex flex-col sm:flex-row border-2 border-bc rounded-neo shadow-neo overflow-hidden sm:max-h-[80dvh]">
        <img
          className="lazy w-full object-cover border-b-2 sm:border-b-0 sm:ltr:border-r-2 sm:rtl:border-l-2 border-bc"
          src={image}
          alt={mainTitle || ''}
          loading="lazy"
          decoding="async"
        />
        <div className="w-full p-8 md:p-14 flex flex-col gap-6 lg:gap-8 justify-center">
          <h2 className="text-xl md:text-2xl lg:text-3xl">{mainTitle}</h2>
          {subText ? <p className="text-sm md:text-base lg:text-lg">{subText}</p> : null}
          {linkTitle && linkUrl ? <SallaButton href={linkUrl}>{linkTitle}</SallaButton> : null}
        </div>
      </div>
    </div>
  );
});
