import projects from '../data/projects.json';
export function GET({ site }: { site: URL }) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const paths = [
    '/',
    '/cv.html',
    ...projects.map((p) => '/projetos/' + p.id + '/'),
    ...[...new Set(projects.map((p) => p.source))].map((p) => '/' + p),
  ];
  return new Response(
    '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
      paths
        .map(
          (p) => '<url><loc>' + new URL(base + p, site).href + '</loc></url>',
        )
        .join('') +
      '</urlset>',
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
