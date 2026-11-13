// @vitest-environment node
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import * as sass from 'sass';
import postcss, { type Root } from 'postcss';
import tailwindcss from 'tailwindcss';

const themeRoot = fileURLToPath(new URL('../../', import.meta.url));
const tailwindConfig = createRequire(import.meta.url)(`${themeRoot}tailwind.config.cjs`);

async function compile(file: string): Promise<Root> {
  const { css } = sass.compile(`${themeRoot}app/styles/04-components/${file}`);
  const result = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: '' }] }),
  ]).process(css, { from: undefined });
  return result.root;
}

/** Declarations from top-level rules only, so responsive overrides don't win. */
function declarations(root: Root, selector: string): Record<string, string> {
  const decls: Record<string, string> = {};
  root.walkRules((rule) => {
    if (rule.parent !== root || !rule.selectors.includes(selector)) return;
    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
    });
  });
  return decls;
}

describe('horizontal product card', () => {
  it('uses one even card frame instead of the utility bottom padding', async () => {
    const root = await compile('product-list.scss');
    const card = declarations(
      root,
      '.s-products-list-horizontal-cards .s-product-card-horizontal'
    );

    expect(card.padding).toBe('0.75rem');
    expect(card.gap).toBe('0.75rem');
    expect(card['border-width']).toBe('2px');
    expect(card['border-radius']).toBe('var(--br)');
    expect(card['background-color']).toBe('var(--base-50)');
    expect(card['--tw-shadow']).toBe('var(--neo-shadow)');
  });

  it('lets the card frame own the image border and shadow', async () => {
    const root = await compile('product-list.scss');
    const image = declarations(
      root,
      '.s-products-list-horizontal-cards .s-product-card-horizontal > div:first-child'
    );

    expect(image.width).toBe('6rem');
    expect(image['aspect-ratio']).toBe('auto');
    expect(image['border-width']).toBe('0px');
    expect(image['--tw-shadow']).toBe('0 0 #0000');
  });

  it('gives the add-to-cart button the theme border and shadow', async () => {
    const root = await compile('product-list.scss');
    const button = declarations(
      root,
      '.s-products-list-horizontal-cards .s-product-card-horizontal salla-add-product-button .s-button-btn'
    );

    expect(button.height).toBe('2.25rem');
    expect(button['border-width']).toBe('2px');
    expect(button['border-radius']).toBe('var(--br)');
    expect(button['--tw-shadow']).toBe('var(--neo-shadow)');
  });
});
