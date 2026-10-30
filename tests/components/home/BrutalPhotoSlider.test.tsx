import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { BrutalPhotoSlider } from '../../../app/components/home/BrutalPhotoSlider';

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({ t: (_k: string, fb?: string) => fb ?? _k }),
}));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, className }: { to: string; children?: unknown; className?: string }) => (
    <a href={to} className={className}>
      {children as never}
    </a>
  ),
  Image: (props: Record<string, unknown>) => (
    <img
      alt={String(props.alt ?? '')}
      src={String(props.src ?? '')}
      width={Number(props.width)}
      height={Number(props.height)}
      className={String(props.className ?? '')}
    />
  ),
}));

beforeEach(() => {
  Element.prototype.scrollBy = vi.fn();
});

describe('BrutalPhotoSlider', () => {
  const mockItems = [
    { url: '/photo1', image: 'photo1.jpg' },
    { url: '/photo2', image: 'photo2.jpg' },
  ];

  it('returns null when no items', () => {
    const { container } = render(<BrutalPhotoSlider data={{ items: [] }} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the Twig-sized banner slide per photo, linked to its url', () => {
    const { container } = render(<BrutalPhotoSlider data={{ items: mockItems }} />);
    const slides = container.querySelectorAll('.s-brutal-photo-slider__slide');
    expect(slides.length).toBe(2);
    expect(slides[0].getAttribute('href')).toBe('/photo1');
  });

  it('keeps the old 1200px banner width and contain fit', () => {
    const { container } = render(<BrutalPhotoSlider data={{ items: mockItems }} />);
    const imgs = container.querySelectorAll<HTMLImageElement>(
      '.s-brutal-photo-slider__slide img'
    );
    expect(imgs[0].getAttribute('src')).toBe('photo1.jpg');
    expect(imgs[0].getAttribute('width')).toBe('1200');
    expect(Number(imgs[0].getAttribute('height'))).toBeGreaterThan(0);
    expect(imgs[0].className).toContain('object-contain');
  });

  it('keeps the scroll-carousel progress and arrows', () => {
    const { container, getByLabelText } = render(
      <BrutalPhotoSlider data={{ items: mockItems }} />
    );

    expect(container.querySelector('.scroll-carousel__progress-thumb')).toBeTruthy();
    expect(getByLabelText('Previous')).toBeTruthy();

    fireEvent.click(getByLabelText('Next'));
    expect(Element.prototype.scrollBy).toHaveBeenCalled();
  });

  it('cancels the native image drag so a mouse drag on a photo scrolls the slider', () => {
    const { container } = render(<BrutalPhotoSlider data={{ items: mockItems }} />);
    const img = container.querySelector('.s-brutal-photo-slider__slide img') as HTMLElement;
    expect(fireEvent.dragStart(img)).toBe(false);
  });
});
