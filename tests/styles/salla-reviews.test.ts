// @vitest-environment node
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, it, expect } from 'vitest';
import * as sass from 'sass';
import postcss, { type Root } from 'postcss';
import tailwindcss from 'tailwindcss';

const themeRoot = fileURLToPath(new URL('../../', import.meta.url));
const tailwindConfig = createRequire(import.meta.url)(`${themeRoot}tailwind.config.cjs`);

let root: Root;

beforeAll(async () => {
  // `home-blocks.scss` extends slider selectors, so compile the whole stylesheet.
  const { css } = sass.compile(`${themeRoot}app/styles/app.scss`);
  const result = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: '' }] }),
  ]).process(css, { from: undefined });
  root = result.root;
});

function declarations(selector: string, media?: string): Record<string, string> {
  const decls: Record<string, string> = {};

  root.walkRules((rule) => {
    if (!rule.selectors.includes(selector)) return;
    if (media && (rule.parent.type !== 'atrule' || rule.parent.params !== media)) return;

    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
    });
  });

  return decls;
}

describe('SallaReviews styles', () => {
  it('applies the Brutal card at every mount point', () => {
    const card = declarations('salla-reviews .s-reviews-testimonial');

    expect(card['border-width']).toBe('2px');
    expect(card['border-color']).toBe('var(--bc)');
    expect(card['border-radius']).toBe('var(--br)');
    expect(card['background-color']).toBe('var(--base-50)');
    expect(card['--tw-shadow']).toBe('var(--neo-shadow)');
  });

  it('makes the component block-level', () => {
    expect(declarations('salla-reviews').display).toBe('block');
  });

  it('restyles the built-in heading where the theme has no title of its own', () => {
    const wrapper = declarations('salla-reviews .s-reviews-header-wrapper');
    const heading = declarations('salla-reviews .s-reviews-header');

    expect(wrapper['justify-content']).toBe('center');
    expect(wrapper['margin-bottom']).toBe('1rem');
    expect(heading['font-size']).toBe('1.25rem');
    expect(heading['font-weight']).toBe('700');
    expect(heading['text-decoration-line']).toBe('underline');
    expect(heading.color).toBe('var(--text-color)');
  });

  it('stacks the card and hides the arrows on phones', () => {
    const mobile = '(max-width: 767px)';

    expect(
      declarations('salla-reviews .s-reviews-testimonial__inner', mobile)['flex-direction']
    ).toBe('column');
    expect(declarations('salla-reviews .s-reviews-testimonial__text', mobile).width).toBe('100%');
    expect(declarations('salla-reviews .s-slider-block__title-nav', mobile).display).toBe('none');
    expect(
      declarations('salla-reviews .s-reviews-container .swiper', mobile)['padding-inline']
    ).toBe('1rem');
  });

  it('keeps the built-in heading hidden inside the home block', () => {
    expect(
      declarations('.s-block--brutal_testimonials .s-reviews-header-wrapper').display
    ).toBe('none');
  });

  it('collapses when there are no review slides', () => {
    expect(declarations('salla-reviews:not(:has(.s-reviews-swiper-slide))').display).toBe('none');
  });
});
