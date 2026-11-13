// @vitest-environment node
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, it, expect } from 'vitest';
import * as sass from 'sass';
import postcss, { type AtRule, type Root } from 'postcss';
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
    if (!rule.selectors.includes(selector)) return;
    rule.walkDecls((decl) => {
      decls[decl.prop] = decl.value;
    });
  });
  return decls;
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

describe('catalog filters', () => {
  it('turns each widget into a Brutal card', async () => {
    const root = await compile('product-list.scss');
    const card = declarations(root, '#filters-menu .s-filters-widget-container');

    expect(card.padding).toBe('0');
    expect(card.border).toBe('2px solid var(--bc)');
    expect(card['border-radius']).toBe('var(--br)');
    expect(card['background-color']).toBe('var(--base-50)');
    expect(card['box-shadow']).toBe('var(--neo-shadow)');
  });

  it('uses a bordered plus/minus control', async () => {
    const root = await compile('product-list.scss');
    const toggle = declarations(root, '#filters-menu .s-filters-widget-plusminus');

    expect(toggle.width).toBe('1.5rem');
    expect(toggle.height).toBe('1.5rem');
    expect(toggle.border).toBe('2px solid var(--bc)');
    expect(toggle['box-shadow']).toBe('var(--neo-shadow)');
  });

  it('styles the option inputs and price fields as Brutal controls', async () => {
    const root = await compile('product-list.scss');
    const checkbox = declarations(root, '#filters-menu .s-filters-checkbox');
    const price = declarations(root, '#filters-menu .s-price-range-number-input');

    expect(checkbox['appearance']).toBe('none');
    expect(checkbox.width).toBe('1.25rem');
    expect(checkbox.height).toBe('1.25rem');
    expect(checkbox.border).toBe('2px solid var(--bc)');
    expect(checkbox['box-shadow']).toBe('var(--neo-shadow)');

    expect(price.height).toBe('2.5rem');
    expect(price.border).toBe('2px solid var(--bc)');
    expect(price['border-radius']).toBe('var(--br)');
    expect(price['box-shadow']).toBe('var(--neo-shadow)');
  });

  it('only makes the desktop panel a flex column from the md breakpoint', async () => {
    const root = await compile('product-list.scss');
    let topLevelDisplay: string | undefined;

    root.walkRules((rule) => {
      if (rule.parent !== root || !rule.selectors.includes('#filters-menu')) return;
      rule.walkDecls('display', (decl) => {
        topLevelDisplay = decl.value;
      });
    });

    // `hidden md:block` must stay in charge below md.
    expect(topLevelDisplay).toBeUndefined();
    expect(declarationsInMedia(root, '(min-width: 768px)', '#filters-menu').display).toBe(
      'flex'
    );
  });

  it('uses the page tone for cards inside the mobile sheet', async () => {
    const root = await compile('product-list.scss');
    const card = declarations(
      root,
      '#filters-menu-mobile .s-filters-widget-container'
    );

    expect(card['background-color']).toBe('var(--base-100)');
  });
});
