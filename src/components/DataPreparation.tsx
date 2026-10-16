import { preparationSteps } from '../content/research';
import { useResearchArchive } from '../hooks/useResearchArchive';
import { ResearchEvidence } from './ResearchEvidence';

const summaryRows = [
  ['Age (years)', '15', '22', '26', '26.13', '30', '43'],
  ['Height (cm)', '156', '176', '181.2', '181.2', '186', '206'],
  ['Minutes played', '1', '795', '2,238', '2,567', '4,051', '9,510'],
  ['Market value (€)', '0', '300,000', '800,000', '3,754,406', '3,000,000', '180,000,000'],
  ['Goals', '0', '0', '1', '3.861', '5', '83'],
  ['Assists', '0', '0', '1', '2.753', '4', '45'],
  ['Yellow cards', '0', '1', '4', '5.013', '8', '35'],
  ['Games missed (injury)', '0', '0', '6', '16.28', '25', '339'],
  ['Awards', '0', '0', '1', '2.014', '2', '92'],
  ['Red cards', '0', '0', '0', '0.1485', '0', '4'],
  ['Goals + assists', '0', '0', '3', '6.614', '8', '116'],
];

export function DataPreparation() {
  const { topics } = useResearchArchive();
  return <div className="preparation-workbook">
    <div className="atlas-intro"><div><p className="dossier-kicker">BEFORE THE FIRST MODEL</p><h3>The work behind the rows.</h3></div><p>The research makes several consequential choices before fitting a model. These choices define what the final estimates can—and cannot—describe.</p></div>
    <ol className="preparation-steps">{preparationSteps.map((step, index) => <li key={step.title}><span className="preparation-number">{String(index + 1).padStart(2, '0')}</span><div><h4>{step.title}</h4><p>{step.detail}</p></div><div><p className="preparation-reason">{step.reason}</p><details><summary>R method excerpt</summary><pre><code>{step.code}</code></pre></details></div></li>)}</ol>
    {topics[4] && <div className="preparation-source"><h4>Trace the preparation back to its implementation</h4><ResearchEvidence topic={topics[4]} /></div>}
    <div className="descriptive-summary"><p className="dossier-kicker">AFTER THE ZERO-MINUTE FILTER</p><h3>A numerical portrait of the sample.</h3><p>All 11 variables in the report’s printed summary. Counts refer to the recorded study window; goals, assists and disciplinary totals are reconstructed from per-90 rates.</p><div className="source-table-scroll" tabIndex={0} aria-label="Scrollable descriptive statistics"><table><thead><tr>{['Variable', 'Minimum', 'Q1', 'Median', 'Mean', 'Q3', 'Maximum'].map((label) => <th scope="col" key={label}>{label}</th>)}</tr></thead><tbody>{summaryRows.map((row) => <tr key={row[0]}>{row.map((value, index) => index === 0 ? <th scope="row" key={index}>{value}</th> : <td key={index}>{value}</td>)}</tr>)}</tbody></table></div><p className="summary-source">Source: summary(final_data) in the broad-position analysis. Zero-value records remain in this EDA summary; modelling subsequently keeps positive values only.</p></div>
  </div>;
}
