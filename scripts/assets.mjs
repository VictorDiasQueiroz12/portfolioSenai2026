import fs from 'node:fs/promises';
import sharp from 'sharp';
await fs.mkdir('public/optimized', { recursive: true });
const files = await fs.readdir('public/fotos');
for (const file of files) {
  await sharp('public/fotos/' + file)
    .rotate()
    .resize({
      width: file === 'victor.jpg' ? 900 : 1200,
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toFile('public/optimized/' + file.replace(/\.[^.]+$/, '.webp'));
}
const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#f7f8f3"/><circle cx="1090" cy="120" r="250" fill="#d6ec88"/><text x="75" y="110" fill="#234bce" font-family="Arial" font-size="28">VICTOR DIAS QUEIROZ / PORTFÓLIO</text><text x="70" y="300" fill="#172221" font-family="Arial" font-size="88" font-weight="bold">Curiosidade que</text><text x="70" y="405" fill="#234bce" font-family="Arial" font-size="88" font-weight="bold">vira código.</text><text x="75" y="540" fill="#53625e" font-family="Arial" font-size="28">Desenvolvimento de sistemas · Florianópolis, SC</text></svg>';
await sharp(Buffer.from(svg)).png().toFile('public/social-card.png');
process.stdout.write(
  'Imagens WebP e social card gerados; currículo oficial preservado em assets.',
);
