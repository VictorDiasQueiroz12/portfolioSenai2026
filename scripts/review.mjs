import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { startTestServer } from './test-server.mjs';
const local = await startTestServer();
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
});
const paths = [];
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const f = dir + '/' + e.name;
    if (e.isDirectory()) await walk(f);
    else if (f.endsWith('.html')) paths.push(f);
  }
}
await walk('dist');
const internal = new Set(),
  external = new Map();
const checks = [];
for (const file of paths) {
  const html = await fs.readFile(file, 'utf8');
  for (const m of html.matchAll(/(?:href|src|data-video)="([^"]+)"/g)) {
    const href = m[1].replaceAll('&amp;', '&');
    if (href.startsWith('/')) internal.add(href.split('#')[0]);
    else if (/^https?:/.test(href)) {
      if (!external.has(href)) external.set(href, []);
      external.get(href).push(file);
    }
  }
}
const linkResults = [];
for (const href of internal) {
  const res = await fetch(new URL(href, local.url));
  linkResults.push({ url: href, status: res.status, kind: 'internal' });
}
// GET, not HEAD: several material providers reject HEAD even for valid pages.
const queue = [...external];
const remote = [];
await Promise.all(
  Array.from({ length: 5 }, async () => {
    while (queue.length) {
      const [url, files] = queue.shift();
      try {
        const res = await fetch(url, {
          signal: AbortSignal.timeout(20000),
          headers: { 'User-Agent': 'Mozilla/5.0' },
        });
        const type = res.headers.get('content-type') || '';
        let title = '';
        if (type.includes('text/html')) {
          const html = await res.text();
          title =
            html
              .match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]
              ?.replace(/\s+/g, ' ')
              .trim() || '';
        } else await res.body?.cancel();
        remote.push({
          url,
          status: res.status,
          final: res.url,
          title,
          files: [...new Set(files)],
          classification: [404, 410].includes(res.status)
            ? 'not-found'
            : [401, 403, 429, 999].includes(res.status)
              ? 'restricted'
              : res.ok
                ? 'reachable'
                : 'unverified',
        });
      } catch (e) {
        remote.push({
          url,
          status: null,
          error: e.message,
          files: [...new Set(files)],
          classification: 'unverified',
        });
      }
    }
  }),
);
try {
  for (const width of [360, 768, 1280]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    for (const file of paths) {
      const route = '/' + file.slice(5).replace(/index.html$/, '');
      const errors = [];
      const listener = (e) => errors.push(e.message);
      page.on('pageerror', listener);
      const res = await page.goto(new URL(route, local.url).href, {
        waitUntil: 'load',
      });
      await page.evaluate(async () => {
        for (const img of document.images) img.loading = 'eager';
        await Promise.all(
          [...document.images].map((img) => img.decode().catch(() => {})),
        );
        await document.fonts.ready;
      });
      const state = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.src),
        missingAlt: [...document.images].filter((i) => !i.hasAttribute('alt'))
          .length,
        title: document.title,
        description: !!document
          .querySelector('meta[name="description"]')
          ?.getAttribute('content'),
        h1: document.querySelectorAll('h1').length,
      }));
      checks.push({ route, width, status: res.status(), errors, ...state });
      page.off('pageerror', listener);
      if (route === '/') {
        for (const id of [
          'inicio',
          'sobre',
          'habilidades',
          'projetos',
          'formacao',
        ]) {
          await page.locator('#' + id).scrollIntoViewIfNeeded();
          await page.screenshot({
            path: 'artifacts/review-' + width + '-' + id + '.png',
          });
        }
      }
    }
    await context.close();
  }
} finally {
  await browser.close();
  await local.close();
}
remote.sort((a, b) => a.url.localeCompare(b.url));
await fs.writeFile(
  'artifacts/review.json',
  JSON.stringify({ checks, internal: linkResults, external: remote }, null, 2),
);
const failed = checks.filter(
  (c) =>
    c.status !== 200 ||
    c.overflow ||
    c.brokenImages.length ||
    c.missingAlt ||
    c.errors.length ||
    !c.description ||
    c.h1 !== 1,
);
process.stdout.write(
  JSON.stringify(
    {
      pages: paths.length,
      viewports: 3,
      failed,
      internalFailures: linkResults.filter((r) => r.status !== 200),
      external: remote.map(({ url, status, classification, title }) => ({
        url,
        status,
        classification,
        title,
      })),
    },
    null,
    2,
  ),
);
if (failed.length || linkResults.some((r) => r.status !== 200))
  process.exitCode = 1;
