import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { Section } from '../components/Section';
import { links } from '../content/site';
import { PhotoCredits } from '../components/PlayerPortrait';
import { researchTakeaways, retrospectiveCases } from '../content/research';
import { useResearchArchive } from '../hooks/useResearchArchive';
import { ResearchEvidence } from '../components/ResearchEvidence';

const limitations = [
  'Historical Transfermarkt valuations from the 2021/22 and 2022/23 data context are not current prices.',
  'The model uses performance variables and cannot fully represent potential, leadership, contract context, reputation or scouting judgement.',
  'The full player-level prediction export is not embedded in the HTML; this version exposes only recovered table records.',
  'Correlations and model residuals should not be read as causal proof or guaranteed investment signals.',
  'LASSO errors and Random Forest RMSE are in log-price scale, so raw-euro comparisons must be interpreted carefully.',
];

const future = [
  'Export complete player-level predictions from R and replace the recovered-table sample.',
  'Add temporal validation to test whether a model trained on earlier seasons generalizes to later valuation windows.',
  'Incorporate advanced event data and role-specific goalkeeper metrics.',
  'Add SHAP or permutation importance views for clearer Random Forest interpretability.',
];

export function ResearchSection() {
  const { topics } = useResearchArchive();
  return (
    <Section id="research" eyebrow="The final whistle" title="What the numbers explain. What they leave open.">
      <div className="research-takeaways">{researchTakeaways.map((takeaway, index) => <article key={takeaway.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{takeaway.title}</h3><p>{takeaway.text}</p></div></article>)}</div>
      <div className="retrospective-notes"><h3>Where the author looked next</h3><p>The report includes retrospective player case notes, rather than a complete dated valuation panel. These are the author’s accounts, not an independently reproduced temporal validation.</p><div>{retrospectiveCases.map((item) => <article key={item.player}><h4>{item.player}</h4><strong>{item.finding}</strong><p>{item.interpretation}</p></article>)}</div></div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Panel title="Limitations">
          <ul className="space-y-3">
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Future improvements">
          <ul className="space-y-3">
            {future.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Panel>
      </div>
      <div className="conclusion-source"><h3>Follow the interpretation back to the source</h3>{topics[55] && <ResearchEvidence topic={topics[55]} />}{topics[57] && <ResearchEvidence topic={topics[57]} />}</div>
      <div className="mt-10 border-t border-line pt-6">
        <h3 className="text-xl font-semibold text-ink">Technical resources</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Resource label="GitHub Repository" value={links.githubRepository} />
          <Resource label="Original Research" value={links.originalResearch} />
          <Resource label="Technical Methodology" value={links.technicalMethodology} />
        </div>
        <a className="report-download" href={`${import.meta.env.BASE_URL}research/original-report.html`} download="Football-Value-Lab-Original-Research.html">Download the complete original HTML report</a>
      </div>
      <PhotoCredits />
    </Section>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="border-t border-line py-5 text-sm leading-6 text-muted">
      <h3 className="mb-4 text-xl font-semibold text-ink">{title}</h3>
      <div className="space-y-3">{children}</div>
    </article>
  );
}

function Resource({ label, value }: { label: string; value: string }) {
  return value ? (
    <a className="flex items-center justify-between border-b border-line py-4 text-sm text-ink" href={value}>
      {label}
      <ExternalLink className="h-4 w-4 text-accent" />
    </a>
  ) : (
    <div className="border-b border-line py-4 text-sm text-muted">{label} <span className="block text-xs mt-1">Link not yet published</span></div>
  );
}
