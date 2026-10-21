import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { BrutalProductCard } from '../../../app/components/product/BrutalProductCard';

const wishlistState = { ids: [] as number[], toggle: vi.fn() };

vi.mock('@salla.sa/twilight-theme-engine/hooks/useMoney', () => ({
  useMoney: () => ({ format: (value: unknown) => `${value} SAR` }),
}));

vi.mock('@salla.sa/twilight-theme-engine/hooks/useAsset', () => ({
  useAsset: () => ({ isPlaceholder: () => false }),
}));

vi.mock('@salla.sa/twilight-theme-engine/hooks/useWishlist', () => ({
  useWishlist: () => ({
    has: (id: number) => wishlistState.ids.includes(id),
    toggle: wishlistState.toggle,
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => ({
    store: { settings: { product: { show_price_as_dash: true } } },
    theme: { settings: {} },
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

vi.mock('@salla.sa/twilight-components-react/add-product-button', () => ({
  SallaAddProductButton: ({
    children,
    productStatus,
  }: {
    children?: ReactNode;
    productStatus?: string;
  }) => (
    <div data-testid="add-to-cart" data-status={productStatus}>
      {children}
    </div>
  ),
}));

vi.mock('@salla.sa/twilight-components-react/button', () => ({
  SallaButton: ({
    children,
    onClick,
    ariaLabel,
  }: {
    children?: ReactNode;
    onClick?: () => void;
    ariaLabel?: string;
  }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('@salla.sa/twilight-components-react/count-down', () => ({
  SallaCountDown: ({ date, boxed }: { date: string; boxed: boolean }) => (
    <div data-testid="count-down" data-date={date} data-boxed={String(boxed)} />
  ),
}));

const baseProduct = {
  id: 42,
  name: 'Brutal Tee',
  url: '/p/brutal-tee',
  image: { url: '/tee.jpg', alt: 'Brutal Tee' },
  price: 100,
  sale_price: 80,
  regular_price: 100,
  starting_price: null,
  is_on_sale: true,
  is_out_of_stock: false,
  status: 'sale',
  type: 'product',
  has_preorder_campaign: false,
  quantity: 5,
  subtitle: 'Heavy cotton',
  discount_ends: '2026-12-31T23:59:59',
};

beforeEach(() => {
  wishlistState.ids = [];
  wishlistState.toggle.mockClear();
});

describe('BrutalProductCard', () => {
  it('renders the Twig card: sale price, regular strike-through and add-to-cart', () => {
    const { container, getByTestId } = render(
      <BrutalProductCard product={baseProduct as never} />
    );

    expect(container.textContent).toContain('Brutal Tee');
    expect(container.textContent).toContain('80 SAR');
    expect(container.textContent).toContain('100 SAR');
    expect(container.querySelector('.s-product-card-sale-price')).toBeTruthy();
    expect(container.querySelector('.s-product-card-image')).toBeTruthy();
    expect(getByTestId('add-to-cart').textContent).toContain('Add to Cart');
  });

  it('shows the boxed countdown and deadline on the special card', () => {
    const { getByTestId, container } = render(
      <BrutalProductCard product={baseProduct as never} layout="special" />
    );

    const countdown = getByTestId('count-down');
    expect(countdown.getAttribute('data-date')).toBe('2026-12-31');
    expect(countdown.getAttribute('data-boxed')).toBe('true');
    expect(container.textContent).toContain('Discount ends in');
  });

  it('omits the add-to-cart button with withoutAddButton', () => {
    const { queryByTestId } = render(
      <BrutalProductCard product={baseProduct as never} withoutAddButton />
    );

    expect(queryByTestId('add-to-cart')).toBeNull();
  });

  it('toggles the wishlist with a numeric id even on list string ids', () => {
    const { getByLabelText } = render(
      <BrutalProductCard
        product={{ ...baseProduct, id: '42' } as never}
      />
    );

    getByLabelText('Add or remove to wishlist').click();
    expect(wishlistState.toggle).toHaveBeenCalledWith(42);
  });

  it('renders the Twig out-of-stock ribbon when there is no promotion title', () => {
    const { container } = render(
      <BrutalProductCard
        product={
          {
            ...baseProduct,
            promotion_title: '',
            is_on_sale: false,
            is_out_of_stock: true,
            status: 'out',
          } as never
        }
      />
    );

    expect(container.querySelector('[class*="7a0000"]')?.textContent).toContain(
      'Out of Stock'
    );
  });
});
