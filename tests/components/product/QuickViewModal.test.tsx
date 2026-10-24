import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { QuickViewModal } from '../../../app/components/product/QuickViewModal';

const { findMock } = vi.hoisted(() => ({ findMock: vi.fn() }));

vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({
  product: { find: findMock },
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({
    t: (_key: string, fallback?: string) => fallback ?? _key,
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/hooks/useWishlist', () => ({
  useWishlist: () => ({ has: () => false, toggle: vi.fn() }),
}));

vi.mock('@salla.sa/twilight-theme-engine/common', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@salla.sa/twilight-theme-engine/common')>();
  return {
    ...actual,
    Image: ({ src, alt }: { src?: string; alt?: string }) => (
      <img src={src} alt={alt ?? ''} />
    ),
    Link: ({ to, children }: { to?: string; children?: ReactNode }) => (
      <a href={to}>{children}</a>
    ),
  };
});

vi.mock('@salla.sa/twilight-components-react/product-options', () => ({
  SallaProductOptionsCore: () => <div data-testid="quick-view-options" />,
}));

vi.mock('@salla.sa/twilight-components-react/add-product-button', () => ({
  SallaAddProductButton: ({ children }: { children?: ReactNode }) => (
    <div data-testid="quick-view-add">{children}</div>
  ),
}));

vi.mock('@salla.sa/twilight-components-react/installment', () => ({
  SallaInstallment: () => <div data-testid="quick-view-installment" />,
}));

vi.mock('@salla.sa/twilight-components-react/social-share', () => ({
  SallaSocialShare: () => <div data-testid="quick-view-share" />,
}));

const baseProduct = {
  id: 42,
  name: 'Brutal Tee',
  description: '<p>A heavyweight tee.</p>',
  url: '/en/product/brutal-tee',
  promotion_title: '',
  type: 'product',
  status: 'sale',
  is_out_of_stock: false,
  is_on_sale: true,
  sale_price: 80,
  regular_price: 100,
  price: 80,
  starting_price: null,
  currency: 'SAR',
  base_currency_price: { amount: 80, currency: 'SAR' },
  image: { id: 1, url: '/images/front.jpg', alt: 'Front' },
  images: [
    { id: 1, url: '/images/front.jpg', alt: 'Front' },
    { id: 2, url: '/images/back.jpg', alt: 'Back' },
  ],
  options: [{ id: 1, name: 'Size', type: 'radio', values: [] }],
  notify_availability: null,
  has_preorder_campaign: false,
} as unknown as Product;

describe('QuickViewModal', () => {
  beforeEach(() => {
    findMock.mockReset();
  });

  afterEach(() => {
    delete (window as unknown as { salla?: unknown }).salla;
  });

  it('loads the product and renders the gallery, price, options and add button', async () => {
    findMock.mockResolvedValue(baseProduct);

    render(<QuickViewModal productId={42} onClose={() => {}} />);

    expect(screen.getByRole('status')).toBeTruthy();

    expect(await screen.findByText('Brutal Tee')).toBeTruthy();
    expect(findMock).toHaveBeenCalledWith('42');
    expect(await screen.findByTestId('quick-view-options')).toBeTruthy();
    expect(screen.getByTestId('quick-view-add').textContent).toContain('Add to Cart');
    expect(screen.getByTestId('quick-view-installment')).toBeTruthy();
    expect(screen.getByTestId('quick-view-share')).toBeTruthy();
    // `CurrencySymbol` turns "SAR" into an icon, so assert on the amount only.
    expect(document.body.textContent).toContain('80');
  });

  it('shows the error state when the request fails and can retry', async () => {
    findMock.mockRejectedValueOnce(new Error('network'));
    findMock.mockResolvedValueOnce(baseProduct);

    render(<QuickViewModal productId={42} onClose={() => {}} />);

    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toContain('Could not load the product. Please try again.');

    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByText('Brutal Tee')).toBeTruthy();
    expect(findMock).toHaveBeenCalledTimes(2);
  });

  it('closes through the close button', async () => {
    findMock.mockResolvedValue(baseProduct);
    const onClose = vi.fn();

    render(<QuickViewModal productId={42} onClose={onClose} />);
    await screen.findByText('Brutal Tee');

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submits through the SDK form handler so selected options are included', async () => {
    const onSubmit = vi.fn();
    (window as unknown as { salla: unknown }).salla = {
      config: { get: vi.fn(), set: vi.fn() },
      form: { onSubmit },
    };
    findMock.mockResolvedValue(baseProduct);

    render(<QuickViewModal productId={42} onClose={() => {}} />);
    await screen.findByText('Brutal Tee');

    const form = document.querySelector('form.quick-view__form') as HTMLFormElement;
    fireEvent.submit(form);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toBe('cart.addItem');
  });
});
