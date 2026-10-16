import { useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Search, Users, X } from 'lucide-react';
import { Section } from '../components/Section';
import { EChart } from '../charts/EChart';
import { valuationScatter } from '../charts/chartOptions';
import { players } from '../data/research';
import { compactEuro } from '../utils/format';
import './explorer.css';
import { PlayerPortrait } from '../components/PlayerPortrait';

const leagues = [...new Set(players.map((player) => player.league).filter(Boolean))];
const roles = [...new Set(players.map((player) => player.role))];

export function ExplorerSectionV2() {
  const [query, setQuery] = useState('');
  const [league, setLeague] = useState('All');
  const [role, setRole] = useState('All');
  const [selectedId, setSelectedId] = useState(players[0]?.id);
  const filtered = useMemo(() => players.filter((player) =>
    `${player.name} ${player.team ?? ''}`.toLowerCase().includes(query.toLowerCase()) &&
    (league === 'All' || player.league === league) &&
    (role === 'All' || player.role === role)
  ), [query, league, role]);
  // Keep the dossier inside the filtered population when a filter changes.
  const selected = filtered.find((player) => player.id === selectedId) ?? filtered[0];
  const ranking = [...filtered].sort((a, b) => Math.abs(b.difference) - Math.abs(a.difference));
  const reset = () => { setQuery(''); setLeague('All'); setRole('All'); };
  const scale = selected ? Math.max(selected.observedValue, selected.estimatedValue, 1) : 1;
  const relativeGap = selected && selected.observedValue > 0 ? selected.difference / selected.observedValue : null;

  return (
    <Section id="explorer" eyebrow="The player dossier" title="One player. Two valuations.">
      <p className="dossier-intro">Where does the model see a different value? Explore the historical player comparisons published in the research.</p>
      <div className="dossier">
        <div className="dossier-toolbar">
          <div className="dossier-wordmark"><Users size={18} /><span>PLAYER INDEX</span><small>2023 ARCHIVE</small></div>
          <label className="dossier-search"><Search size={17} /><span className="sr-only">Search player or club</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search player or club" /></label>
          <label><span className="sr-only">League</span><select aria-label="League" value={league} onChange={(event) => setLeague(event.target.value)}><option value="All">All leagues</option>{leagues.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label><span className="sr-only">Position</span><select aria-label="Position" value={role} onChange={(event) => setRole(event.target.value)}><option value="All">All positions</option>{roles.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <button type="button" className="dossier-reset" title="Reset filters" aria-label="Reset filters" onClick={reset}><X size={18} /></button>
        </div>
        <div className="dossier-body">
          <aside className="dossier-index" aria-label="Player selection">
            <div className="dossier-index-title"><span>THE SHORTLIST</span><span>{filtered.length.toString().padStart(2, '0')}</span></div>
            {filtered.map((player, index) => <button type="button" key={player.id} aria-pressed={selected?.id === player.id} onClick={() => setSelectedId(player.id)} className={selected?.id === player.id ? 'player-index-row is-selected' : 'player-index-row'}><span className="index-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{player.name}</strong><small>{player.team ?? player.role}</small></span><span className={player.difference >= 0 ? 'gap-positive' : 'gap-negative'}>{player.difference >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}</span></button>)}
          </aside>
          {selected ? <article className="player-dossier" aria-label={`${selected.name} valuation dossier`}>
            <header className="player-dossier-header"><span>{selected.team ?? 'Player comparison'}</span><span>{selected.league ?? 'Historical sample'} / {selected.role}</span></header>
            <div className="player-dossier-main">
              <div className="player-identity">
                <p className="dossier-kicker">PLAYER IN FOCUS</p>
                <h3>{selected.name}</h3>
                <PlayerPortrait key={selected.id} id={selected.id} name={selected.name} />
                <dl className="player-facts">
                  <div><dt>Age in study</dt><dd>{selected.age}</dd></div>
                  <div><dt>Minutes played</dt><dd>{selected.minutesPlayed == null ? 'Unavailable' : selected.minutesPlayed.toLocaleString('en-GB')}</dd></div>
                  <div><dt>Position</dt><dd>{selected.role.replace(/_/g, ' ')}</dd></div>
                </dl>
                <p className="photo-date-note">Club and age refer to the historical study; photograph may show a different season.</p>
              </div>
              <div className="player-values"><p className="dossier-kicker">RANDOM FOREST ESTIMATE</p><div className="player-estimate">{compactEuro(selected.estimatedValue)}</div><p className="player-observed">Observed market value <strong>{compactEuro(selected.observedValue)}</strong></p><div className="value-comparison" role="img" aria-label={`Observed ${compactEuro(selected.observedValue)}, estimated ${compactEuro(selected.estimatedValue)}`}><div><span>Observed</span><strong>{compactEuro(selected.observedValue)}</strong><i style={{ width: `${selected.observedValue / scale * 100}%` }} /></div><div><span>RF estimate</span><strong>{compactEuro(selected.estimatedValue)}</strong><i className="estimate-bar" style={{ width: `${selected.estimatedValue / scale * 100}%` }} /></div></div><div className="player-gap"><span className={selected.difference >= 0 ? 'gap-positive' : 'gap-negative'}>{selected.difference >= 0 ? <ArrowUpRight size={28} /> : <ArrowDownRight size={28} />}{compactEuro(selected.difference)}</span><p>{selected.difference >= 0 ? 'Estimated above market' : 'Estimated below market'}<strong>{relativeGap == null ? 'Relative difference unavailable' : new Intl.NumberFormat('en-GB', { style: 'percent', maximumFractionDigits: 1, signDisplay: 'always' }).format(relativeGap)}</strong></p></div><p className="dossier-caveat">Model estimate minus observed value. A difference describes model behaviour; it does not establish a fair price or a future return.</p></div>
            </div>
            <div className="dossier-map"><div className="dossier-chart-heading"><h4>The valuation map</h4><span>OBSERVED / ESTIMATED</span></div><EChart ariaLabel="Observed and Random Forest estimated values for the filtered historical records" option={valuationScatter(filtered)} height={330} onClick={(event: unknown) => { const params = event as { dataIndex?: number; seriesIndex?: number }; if (params.seriesIndex === 1 && params.dataIndex != null && filtered[params.dataIndex]) setSelectedId(filtered[params.dataIndex].id); }} /><p>The reference line marks equal valuations. Select a player from the shortlist to read the comparison.</p></div>
          </article> : <div className="dossier-empty"><Search size={30} /><h3>No matching players</h3><p>Try a different name, league or position.</p><button type="button" onClick={reset}>Reset filters</button></div>}
        </div>
        <footer className="dossier-footer"><span>{players.length} published comparisons</span><p>Selected records recovered from the report, not a representative sample of all 10,754 players. The ranking workflow predicts on the full modelling population, mixing training and test records. These individual comparisons are not all held-out predictions.</p></footer>
      </div>
      <div className="dossier-ranking"><h3>Where the estimates diverge most</h3><p>Largest absolute differences within the current selection.</p><div>{ranking.slice(0, 5).map((player, index) => <button type="button" key={player.id} onClick={() => setSelectedId(player.id)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{player.name}</strong><small>{player.difference >= 0 ? 'Estimated above market' : 'Estimated below market'}</small><b className={player.difference >= 0 ? 'gap-positive' : 'gap-negative'}>{compactEuro(player.difference)}</b></button>)}</div></div>
    </Section>
  );
}
