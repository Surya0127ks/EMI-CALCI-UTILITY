import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header, Footer } from '@/components/site';
import { CookieConsent } from '@/components/consent';
import { AdLoader } from '@/components/ads';
import { SITE_ORIGIN, SITE_NAME, DEFAULT_DESCRIPTION } from '@/lib/config';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
export const metadata: Metadata = { metadataBase: new URL(SITE_ORIGIN), title: { default: `${SITE_NAME} | Free Loan EMI Calculator`, template: `%s | ${SITE_NAME}` }, description: DEFAULT_DESCRIPTION, applicationName: SITE_NAME, alternates: { canonical: '/' }, icons: { icon: '/favicon.svg' }, openGraph: { type: 'website', siteName: SITE_NAME, title: `${SITE_NAME} | Free Loan EMI Calculator`, description: DEFAULT_DESCRIPTION, url: SITE_ORIGIN }, twitter: { card: 'summary_large_image', title: SITE_NAME, description: DEFAULT_DESCRIPTION }, robots: { index: true, follow: true } };
export const viewport: Viewport = { themeColor: '#247b5b' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={inter.variable} suppressHydrationWarning><body><AdLoader /><Header /><main>{children}</main><Footer /><CookieConsent /></body></html>;
}
