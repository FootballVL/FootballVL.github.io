import { Localized } from '../i18n/I18nProvider';
import { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Section } from '../components/Section';
import { EChart } from '../charts/EChart';
import { valuationScatter } from '../charts/chartOptions';
import { players } from '../data/research';
import type { PlayerValuation } from '../types';
import { compactEuro, euro } from '../utils/format';

const roles = Array.from(new Set(players.map((p) => p.role)));
const leagues = Array.from(new Set(players.map((p) => p.league).filter(Boolean))) as string[];

export function ExplorerSection() {
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('All');
  const [league, setLeague] = useState('All');
  const [selected, setSelected] = useState<PlayerValuation>(players[0]);

  const filtered = useMemo(() => {
    return players.filter((player) => {
      const matchesQuery = `${player.name} ${player.team}`.toLowerCase().includes(query.toLowerCase());
      const matchesRole = role === 'All' || player.role === role;
      const matchesLeague = league === 'All' || player.league === league;
      return matchesQuery && matchesRole && matchesLeague;
    });
  }, [league, query, role]);

  const above = filtered.filter((p) => p.difference > 0).sort((a, b) => b.difference - a.difference);
  const below = filtered.filter((p) => p.difference < 0).sort((a, b) => a.difference - b.difference);

  return <Localized>{(
    <Section id="explorer" eyebrow="Section 05" title="Market Value Explorer, scoped to recoverable records.">
      <div className="mb-6 border border-line bg-surface p-4 text-sm text-muted">
        The original HTML does not expose the full player-level prediction file. This explorer uses the individual
        valuation records embedded in the rendered Quarto tables and is ready to expand when the R export is added.
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="space-y-4 border border-line bg-surface p-5">
          <label className="block">
            <span className="text-sm font-semibold text-ink">Player search</span>
            <div className="mt-2 flex items-center gap-2 border border-line bg-night px-3">
              <Search className="h-4 w-4 text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full bg-transparent py-3 text-sm text-ink outline-none"
                placeholder="Search by player or team"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">League</span>
            <select value={league} onChange={(e) => setLeague(e.target.value)} className="mt-2 w-full border border-line bg-night p-3 text-sm text-ink">
              <option>All</option>
              {leagues.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-ink">Role</span>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="mt-2 w-full border border-line bg-night p-3 text-sm text-ink">
              <option>All</option>
              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <div className="border-t border-line pt-4">
            <h3 className="text-lg font-semibold text-ink">{selected.name}</h3>
            <p className="text-sm text-muted">{selected.team} · {selected.league ?? 'League unavailable'} · {selected.role}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-muted">Age</dt>
                <dd className="font-mono text-ink">{selected.age}</dd>
              </div>
              <div>
                <dt className="text-muted">Minutes</dt>
                <dd className="font-mono text-ink">{selected.minutesPlayed?.toLocaleString() ?? 'n/a'}</dd>
              </div>
              <div>
                <dt className="text-muted">Observed</dt>
                <dd className="font-mono text-ink">{compactEuro(selected.observedValue)}</dd>
              </div>
              <div>
                <dt className="text-muted">Estimated</dt>
                <dd className="font-mono text-ink">{compactEuro(selected.estimatedValue)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-muted">Difference</dt>
                <dd className={selected.difference >= 0 ? 'font-mono text-accent' : 'font-mono text-red-300'}>
                  {euro.format(selected.difference)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-muted">{selected.sourceTable}</p>
          </div>
        </aside>
        <div className="space-y-6">
          <div className="border border-line bg-surface p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-ink">Observed vs estimated value</h3>
                <p className="text-sm text-muted">Click a point to inspect the player record.</p>
              </div>
              <span className="font-mono text-xs text-muted">{filtered.length} records</span>
            </div>
            {filtered.length ? (
              <EChart
                ariaLabel="Scatter plot comparing observed and estimated player market values"
                option={valuationScatter(filtered)}
                height={430}
                onClick={(params: any) => setSelected(filtered[params.dataIndex])}
              />
            ) : (
              <div className="grid h-72 place-items-center text-muted">No records match the current filters.</div>
            )}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Ranking title="Estimated above market" players={above.slice(0, 5)} onSelect={setSelected} />
            <Ranking title="Estimated below market" players={below.slice(0, 5)} onSelect={setSelected} />
          </div>
        </div>
      </div>
    </Section>
  )}</Localized>;
}

function Ranking({
  title,
  players: ranking,
  onSelect,
}: {
  title: string;
  players: PlayerValuation[];
  onSelect: (player: PlayerValuation) => void;
}) {
  return <Localized>{(
    <div className="border border-line bg-surface p-5">
      <h3 className="mb-4 text-lg font-semibold text-ink">{title}</h3>
      <div className="space-y-2">
        {ranking.length ? (
          ranking.map((player) => (
            <button
              key={`${title}-${player.id}`}
              onClick={() => onSelect(player)}
              className="w-full border border-line bg-night p-3 text-left hover:border-accent focus:border-accent focus:outline-none"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-ink">{player.name}</span>
                <span className={player.difference >= 0 ? 'font-mono text-xs text-accent' : 'font-mono text-xs text-red-300'}>
                  {compactEuro(player.difference)}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted">{player.team}</div>
            </button>
          ))
        ) : (
          <p className="text-sm text-muted">No records in this category.</p>
        )}
      </div>
    </div>
  )}</Localized>;
}
