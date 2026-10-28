// Astro emits directory routes for *.html pages. Keep the original file URLs
// usable on static hosts without relying on host-specific directory rewrites.
import fs from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist');
for (const entry of await fs.readdir(output, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.endsWith('.html')) continue;
  const directory = path.resolve(output, entry.name);
  if (path.dirname(directory) !== output)
    throw new Error('Invalid output path');
  const file = path.join(directory, 'index.html');
  const html = await fs.readFile(file);
  await fs.unlink(file);
  await fs.rmdir(directory); // Empty generated folder only; never recursive.
  await fs.writeFile(directory, html);
}
