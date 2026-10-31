import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../../../app/components/layout/Footer';

const twilight: {
  store: {
    name: string;
    logo: string;
    description?: string;
    contacts?: Record<string, string>;
    apps?: Record<string, string>;
    settings?: Record<string, unknown>;
  };
  theme: { settings: Record<string, unknown> };
} = {
  store: { name: 'Brutal Store', logo: '/logo.png', contacts: {}, apps: {}, settings: {} },
  theme: { settings: {} },
};

vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({
  useTwilight: () => twilight,
}));

vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({
  useTranslation: () => ({
    t: (_k: string, fallback?: string) => fallback ?? _k,
    languageName: 'العربية',
  }),
}));

vi.mock('@salla.sa/twilight-theme-engine/hooks', () => ({
  HookSlot: () => null,
  useIsClient: () => true,
}));

vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, className }: Record<string, unknown>) => (
    <a href={String(to)} className={className as string}>
      {children as React.ReactNode}
    </a>
  ),
  Image: (props: Record<string, unknown>) => (
    <img src={String(props.src ?? '')} alt={String(props.alt ?? '')} />
  ),
}));

vi.mock('@salla.sa/twilight-theme-engine/components/modal', () => ({
  ImageModal: () => null,
}));

vi.mock('@salla.sa/twilight-components-react/apps-icons', () => ({
  SallaAppsIcons: () => <div data-testid="apps" />,
}));
vi.mock('@salla.sa/twilight-components-react/contacts', () => ({
  SallaContacts: () => <div data-testid="contacts" />,
}));
vi.mock('@salla.sa/twilight-components-react/social', () => ({
  SallaSocial: () => <div data-testid="social" />,
}));
vi.mock('@salla.sa/twilight-components-react/menu', () => ({
  SallaMenu: ({ className }: { className?: string }) => (
    <nav data-testid="footer-menu" className={className} />
  ),
}));
vi.mock('@salla.sa/twilight-components-react/trust-badges', () => ({
  SallaTrustBadges: ({ dark }: { dark?: boolean }) => (
    <div data-testid="trust-badges" data-dark={String(!!dark)} />
  ),
}));
vi.mock('@salla.sa/twilight-components-react/payments', () => ({
  SallaPayments: () => <div data-testid="payments" />,
}));

beforeEach(() => {
  twilight.store = {
    name: 'Brutal Store',
    logo: '/logo.png',
    contacts: {},
    apps: {},
    settings: {},
  };
  twilight.theme = { settings: {} };
});

describe('Footer settings', () => {
  it('uses the dark Twig band when footer_is_dark is on', () => {
    twilight.theme.settings = { footer_is_dark: true, footer_layout: 'columns' };
    const { container } = render(<Footer />);

    const footer = container.querySelector('.store-footer');
    expect(footer?.className).toContain('store-footer--columns');
    expect(footer?.className).toContain('store-footer--dark');
    expect(footer?.className).toContain('bg-bc');
    expect(screen.getByTestId('trust-badges').getAttribute('data-dark')).toBe('true');
    expect(screen.getByTestId('footer-menu').className).toContain('store-footer__menu--stacked');
  });

  it('uses the light palette and centered layout when configured', () => {
    // dropdown-list values can arrive wrapped, like other theme settings.
    twilight.theme.settings = {
      footer_is_dark: false,
      footer_layout: [{ value: 'centered' }],
    };
    const { container } = render(<Footer />);

    const footer = container.querySelector('.store-footer');
    expect(footer?.className).toContain('store-footer--centered');
    expect(footer?.className).toContain('store-footer--light');
    expect(footer?.className).toContain('bg-base-50');
    expect(screen.getByTestId('trust-badges').getAttribute('data-dark')).toBe('false');
    expect(screen.getByTestId('footer-menu').className).toContain('store-footer__menu--inline');
  });
});
