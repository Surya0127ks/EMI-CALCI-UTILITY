import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/config';
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/home-loan-emi-calculator', '/car-loan-emi-calculator', '/personal-loan-emi-calculator', '/about', '/contact', '/privacy-policy', '/terms-of-service', '/disclaimer'];
  return paths.map((path) => ({ url: `${SITE_ORIGIN}${path}/`, lastModified: new Date(), changeFrequency: path === '' ? 'weekly' : 'monthly', priority: path === '' ? 1 : path.includes('emi-calculator') ? 0.9 : 0.4 }));
}
