import { memo } from 'react';

export interface MarqueeData {
  moving_text?: string;
  animation_speed?: number | string;
  top_margin?: boolean;
  default_colors?: boolean;
  bg_color?: string;
  border_color?: string;
  text_color?: string;
  [key: string]: unknown;
}

/**
 * `marquee` home block — an infinite scrolling text strip.
 * Ported from the Twig theme's `home/marquee.twig`; the keyframes live in
 * `04-components/marquee.scss` and the wrapper classes come from
 * `marqueeConfig` in `app/router.tsx`.
 */
export const Marquee = memo(function Marquee({ data }: { data: MarqueeData }) {
  const {
    moving_text: movingText,
    animation_speed: animationSpeed = 20,
    default_colors: defaultColors,
    bg_color: bgColor,
    border_color: borderColor,
    text_color: textColor,
  } = data;

  if (!movingText) return null;

  const style = defaultColors
    ? undefined
    : {
        backgroundColor: bgColor || undefined,
        borderColor: borderColor || undefined,
        color: textColor || undefined,
      };

  return (
    <div
      className={`marquee-container w-full whitespace-nowrap flex overflow-hidden py-2 border-y-2 ${
        defaultColors ? 'bg-primary border-bc text-base-100' : ''
      }`}
      style={style}
    >
      {Array.from({ length: 11 }, (_, i) => (
        <div
          // A static settings value repeated 11 times; there is no id to key on.
          // react-doctor-disable-next-line react-doctor/no-array-index-as-key
          key={i}
          className="text-sm md:text-base px-5 rtl:animate-[marquee-effect-rtl_linear_infinite] ltr:animate-[marquee-effect-ltr_linear_infinite]"
          style={{ animationDuration: `${animationSpeed}s` }}
        >
          {movingText}
        </div>
      ))}
    </div>
  );
});
