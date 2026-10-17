/**
 * Hex colour helpers matching Salla's `lighter`/`darker` used by the Twig theme's
 * `master.twig` (`theme.color.lighter(0.075, bg)`) and by the engine's own
 * `themeCssVars`. Kept local because the engine keeps its copy private.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function hexToRgb(hex: string): Rgb {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex ?? '');
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
        return hex.length === 1 ? `0${hex}` : hex;
      })
      .join('')
  );
}

/** Darken a hex colour by `amount` (0-1). */
export function darken(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 - Math.max(0, Math.min(1, amount));
  return rgbToHex(r * factor, g * factor, b * factor);
}

/** Lighten a hex colour by `amount` (0-1). */
export function lighten(hex: string, amount: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = Math.max(0, Math.min(1, amount));
  return rgbToHex(
    r + (255 - r) * factor,
    g + (255 - g) * factor,
    b + (255 - b) * factor
  );
}
