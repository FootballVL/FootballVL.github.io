import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('../node_modules/typescript');
const normalise = (text) => text.replace(/\s+/g, ' ').trim();
const corpus = new Set();
const spanishSources = new Set();
const protectedNames = new Set(['Football Value Lab', 'FOOTBALL VALUE LAB', 'FOOTBALL', 'VALUE LAB', 'FVL', 'FV', 'L', 'EUR', 'GitHub', 'Transfermarkt', 'R', 'React', 'TypeScript', 'Vite', 'ECharts', 'Quarto', 'Kaggle', 'IBM Plex Sans', 'Barlow Condensed']);
const archive = JSON.parse(await fs.readFile('src/data/reportArchive.json', 'utf8'));
for (const topic of archive) {
  for (const paragraph of topic.paragraphs) { corpus.add(normalise(paragraph)); spanishSources.add(normalise(paragraph)); }
  for (const table of topic.tables) {
    table.columns.forEach((column) => corpus.add(column));
    table.rows.forEach((row) => row.forEach((cell, i) => {
      if (/^(name|team)$/i.test(table.columns[i])) protectedNames.add(cell);
      else if (/\p{L}/u.test(cell) && !/^[-+\d.,% eE]+$/.test(cell)) corpus.add(normalise(cell));
    }));
  }
}
const ignoredAttributes = new Set(['className', 'href', 'src', 'id', 'key', 'value', 'role', 'type', 'target', 'rel', 'style', 'dir', 'lang', 'viewBox', 'fontFamily', 'fill', 'stroke', 'd']);
const ignoredProperties = new Set(['id', 'src', 'className', 'href', 'path', 'family', 'color', 'fontFamily', 'type', 'position', 'trigger', 'overflow', 'nameLocation', 'lineStyle', 'symbol', 'nameGap', 'extraCssText', 'backgroundColor', 'borderColor']);
function add(value) {
  value = normalise(value);
  if (value.length < 2 || !/\p{L}/u.test(value) || /^(?:[.#/]|https?:|data:|\.\.)/.test(value) || /[{}]|=>|\\[nds]|\$\{|<\/?[a-z]+>/i.test(value)) return;
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
      if (file.endsWith(path.join('data', 'research.ts')) && ts.isArrayLiteralExpression(node) && node.elements.length >= 8 && ts.isStringLiteral(node.elements[0]) && ts.isStringLiteral(node.elements[1])) {
        protectedNames.add(node.elements[0].text); protectedNames.add(node.elements[1].text);
      }
      if (ts.isJsxText(node)) add(node.text);
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const parent = node.parent;
        if (ts.isImportDeclaration(parent) || ts.isLiteralTypeNode(parent) || ts.isExternalModuleReference(parent)) return;
        if (ts.isJsxAttribute(parent) && ignoredAttributes.has(parent.name.text)) return;
        if (ts.isPropertyAssignment(parent) && parent.initializer === node) {
          const key = parent.name.getText(tree).replace(/['"]/g, '');
          if (file.includes('data') && ['name', 'team'].includes(key)) { protectedNames.add(node.text); return; }
          if (ignoredProperties.has(key)) return;
        }
        add(node.text);
      }
      if (ts.isTemplateSpan(node) || ts.isTemplateHead(node)) add(node.literal?.text ?? node.text ?? '');
      ts.forEachChild(node, visit);
    };
    visit(tree);
  }
}
await scan('src');
const photos = JSON.parse(await fs.readFile('src/data/photos.json', 'utf8'));
for (const [id, photo] of Object.entries(photos)) { protectedNames.add(id.replaceAll('-', ' ')); protectedNames.add(photo.author); protectedNames.add(photo.license); }
// Keep exact variable identifiers as keys while translating their explanation.
const glossarySource = await fs.readFile('src/i18n/glossary.ts', 'utf8');
const glossary = ts.transpileModule(glossarySource.replace('export const', 'const') + '\nreturn variableLabels;', { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
const aliases = new Function(glossary)();
Object.values(aliases).forEach(add);
['Language', 'Spanish original', 'Beyond the Price Tag', 'Football Value Lab is an interactive data science portfolio case study on historical football market valuations.', 'Difference', 'Estimated', 'Observed', 'valuation dossier', 'blocks', 'tables', 'published comparisons', 'records', 'Variables', 'Variable glossary', 'Original identifier', 'Translated meaning', 'Model', 'Prediction', 'Metric', 'Metric scale', 'Random Forest', 'Linear baseline', 'Linear + interactions', 'LASSO', 'Football player photograph', 'Photo', 'Source', 'Licence', 'Image unavailable', 'Open source photograph', 'Loading language…', 'Language could not load. Please try again.'].forEach(add);
for (const name of protectedNames) corpus.delete(name);
for (const [key, meaning] of Object.entries(aliases)) if (key !== meaning) corpus.delete(key);
const keys = [...corpus].sort();
await fs.mkdir('work/translation-cache-v2', { recursive: true });
await fs.writeFile('src/i18n/protected.json', JSON.stringify([...protectedNames].sort(), null, 2) + '\n');
await fs.writeFile('work/translation-corpus.json', JSON.stringify(keys, null, 2));
console.log(`${keys.length} source messages; ${keys.join('').length} characters; ${protectedNames.size} protected names`);
const languages = ['en', 'es', 'ja', 'fr', 'de', 'nl', 'zh', 'ko', 'pt', 'it', 'ar', 'hi', 'ru', 'tr', 'id', 'bn'];
const languageArgument = process.argv.find((arg) => arg.startsWith('--language='))?.split('=')[1];
const terminology = JSON.parse(await fs.readFile('src/i18n/terminology.json', 'utf8'));
const overrides = JSON.parse(await fs.readFile('src/i18n/overrides.json', 'utf8'));
const terms = ['Clean sheets', '20% holdout', 'Striker', 'Game creator', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function translateBatch(batch, language, source, attempt = 0) {
  // Disambiguate domain idioms without changing the original dictionary keys.
  const domainSource = (value) => source !== 'en' ? value : value
    .replace(/clean sheets/gi, 'matches without conceding a goal')
    .replace(/a clean sheet/gi, 'a match without conceding a goal')
    .replace(/random holdout/gi, 'randomly reserved test set')
    .replace(/20% holdout/gi, '20% reserved test set')
    .replace(/held-out players/gi, 'players reserved for testing')
    .replace(/held-out predictions/gi, 'predictions on data reserved for testing')
    .replace(/held-out test evaluation/gi, 'evaluation on the reserved test set')
    .replace(/held-out RMSE/gi, 'RMSE on reserved test data')
    .replace(/\bgoals\b/gi, 'football goals')
    .replace(/\bdistribution\b/gi, 'statistical distribution');
  const text = batch.map(domainSource).join('\n\n');
  const url = new URL('https://translate.googleapis.com/translate_a/single');
  for (const [key, value] of Object.entries({ client: 'gtx', sl: source, tl: language === 'zh' ? 'zh-CN' : language, dt: 't', q: text })) url.searchParams.set(key, value);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!response.ok) throw new Error(`Translation HTTP ${response.status}`);
    const result = await response.json();
    const translated = result[0].map((part) => part[0] ?? '').join('').trim().split(/\n\s*\n/);
    if (translated.length !== batch.length) {
      if (batch.length === 1) return [normalise(result[0].map((part) => part[0] ?? '').join(''))];
      const middle = Math.ceil(batch.length / 2);
      return [...await translateBatch(batch.slice(0, middle), language, source), ...await translateBatch(batch.slice(middle), language, source)];
    }
    return translated.map(normalise);
  } catch (error) {
    if (attempt >= 5) throw error;
    await delay(1500 * 2 ** attempt);
    return translateBatch(batch, language, source, attempt + 1);
  }
}
for (const language of languageArgument ? [languageArgument] : languages) {
  const cachePath = `work/translation-cache-v2/${language}.json`;
  let messages = {};
  try { messages = JSON.parse(await fs.readFile(cachePath, 'utf8')); } catch { /* First generation. */ }
  if (process.argv.includes('--refresh-domain')) for (const key of keys) if (/clean.sheet|holdout|held-out|\bgoals\b|\bdistribution\b/i.test(key) && !spanishSources.has(key)) delete messages[key];
  for (const key of keys) { if ((spanishSources.has(key) ? 'es' : 'en') === language) messages[key] = key; }
  const batches = [];
  for (const source of ['en', 'es']) {
    const pending = keys.filter((key) => messages[key] == null && (spanishSources.has(key) ? 'es' : 'en') === source);
    let batch = []; let size = 0;
    for (const key of pending) {
      if (size + key.length > 3000 && batch.length) { batches.push({ items: batch, source }); batch = []; size = 0; }
      batch.push(key); size += key.length + 2;
    }
    if (batch.length) batches.push({ items: batch, source });
  }
  let cursor = 0; let completed = 0; let cacheWrite = Promise.resolve();
  await Promise.all(Array.from({ length: 3 }, async () => {
    while (cursor < batches.length) {
      const current = batches[cursor++];
      const translated = await translateBatch(current.items, language, current.source);
      current.items.forEach((key, index) => { messages[key] = translated[index]; });
      cacheWrite = cacheWrite.then(() => fs.writeFile(cachePath, JSON.stringify(messages, null, 2)));
      await cacheWrite;
      completed++;
      if (completed % 5 === 0 || completed === batches.length) console.log(`${language}: ${completed}/${batches.length} batches`);
      await delay(200);
    }
  }));
  const previousCleanSheets = messages['Clean sheets'];
  const reviewed = terminology[language];
  if (previousCleanSheets && previousCleanSheets !== reviewed[0]) {
    const pattern = new RegExp(previousCleanSheets.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'giu');
    for (const key of Object.keys(messages)) if (/clean.sheet/i.test(key)) messages[key] = messages[key].replace(pattern, reviewed[0]);
  }
  for (const [index, term] of terms.entries()) messages[term] = reviewed[index];
  Object.assign(messages, overrides[language]);
  for (const term of ['R²', 'RMSE', 'MAE', 'LASSO']) if (keys.includes(term)) messages[term] = term;
  const output = Object.fromEntries(keys.map((key) => [key, messages[key]]));
  for (const [key, meaning] of Object.entries(aliases)) output[key] = messages[meaning] ?? meaning;
  for (const topic of archive) for (const table of topic.tables) if (table.columns[0] === 'term') for (const row of table.rows) {
    if (row[0].includes('_x_')) output[row[0]] = row[0].split('_x_').map((part) => output[part] ?? part).join(' × ');
  }
  for (const name of protectedNames) delete output[name];
  await fs.writeFile(`src/i18n/locales/${language}.json`, JSON.stringify(output, null, 2) + '\n');
  console.log(`Saved ${language}: ${Object.keys(output).length} messages`);
}
