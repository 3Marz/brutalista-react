import { memo, type CSSProperties } from 'react';

export interface SeparatorData {
  theme_colors?: boolean;
  border_color?: string;
  border_style?: string;
  border_width?: number | string;
  [key: string]: unknown;
}

/**
 * `separator` home block — a single rule whose width, style and colour the
 * merchant picks. Ported from the Twig theme's `home/separator.twig`.
 */
export const Separator = memo(function Separator({ data }: { data: SeparatorData }) {
  const {
    theme_colors: themeColors,
    border_color: borderColor,
    border_style: borderStyle,
    border_width: borderWidth = 1,
  } = data;

  const style: CSSProperties = {
    borderTopWidth: `${borderWidth}px`,
    borderStyle: borderStyle || 'solid',
    borderColor: themeColors ? 'var(--base-300)' : borderColor || 'var(--bc)',
  };

  return <div style={style} />;
});
