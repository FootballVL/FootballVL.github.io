import fs from 'node:fs/promises';
const archive = JSON.parse(await fs.readFile('src/data/reportArchive.json', 'utf8'));
const names = ['Thijs Dallinga', 'Deniz Undav', 'Ryan Yates', 'Branco van den Boomen', 'Ryan Christie', 'Aleksandar Mitrović', 'Joshua Zirkzee', 'Scott McKenna', 'Mario Götze', 'Sergio Camello', 'Dele Alli', 'Pedri', 'Alejandro Balde', 'Nicolas Pépé', 'Ansu Fati', 'Giovanni Reyna', 'Piotr Zielinski', 'Leny Yoro', 'Hugo Guillamón', 'Neymar'];
const normalise = (name) => name.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
const decode = (text) => text.replaceAll('&amp;', '&');
const tables = archive[56].tables;
const records = names.map((name) => {
  const candidates = tables.flatMap((table, tableIndex) => table.rows.filter((row) => normalise(row[0]) === normalise(name)).map((row) => ({ tableIndex, fields: Object.fromEntries(table.columns.map((key, i) => [key, row[i]])) })));
  if (!candidates.length) throw new Error(`Missing source record: ${name}`);
  const fields = Object.assign({}, ...candidates.map((candidate) => candidate.fields));
  const observedValue = Number(fields.precio_real); const estimatedValue = Number(fields.precio_teorico);
  if (![observedValue, estimatedValue, Number(fields.age)].every(Number.isFinite)) throw new Error(`Invalid source values: ${name}`);
  return { id: normalise(name).replace(/[^a-z0-9]+/g, '-'), name, team: decode(fields.team), ...(fields.league ? { league: fields.league } : {}), age: Number(fields.age), role: fields.rol_funcional, ...(fields['minutes.played'] ? { minutesPlayed: Number(fields['minutes.played']) } : {}), observedValue, estimatedValue, difference: estimatedValue - observedValue, ratio: estimatedValue / observedValue, ...(fields.z_score ? { zScore: Number(fields.z_score) } : {}), sourceTable: `Random Forest / topic 56 / tables ${candidates.map((candidate) => candidate.tableIndex + 1).join(', ')}`, signal: estimatedValue >= observedValue ? 'estimated_above_market' : 'estimated_below_market' };
});
await fs.writeFile('src/data/playerSelection.json', JSON.stringify(records, null, 2) + '\n');
console.log(`Recovered ${records.length} exact player records; no league or playing-time values inferred.`);
