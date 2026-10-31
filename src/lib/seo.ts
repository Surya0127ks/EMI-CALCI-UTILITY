import { SITE_ORIGIN, SITE_NAME } from './config';
import type { Faq } from '@/components/content';
import type { Metadata } from 'next';

export function metadataFor(title: string, description: string, path: string): Metadata {
  const canonical = `${SITE_ORIGIN}${path}`;
  return { title, description, alternates: { canonical }, openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: 'website' }, twitter: { card: 'summary', title, description } };
}
export function structuredData(path: string, title: string, description: string, faqs: Faq[]) {
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE_ORIGIN}/`, inLanguage: 'en' },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: `${SITE_ORIGIN}${path}`, description, isAccessibleForFree: true, browserRequirements: 'Requires JavaScript enabled', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` }, { '@type': 'ListItem', position: 2, name: title, item: `${SITE_ORIGIN}${path}` }] }
  ];
}
