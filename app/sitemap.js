import { SITE_ROUTES } from '@/lib/serverData';
import { getSiteUrl } from '@/lib/runtimeConfig';

const routes = [...new Set(SITE_ROUTES)];
const siteUrl = getSiteUrl();

export default function sitemap() {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/system' ? 'daily' : route === '/about' || route === '/contact' ? 'monthly' : 'weekly',
    priority: route === '' ? 1 : route === '/system' ? 0.9 : 0.8,
  }));
}
