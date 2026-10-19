import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('../node_modules/typescript');
const normalise = (value) => value.replace(/\s+/g, ' ').trim();
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
async function writeJson(file, value) {
  for (let attempt = 0; ; attempt++) {
    try { await fs.writeFile(file, JSON.stringify(value, null, 2) + '\n'); return; }
    catch (error) { if (attempt >= 7) throw error; await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1))); }
  }
}
const archive = await read('src/data/reportArchive.json');
const spanish = await read('src/content/es.json');
const voice = await read('src/content/author.es.json');
const editorial = await read('src/content/interface.es.json');
const protectedNames = new Set(['Football Value Lab', 'FOOTBALL VALUE LAB', 'FOOTBALL', 'VALUE LAB', 'FVL', 'FV', 'L', 'EUR', 'GitHub', 'Transfermarkt', 'R', 'React', 'TypeScript', 'Vite', 'ECharts', 'Quarto', 'Kaggle']);
const corpus = new Set();
function loadExports(source) {
  const output = {};
  const code = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('exports', code)(output);
  return output;
}
const research = loadExports(await fs.readFile('src/content/research.ts', 'utf8'));
for (const [index, title, summary, note] of voice.analyses) {
  const original = research.analysisGroups.flatMap((group) => group.entries).find((entry) => entry.sourceIndex === index);
  if (!original) throw new Error(`Unknown analysis: ${index}`);
  Object.assign(editorial, { [original.title]: title, [original.summary]: summary, [original.note]: note });
}
for (const [originals, replacements, fields] of [[research.preparationSteps, voice.preparation, ['title', 'detail', 'reason']], [research.researchTakeaways, voice.takeaways, ['title', 'text']], [research.retrospectiveCases, voice.cases, ['finding', 'interpretation']]]) {
  replacements.forEach((row, index) => fields.forEach((field, column) => { editorial[originals[index][field]] = row[column]; }));
}
Object.assign(spanish, editorial);
for (const topic of archive) {
  for (const paragraph of topic.paragraphs) { const key = normalise(paragraph); corpus.add(key); spanish[key] = key; }
  for (const table of topic.tables) {
    table.columns.forEach((column) => corpus.add(column));
    table.rows.forEach((row) => row.forEach((cell, index) => {
      if (/^(name|team)$/.test(table.columns[index])) protectedNames.add(cell);
      else if (/\p{L}/u.test(cell)) corpus.add(normalise(cell));
    }));
  }
}
const ignoredAttributes = new Set(['className', 'href', 'src', 'id', 'key', 'value', 'role', 'type', 'target', 'rel', 'style', 'dir', 'lang', 'viewBox', 'fontFamily', 'fill', 'stroke', 'd']);
const ignoredProperties = new Set(['id', 'src', 'className', 'href', 'path', 'family', 'color', 'fontFamily', 'type', 'position', 'trigger', 'overflow', 'nameLocation', 'lineStyle', 'symbol', 'extraCssText', 'backgroundColor', 'borderColor']);
function add(value) {
  value = normalise(value);
  if (value.length < 2 || !/\p{L}/u.test(value) || /^(?:[.#/]|https?:|data:)/.test(value) || /[{}]|=>|\\[nds]|\$\{|<\/?[a-z]+>/i.test(value)) return;
  if (/^(?:[a-z0-9]+[-:])+[a-z0-9-]+$/.test(value) || /\.(?:tsx?|css|json|csv|png|jpe?g|webp|mjs|html|woff2)$/.test(value)) return;
  corpus.add(value);
}
async function scan(dir) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (entry.name !== 'locales') await scan(file); continue; }
    if (!/\.tsx?$/.test(entry.name) || /languages\.ts|I18nProvider\.tsx|chartTranslation\.ts/.test(entry.name)) continue;
    const tree = ts.createSourceFile(file, await fs.readFile(file, 'utf8'), ts.ScriptTarget.Latest, true, entry.name.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
    const visit = (node) => {
      if (ts.isJsxText(node)) add(node.text.replaceAll('&gt;', '>').replaceAll('&lt;', '<').replaceAll('&quot;', '"').replaceAll('&apos;', "'").replaceAll('&amp;', '&'));
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const parent = node.parent;
        if (ts.isImportDeclaration(parent) || ts.isLiteralTypeNode(parent) || ts.isExternalModuleReference(parent)) return;
        if (ts.isJsxAttribute(parent) && ignoredAttributes.has(parent.name.text)) return;
        if (ts.isPropertyAssignment(parent) && parent.initializer === node) {
          const key = parent.name.getText(tree).replace(/['"]/g, '');
          if (ignoredProperties.has(key)) return;
        }
        add(node.text);
      }
      if (ts.isTemplateSpan(node) || ts.isTemplateHead(node)) add(node.literal?.text ?? node.text ?? '');
      ts.forEachChild(node, visit);
    }; visit(tree);
  }
}
await scan('src');
for (const player of await read('src/data/playerSelection.json')) { protectedNames.add(player.name); protectedNames.add(player.team); }
for (const [id, photo] of Object.entries(await read('src/data/photos.json'))) { protectedNames.add(id.replaceAll('-', ' ')); protectedNames.add(photo.author); protectedNames.add(photo.license); }
const aliases = loadExports(await fs.readFile('src/i18n/glossary.ts', 'utf8')).variableLabels;
Object.values(aliases).forEach(add);
['Language', 'Beyond the Price Tag', 'Football Value Lab is an interactive data science portfolio case study on historical football market valuations.', 'Difference', 'Estimated', 'Observed', 'valuation dossier', 'blocks', 'tables', 'published comparisons', 'records'].forEach(add);
for (const name of protectedNames) corpus.delete(name);
const keys = [...corpus].sort();
// New interface copy is authored in Spanish. Existing English strings remain
// stable message identifiers, not a translation source or an editorial fallback.
for (const key of keys) if (spanish[key] == null) spanish[key] = key;
for (const [key, meaning] of Object.entries(aliases)) spanish[key] = spanish[meaning] ?? meaning;
for (const topic of archive) for (const table of topic.tables) if (table.columns[0] === 'term') for (const row of table.rows) if (row[0].includes('_x_')) spanish[row[0]] = row[0].split('_x_').map((part) => spanish[part] ?? part).join(' × ');
await writeJson('src/content/es.json', spanish);
await writeJson('src/i18n/protected.json', [...protectedNames].sort());
await fs.mkdir('work/translations-from-spanish', { recursive: true });
const languages = ['es', 'en', 'ja', 'fr', 'de', 'nl', 'zh', 'ko', 'pt', 'it', 'ar', 'hi', 'ru', 'tr', 'id', 'bn'];
const selected = process.argv.find((argument) => argument.startsWith('--language='))?.split('=')[1];
const terminology = await read('src/i18n/terminology.json');
const overrides = await read('src/i18n/overrides.json');
const terms = ['Clean sheets', '20% holdout', 'Striker', 'Game creator', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function translate(batch, language, attempt = 0) {
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  url.search = new URLSearchParams({ client: 'gtx', sl: 'es', tl: language === 'zh' ? 'zh-CN' : language, dt: 't', q: batch.join('\n\n') });
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);
    const result = await response.json(); const text = result[0].map((part) => part[0] ?? '').join('').trim();
    const rows = text.split(/\n\s*\n/);
    if (rows.length === batch.length) return rows.map(normalise);
    if (batch.length === 1) return [normalise(text)];
    const middle = Math.ceil(batch.length / 2);
    return [...await translate(batch.slice(0, middle), language), ...await translate(batch.slice(middle), language)];
  } catch (error) { if (attempt >= 5) throw error; await delay(1500 * 2 ** attempt); return translate(batch, language, attempt + 1); }
}
for (const language of selected ? [selected] : languages) {
  let cache = {}; const cachePath = `work/translations-from-spanish/${language}.json`;
  try { cache = await read(cachePath); } catch { /* First preparation of this edition. */ }
  const pending = language === 'es' ? [] : [...new Set(keys.map((key) => spanish[key]))].filter((source) => !cache[source]);
  const batches = []; let current = []; let size = 0;
  for (const source of pending) { if (size + source.length > 2800 && current.length) { batches.push(current); current = []; size = 0; } current.push(source); size += source.length + 2; }
  if (current.length) batches.push(current);
  let cursor = 0; let completed = 0; let save = Promise.resolve();
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < batches.length) {
      const batch = batches[cursor++]; const values = await translate(batch, language);
      batch.forEach((source, index) => { cache[source] = values[index]; });
      save = save.then(() => fs.writeFile(cachePath, JSON.stringify(cache, null, 2))); await save;
      completed++; if (completed % 5 === 0 || completed === batches.length) console.log(`${language}: ${completed}/${batches.length}`);
    }
  }));
  const output = Object.fromEntries(keys.map((key) => [key, language === 'es' ? spanish[key] : cache[spanish[key]]]));
  for (const [key, meaning] of Object.entries(aliases)) output[key] = output[meaning] ?? (language === 'es' ? spanish[key] : cache[spanish[key]]) ?? meaning;
  if (language !== 'es') { terms.forEach((term, index) => { if (term in output) output[term] = terminology[language][index]; }); for (const [key, value] of Object.entries(overrides[language])) if (key in output) output[key] = value; }
  for (const topic of archive) for (const table of topic.tables) if (table.columns[0] === 'term') for (const row of table.rows) if (row[0].includes('_x_')) output[row[0]] = row[0].split('_x_').map((part) => output[part] ?? part).join(' × ');
  for (const term of ['R²', 'RMSE', 'MAE', 'LASSO']) if (term in output) output[term] = term;
  for (const name of protectedNames) delete output[name];
  await writeJson(`src/i18n/locales/${language}.json`, output);
  console.log(`Saved ${language}: ${Object.keys(output).length} messages from Spanish source`);
}
