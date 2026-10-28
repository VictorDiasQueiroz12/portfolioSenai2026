import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const projects = JSON.parse(fs.readFileSync('src/data/projects.json', 'utf8'));
const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
const text = (s) =>
  decode(s.replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
const hash = (p) =>
  crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const baseline = JSON.parse(
  fs.readFileSync('tests/fixtures/preservation.json', 'utf8'),
);
for (const original of baseline.projects) {
  const p = projects.find((p) => p.id === original.id);
  assert.ok(p, 'Missing activity ' + original.id);
  assert.deepEqual(p, original, 'Original record changed: ' + original.id);
  const built = fs.readFileSync(
    'dist/projetos/' + p.id + '/index.html',
    'utf8',
  );
  const readable = text(built);
  for (const f of p.fields)
    assert.ok(readable.includes(text(f.text)), 'Missing paragraph ' + p.id);
  for (const link of [...p.links.map((l) => l.url), ...p.videos, ...p.images])
    assert.ok(decode(built).includes(link), 'Missing material ' + link);
  for (const code of p.code)
    assert.ok(readable.includes(text(code)), 'Missing code ' + p.id);
}
assert.equal(baseline.projects.length, 29);
assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
for (const [file, expected] of Object.entries(baseline.images)) {
  assert.equal(hash('public/fotos/' + file), expected);
  assert.ok(
    fs.existsSync('dist/optimized/' + file.replace(/\.[^.]+$/, '.webp')),
  );
}
const index = fs.readFileSync('dist/index.html', 'utf8');
assert.doesNotMatch(
  index,
  /<form\b|data-netlify|netlify-honeypot|#contato|id="contato"/,
);
assert.ok(index.includes('/assets/img/foto-inicio.webp'));
assert.equal(
  (index.match(/src="[^"]*optimized\/victor.webp"/g) || []).length,
  1,
);
assert.equal(
  hash('dist/assets/curriculo-victor-queiroz.pdf'),
  '867653452e96e8676dafa16b09028e27404f3c26f52834dd8f9ea24ec41b229b',
);
assert.ok(!fs.existsSync('dist/obrigado'));
assert.ok(!fs.existsSync('dist/curriculo-victor-queiroz.pdf'));
for (const p of projects) {
  const html = fs.readFileSync('dist/projetos/' + p.id + '/index.html', 'utf8');
  assert.doesNotMatch(
    html,
    /Consultar registro original|href="[^" ]*\/original\//,
  );
}
assert.ok(!index.includes('<iframe'));
assert.ok(fs.statSync('dist/assets/curriculo-victor-queiroz.pdf').size > 1000);
for (const f of ['robots.txt', 'sitemap.xml', 'social-card.png', 'favicon.svg'])
  assert.ok(fs.existsSync('dist/' + f));
process.stdout.write(
  'PASS: 29 atividades originais; textos, links, vídeos, imagens e códigos; 26 imagens intactas;  ausência de formulário; PDF oficial, fotos e SEO.',
);
