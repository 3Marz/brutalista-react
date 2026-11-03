import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Marquee } from '../../../app/components/home/Marquee';
import { Categories } from '../../../app/components/home/Categories';
import { SquareBannerBrutal } from '../../../app/components/home/SquareBannerBrutal';
import { Questions } from '../../../app/components/home/Questions';
import { SquarePhotos } from '../../../app/components/home/SquarePhotos';
import { PhotoAndText } from '../../../app/components/home/PhotoAndText';
import { Separator } from '../../../app/components/home/Separator';
import { Stats } from '../../../app/components/home/Stats';
import { TextAndButton } from '../../../app/components/home/TextAndButton';
import { BannersBrutal } from '../../../app/components/home/BannersBrutal';
import { CustomReviewsBrutal } from '../../../app/components/home/CustomReviewsBrutal';
import { BrutalTestimonials } from '../../../app/components/home/BrutalTestimonials';

vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => ({
    theme: { settings: { squar_photo_bg_image_size: 'cover' } },
    store: { name: 'Test Store', logo: 'logo.png' },
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({
    locale: 'ar',
    t: (_key: string, fallback?: string) => fallback ?? _key,
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({
    to,
    children,
    className,
    style,
  }: {
    to: string;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <a href={to} className={className} style={style}>
      {children}
    </a>
  ),
}));

vi.mock('@salla.sa/twilight-components-react/button', () => ({
  SallaButton: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('@salla.sa/twilight-components-react/reviews', () => ({
  SallaReviews: ({ limit, sort }: { limit?: number; sort?: string }) => (
    <div data-testid="reviews" data-sort={sort} data-limit={String(limit)} />
  ),
}));

describe('Brutal home blocks', () => {
  it('Marquee repeats the text and hides when empty', () => {
    const { rerender } = render(<Marquee data={{ moving_text: 'Sale 60%' }} />);
    expect(screen.getAllByText('Sale 60%')).toHaveLength(11);

    rerender(<Marquee data={{}} />);
    expect(screen.queryByText('Sale 60%')).toBeNull();
  });

  it('Categories renders the title and links', () => {
    render(
      <Categories
        data={{
          title: 'Categories',
          categories: [{ name: 'Shoes', url: '/shoes' }, { name: 'Bags', icon: 'sicon-bag' }],
        }}
      />
    );
    expect(screen.getByText('Categories')).toBeTruthy();
    expect(screen.getByRole('link', { name: /Shoes/ }).getAttribute('href')).toBe('/shoes');
    expect(screen.getByText('Bags')).toBeTruthy();
  });

  it('SquareBannerBrutal renders the banner titles', () => {
    render(
      <SquareBannerBrutal
        data={{ banners: [{ image: 'a.jpg', url: '/a', title: 'First' }, { title: 'Second' }] }}
      />
    );
    expect(screen.getAllByText('First').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Second').length).toBeGreaterThan(0);
  });

  it('Questions renders the FAQ and its answer HTML', () => {
    render(
      <Questions data={{ title: 'FAQ', questions: [{ question: 'Q1?', answer: '<b>A1</b>' }] }} />
    );
    expect(screen.getByText('FAQ')).toBeTruthy();
    expect(screen.getByText('Q1?')).toBeTruthy();
    expect(screen.getByText('A1')).toBeTruthy();
  });

  it('SquarePhotos renders the photo names', () => {
    render(
      <SquarePhotos
        data={{ links: [{ name: 'One', image: '1.jpg' }, { name: 'Two' }, { name: 'Big' }] }}
      />
    );
    expect(screen.getByText('One')).toBeTruthy();
    expect(screen.getByText('Big')).toBeTruthy();
  });

  it('PhotoAndText renders the copy and the CTA', () => {
    render(
      <PhotoAndText
        data={{ image: 'p.jpg', main_title: 'Hello', sub_text: 'Sub', link_title: 'Go', link_url: '/go' }}
      />
    );
    expect(screen.getByText('Hello')).toBeTruthy();
    expect(screen.getByText('Sub')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Go' }).getAttribute('href')).toBe('/go');
  });

  it('Separator applies the configured border', () => {
    const { container } = render(
      <Separator data={{ border_width: 4, border_style: 'dashed', border_color: '#000' }} />
    );
    const div = container.firstElementChild as HTMLElement;
    expect(div.style.borderTopWidth).toBe('4px');
    expect(div.style.borderStyle).toBe('dashed');
    // jsdom normalises hex colours to `rgb(...)`.
    expect(div.style.borderColor).toBe('rgb(0, 0, 0)');
  });

  it('Stats renders each counter with its title', () => {
    render(
      <Stats data={{ stats: [{ title: 'Orders', number: 42 }, { title: 'Clients', number: 7, more_then: true }] }} />
    );
    expect(screen.getByText('Orders')).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('+7')).toBeTruthy();
  });

  it('TextAndButton renders the title, text and button', () => {
    render(
      <TextAndButton
        data={{ title: 'Title', text: 'Body', button_title: 'Click', url: '/here', doted_bg: true }}
      />
    );
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Click' }).getAttribute('href')).toBe('/here');
  });

  it('BannersBrutal renders the banner images', () => {
    const { container } = render(<BannersBrutal data={{ banners: [{ image: 'b1.jpg', url: '/b1' }] }} />);
    expect(container.querySelector('img')?.getAttribute('src')).toBe('b1.jpg');
  });

  it('CustomReviewsBrutal renders the review name, text and stars', () => {
    const { container } = render(
      <CustomReviewsBrutal
        data={{ title: 'Reviews', reviews: [{ name: 'Sara', text: 'Great', stars: 5 }] }}
      />
    );
    expect(screen.getByText('Sara')).toBeTruthy();
    expect(screen.getByText('Great')).toBeTruthy();
    expect(container.querySelector('salla-rating-stars')?.getAttribute('value')).toBe('5');
  });

  it('BrutalTestimonials maps order_by to the reviews sort and forwards the limit', () => {
    const { rerender } = render(
      <BrutalTestimonials
        data={{ title: 'Testimonials', order_by: 'highest', limit: 4, hide_names: true, display_all_url: true }}
      />
    );
    expect(screen.getByText('Testimonials')).toBeTruthy();
    expect(screen.getByRole('link', { name: /View All/ }).getAttribute('href')).toBe(
      '/testimonials'
    );
    const reviews = screen.getByTestId('reviews');
    expect(reviews.getAttribute('data-sort')).toBe('top_rating');
    expect(reviews.getAttribute('data-limit')).toBe('4');

    rerender(<BrutalTestimonials data={{ order_by: 'newest' }} />);
    expect(screen.getByTestId('reviews').getAttribute('data-sort')).toBe('latest');
    expect(screen.queryByRole('link', { name: /View All/ })).toBeNull();

    rerender(
      <BrutalTestimonials data={{ ar: { title: 'آراء العملاء' }, order_by: 'newest' }} />
    );
    expect(screen.getByText('آراء العملاء')).toBeTruthy();
  });
});
