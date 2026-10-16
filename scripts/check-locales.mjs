import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const files = (await fs.readdir('src/i18n/locales')).filter((file) => file.endsWith('.json'));
assert.equal(files.length, 16, 'All 16 language catalogues must be committed');
const english = JSON.parse(await fs.readFile('src/i18n/locales/en.json', 'utf8'));
const expected = Object.keys(english).sort();
for (const file of files) {
  const messages = JSON.parse(await fs.readFile(`src/i18n/locales/${file}`, 'utf8'));
  assert.deepEqual(Object.keys(messages).sort(), expected, `${file}: catalogue keys differ`);
  for (const [key, value] of Object.entries(messages)) assert(typeof value === 'string' && value.trim(), `${file}: empty translation for ${key}`);
  for (const label of ['Resources', 'Language', 'Observed', 'Age', 'Variable glossary', 'Read the author’s discussion']) assert(messages[label], `${file}: missing ${label}`);
}
const archive = JSON.parse(await fs.readFile('src/data/reportArchive.json', 'utf8'));
let paragraphs = 0;
for (const topic of archive) for (const paragraph of topic.paragraphs) {
  const key = paragraph.replace(/\s+/g, ' ').trim();
  assert(english[key], `Missing source discussion: ${key.slice(0, 80)}`);
  if (key.length > 70) assert.notEqual(english[key], key, `Source paragraph remains untranslated: ${key.slice(0, 80)}`);
  paragraphs++;
}
console.log(`16 complete catalogues, ${expected.length} messages each; ${paragraphs} source paragraphs covered.`);
