import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
try {
  await page.goto(process.argv[2] || 'http://localhost:4173/', { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('lang'), 'es');
  assert.match(await page.locator('.cover-study-period').innerText(), /Temporadas 2021\/22 y 2022\/23/);
  assert.equal(await page.locator('.method-boundaries').count(), 0);
  assert(!/junio/.test(await page.locator('.preparation-steps > li').nth(2).innerText()));
  assert.match(await page.locator('.preparation-steps > li').nth(6).innerText(), /logarithm/);
  assert.match(await page.locator('.preparation-steps > li').first().innerText(), /10\/06\/2023 por Kang Huynh Nugyen Trong y Minh Nguyen/);
  const contributions = await page.locator('.preparation-steps > li').nth(5).innerText();
  assert.match(contributions, /contribuciones directas de gol/);
  assert(!contributions.includes('450'));
  assert.match(await page.locator('.dossier-intro').innerText(), /tomando 10 clasificados como infravalorados y 10 como sobrevalorados/);
  assert.match(await page.locator('.model-introduction').innerText(), /Busco identificar/);
  assert.match(await page.locator('.model-criterion').innerText(), /1,96/);
  assert.equal(await page.locator('#research .research-evidence').count(), 0);
  assert.equal(await page.locator('.research-report-access > a').count(), 1);
  assert.match(await page.locator('.research-report-access > a').innerText(), /Accede a mi informe original/);
  const target = await page.locator('.research-report-access > a').getAttribute('href');
  assert.equal((await page.request.get(new URL(target, page.url()).href)).status(), 200);
  assert.equal(await page.locator('.dossier-index .player-index-row').count(), 20);
  assert.deepEqual(await page.locator('.dossier-ranking > div:not(.ranking-scope) strong').allTextContents(), ['Alejandro Balde', 'Ansu Fati', 'Thijs Dallinga', 'Giovanni Reyna', 'Deniz Undav']);
  assert(!/Pedri|Neymar|Haaland|Mbappe|Saka|Bellingham/.test(await page.locator('.dossier-ranking > div:not(.ranking-scope)').innerText()));
  await page.locator('.ranking-scope button').nth(1).click();
  assert.match(await page.locator('.dossier-ranking > div:not(.ranking-scope)').innerText(), /Pedri/);
  await page.locator('.ranking-scope button').first().click();
  const requested = ['Deniz Undav', 'Mario Götze', 'Sergio Camello', 'Dele Alli', 'Alejandro Balde', 'Nicolas Pépé', 'Ansu Fati', 'Giovanni Reyna', 'Piotr Zielinski', 'Leny Yoro', 'Hugo Guillamón'];
  for (const name of requested) {
    await page.locator('.dossier-index .player-index-row').filter({ hasText: name }).click();
    assert.equal((await page.locator('.player-identity h3').textContent()).trim(), name);
    await page.waitForFunction(() => { const image = document.querySelector('.player-identity img'); return image?.complete && image.naturalWidth > 0; });
    assert(!/NaN|undefined/.test(await page.locator('.player-values').innerText()));
  }
  await page.locator('.dossier-search input').fill('nicolas pepe');
  assert.equal(await page.locator('.dossier-index .player-index-row').count(), 1);
  assert.match(await page.locator('.player-identity h3').textContent(), /Nicolas Pépé/);
  await page.locator('.dossier-search input').fill('');
  await page.locator('.dossier-toolbar select').first().selectOption('Unpublished');
  assert((await page.locator('.dossier-index .player-index-row').count()) > 0);
  await page.locator('.dossier-toolbar select').first().selectOption('All');
  await page.locator('.dossier-index .player-index-row').filter({ hasText: 'Sergio Camello' }).click();
  await page.locator('.player-dossier').screenshot({ path: 'work/authored-camello-desktop.png' });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'work/authored-cover-desktop.png' });
  await page.locator('.research-report-access').screenshot({ path: 'work/authored-report-desktop.png' });
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 }); await page.waitForTimeout(350);
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Overflow at ${width}`);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'work/authored-cover-mobile.png' });
  await page.locator('.research-report-access').screenshot({ path: 'work/authored-report-mobile.png' });
  console.log('Spanish default, authored edits, 11 replacement portraits, ranking scopes, historical dates, source access and responsive layout OK.');
} finally { await browser.close(); }
