import { useState } from 'react';
import { SallaAppsIcons } from '@salla.sa/twilight-components-react/apps-icons';
import { SallaContacts } from '@salla.sa/twilight-components-react/contacts';
import { SallaSocial } from '@salla.sa/twilight-components-react/social';
import { SallaMenu } from '@salla.sa/twilight-components-react/menu';
import { SallaTrustBadges } from '@salla.sa/twilight-components-react/trust-badges';
import { SallaPayments } from '@salla.sa/twilight-components-react/payments';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { HookSlot, useIsClient } from '@salla.sa/twilight-theme-engine/hooks';
import { Link, Image } from '@salla.sa/twilight-theme-engine/common';
import { ImageModal } from '@salla.sa/twilight-theme-engine/components/modal';
import { openStoreSwitcher } from '../../lib/storeSwitchers';

/**
 * Fork of the engine `Footer` (`components/layout/Footer.tsx`).
 *
 * Differs from the engine only where the Twig theme's footer settings need it:
 *  - `sub_logo`: uses the merchant's alternate logo (for dark footers) instead
 *    of `store.logo`;
 *  - `show_store_name_footer`: prints the store name under the logo;
 *  - `lang_button_bottom`: puts the language / currency switcher in the footer's
 *    bottom bar (the shared `<SallaLocalizationModal>` is already mounted by
 *    `ThemeLayout`'s `GlobalModals`, so the button only dispatches the event).
 *
 * Everything else — layout, trust badges, tax/SBC, payments, copyright — is the
 * engine's own markup. See FORKS.md.
 */

const TAX_ICON_URL =
  'https://cdn.salla.network/cdn-cgi/image/fit=scale-down,width=70,height=70,onerror=redirect,format=auto/images/tax.png?v=2.0.5';

function FooterTax({ dark }: { dark: boolean }) {
  const { store } = useTwilight();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const number = store.settings?.tax?.number;
  const certificate = store.settings?.tax?.certificate;
  if (!number) return null;

  return (
    <div
      data-testid="store-footer-tax"
      className="store-footer__tax flex items-end gap-2 rtl:space-x-reverse"
    >
      {certificate && (
        <>
          <button
            type="button"
            data-testid="store-footer-tax-certificate"
            className="store-footer__tax-cert shrink-0"
            aria-label={t('common.elements.tax_certificate', 'Tax Certificate')}
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            <img
              src={TAX_ICON_URL}
              alt={t('common.elements.tax_certificate', 'Tax Certificate')}
              width={40}
              height={50}
              loading="lazy"
              decoding="async"
              className="w-10 rounded-sm transition-opacity hover:opacity-80"
            />
          </button>
          <ImageModal
            isOpen={open}
            onClose={() => setOpen(false)}
            src={certificate}
            alt={t('common.elements.tax_certificate', 'Tax Certificate')}
            title={t('common.elements.tax_certificate', 'Tax Certificate')}
          />
        </>
      )}
      <div>
        <p className={`mb-1 text-sm opacity-70 ${dark ? 'text-white' : ''}`}>
          {t('common.elements.tax_number', 'Tax Number')}
        </p>
        <b className="text-sm">{number}</b>
      </div>
    </div>
  );
}

const SBC_ICON_URL = 'https://cdn.salla.network/images/sbc.png?v=2.0.5';

function FooterSbc({ dark }: { dark: boolean }) {
  const { store } = useTwilight();
  const { t } = useTranslation();
  const id = store.settings?.certificate?.id;
  if (!id) return null;

  return (
    <a
      href={`https://eauthenticate.saudibusiness.gov.sa/certificate-details/${encodeURIComponent(id)}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="store-footer-sbc"
      className="store-footer__sbc flex items-center gap-2.5 transition-opacity hover:opacity-75"
    >
      <img
        src={SBC_ICON_URL}
        alt={`SBC ${id}`}
        width={56}
        height={40}
        loading="lazy"
        decoding="async"
        className="h-10 w-14 rounded-sm"
      />
      <div>
        <p className={`text-xs opacity-70 ${dark ? 'text-white' : ''}`}>
          {t('blocks.footer.sbc_trusted_by', 'Trusted by')}
        </p>
        <b className="text-sm">{t('blocks.footer.sbc_platform', 'Business Platform')}</b>
      </div>
    </a>
  );
}

function FooterTrust({ dark, centered }: { dark: boolean; centered: boolean }) {
  return (
    <div
      data-testid="store-footer-trust"
      className={`store-footer__trust flex flex-wrap items-end gap-x-6 gap-y-3${centered ? ' justify-center' : ''}`}
    >
      <FooterTax dark={dark} />
      <FooterSbc dark={dark} />
      <SallaTrustBadges {...(dark ? { dark: true } : {})} />
    </div>
  );
}

function FooterLinksMenu({
  inSheet,
  className,
  heading,
}: {
  inSheet: boolean;
  className: string;
  heading?: string;
}) {
  if (inSheet) return null;

  const menu = <SallaMenu source="footer" className={className} suppressHydrationWarning />;
  if (!heading) return menu;

  return (
    <div className="store-footer__links">
      {/* The brutal footer is always the dark `bg-bc` band, so headings are light. */}
      <h3 className="mb-3 text-lg font-bold text-base-100 lg:mb-5">{heading}</h3>
      {menu}
    </div>
  );
}

function FooterApps({ className }: { className: string }) {
  const { store } = useTwilight();
  const { t } = useTranslation();
  const isClient = useIsClient();
  if (!store.apps?.appstore && !store.apps?.googleplay) return null;

  return (
    <div data-testid="store-footer-apps" className={`store-footer__apps ${className}`}>
      {isClient && (
        <SallaAppsIcons
          apps={store.apps}
          appsTitle={t('blocks.footer.download_apps', 'Get our apps')}
        />
      )}
    </div>
  );
}

/**
 * The logo link. Uses the `sub_logo` setting first (for dark footers the
 * merchant may set a light logo), and renders the store name next to it when
 * `show_store_name_footer` is on.
 */
function FooterLogo({ className }: { className: string }) {
  const { store, theme } = useTwilight();
  // These are Twig-era settings the generated `ThemeSettings` type predates.
  const settings = theme.settings as Record<string, unknown> | undefined;
  const subLogo = typeof settings?.sub_logo === 'string' ? settings.sub_logo : undefined;
  const showName = !!settings?.show_store_name_footer;

  return (
    <Link
      to="/"
      className={`store-footer__logo inline-flex items-center gap-3 m-0 transition-opacity hover:opacity-75 ${className}`}
    >
      <Image
        src={subLogo || store.logo}
        alt={store.name || 'Store'}
        width={150}
        height={44}
        objectFit="contain"
        className="h-11 w-auto max-w-[180px]"
      />
      {showName && <span className="store-footer__store-name text-lg font-bold">{store.name}</span>}
    </Link>
  );
}

function FooterDescription({ className }: { className: string }) {
  const { store } = useTwilight();
  if (!store.description) return null;
  return (
    <div
      className={`store-footer__desc opacity-80 ${className}`}
      dangerouslySetInnerHTML={{ __html: store.description }}
    />
  );
}

function FooterContacts({ className }: { className: string }) {
  const { store } = useTwilight();
  const { t } = useTranslation();
  if (!store.contacts?.phone && !store.contacts?.email) return null;
  return (
    <div className={`store-footer__contacts ${className}`}>
      <SallaContacts
        contacts={store.contacts}
        contactsTitle={t('blocks.footer.social', 'Contact us')}
        isHeader
      />
    </div>
  );
}

/** `lang_button_bottom` — the language / currency switcher for the bottom bar. */
function FooterLanguageButton() {
  const { store, currency } = useTwilight();
  const { languageName } = useTranslation();

  const show = !!store?.settings?.is_multilingual || !!store?.settings?.currencies_enabled;
  if (!show) return null;

  return (
    <div className="header-buttons">
      <button
        type="button"
        onClick={() => openStoreSwitcher('language')}
        className="btn--rounded-gray basis-0"
      >
        <span className="rtl:ml-1.5 ltr:mr-1.5 flex">
          <i className="sicon-world" />
        </span>
        <span>{languageName}</span>
        <span className="mx-1.5">|</span>
        <span>{currency?.symbol}</span>
      </button>
    </div>
  );
}

function FooterCenteredBody({ inSheet, isDark }: { inSheet: boolean; isDark: boolean }) {
  return (
    <div className="container mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
      <FooterLogo className="" />
      <FooterDescription className="" />
      <FooterContacts className="" />
      <SallaSocial />

      <FooterLinksMenu
        inSheet={inSheet}
        className="store-footer__menu store-footer__menu--inline"
      />

      <FooterTrust dark={isDark} centered />

      <FooterApps className="flex flex-col items-center gap-3" />
    </div>
  );
}

function FooterColumnsBody({ inSheet, isDark }: { inSheet: boolean; isDark: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="container grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
      <div className="store-footer__brand rtl:lg:pl-16 ltr:lg:pr-16 sm:col-span-2">
        <FooterLogo className="mb-5" />
        <FooterDescription className="max-w-sm leading-6 my-5" />
        <FooterContacts className="mb-6" />
        <SallaSocial className="block mb-6" />
        <FooterTrust dark={isDark} centered={false} />
      </div>

      <FooterLinksMenu
        inSheet={inSheet}
        className="store-footer__menu store-footer__menu--stacked"
        heading={t('blocks.footer.important_links', 'Important links')}
      />

      <FooterApps className="" />
    </div>
  );
}

export interface FooterProps {
  inSheet?: boolean;
}

export function Footer({ inSheet = false }: FooterProps) {
  const { store, theme } = useTwilight();
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  const isCentered = theme.settings?.footer_layout === 'centered';
  const isDark = !!theme.settings?.footer_is_dark;
  const langButtonBottom = !!(theme.settings as Record<string, unknown> | undefined)
    ?.lang_button_bottom;

  const Root = inSheet ? 'div' : 'footer';

  return (
    <Root
      className={`store-footer store-footer--${isCentered ? 'centered' : 'columns'}${
        inSheet ? ' store-footer--sheet' : ''
      } relative mt-8 sm:mt-16 bg-bc text-base-100`}
      suppressHydrationWarning
    >
      {!inSheet && <HookSlot name="footer:start" />}

      <div
        aria-label="footer"
        className="store-footer__inner border-b border-dashed border-base-100 bg-bc py-8 lg:py-16"
      >
        {isCentered ? (
          <FooterCenteredBody inSheet={inSheet} isDark={isDark} />
        ) : (
          <FooterColumnsBody inSheet={inSheet} isDark={isDark} />
        )}
      </div>

      <div className="store-footer__bottom container flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4 py-4 lg:py-7 text-center">
        {langButtonBottom && <FooterLanguageButton />}

        <span className="text-sm text-base-100 copyright-text">
          <HookSlot
            name="copyright"
            context={{ storeName: store.name }}
            fallback={
              <>
                {t('blocks.footer.copyright', 'All rights reserved')}{' '}
                <Link to="/" className="transition-opacity hover:opacity-75 hover:text-primary">
                  {store.name}
                </Link>{' '}
                © {year}
              </>
            }
          />
        </span>

        <SallaPayments />
      </div>

      {!inSheet && <HookSlot name="footer:end" />}
    </Root>
  );
}
