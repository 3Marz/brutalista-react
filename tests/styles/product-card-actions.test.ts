// @vitest-environment node
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import * as sass from 'sass';
import postcss, { type AtRule, type Root } from 'postcss';
import tailwindcss from 'tailwindcss';

const themeRoot = fileURLToPath(new URL('../../', import.meta.url));
const tailwindConfig = createRequire(import.meta.url)(`${themeRoot}tailwind.config.cjs`);

/** `product.scss` uses a mixin from the generic layer, so compile both. */
async function compileProduct(): Promise<Root> {
  const mixins = readFileSync(`${themeRoot}app/styles/02-generic/_mixins.scss`, 'utf8');
  const product = readFileSync(`${themeRoot}app/styles/04-components/product.scss`, 'utf8');
  const { css } = sass.compileString(`${mixins}\n${product}`);
  const result = await postcss([
    tailwindcss({ ...tailwindConfig, content: [{ raw: '' }] }),
  ]).process(css, { from: undefined });
  return result.root;
}

function declarationsInMedia(
  root: Root,
  media: string,
  selector: string
): Record<string, string> {
  const decls: Record<string, string> = {};
  root.walkRules((rule) => {
    const parent = rule.parent as AtRule | undefined;
    if (parent?.type !== 'atrule' || parent.name !== 'media' || parent.params !== media) {
      return;
    }
    if (!rule.selectors.includes(selector)) return;
    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
    });
  });
  return decls;
}

describe('product card overlay actions', () => {
  it('shrinks the wishlist and quick-view buttons on phones', async () => {
    const root = await compileProduct();
    const button = declarationsInMedia(
      root,
      '(max-width: 767px)',
      '.s-product-card-actions .s-button-element'
    );

    expect(button.width).toBe('2rem');
    expect(button.height).toBe('2rem');
    expect(button.margin).toBe('0');
    expect(button['font-size']).toBe('0.875rem');
  });
});
