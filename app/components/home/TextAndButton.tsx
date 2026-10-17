import { memo } from 'react';
import { SallaButton } from '@salla.sa/twilight-components-react/button';

export interface TextAndButtonData {
  title?: string;
  text?: string;
  button_title?: string;
  url?: string;
  doted_bg?: boolean;
  [key: string]: unknown;
}

/**
 * `text_and_button` home block — a centered call-to-action, optionally over a
 * dotted backdrop (`.dots-bg`, `02-generic/common.scss`). Ported from the Twig
 * theme's `home/text_and_button.twig`.
 */
export const TextAndButton = memo(function TextAndButton({ data }: { data: TextAndButtonData }) {
  const {
    title,
    text,
    button_title: buttonTitle,
    url,
    doted_bg: dotedBg,
  } = data;

  return (
    <div className={`w-full p-8 md:p-0 flex justify-center items-center ${dotedBg ? 'dots-bg min-h-80' : ''}`}>
      <div
        className={`rounded-neo md:max-w-1/2 text-center bg-base-100 gap-3 md:gap-5 flex flex-col items-center border-bc ${
          dotedBg ? 'border-2 px-6 py-3 md:py-5' : ''
        }`}
      >
        {title ? (
          <h2 className="font-bold text-lg md:text-xl lg:text-2xl">{title}</h2>
        ) : null}

        <p className="opacity-85 lg:text-lg">{text}</p>

        {buttonTitle && url ? <SallaButton href={url}>{buttonTitle}</SallaButton> : null}
      </div>
    </div>
  );
});
