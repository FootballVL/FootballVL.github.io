import { Section } from '../components/Section';
import { EChart } from '../charts/EChart';
import { barOption } from '../charts/chartOptions';
import { correlations, insights } from '../data/research';
import { AnalysisAtlas } from '../components/AnalysisAtlas';

export function FindingsSection() {
  return (
    <Section id="findings" eyebrow="Reading the market" title="Performance has a price. Context changes it.">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-5">
          {insights.map((insight) => (
            <article key={insight.title} className="border-t border-line py-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{insight.question}</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">{insight.title}</h3>
              <p className="mt-3 text-muted">{insight.interpretation}</p>
              <p className="mt-3 text-xs text-muted">Method: {insight.method}</p>
            </article>
          ))}
        </div>
        <div className="findings-chart border-t border-line pt-5">
          <h3 className="text-lg font-semibold text-ink">Which observed signals move with price?</h3>
          <p className="mb-4 text-sm text-muted">
            Correlations are descriptive, not causal. The yellow-card relationship is explicitly treated as confounded
            by minutes played in the original report.
          </p>
          <EChart
            ariaLabel="Correlations between variables and current market value"
            option={barOption(
              correlations.map((d) => d.variable),
              correlations.map((d) => d.value),
            )}
            height={430}
          />
        </div>
      </div>
      <AnalysisAtlas />
    </Section>
  );
}
