import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
// Playwright is an optional QA dependency, not part of the application bundle.
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const url = process.argv[2] || 'http://localhost:4173/';
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
const languages = ['en', 'es', 'ja', 'fr', 'de', 'nl', 'zh', 'ko', 'pt', 'it', 'ar', 'hi', 'ru', 'tr', 'id', 'bn'];
const change = async (language) => {
  await page.locator('.language-picker select').selectOption(language);
  await page.waitForFunction((code) => document.documentElement.lang === code && !document.querySelector('.language-picker select').disabled, language);
  await page.waitForTimeout(120);
};
try {
  await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'es', 'Spanish must be the initial edition');
  const numbers = await page.locator('.model-stat-pair strong').allTextContents();
  const values = await page.locator('.hero-stats strong').allTextContents();
  let checked = 0;
  for (const language of languages) {
    const dictionary = JSON.parse(await fs.readFile(`src/i18n/locales/${language}.json`, 'utf8'));
    await change(language);
    assert.equal(await page.locator('.resources-link').innerText(), dictionary.Resources);
    assert.equal(await page.locator('.cover-tagline').innerText(), dictionary['Beyond the Price Tag.']);
    assert.equal(await page.locator('.model-criterion').innerText(), dictionary['Mi criterio de selección es |z| > 1,96 en los residuos estandarizados. Lo utilizo como señal para investigar perfiles, no como un intervalo de confianza individual validado.']);
    assert.deepEqual(await page.locator('.model-stat-pair strong').allTextContents(), numbers, `${language}: numeric metrics changed`);
    assert.deepEqual(await page.locator('.hero-stats strong').allTextContents(), values, `${language}: study totals changed`);
    assert.equal(await page.locator('.valuation-film-group').first().locator('.valuation-slide h2').first().innerText(), 'Thijs Dallinga');
    assert.equal(await page.locator('.atlas-index button').count(), 20);
    assert.equal(await page.locator('.translated-figure').first().getAttribute('role'), 'img');
    assert((await page.locator('.translated-figure').first().textContent()).includes(dictionary['Awards distribution']));
    await page.locator('.dossier-toolbar select').nth(1).selectOption('Striker');
    assert.equal(await page.locator('.dossier-index .player-index-row').count(), 5);
    await page.locator('.dossier-toolbar select').nth(1).selectOption('All');
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.waitForTimeout(300);
      const overflow = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
      if (overflow.scroll > overflow.width + 1) console.log(await page.evaluate(() => [...document.querySelectorAll('body *')].filter((element) => { const rect = element.getBoundingClientRect(); return rect.right > innerWidth + 1 && !element.closest('.valuation-film-track,.dossier-index,pre,table,dialog'); }).map((element) => ({ tag: element.tagName, cls: String(element.className), text: element.textContent.slice(0, 80), right: element.getBoundingClientRect().right, overflow: getComputedStyle(element).overflow })).slice(0, 30)));
      assert(overflow.scroll <= overflow.width + 1, `${language}/${width}: page overflow ${overflow.scroll}`);
    }
    checked++;
    console.log(`${language}: translated UI, invariant values, filters, 4 widths OK`);
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await change('en');
  let figures = 0;
  for (const family of [0, 1]) {
    await page.locator('.atlas-tabs button').nth(family).click();
    const count = await page.locator('.atlas-index button').count();
    for (let index = 0; index < count; index++) {
      await page.locator('.atlas-index button').nth(index).click();
      assert.equal(await page.locator('.atlas-detail .translated-figure image').count(), 1);
      assert((await page.locator('.atlas-detail .translated-figure text').count()) >= 2);
      figures++;
    }
  }
  for (let index = 0; index < 4; index++) {
    await page.locator('.diagnostic-tabs button').nth(index).click();
    assert.equal(await page.locator('.model-diagnostics .translated-figure image').count(), 1);
    figures++;
  }
  assert.equal(figures, 41);
  await change('ja');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.documentElement.lang === 'ja');
  await page.locator('#hero').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.querySelectorAll('.valuation-film-group:first-child img')].slice(0, 4).every((image) => image.complete && image.naturalWidth > 0));
  await page.locator('#hero').screenshot({ path: 'work/languages-hero-ja.png' });
  await page.locator('.atlas-detail .localised-source-figure figcaption button').click();
  assert(await page.locator('.figure-dialog[open]').isVisible());
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('.figure-dialog[open]').count(), 0);
  await page.locator('#analysis-atlas').screenshot({ path: 'work/languages-atlas-ja.png' });
  await change('ar');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#hero').screenshot({ path: 'work/languages-hero-ar-mobile.png' });
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.deepEqual(errors, []);
  console.log(`PASS: ${checked} languages, 41 annotated figures, persistence, modal keyboard and RTL.`);
} finally { await browser.close(); }
