import { Localized } from '../i18n/I18nProvider';
import { ArrowUpRight } from 'lucide-react';
import type { ResearchTopic, ResearchTable } from '../types/research';
import { variableLabels } from '../i18n/glossary';

export function ReportTable({ table }: { table: ResearchTable }) {
  return <Localized>{<div className="source-table-scroll" tabIndex={0} aria-label="Scrollable original output table"><table><thead><tr>{table.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>}</Localized>;
}

export function ResearchEvidence({ topic }: { topic: ResearchTopic }) {
  return <Localized>{<div className="research-evidence">
    {!!topic.paragraphs.length && <details><summary>Read the author’s discussion <span>Translated from Spanish</span></summary><p className="source-language-note">The author’s original interpretation is translated below. It is not an additional validation of the source claims.</p><div lang="es">{topic.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></details>}
    {!!topic.code.length && <details><summary>Inspect the R code & printed output <span>{topic.code.length} blocks</span></summary><p className="source-language-note">Executable R syntax, variable identifiers and verbatim console output are preserved for reproducibility. Their meaning is explained in the translated analysis and variable glossary.</p><details className="variable-glossary"><summary>Variable glossary</summary><dl>{Object.entries(variableLabels).filter(([key]) => topic.code.some((block) => block.includes(key))).map(([key, value]) => <div key={key}><dt><code translate="no">{key}</code></dt><dd>{value}</dd></div>)}</dl></details>{topic.code.map((block, index) => <pre key={index}><code>{block}</code></pre>)}</details>}
    {!!topic.tables.length && <details><summary>Open the complete published tables <span>{topic.tables.length} tables</span></summary>{topic.tables.map((table, index) => <ReportTable key={index} table={table} />)}</details>}
    <a className="source-reference" href={`${import.meta.env.BASE_URL}research/original-report.html#${topic.id}`} target="_blank" rel="noreferrer">Locate this analysis in the original report <ArrowUpRight size={14} /></a>
  </div>}</Localized>;
}
