import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const source = await read('src/content/es.json');
const spanish = await read('src/i18n/locales/es.json');
for (const [key, value] of Object.entries(spanish)) assert.equal(value, source[key], `Spanish edition diverges from its authored source: ${key}`);
assert.equal(spanish['Read the author’s discussion'], 'Mi interpretación de los resultados');
assert(!spanish['The mapping relies on the order of unique team names. A reproducible extension should verify that order and audit unmatched joins. The September rating also postdates the June valuation snapshot.']?.includes('junio'));
const players = await read('src/data/playerSelection.json'); const archive = await read('src/data/reportArchive.json'); const photos = await read('src/data/photos.json');
assert.equal(players.length, 20);
assert.equal(new Set(players.map((player) => player.id)).size, 20);
const normalise = (text) => text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
for (const player of players) {
  const rows = archive[56].tables.flatMap((table) => table.rows.filter((row) => normalise(row[0]) === normalise(player.name)).map((row) => Object.fromEntries(table.columns.map((column, i) => [column, row[i]]))));
  assert(rows.some((row) => Number(row.precio_real) === player.observedValue && Number(row.precio_teorico) === player.estimatedValue), `Unverified values: ${player.name}`);
  assert.equal(player.difference, player.estimatedValue - player.observedValue);
  if (player.league) assert(rows.some((row) => row.league === player.league), `Unverified league: ${player.name}`);
  if (player.minutesPlayed != null) assert(rows.some((row) => Number(row['minutes.played']) === player.minutesPlayed), `Unverified minutes: ${player.name}`);
  assert(photos[player.id]?.sourceUrl.startsWith('https://commons.wikimedia.org/'));
  await fs.access(`public/${photos[player.id].src}`);
}
for (const name of ['Deniz Undav', 'Mario Götze', 'Sergio Camello', 'Dele Alli', 'Alejandro Balde', 'Nicolas Pépé', 'Ansu Fati', 'Giovanni Reyna', 'Piotr Zielinski', 'Leny Yoro', 'Hugo Guillamón']) assert(players.some((player) => player.name === name), `Missing requested player: ${name}`);
for (const name of ['Erling Haaland', 'Bukayo Saka', 'Vinicius Junior', 'Kylian Mbappe', 'Jude Bellingham']) assert(!players.some((player) => player.name === name));
console.log('Authored Spanish source, 20 source-verified records and 20 attributed photographs OK.');
