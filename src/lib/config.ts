/** Change these site-wide values here before deployment. */
export const SITE_NAME = 'EMICalc Pro';
/** Set NEXT_PUBLIC_SITE_URL at build time to the Pages URL or your custom domain. */
export const DOMAIN = process.env.NEXT_PUBLIC_SITE_URL || 'https://emicalcpro.example';
/** Normalized origin for canonical, sitemap, and structured-data URLs. */
export const SITE_ORIGIN = DOMAIN.replace(/\/+$/, '');
export const CONTACT_EMAIL = 'hello@emicalcpro.example';
export const DEFAULT_DESCRIPTION = 'Plan a smarter loan with free EMI, interest and amortization estimates. Compare home, car and personal loan scenarios privately in your browser.';
export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'CAD', 'AUD', 'SGD'] as const;
export type Currency = typeof CURRENCIES[number];
