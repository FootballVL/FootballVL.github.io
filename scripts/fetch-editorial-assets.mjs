import fs from 'node:fs/promises';
import path from 'node:path';

// Optional asset regeneration. Run from the repository root with Node 22+.

const entries = [
  ['thijs-dallinga', 'Thijs Dallinga'], ['adam-hlozek', 'Adam Hložek'],
  ['ryan-yates', 'Ryan Yates'], ['branco-van-den-boomen', 'Branco van den Boomen'],
  ['ryan-christie', 'Ryan Christie'], ['aleksandar-mitrovic', 'Aleksandar Mitrović'],
  ['joshua-zirkzee', 'Joshua Zirkzee'], ['scott-mckenna', 'Scott McKenna'],
  ['nikola-moro', 'Nikola Moro'], ['chancel-mbemba', 'Chancel Mbemba'],
  ['erling-haaland', 'Erling Haaland'], ['pedri', 'Pedri'], ['bukayo-saka', 'Bukayo Saka'],
  ['vinicius-junior', 'Vinícius Júnior'], ['kylian-mbappe', 'Kylian Mbappé'],
  ['florian-wirtz', 'Florian Wirtz'], ['jude-bellingham', 'Jude Bellingham'],
  ['khvicha-kvaratskhelia', 'Khvicha Kvaratskhelia'], ['declan-rice', 'Declan Rice'], ['neymar', 'Neymar'],
];
const headers = { 'User-Agent': 'FootballValueLabPortfolio/1.0 (educational portfolio, Wikimedia photo attribution)' };
async function get(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(url, { headers });
    if (response.ok) return response;
    if (response.status !== 429 && response.status !== 503) throw new Error(`${response.status}: ${url}`);
    await new Promise((resolve) => setTimeout(resolve, 2500 * (attempt + 1)));
  }
  throw new Error(`Retry limit: ${url}`);
}
const api = new URL('https://en.wikipedia.org/w/api.php');
api.search = new URLSearchParams({ action: 'query', titles: entries.map(([, title]) => title).join('|'), prop: 'pageimages', piprop: 'thumbnail|original|name', pithumbsize: '720', format: 'json', redirects: '1' });
const data = await (await get(api)).json();
const pages = Object.values(data.query.pages);
const metadataApi = new URL('https://commons.wikimedia.org/w/api.php');
metadataApi.search = new URLSearchParams({ action: 'query', titles: pages.filter((p) => p.pageimage).map((p) => `File:${p.pageimage}`).join('|'), prop: 'imageinfo', iiprop: 'extmetadata|url', format: 'json' });
const metadata = Object.values((await (await get(metadataApi)).json()).query.pages);
const plain = (value = '') => value.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#160;/g, ' ').trim();
await fs.mkdir('public/photos', { recursive: true });
await fs.mkdir('public/fonts', { recursive: true });
const photos = {};
for (const [id, title] of entries) {
  const normalizedTitle = data.query.redirects?.find((r) => r.from === title)?.to ?? title;
  const page = pages.find((p) => p.title === normalizedTitle);
  if (!page?.thumbnail) { console.log(`MISSING ${id}`); continue; }
  const file = metadata.find((p) => p.title === `File:${page.pageimage.replaceAll('_', ' ')}` || p.title === `File:${page.pageimage}`);
  const info = file?.imageinfo?.[0];
  if (!info) throw new Error(`Missing credit: ${id} ${page.pageimage}`);
  const ext = info.extmetadata;
  const license = plain(ext.LicenseShortName?.value);
  if (!/CC BY|public domain|CC0/i.test(license)) throw new Error(`Review license for ${id}: ${license}`);
  const sourceUrl = page.thumbnail.source;
  const extension = new URL(sourceUrl).pathname.endsWith('.png') ? 'png' : 'jpg';
  const asset = `photos/${id}.${extension}`;
  await fs.writeFile(path.join('public', asset), Buffer.from(await (await get(sourceUrl)).arrayBuffer()));
  photos[id] = { src: asset, sourceUrl: info.descriptionurl, author: plain(ext.Artist?.value), license, licenseUrl: ext.LicenseUrl?.value ?? info.descriptionurl, date: plain(ext.DateTimeOriginal?.value), description: plain(ext.ImageDescription?.value).slice(0, 450) };
  console.log(`${id}: ${license} / ${photos[id].author.slice(0, 70)}`);
  await new Promise((resolve) => setTimeout(resolve, 350));
}
await fs.writeFile('src/data/photos.json', JSON.stringify(photos, null, 2) + '\n');
for (const [family, weight, filename] of [['barlow-condensed', '700', 'display'], ['ibm-plex-sans', '400', 'body'], ['ibm-plex-sans', '600', 'body-semibold'], ['ibm-plex-mono', '400', 'mono']]) {
  const font = await get(`https://cdn.jsdelivr.net/npm/@fontsource/${family}/files/${family}-latin-${weight}-normal.woff2`);
  await fs.writeFile(`public/fonts/${filename}.woff2`, Buffer.from(await font.arrayBuffer()));
  const license = await get(`https://cdn.jsdelivr.net/npm/@fontsource/${family}/LICENSE`);
  await fs.writeFile(`public/fonts/${family}-LICENSE.txt`, await license.text());
}
console.log(`Saved ${Object.keys(photos).length} real player photos and local fonts.`);
