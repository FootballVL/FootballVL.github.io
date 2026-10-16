import { Section } from '../components/Section';
import { EChart } from '../charts/EChart';
import { barOption } from '../charts/chartOptions';
import { leagueRatings } from '../data/research';
import { DataPreparation } from '../components/DataPreparation';

const pipeline = ['Raw Dataset', 'Data Cleaning', 'Feature Engineering', 'Exploratory Analysis', 'Modeling', 'Evaluation'];
const variables = ['age', 'height', 'minutes.played', 'goals_abs', 'assists_abs', 'award', 'games_injured', 'league_rating', 'rol_funcional'];

export function DataSection() {
  return (
    <Section id="data" eyebrow="The research" title="10,754 players. One complex question.">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6 text-muted">
          <p>
            The original study asks whether historical player valuations from Transfermarkt can be modeled using
            sport-performance variables. The dataset contains 10,754 players from 20 leagues, primarily covering the
            2021/22 and 2022/23 seasons.
          </p>
          <p>
            The raw data was enriched with league labels and Opta Power Ranking scores from September 2023. Roughly
            400 inactive records with zero minutes were removed so the model focused on observed on-pitch production.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-3 border-t border-line pt-5">
            {variables.map((variable) => (
              <span key={variable} className="font-mono text-xs text-muted">
                {variable}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {pipeline.map((step, index) => (
              <div key={step} className="border-t border-line py-4">
                <div className="font-mono text-xs text-accent">0{index + 1}</div>
                <div className="mt-3 text-sm font-semibold text-ink">{step}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-line pt-5">
            <h3 className="mb-1 text-lg font-semibold text-ink">League context added to the model</h3>
            <p className="mb-4 text-sm text-muted">Opta league ratings used as competitive-context features.</p>
            <EChart
              ariaLabel="Top league ratings used for enrichment"
              option={barOption(
                leagueRatings.slice(0, 10).map((d) => d.league),
                leagueRatings.slice(0, 10).map((d) => d.rating),
              )}
              height={340}
            />
          </div>
        </div>
      </div>
      <DataPreparation />
    </Section>
  );
}
