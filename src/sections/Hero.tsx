import { Localized } from '../i18n/I18nProvider';
import { ArrowDown, BarChart3, BookOpen, Search } from 'lucide-react';
import { EChart } from '../charts/EChart';
import { barOption } from '../charts/chartOptions';
import { projectStats, correlations } from '../data/research';
import { StatPill } from '../components/StatPill';

export function Hero() {
  const topSignals = correlations.slice(0, 6);
  return <Localized>{(
    <section id="hero" className="relative overflow-hidden py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(90deg,rgba(181,243,106,.12)_1px,transparent_1px),linear-gradient(rgba(37,56,75,.65)_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
        <div>
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.28em] text-accent">Football Value Lab</p>
          <h1 className="font-display text-6xl leading-[0.95] text-ink md:text-8xl">Beyond the Price Tag.</h1>
          <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">
            Can player performance explain football's multi-billion-euro valuation market? This portfolio case study
            turns a historical academic analysis into an interactive data product for model evaluation and market-value storytelling.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a className="inline-flex items-center gap-2 rounded bg-accent px-5 py-3 text-sm font-bold text-night" href="#findings">
              <BarChart3 className="h-4 w-4" /> Explore the Findings
            </a>
            <a className="inline-flex items-center gap-2 rounded border border-line px-5 py-3 text-sm font-bold text-ink" href="#explorer">
              <Search className="h-4 w-4" /> Explore Player Valuations
            </a>
            <a className="inline-flex items-center gap-2 rounded border border-line px-5 py-3 text-sm font-bold text-ink" href="#research">
              <BookOpen className="h-4 w-4" /> View Research & Code
            </a>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-3">
            {projectStats.map((stat) => (
              <StatPill key={stat.label} {...stat} />
            ))}
          </div>
        </div>
        <div className="relative border-y border-line bg-surface/70 p-5 shadow-panel backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-ink">Signals correlated with market value</h2>
              <p className="text-sm text-muted">Verified values from the report correlation matrix.</p>
            </div>
            <span className="font-mono text-xs text-accent">historical</span>
          </div>
          <EChart
            ariaLabel="Bar chart of correlations with market value"
            option={barOption(
              topSignals.map((d) => d.variable),
              topSignals.map((d) => d.value),
            )}
            height={380}
          />
        </div>
      </div>
      <a href="#data" className="mx-auto mt-12 flex w-fit items-center gap-2 text-sm text-muted">
        Scroll <ArrowDown className="h-4 w-4 animate-bounce" />
      </a>
    </section>
  )}</Localized>;
}
