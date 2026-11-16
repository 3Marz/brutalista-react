import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FixedProducts } from '../../../app/components/home/FixedProducts';

const listMock = vi.fn();
const themeSettings = { current: {} as Record<string, unknown> };

vi.mock('@salla.sa/twilight-theme-engine/hooks/useTheme', () => ({
  useTheme: () => ({ settings: themeSettings.current }),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_k: string, fb?: string) => fb ?? _k }),
}));

vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({
  product: {
    queries: {
      list: (params: Record<string, unknown>) => ({
        queryKey: ['products', 'list', params],
        queryFn: () => listMock(params),
      }),
    },
  },
}));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children }: { to: string; children?: unknown }) => (
    <a href={to}>{children as never}</a>
  ),
}));

vi.mock('@salla.sa/twilight-components-react', () => ({
  FixedProductsSkeleton: () => <div data-testid="home-fixed-products-skeleton" />,
}));

vi.mock('../../../app/components/product/ProductCard', () => ({
  ProductCard: ({
    product,
    layout,
  }: {
    product: { id: number; name?: string };
    layout?: string;
  }) => (
    <div data-testid={`home-fixed-products-card-${product.id}`} data-layout={layout}>
      {product.name}
    </div>
  ),
}));

const products = (count: number) =>
  Array.from({ length: count }, (_, index) => ({ id: index + 1, name: `P${index + 1}` }));

/** The rendered product cards, in order. */
const cards = (container: HTMLElement) =>
  container.querySelectorAll('[data-testid^="home-fixed-products-card-"]');

function renderBlock(data: Record<string, unknown>) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(
    <QueryClientProvider client={client}>
      <FixedProducts data={{ products: { source: 'latest' }, ...data }} />
    </QueryClientProvider>
  );
}

beforeEach(() => {
  listMock.mockReset();
  themeSettings.current = {};
});

describe('FixedProducts', () => {
  it('asks for and shows as many products as the block limit, past 4', async () => {
    listMock.mockResolvedValue({ items: products(8) });
    const { container } = renderBlock({ limit: 8 });
    await waitFor(() => expect(cards(container)).toHaveLength(8));
    expect(cards(container)[7].getAttribute('data-testid')).toBe('home-fixed-products-card-8');
    expect(listMock).toHaveBeenCalledWith(expect.objectContaining({ perPage: 8 }));
  });

  it('never shows more than the limit, even when the API sends more', async () => {
    listMock.mockResolvedValue({ items: products(12) });
    const { container } = renderBlock({ limit: '8' });
    await waitFor(() => expect(cards(container)).toHaveLength(8));
  });

  it('shows what the API returns when the block has no limit', async () => {
    listMock.mockResolvedValue({ items: products(6) });
    const { container } = renderBlock({});
    await waitFor(() => expect(cards(container)).toHaveLength(6));
    expect(listMock).toHaveBeenCalledWith(expect.objectContaining({ perPage: undefined }));
  });

  it('uses the theme setting to switch between vertical and horizontal cards', async () => {
    listMock.mockResolvedValue({ items: products(2) });
    themeSettings.current = { vertical_fixed_products: false };

    const { container } = renderBlock({});
    await waitFor(() => expect(cards(container)).toHaveLength(2));

    expect(container.querySelector('.s-products-list-wrapper')?.className).toContain(
      's-products-list-horizontal-cards'
    );
    expect(cards(container)[0].getAttribute('data-layout')).toBe('horizontal');
  });

  it('keeps a block vertical when the block asks for it and the theme switch is off', async () => {
    listMock.mockResolvedValue({ items: products(2) });
    themeSettings.current = { vertical_fixed_products: false };

    const { container } = renderBlock({ isVertical: true });
    await waitFor(() => expect(cards(container)).toHaveLength(2));

    expect(container.querySelector('.s-products-list-wrapper')?.className).toContain(
      's-products-list-vertical-cards'
    );
    expect(cards(container)[0].getAttribute('data-layout')).toBe('vertical');
  });

  it('forces a vertical grid when the theme switch is on', async () => {
    listMock.mockResolvedValue({ items: products(2) });
    themeSettings.current = { vertical_fixed_products: true };

    const { container } = renderBlock({ isVertical: false });
    await waitFor(() => expect(cards(container)).toHaveLength(2));

    expect(container.querySelector('.s-products-list-wrapper')?.className).toContain(
      's-products-list-vertical-cards'
    );
    expect(cards(container)[0].getAttribute('data-layout')).toBe('vertical');
  });
});
