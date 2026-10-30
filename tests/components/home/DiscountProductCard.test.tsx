import { describe, it, expect, vi } from 'vitest';
import type { ReactNode } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { DiscountProductCard } from '../../../app/components/home/DiscountProductCard';
import { QUICK_VIEW_EVENT } from '../../../app/lib/quickView';

vi.mock('@salla.sa/twilight-theme-engine/hooks/useMoney', () => ({
  useMoney: () => ({ format: (value: unknown) => `${value} SAR` }),
}));

vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => ({
    store: { settings: { product: { show_price_as_dash: true } } },
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_key: string, fallback?: string) => fallback ?? _key }),
}));

vi.mock('@salla.sa/twilight-components-react/add-product-button', () => ({
  SallaAddProductButton: ({
    children,
    productStatus,
    productId,
  }: {
    children?: ReactNode;
    productStatus?: string;
    productId?: number | string;
  }) => (
    <div data-testid="add-to-cart" data-status={productStatus} data-product-id={productId}>
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
  name: 'Offer Tee',
  url: '/p/offer-tee',
  image: { url: '/offer-tee.jpg', alt: 'Offer Tee' },
  price: 100,
  sale_price: 80,
  regular_price: 100,
  starting_price: null,
  is_on_sale: true,
  is_out_of_stock: false,
  status: 'sale',
  type: 'product',
  discount_ends: '2026-12-31T23:59:59',
};

describe('DiscountProductCard', () => {
  it('renders the Twig offer card: wide image + details, sale price and add-to-cart', () => {
    const { container, getByTestId } = render(
      <DiscountProductCard product={baseProduct as never} />
    );

    const card = container.querySelector('.discount-product-card');
    expect(card?.className).toContain('md:flex-row');
    expect(card?.className).toContain('md:h-96');
    expect(card?.className).toContain('border-2');
    expect(card?.className).toContain('border-bc');
    expect(card?.className).toContain('rounded-neo');
    expect(card?.className).toContain('shadow-neo');

    expect(container.textContent).toContain('Offer Tee');
    expect(container.textContent).toContain('80 SAR');
    expect(container.textContent).toContain('100 SAR');
    expect(container.querySelector('.s-product-card-sale-price')).toBeTruthy();
    expect(getByTestId('add-to-cart').textContent).toContain('Add to Cart');
    expect(getByTestId('add-to-cart').getAttribute('data-status')).toBe('sale');
  });

  it('renders the starting-price branch', () => {
    const { container } = render(
      <DiscountProductCard
        product={
          {
            ...baseProduct,
            is_on_sale: false,
            starting_price: 50,
          } as never
        }
      />
    );

    expect(container.querySelector('.s-product-card-starting-price')).toBeTruthy();
    expect(container.textContent).toContain('Starting from');
    expect(container.textContent).toContain('50 SAR');
  });

  it('shows the unboxed, labelled countdown', () => {
    const { getByTestId } = render(
      <DiscountProductCard product={baseProduct as never} />
    );

    const countdown = getByTestId('count-down');
    expect(countdown.getAttribute('data-date')).toBe('2026-12-31');
    expect(countdown.getAttribute('data-boxed')).toBe('false');
  });

  it('supports legacy Unix-second discount end dates', () => {
    const { getByTestId } = render(
      <DiscountProductCard
        product={{ ...baseProduct, discount_ends: '1735732800' } as never}
      />
    );

    expect(getByTestId('count-down').getAttribute('data-date')).toBe('2025-1-1');
  });

  it('omits the countdown when the product has no discount end date', () => {
    const { queryByTestId } = render(
      <DiscountProductCard
        product={{ ...baseProduct, discount_ends: undefined } as never}
      />
    );

    expect(queryByTestId('count-down')).toBeNull();
  });

  it('asks the quick-view host to open the product', () => {
    const listener = vi.fn();
    window.addEventListener(QUICK_VIEW_EVENT, listener);

    const { getByLabelText } = render(
      <DiscountProductCard product={baseProduct as never} />
    );
    fireEvent.click(getByLabelText('Quick view product'));

    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0][0] as CustomEvent).detail).toEqual({
      productId: 42,
    });

    window.removeEventListener(QUICK_VIEW_EVENT, listener);
  });

  it('uses the out-of-stock label and status when the product cannot be bought', () => {
    const { container, getByTestId } = render(
      <DiscountProductCard
        product={
          {
            ...baseProduct,
            status: 'out',
            is_out_of_stock: true,
            is_on_sale: false,
          } as never
        }
      />
    );

    expect(getByTestId('add-to-cart').textContent).toContain('Out of Stock');
    expect(getByTestId('add-to-cart').getAttribute('data-status')).toBe('out');
    expect(container.querySelector('.s-product-card-sale-price')).toBeNull();
  });
});
