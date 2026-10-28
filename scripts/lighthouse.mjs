import net from 'node:net';
import { startTestServer } from './test-server.mjs';
const local = process.env.QA_URL ? null : await startTestServer();
const probe = net.createServer();
await new Promise((resolve) => probe.listen(0, resolve));
const debugPort = probe.address().port;
await new Promise((resolve) => probe.close(resolve));
import lighthouse from 'lighthouse';
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({
  channel: process.env.BROWSER_CHANNEL || 'chrome',
  headless: true,
  args: ['--remote-debugging-port=' + debugPort],
});
await fs.mkdir('artifacts', { recursive: true });
try {
  for (const mode of ['mobile', 'desktop']) {
    const result = await lighthouse(
      process.env.QA_URL || local.url,
      {
        port: debugPort,
        output: ['html', 'json'],
        logLevel: 'error',
        onlyCategories: [
          'performance',
          'accessibility',
          'best-practices',
          'seo',
        ],
      },
      {
        extends: 'lighthouse:default',
        settings:
          mode === 'desktop'
            ? {
                formFactor: 'desktop',
                screenEmulation: {
                  mobile: false,
                  width: 1350,
                  height: 940,
                  deviceScaleFactor: 1,
                  disabled: false,
                },
                throttling: {
                  rttMs: 40,
                  throughputKbps: 10240,
                  cpuSlowdownMultiplier: 1,
                },
              }
            : {},
      },
    );
    await fs.writeFile(
      'artifacts/lighthouse-' + mode + '.html',
      result.report[0],
    );
    await fs.writeFile(
      'artifacts/lighthouse-' + mode + '.json',
      result.report[1],
    );
    process.stdout.write(
      mode +
        ' ' +
        JSON.stringify(
          Object.fromEntries(
            Object.entries(result.lhr.categories).map(([k, v]) => [
              k,
              Math.round(v.score * 100),
            ]),
          ),
        ),
    );
  }
} finally {
  await browser.close();
  await local?.close();
}
