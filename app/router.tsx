import { lazy } from 'react';
import { createRouter } from '@salla.sa/twilight-theme-engine/tanstack';
import { registry } from '@salla.sa/twilight-theme-engine';
import {
  registerHomeComponents,
  registerHomeComponentConfig,
  DefaultHomeComponents,
} from '@salla.sa/twilight-theme-engine/routes/home';
import { SliderSkeleton } from '@salla.sa/twilight-components-react';
import { routeTree } from './routeTree.gen';
import {
  Brands,
  CustomTestimonials,
  EnhancedSlider,
  FeaturedProducts,
  featuredProductsConfig,
  FixedProducts,
  MainLinks,
  PhotosSlider,
  ProductsSlider,
  SliderProductsWithHeader,
  EnhancedSquareBanners,
  // Brutal home blocks ported from the Twig theme.
  Marquee,
  Categories,
  SquareBannerBrutal,
  Questions,
  SquarePhotos,
  PhotoAndText,
  OffersProducts,
  BrutalTestimonials,
  TextAndButton,
  Stats,
  Separator,
  BannersBrutal,
  CustomReviewsBrutal,
} from './components/home';
import { registerThemeHooks } from './hooks';
import { ProductListSkeleton } from './components/product/ProductListSkeleton';
import { BrutalProductCard } from './components/product/BrutalProductCard';

const ProductListPage = lazy(() =>
  import('./components/product/ProductListPage').then((m) => ({ default: m.ProductListPage }))
);

// Register theme-level hooks (AddProductToast, DigitalFilesSettings, etc.)
registerThemeHooks();

registry.register('product:list-page', ProductListPage);
registry.register('product:list-skeleton', ProductListSkeleton);

//Brutal Product Card
registry.register('product:card', BrutalProductCard);
registry.override('product:card', BrutalProductCard);

registerHomeComponents({
  ...DefaultHomeComponents,
  brands: Brands,
  'enhanced-slider': EnhancedSlider,
  'custom-testimonials': CustomTestimonials,
  'main-links': MainLinks,
  'square-links': MainLinks,
  // Replaces the engine Swiper with the theme's scroll carousel (home block +
  // the product page's "similar products" `best-offers-<n>-slider`).
  'products-slider': ProductsSlider,
  // Replaces the engine Swiper with the theme's scroll carousel — same
  // progress bar + arrows as testimonials/products, cards instead of a thin
  // full-width banner strip.
  'photos-slider': PhotosSlider,
  // The renderer checks `home:featured-products:<view_style>` before the bare
  // key (theme-engine `HomePageRenderer.getComponentByPath`), and
  // `...DefaultHomeComponents` above still has the engine's own component
  // registered under the three literal `styleN` variants — leaving those out
  // here would mean only view_style-less / unrecognised blocks ever reach
  // this component, and every `style1`/`style2`/`style3` block keeps
  // rendering the broken engine variants this fork exists to replace.
  'featured-products': FeaturedProducts,
  'featured-products:style1': FeaturedProducts,
  'featured-products:style2': FeaturedProducts,
  'featured-products:style3': FeaturedProducts,
  // Fork of the engine block so its grid renders the theme's ProductCard wrapper.
  'fixed-products': FixedProducts,
  'slider-products-with-header': SliderProductsWithHeader,
  'enhanced-square-banners': EnhancedSquareBanners,

  // Brutal home blocks (ported from the Twig theme). Registry key is
  // `home:<path>` — the block `path` without the `home.` prefix.
  marquee: Marquee,
  categories: Categories,
  'square-banner-brutal': SquareBannerBrutal,
  questions: Questions,
  'square-photos': SquarePhotos,
  'photo-and-text': PhotoAndText,
  'offers-products': OffersProducts,
  brutal_testimonials: BrutalTestimonials,
  text_and_button: TextAndButton,
  stats: Stats,
  separator: Separator,
  banners_brutal: BannersBrutal,
  'custom-reviews-brutal': CustomReviewsBrutal,
});

// Wrapper `<section>` classes for `featured-products` — the engine only styles
// the literal `styleN` values; this covers the semantic `view_style`s too.
// `custom-testimonials` gets `s-block--full-bg` so the gray band runs edge-to-edge.
registerHomeComponentConfig({
  'featured-products': featuredProductsConfig,
  'custom-testimonials': {
    className: 's-block s-block--custom-testimonials s-block--full-bg',
  },
  // Lazy placements (blocks 4+): reserve the loaded blocks' height and show the
  // same SliderSkeleton the SSR path shows (sized in home-blocks.scss), not the
  // engine's 400px/200px defaults with mismatched skeletons (CLS on scroll-in).
  'enhanced-slider': {
    height: 'calc(100vw / 2.4)', // the 12:5 slide ratio
    placeholder: <SliderSkeleton />,
    // The boxed variant (`in_container`) is capped at the container width, so
    // its skeleton must be too (home-blocks.scss) or the reservation oversizes.
    className: (data) =>
      `s-block s-block--enhanced-slider${data.in_container ? ' s-block--enhanced-slider-boxed' : ''}`,
  },
  'main-links': {
    height: '112px',
    placeholder: <SliderSkeleton />,
    // Keeps the engine entry's merge classes; theme config replaces, not merges.
    className: (data) => {
      const mergeWithTop = data.merge_links_with_top_component;
      return [
        's-block',
        's-block--main-links',
        mergeWithTop && data.position ? 'merge-with-top-component' : '',
        !data.title && mergeWithTop ? 'merged-has-no-title' : '',
      ]
        .filter(Boolean)
        .join(' ');
    },
  },
  'square-links': {
    height: '144px', // .slide--cat-entry h-36 cards (square-links keeps the card look)
    placeholder: <SliderSkeleton />,
  },
  // Taller cards than the engine's thin full-width banner strip — reserve
  // more skeleton height so the real content doesn't shift the page on load.
  'photos-slider': {
    height: 'clamp(210px, 32vw, 420px)',
    placeholder: <SliderSkeleton />,
    className: (data) =>
      `s-block s-block--photos-slider${data.is_repeated ? ' repeated-block' : ''}`,
  },

  // ---- Brutal blocks ------------------------------------------------------
  // Wrapper `<section>` classes (the engine would otherwise fall back to
  // `s-block s-block--<path>`, which is fine here, but the sliders need a
  // skeleton sized like the real content to avoid CLS on scroll-in).
  marquee: {
    height: '56px',
    className: (data) => `s-block--marquee w-full${data.top_margin ? ' s-block' : ''}`,
  },
  categories: { className: 's-block s-block--categories' },
  'square-banner-brutal': { className: 's-block s-block--square-banner-brutal' },
  questions: { height: '300px', className: 's-block s-block--questions' },
  'square-photos': { className: 's-block s-block--square-photos' },
  'photo-and-text': { height: '400px', className: 's-block s-block--photo-and-text' },
  'offers-products': {
    height: '480px',
    placeholder: <SliderSkeleton />,
    className: 's-block s-block--offers-products',
  },
  brutal_testimonials: {
    height: '420px',
    placeholder: <SliderSkeleton />,
    className: 's-block s-block--brutal_testimonials',
  },
  text_and_button: { height: '300px', className: 's-block s-block--text_and_button' },
  stats: { height: '220px', className: 's-block s-block--stats' },
  separator: { height: '24px', className: 's-block s-block--separator' },
  banners_brutal: {
    height: 'clamp(160px, 26vw, 340px)',
    placeholder: <SliderSkeleton />,
    className: (data) =>
      `s-block--banners_brutal ${data.top_margin ? 's-block' : ''} ${
        data.full_banners ? 'overflow-hidden' : 'container'
      }`,
  },
  'custom-reviews-brutal': {
    height: '380px',
    placeholder: <SliderSkeleton />,
    className: 's-block s-block--custom-reviews-brutal',
  },
});

// Singleton for client-side (preserves QueryClient cache across navigations)
// SSR creates fresh instances per request via getRouter()
let clientRouter: ReturnType<typeof createRouter> | null = null;

// TanStack Start expects getRouter() for SSR compatibility
export function getRouter() {
  // On client: reuse existing router to preserve QueryClient cache
  if (typeof window !== 'undefined' && clientRouter) {
    return clientRouter;
  }

  // On SSR or first client load: create new router
  const router = createRouter(routeTree);

  // Cache for client-side
  if (typeof window !== 'undefined') {
    clientRouter = router;
  }

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
