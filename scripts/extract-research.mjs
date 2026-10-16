import fs from 'node:fs/promises';
const { chromium } = await import(process.argv[3] ?? 'playwright');

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error('Usage: node scripts/extract-research.mjs path/to/Proyecto_final.html [optional-playwright-module]');
const html = await fs.readFile(sourcePath, 'utf8');
const browser = await chromium.launch({ headless: true, channel: 'msedge' });
let topics;
try {
  const page = await browser.newPage();
  topics = await page.evaluate((source) => {
    // Parsing an inert document keeps report scripts and external assets unexecuted.
    const document = new DOMParser().parseFromString(source, 'text/html');
    const main = document.querySelector('main') ?? document.body;
    const output = [];
    let current = { id: 'introduction', title: 'Introduction', level: 1, path: [], paragraphs: [], code: [], figures: [], tables: [] };
    output.push(current);
    for (const node of main.querySelectorAll('h1,h2,h3,h4,h5,h6,p,pre,img,script[data-pagedtable-source],table')) {
      if (/^H[1-6]$/.test(node.tagName)) {
        const sections = [];
        for (let parent = node.closest('section'); parent; parent = parent.parentElement?.closest('section')) {
          const heading = parent.querySelector(':scope > h1,:scope > h2,:scope > h3,:scope > h4,:scope > h5,:scope > h6');
          if (heading) sections.unshift(heading.textContent.trim());
        }
        current = { id: node.parentElement.id || node.id || `topic-${output.length}`, title: node.textContent.trim(), level: Number(node.tagName[1]), path: sections, paragraphs: [], code: [], figures: [], tables: [] };
        output.push(current);
      } else if (node.tagName === 'P' && !node.closest('pre')) {
        const text = node.textContent.trim();
        if (text) current.paragraphs.push(text);
      } else if (node.tagName === 'PRE') current.code.push(node.textContent.trim());
      else if (node.tagName === 'IMG' && node.getAttribute('src')?.startsWith('data:image')) {
        current.figures.push({ data: node.getAttribute('src'), alt: node.getAttribute('alt') ?? '', caption: node.closest('figure')?.querySelector('figcaption')?.textContent.trim() ?? '' });
      } else if (node.matches('script[data-pagedtable-source]')) current.tables.push(JSON.parse(node.textContent));
      else if (node.tagName === 'TABLE') current.tables.push({ headers: [...node.querySelectorAll('th')].map((cell) => cell.textContent.trim()), rows: [...node.querySelectorAll('tr')].map((row) => [...row.querySelectorAll('td')].map((cell) => cell.textContent.trim())).filter((row) => row.length) });
    }
    return output;
  }, html);
} finally { await browser.close(); }

await fs.mkdir('public/research/figures', { recursive: true });
await fs.mkdir('work', { recursive: true });
let figureNumber = 0;
for (const topic of topics) {
  topic.tables = topic.tables.map((table) => table.data ? {
    columns: table.columns.map((column) => column.label[0]),
    rows: table.data.map((row) => table.columns.map((column) => String(row[column.name[0]] ?? ''))),
  } : { columns: table.headers, rows: table.rows });
  for (const figure of topic.figures) {
    figureNumber++;
    const match = /^data:image\/([^;]+);base64,(.*)$/s.exec(figure.data);
    if (!match) throw new Error('Unsupported embedded figure');
    const extension = match[1] === 'jpeg' ? 'jpg' : match[1];
    figure.src = `research/figures/figure-${String(figureNumber).padStart(3, '0')}.${extension}`;
    await fs.writeFile(`public/${figure.src}`, Buffer.from(match[2], 'base64'));
    delete figure.data;
  }
}
await fs.writeFile('public/research/original-report.html', html);
await fs.writeFile('src/data/reportArchive.json', JSON.stringify(topics, null, 2) + '\n');
await fs.writeFile('work/full-research.txt', topics.map((topic, index) => `\n[${index}] ${topic.path.join(' > ')}\nID: ${topic.id}\n${topic.title}\n${topic.paragraphs.join('\n\n')}\nFIGURES: ${topic.figures.map((figure) => figure.src).join(', ')}\nCODE:\n${topic.code.join('\n\n')}`).join('\n'));
console.log(JSON.stringify({ topics: topics.length, figures: figureNumber, tables: topics.reduce((sum, topic) => sum + topic.tables.length, 0) }));
console.log(topics.map((topic, index) => `[${index}] ${topic.path.join(' > ') || topic.title} | ${topic.figures.length} figures | ${topic.code.length} code blocks`).join('\n'));
