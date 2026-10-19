import { Localized } from '../i18n/I18nProvider';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';
import { Section } from '../components/Section';
import { links } from '../content/site';
import { PhotoCredits } from '../components/PlayerPortrait';
import { researchTakeaways, retrospectiveCases } from '../content/research';

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
  return <Localized>{(
    <Section id="research" eyebrow="The final whistle" title="What the numbers explain. What they leave open.">
      <div className="research-takeaways">{researchTakeaways.map((takeaway, index) => <article key={takeaway.title}><span>{String(index + 1).padStart(2, '0')}</span><div><h3>{takeaway.title}</h3><p>{takeaway.text}</p></div></article>)}</div>
      <div className="retrospective-notes"><h3>Volví a mirar a los jugadores</h3><div>{retrospectiveCases.map((item) => <article key={item.player}><h4>{item.player}</h4><strong>{item.finding}</strong><p>{item.interpretation}</p></article>)}</div></div>
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
      <div className="research-report-access"><div><p>MI INVESTIGACIÓN, DE PRINCIPIO A FIN</p><h3>Detrás de cada resultado hay una decisión.</h3><span>He reunido el desarrollo completo, los análisis, las tablas y el código R en el informe original.</span></div><a href={links.originalResearch} target="_blank" rel="noreferrer">Accede a mi informe original <ExternalLink size={22} /></a></div>
      <div className="mt-10 border-t border-line pt-6">
        <h3 className="text-xl font-semibold text-ink">Technical resources</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <Resource label="GitHub Repository" value={links.githubRepository} />
          <Resource label="Technical Methodology" value={links.technicalMethodology} />
        </div>
        <a className="report-download" href={`${import.meta.env.BASE_URL}research/original-report.html`} download="Football-Value-Lab-Original-Research.html">Download the complete original HTML report</a>
      </div>
      <PhotoCredits />
    </Section>
  )}</Localized>;
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <Localized>{(
    <article className="border-t border-line py-5 text-sm leading-6 text-muted">
      <h3 className="mb-4 text-xl font-semibold text-ink">{title}</h3>
      <div className="space-y-3">{children}</div>
    </article>
  )}</Localized>;
}

function Resource({ label, value }: { label: string; value: string }) {
  return <Localized>{value ? (
    <a className="flex items-center justify-between border-b border-line py-4 text-sm text-ink" href={value}>
      {label}
      <ExternalLink className="h-4 w-4 text-accent" />
    </a>
  ) : (
    <div className="border-b border-line py-4 text-sm text-muted">{label} <span className="block text-xs mt-1">Link not yet published</span></div>
  )}</Localized>;
}
