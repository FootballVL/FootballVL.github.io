import { Localized, useI18n } from '../i18n/I18nProvider';
import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Search } from 'lucide-react';
import { analysisGroups } from '../content/research';
import { useResearchArchive } from '../hooks/useResearchArchive';
import { ResearchEvidence } from './ResearchEvidence';
import { LocalizedResearchFigure } from './LocalizedResearchFigure';

export function AnalysisAtlas() {
  const { t } = useI18n();
  const { topics, loading, error } = useResearchArchive();
  const [family, setFamily] = useState<'univariate' | 'bivariate'>('univariate');
  const [selectedIndex, setSelectedIndex] = useState(8);
  const [query, setQuery] = useState('');
  const groups = useMemo(() => analysisGroups.filter((group) => group.family === family).map((group) => ({ ...group, entries: group.entries.filter((entry) => `${t(group.title)} ${t(entry.title)} ${t(entry.summary)} ${entry.title}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())) })).filter((group) => group.entries.length), [family, query, t]);
  const entries = groups.flatMap((group) => group.entries);
  const selected = entries.find((entry) => entry.sourceIndex === selectedIndex) ?? entries[0];
  const position = selected ? entries.indexOf(selected) : -1;
  const topic = selected ? topics[selected.sourceIndex] : undefined;
  const selectedGroup = groups.find((group) => group.entries.some((entry) => entry.sourceIndex === selected?.sourceIndex));

  return <Localized>{<div className="analysis-atlas" id="analysis-atlas">
    <div className="atlas-intro"><div><p className="dossier-kicker">THE COMPLETE EXPLORATORY WORKBOOK</p><h3>Every question leaves a trace.</h3></div><p>20 univariate investigations. 17 bivariate comparisons. Each original figure is paired with its research question, a translated interpretation and the R implementation.</p></div>
    <div className="atlas-toolbar">
      <div className="atlas-tabs" role="group" aria-label="Analysis family"><button type="button" aria-pressed={family === 'univariate'} onClick={() => { setFamily('univariate'); setQuery(''); }}>Univariate <span>20</span></button><button type="button" aria-pressed={family === 'bivariate'} onClick={() => { setFamily('bivariate'); setQuery(''); }}>Bivariate <span>17</span></button></div>
      <label className="atlas-search"><Search size={16} /><span className="sr-only">Search research analyses</span><input aria-label="Search research analyses" placeholder="Find a variable or question" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
    </div>
    {loading ? <p className="archive-status" role="status">Loading the original research archive…</p> : error ? <p className="archive-status" role="alert">The research archive could not load. Reload the page or download the original report below.</p> : <div className="atlas-workspace">
      <aside className="atlas-index" aria-label="Research analysis index">{groups.map((group) => <div key={group.id}><h4>{group.title}<span>{group.entries.length}</span></h4>{group.entries.map((entry) => <button type="button" key={entry.sourceIndex} aria-pressed={selected?.sourceIndex === entry.sourceIndex} onClick={() => setSelectedIndex(entry.sourceIndex)}>{entry.title}</button>)}</div>)}</aside>
      {selected && topic ? <article className="atlas-detail" aria-label="Selected research analysis">
        <div className="atlas-reading-line"><span>{selectedGroup?.title}</span><div><span>{position + 1} / {entries.length}</span><button type="button" aria-label="Previous analysis" title="Previous analysis" disabled={position <= 0} onClick={() => setSelectedIndex(entries[position - 1].sourceIndex)}><ArrowLeft size={17} /></button><button type="button" aria-label="Next analysis" title="Next analysis" disabled={position >= entries.length - 1} onClick={() => setSelectedIndex(entries[position + 1].sourceIndex)}><ArrowRight size={17} /></button></div></div>
        <p className="atlas-question">{selectedGroup?.question}</p><h4>{selected.title}</h4><p className="atlas-interpretation">{selected.summary}</p>
        {topic.figures.map((figure) => <LocalizedResearchFigure key={figure.src} src={figure.src} title={selected.title} />)}
        <div className="analysis-reading-note"><strong>Reading with care</strong><p>{selected.note}</p></div>
        <ResearchEvidence topic={topic} />
      </article> : <div className="archive-status"><h4>No analyses match this search.</h4><button type="button" onClick={() => setQuery('')}>Clear search</button></div>}
    </div>}
  </div>}</Localized>;
}
