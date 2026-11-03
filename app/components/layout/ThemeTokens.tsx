import { darken, lighten } from '../../lib/themeColor';

/**
 * Theme settings that drive the Brutal design system, mirroring `master.twig`'s
 * inline `:root { … }` block. The engine only injects its own colour/font tokens
 * (`--color-primary`, `--font-main`, …); these are theme-specific, so the theme
 * has to emit them itself.
 *
 * Keys are the `id`s from `twilight.json`: `bg_color`, `border_color`,
 * `shadow_color`, `text_color`, `border-radius`, `x_shadow_offset`,
 * `y_shadow_offset`.
 */
export type BrutalTokenSettings = Record<string, unknown>;

const DEFAULTS = {
  borderColor: '#3d081b',
  base: '#f2efdd',
  textColor: '#000000',
  shadowColor: '#3d081b',
  xShadow: 0,
  yShadow: 3,
} as const;

function asColor(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === 'number' ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
}

/** Build the `:root { … }` declarations for the Brutal tokens. */
export function themeTokensCss(settings?: BrutalTokenSettings): string {
  const s = settings ?? {};

  const radius = s['border-radius'] === false ? '0rem' : '0.75rem';
  const borderColor = asColor(s.border_color, DEFAULTS.borderColor);
  const base = asColor(s.bg_color, DEFAULTS.base);
  const textColor = asColor(s.text_color, DEFAULTS.textColor);
  const shadowColor = asColor(s.shadow_color, DEFAULTS.shadowColor);
  const x = asNumber(s.x_shadow_offset, DEFAULTS.xShadow);
  const y = asNumber(s.y_shadow_offset, DEFAULTS.yShadow);

  return [
    ':root{',
    `--br:${radius};`,
    `--bc:${borderColor};`,
    `--bc-dark:${darken(borderColor, 0.25)};`,
    `--bc-light:${lighten(borderColor, 0.25)};`,
    `--base:${base};`,
    `--base-50:${lighten(base, 0.65)};`,
    `--base-100:${base};`,
    `--base-200:${darken(base, 0.18)};`,
    `--base-300:${darken(base, 0.28)};`,
    `--text-color:${textColor};`,
    `--x-shadow-offset:${x}px;`,
    `--y-shadow-offset:${y}px;`,
    `--neo-shadow:var(--x-shadow-offset) var(--y-shadow-offset) ${shadowColor};`,
    // Static palette (master.twig hard-coded these; the engine does not).
    '--success:#00B74A;',
    '--danger:#ef4444;',
    '--warning:#fbc524;',
    '--my-dark:#0E0F0F;',
    '--my-gray:#4c4d4b;',
    '--light:#e8e8e8;',
    '}',
  ].join('');
}

export const THEME_TOKENS_STYLE_ID = 'salla-theme-tokens';

/**
 * Server-rendered `<style>` with the Brutal tokens. Mounted in the root `<head>`
 * so the values are present on first paint (no FOUC); `ThemeLayout` keeps the
 * element in sync when the settings change (preview / dev panel).
 */
export function ThemeTokens({ settings }: { settings?: BrutalTokenSettings }) {
  return (
    <style
      id={THEME_TOKENS_STYLE_ID}
      dangerouslySetInnerHTML={{ __html: themeTokensCss(settings) }}
    />
  );
}
