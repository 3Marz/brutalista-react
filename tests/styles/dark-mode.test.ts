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

describe('footer_is_dark (body.footer-is-dark)', () => {
  // The footer's own background/text colors for this setting moved into the
  // Footer component itself (@salla.sa/twilight-theme-engine/layout) along
  // with the rest of its structure -- see that package's own
  // Footer.test.tsx for the equivalent "Raed palette, not a generic Tailwind
  // shade" regression guard. What's left compiled here is just the one piece
  // still theme-owned: the footer-menu item colors, which depend on the
  // `--stacked` / `--inline` modifier classes this theme's own Footer usage
  // adds, not something the shared component could style itself.
  it('keeps the footer menu items on the light base-100 ink of the brutal footer', async () => {
    const root = await compile('footer.scss');

    const stacked = declarations(
      root,
      'body.footer-is-dark .store-footer__menu--stacked .s-menu-footer-item'
    );
    expect(stacked.color).toBe('var(--base-100)');

    const inline = declarations(
      root,
      'body.footer-is-dark .store-footer__menu--inline .s-menu-footer-item'
    );
    expect(inline.color).toBe('var(--base-100)');
    expect(inline['border-color']).toBe('var(--base-100)');
  });
});

describe('topnav_is_dark (body.topnav-is-dark)', () => {
  it('paints the header top bar on the brutal `bc` band', async () => {
    const root = await compile('header.scss');

    const topnav = declarations(root, 'body.topnav-is-dark .site-header__topnav');
    expect(topnav['background-color']).toBe('var(--bc)');
    expect(topnav['border-color']).toBe('var(--bc)');
    expect(topnav.color).toBe('var(--base-100)');
  });

  it('darkens the lite header bar, the only bar that layout has', async () => {
    const root = await compile('header.scss');

    const bar = declarations(root, 'body.topnav-is-dark .site-header--lite .site-header__bar');
    expect(bar['background-color']).toBe('var(--bc)');

    const action = declarations(
      root,
      'body.topnav-is-dark .site-header--lite .site-header__bar .header-action'
    );
    expect(action.color).toBe('var(--base-100)');
    expect(action['border-color']).toBe('var(--base-100)');
  });
});
