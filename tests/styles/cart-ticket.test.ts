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

function declarations(root: Root, selector: string): Record<string, string> {
  const decls: Record<string, string> = {};
  root.walkRules((rule) => {
    if (rule.selectors.includes(selector)) {
      rule.walkDecls((decl) => {
        decls[decl.prop] = decl.value;
      });
    }
  });
  return decls;
}

describe('cool_cart_page', () => {
  it('applies the ticket treatment to the order summary on the cart page', async () => {
    const root = await compile('cart.scss');

    const ticket = declarations(
      root,
      'body.cart.cool-cart-page .shadow-default.transition-height'
    );
    expect(ticket.filter).toContain('drop-shadow');
  });

  it('applies the bordered brutal card when the setting is off', async () => {
    const root = await compile('cart.scss');

    const plain = declarations(
      root,
      'body.cart:not(.cool-cart-page) .shadow-default.transition-height'
    );
    expect(plain['border-width']).toBe('2px');
    expect(plain['--tw-shadow']).toBe('var(--neo-shadow)');
  });
});
