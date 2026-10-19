import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const sharp = require(process.env.SHARP_MODULE || 'sharp');
const entries = [['deniz-undav', 'Deniz Undav'], ['mario-gotze', 'Mario Götze'], ['sergio-camello', 'Sergio Camello'], ['dele-alli', 'Dele Alli'], ['alejandro-balde', 'Alejandro Balde'], ['nicolas-pepe', 'Nicolas Pépé'], ['ansu-fati', 'Ansu Fati'], ['giovanni-reyna', 'Giovanni Reyna'], ['piotr-zielinski', 'Piotr Zieliński'], ['leny-yoro', 'Leny Yoro'], ['hugo-guillamon', 'Hugo Guillamón']];
const headers = { 'User-Agent': 'FootballValueLabPortfolio/1.0 (educational portfolio; Wikimedia attribution)' };
async function get(url) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const response = await fetch(url, { headers });
    if (response.ok) return response;
    if (![429, 503].includes(response.status)) throw new Error(`${response.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
  }
  throw new Error(`Retry limit: ${url}`);
}
const api = new URL('https://en.wikipedia.org/w/api.php');
api.search = new URLSearchParams({ action: 'query', titles: entries.map(([, title]) => title).join('|'), prop: 'pageimages', piprop: 'thumbnail|name', pithumbsize: '720', format: 'json', redirects: '1' });
const data = await (await get(api)).json(); const pages = Object.values(data.query.pages);
const commons = new URL('https://commons.wikimedia.org/w/api.php');
commons.search = new URLSearchParams({ action: 'query', titles: pages.filter((page) => page.pageimage).map((page) => `File:${page.pageimage}`).join('|'), prop: 'imageinfo', iiprop: 'extmetadata|url', format: 'json' });
const metadata = Object.values((await (await get(commons)).json()).query.pages);
const plain = (value = '') => value.replace(/<[^>]*>/g, '').replaceAll('&amp;', '&').replaceAll('&#160;', ' ').trim();
const photos = JSON.parse(await fs.readFile('src/data/photos.json', 'utf8'));
for (const [id, title] of entries) {
  const normalized = data.query.redirects?.find((redirect) => redirect.from === title)?.to ?? title;
  const page = pages.find((page) => page.title === normalized);
  let info = metadata.find((file) => file.title.replaceAll('_', ' ') === `File:${page?.pageimage}`.replaceAll('_', ' '))?.imageinfo?.[0];
  let imageUrl = page?.thumbnail?.source;
  if (id === 'sergio-camello') {
    const fallback = new URL('https://commons.wikimedia.org/w/api.php');
    fallback.search = new URLSearchParams({ action: 'query', titles: 'File:FC Salzburg gegen Atletico Madrid (Testspiel 28. Juli 2021) 49.jpg', prop: 'imageinfo', iiprop: 'extmetadata|url', iiurlwidth: '720', format: 'json' });
    info = Object.values((await (await get(fallback)).json()).query.pages)[0].imageinfo[0];
    imageUrl = info.thumburl;
  }
  if (!info) throw new Error(`No photo metadata: ${title}`);
  const ext = info.extmetadata; const license = plain(ext.LicenseShortName?.value);
  if (!/CC BY|public domain|CC0/i.test(license)) throw new Error(`License review required: ${title}: ${license}`);
  if (!imageUrl) throw new Error(`No verified photo: ${title}`);
  const bytes = Buffer.from(await (await get(imageUrl)).arrayBuffer());
  const src = `photos/${id}.webp`;
  await sharp(bytes).resize({ width: 640, withoutEnlargement: true }).webp({ quality: 84 }).toFile(`public/${src}`);
  photos[id] = { src, sourceUrl: info.descriptionurl, author: plain(ext.Artist?.value), license, licenseUrl: ext.LicenseUrl?.value ?? info.descriptionurl, date: plain(ext.DateTimeOriginal?.value), description: plain(ext.ImageDescription?.value).slice(0, 450) };
  console.log(`${id}: ${license}`);
}
const selection = JSON.parse(await fs.readFile('src/data/playerSelection.json', 'utf8'));
const selectedPhotos = Object.fromEntries(selection.map(({ id }) => { if (!photos[id]) throw new Error(`Missing photo: ${id}`); return [id, photos[id]]; }));
await fs.writeFile('src/data/photos.json', JSON.stringify(selectedPhotos, null, 2) + '\n');
