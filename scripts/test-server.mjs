// Servidor de teste em porta efêmera; nunca altera URLs da aplicação.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
export async function startTestServer() {
  const root = path.resolve('dist');
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.woff2': 'font/woff2',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };
  const server = http.createServer(async (req, res) => {
    try {
      let file = path.resolve(
        root,
        '.' +
          decodeURIComponent(new URL(req.url, 'http://test.invalid').pathname),
      );
      if (file !== root && !file.startsWith(root + path.sep)) {
        res.writeHead(403).end();
        return;
      }
      if ((await fs.stat(file)).isDirectory())
        file = path.join(file, 'index.html');
      const data = await fs.readFile(file);
      res.setHeader(
        'Content-Type',
        types[path.extname(file)] || 'application/octet-stream',
      );
      res.end(data);
    } catch {
      res.writeHead(404).end('Not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '::1', resolve));
  return {
    url: 'http://[' + server.address().address + ']:' + server.address().port,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}
