import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { startTestServer } from './test-server.mjs';
const local = process.env.QA_URL ? null : await startTestServer();
const base = process.env.QA_URL || local.url;
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
});
await fs.mkdir('artifacts', { recursive: true });
const report = [];
try {
  for (const width of [360, 768, 1280, 1920]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('.project-card').count(), 29);
    assert.equal(
      await page.locator('form, #contato, a[href$="#contato"]').count(),
      0,
    );
    assert.equal(
      await page.locator('#inicio img').getAttribute('src'),
      '/assets/img/foto-inicio.webp',
    );
    assert.equal(
      await page.locator('#sobre img').getAttribute('src'),
      '/optimized/victor.webp',
    );
    assert.equal(
      await page.locator('#sobre img').getAttribute('loading'),
      'lazy',
    );
    assert.equal(await page.locator('footer .social-links a').count(), 3);
    for (const link of await page.locator('footer .social-links a').all()) {
      assert.equal(await link.getAttribute('target'), '_blank');
      assert.equal(await link.getAttribute('rel'), 'noopener noreferrer');
      assert.ok(await link.getAttribute('aria-label'));
    }
    const pdf = await page.request.get(
      base + '/assets/curriculo-victor-queiroz.pdf',
    );
    assert.equal(pdf.status(), 200);
    assert.ok((await pdf.body()).subarray(0, 5).toString() === '%PDF-');

    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      'Overflow ' + width,
    );
    for (const theme of ['light', 'dark']) {
      await page.evaluate(
        (t) => (document.documentElement.dataset.theme = t),
        theme,
      );
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .analyze();
      report.push({
        width,
        theme,
        violations: result.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      });
      await page.screenshot({
        path: 'artifacts/home-' + width + '-' + theme + '.png',
        fullPage: width === 360,
      });
    }
    await page.getByRole('button', { name: 'IoT', exact: true }).click();
    assert.equal(await page.locator('.project-card:visible').count(), 4);
    await page.locator('#project-search').fill('semaforo');
    assert.equal(await page.locator('.project-card:visible').count(), 1);
    await page.locator('#trimester').selectOption('3');
    assert.ok(await page.locator('#no-results').isVisible());
    await page.locator('#project-search').fill('');
    await page.locator('#trimester').selectOption('all');
    await page.getByRole('button', { name: /Todos/ }).click();
    assert.equal(await page.locator('.project-card:visible').count(), 29);
    if (width < 1100) {
      await page.locator('#menu-toggle').click();
      assert.equal(
        await page.locator('#menu-toggle').getAttribute('aria-expanded'),
        'true',
      );
      await page.keyboard.press('Escape');
      assert.equal(
        await page.locator('#menu-toggle').getAttribute('aria-expanded'),
        'false',
      );
    }
    await page.locator('#theme-toggle').click();
    const theme = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    await page.reload();
    assert.equal(
      await page.evaluate(() => document.documentElement.dataset.theme),
      theme,
    );
    await page.goto(base + '/projetos/iot-4/');
    assert.ok((await page.locator('pre').count()) > 0);
    assert.equal(await page.locator('.detail-assets img').count(), 2);
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    const detailAudit = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    report.push({ width, page: 'iot-4', violations: detailAudit.violations });
    assert.deepEqual(errors, []);
    await page.close();
  }
  const page = await browser.newPage({ javaScriptEnabled: false });
  await page.goto(base);
  assert.equal(await page.locator('.project-card').count(), 29);
  assert.equal(await page.locator('form').count(), 0);
  await page.close();
} finally {
  await fs.writeFile(
    'artifacts/browser-qa.json',
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  await local?.close();
}
const violations = report.flatMap((r) => r.violations);
process.stdout.write(
  JSON.stringify(
    report.map((r) => ({
      width: r.width,
      theme: r.theme,
      page: r.page,
      violations: r.violations.length,
    })),
    null,
    2,
  ),
);
assert.equal(
  violations.length,
  0,
  'Acessibilidade: veja artifacts/browser-qa.json',
);
process.stdout.write(
  'PASS: breakpoints, temas, filtros combinados, menu, persistência, código, imagens, sem JS e axe.',
);
