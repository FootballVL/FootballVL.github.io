import { Localized } from '../i18n/I18nProvider';
import { Section } from '../components/Section';
import { EChart } from '../charts/EChart';
import { barOption } from '../charts/chartOptions';
import { leagueRatings } from '../data/research';
import { DataPreparation } from '../components/DataPreparation';

const pipeline = ['Raw Dataset', 'Data Cleaning', 'Feature Engineering', 'Exploratory Analysis', 'Modeling', 'Evaluation'];
const variables = ['age', 'height', 'minutes.played', 'goals_abs', 'assists_abs', 'award', 'games_injured', 'league_rating', 'rol_funcional'];

export function DataSection() {
  return <Localized>{(
    <Section id="data" eyebrow="The research" title="10,754 players. One complex question.">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6 text-muted">
          <p>
            Quise averiguar hasta dónde podía explicar el valor de mercado de un futbolista con sus datos de rendimiento. Para ello trabajé con 10.754 jugadores de 20 ligas y con el contexto de las temporadas 2021/22 y 2022/23.
          </p>
          <p>
            Enriquecí la base con las ligas y sus puntuaciones Opta de septiembre de 2023. Antes de modelizar, eliminé aproximadamente 400 registros sin minutos jugados para centrarme en la producción efectiva sobre el césped.
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
  )}</Localized>;
}
