import { memo } from 'react';
import { Link } from '@salla.sa/twilight-theme-engine/common';

interface CategoryItem {
  url?: string;
  icon?: string;
  image?: string;
  name?: string;
}

export interface CategoriesData {
  title?: string;
  categories?: CategoryItem[];
  [key: string]: unknown;
}

/**
 * `categories` home block — a grid of circular category entries with an
 * animated underline (`.cat-entry-br`, `04-components/home-blocks.scss`).
 * Ported from the Twig theme's `home/categories.twig`.
 */
export const Categories = memo(function Categories({ data }: { data: CategoriesData }) {
  const { title, categories = [] } = data;

  if (!categories.length) return null;

  return (
    <div className="container">
      {title ? (
        <div className="s-block__title">
          <div className="right-side">
            <h2>{title}</h2>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-1.5 md:gap-x-4 gap-y-6">
        {categories.map((cat, index) => (
          <Link
            key={cat.url && cat.url !== '#' ? cat.url : index}
            to={cat.url || '#'}
            className="w-full cat-entry-br group justify-self-center text-text-color flex flex-col gap-2 p-1 items-center justify-between"
          >
            <div className="md:w-24 md:h-24 w-20 h-20 flex justify-center items-center text-xl rounded-full bg-base-50 border border-bc overflow-hidden">
              {cat.image ? (
                <img
                  src={cat.image}
                  alt={cat.name || ''}
                  loading="lazy"
                  decoding="async"
                  className="w-full transition group-hover:scale-110 h-full object-cover"
                />
              ) : (
                <i className={`${cat.icon || ''} group-hover:scale-110 transition`} />
              )}
            </div>

            <div className="text-center text-sm md:font-bold line-clamp-2">
              <span title={cat.name}>{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
});
