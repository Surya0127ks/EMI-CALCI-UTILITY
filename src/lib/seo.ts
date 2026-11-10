import { SITE_ORIGIN, SITE_NAME } from './config';
import type { Faq } from '@/components/content';
import type { Metadata } from 'next';

export function metadataFor(title: string, description: string, path: string): Metadata {
  const canonical = `${SITE_ORIGIN}${path}`;
  const ogImage = `${SITE_ORIGIN}/og-image.png`;
  return {
    title,
    description,
    keywords: extractKeywords(title, description),
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: SITE_NAME, type: 'website', images: [{ url: ogImage, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] }
  };
}

function extractKeywords(title: string, description: string): string {
  const base = ['EMI calculator', 'loan EMI calculator', 'EMI calculator India', 'free EMI calculator', 'loan calculator'];
  if (title.toLowerCase().includes('home')) base.push('home loan EMI calculator', 'housing loan EMI', 'home loan calculator India');
  if (title.toLowerCase().includes('car')) base.push('car loan EMI calculator', 'vehicle loan EMI', 'auto loan calculator India');
  if (title.toLowerCase().includes('personal')) base.push('personal loan EMI calculator', 'personal loan calculator India');
  return base.join(', ');
}

export function structuredData(path: string, title: string, description: string, faqs: Faq[]) {
  return [
    { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: `${SITE_ORIGIN}/`, logo: `${SITE_ORIGIN}/favicon.svg` },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: `${SITE_ORIGIN}/`, inLanguage: 'en', potentialAction: { '@type': 'SearchAction', target: `${SITE_ORIGIN}/?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: title, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', url: `${SITE_ORIGIN}${path}`, description, isAccessibleForFree: true, browserRequirements: 'Requires JavaScript enabled', offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' }, featureList: 'EMI calculation, Amortization schedule, Prepayment analysis, CSV export' },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` }, { '@type': 'ListItem', position: 2, name: title, item: `${SITE_ORIGIN}${path}` }] }
  ];
}
