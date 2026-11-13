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

describe('blog styles', () => {
  it('restores the Brutal article card on listing pages', async () => {
    const root = await compile('blog.scss');
    const card = declarations(root, '.post-entry');

    expect(card['border-width']).toBe('2px');
    expect(card['border-color']).toBe('var(--bc)');
    expect(card['background-color']).toBe('var(--base-50)');
    expect(card['border-radius']).toBe('var(--br)');
    expect(card['--tw-shadow']).toBe('var(--neo-shadow)');
  });

  it('restores the bordered single-article surface', async () => {
    const root = await compile('blog.scss');
    const main = declarations(root, '.blog-single .main-content');

    expect(main['border-width']).toBe('2px');
    expect(main['border-color']).toBe('var(--bc)');
    expect(main['background-color']).toBe('var(--base-50)');
    expect(main['border-radius']).toBe('var(--br)');
  });
});
