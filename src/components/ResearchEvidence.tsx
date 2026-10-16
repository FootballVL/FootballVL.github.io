import { ArrowUpRight } from 'lucide-react';
import type { ResearchTopic, ResearchTable } from '../types/research';

export function ReportTable({ table }: { table: ResearchTable }) {
  return <div className="source-table-scroll" tabIndex={0} aria-label="Scrollable original output table"><table><thead><tr>{table.columns.map((column, index) => <th key={index} scope="col">{column}</th>)}</tr></thead><tbody>{table.rows.map((row, index) => <tr key={index}>{row.map((cell, column) => <td key={column}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

export function ResearchEvidence({ topic }: { topic: ResearchTopic }) {
  return <div className="research-evidence">
    {!!topic.paragraphs.length && <details><summary>Read the author’s original discussion <span>Spanish source</span></summary><div lang="es">{topic.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div></details>}
    {!!topic.code.length && <details><summary>Inspect the R code & printed output <span>{topic.code.length} blocks</span></summary>{topic.code.map((block, index) => <pre key={index}><code>{block}</code></pre>)}</details>}
    {!!topic.tables.length && <details><summary>Open the complete published tables <span>{topic.tables.length} tables</span></summary>{topic.tables.map((table, index) => <ReportTable key={index} table={table} />)}</details>}
    <a className="source-reference" href={`${import.meta.env.BASE_URL}research/original-report.html#${topic.id}`} target="_blank" rel="noreferrer">Locate this analysis in the original report <ArrowUpRight size={14} /></a>
  </div>;
}
