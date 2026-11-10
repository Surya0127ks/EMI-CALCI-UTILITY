/** Change these site-wide values here before deployment. */
export const SITE_NAME = 'EMICalc Pro';
/** Set NEXT_PUBLIC_SITE_URL at build time to the Pages URL or your custom domain. */
export const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://emi-calci-utility.pages.dev';
/** Normalized origin for canonical, sitemap, and structured-data URLs. */
export const SITE_ORIGIN = DOMAIN.replace(/\/+$/, '');
export const CONTACT_EMAIL = 'hello@emicalcpro.example';
export const DEFAULT_DESCRIPTION = 'Free EMI calculator for home loan, car loan and personal loan in India. Calculate monthly EMI, total interest and amortization schedule instantly. 100% private, no sign-up needed.';
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'CAD', 'AUD', 'SGD'] as const;
export type Currency = typeof CURRENCIES[number];
