const routes = [
  '',
  '/servers/arma3-cth',
  '/servers/rust-biweekly',
  '/servers/rust-weekly',
  '/servers/rust-monthly',
  '/donate',
  '/report-player'
];

export default function sitemap() {
  return routes.map((route) => ({
    url: `https://t-central.me${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8
  }));
}
