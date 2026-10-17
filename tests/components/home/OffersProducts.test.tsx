import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { OffersProducts } from '../../../app/components/home/OffersProducts';

const listMock = vi.fn().mockResolvedValue({
  data: [
    { id: 11, name: 'Offer Eleven' },
    { id: 22, name: 'Offer Twenty Two' },
  ],
});

vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({
  product: { list: (...args: unknown[]) => listMock(...args) },
}));

// The theme `ProductCard` re-exports the engine one; mock the engine so the
// fetched products render as plain nodes.
vi.mock('@salla.sa/twilight-theme-engine/product', () => ({
  ProductCard: ({ product }: { product: { name?: string } }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

vi.mock('@salla.sa/twilight-components-react', () => ({
  ProductsListSkeleton: () => <div data-testid="list-skeleton" />,
  SallaProductsList: ({
    loader,
    children,
  }: {
    loader: () => unknown;
    children: (items: unknown[]) => unknown;
  }) => {
    loader();
    return (
      <div data-testid="salla-products-list">
        {
          children([
            { id: 11, name: 'Offer Eleven' },
            { id: 22, name: 'Offer Twenty Two' },
          ]) as never
        }
      </div>
    );
  },
}));

describe('OffersProducts', () => {
  it('renders nothing without offers', () => {
    const { container } = render(<OffersProducts data={{}} />);
    expect(container.firstChild).toBeNull();
  });

  it('loads the selected products and pairs each with its offer title', () => {
    const { container } = render(
      <OffersProducts
        data={{
          offers: [
            { title: 'Deal A', product: 11 },
            { title: 'Deal B', product: { value: 22 } },
          ],
        }}
      />
    );

    expect(listMock).toHaveBeenCalledWith({
      source: 'selected',
      sourceValue: [11, 22],
      perPage: 2,
    });
    expect(container.textContent).toContain('Deal A');
    expect(container.textContent).toContain('Deal B');
    expect(container.textContent).toContain('Offer Eleven');
    expect(container.textContent).toContain('Offer Twenty Two');
  });
});
