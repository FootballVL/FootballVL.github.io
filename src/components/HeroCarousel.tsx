import { Localized } from '../i18n/I18nProvider';
import { useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { players as allPlayers } from '../data/research';
import { compactEuro } from '../utils/format';
import { PlayerPortrait } from './PlayerPortrait';
import type { PlayerValuation } from '../types';
import './hero-carousel.css';

const openingIds = ['thijs-dallinga', 'deniz-undav', 'alejandro-balde', 'giovanni-reyna'];
const players = [
  ...openingIds.flatMap((id) => allPlayers.filter((player) => player.id === id)),
  ...allPlayers.filter((player) => !openingIds.includes(player.id)),
];

function ValuationSlide({ player, eager }: { player: PlayerValuation; eager: boolean }) {
  const maxValue = Math.max(player.observedValue, player.estimatedValue, 1);
  return <Localized>{(
    <div className="valuation-slide" role="listitem">
      <PlayerPortrait id={player.id} name={player.name} credit={false} eager={eager} />
      <div className="valuation-photo-overlay">
        <h2>{player.name}</h2>
        <dl>
          <div><dt>Observed</dt><dd>{compactEuro(player.observedValue)}</dd><i style={{ width: `${player.observedValue / maxValue * 100}%` }} aria-hidden="true" /></div>
          <div><dt>RF estimate</dt><dd>{compactEuro(player.estimatedValue)}</dd><i style={{ width: `${player.estimatedValue / maxValue * 100}%` }} aria-hidden="true" /></div>
        </dl>
        <p className={player.difference >= 0 ? 'overlay-gap-positive' : 'overlay-gap-negative'}>
          <span>Model gap</span><strong>{player.difference > 0 ? '+' : ''}{compactEuro(player.difference)}</strong>
        </p>
      </div>
    </div>
  )}</Localized>;
}

export function HeroCarousel() {
  const reducedMotion = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const moving = !paused && !reducedMotion;

  return <Localized>{(
    <div className="continuous-carousel" role="region" aria-label="Historical player valuation gallery">
      <div className="valuation-film-window" tabIndex={reducedMotion ? 0 : undefined} aria-label={reducedMotion ? 'Scrollable player gallery' : undefined}>
        <div className="valuation-film-track" data-moving={moving} style={{ animationPlayState: moving ? 'running' : 'paused' }}>
          <div className="valuation-film-group" role="list" aria-label="Player valuations">
            {players.map((player, index) => <ValuationSlide key={player.id} player={player} eager={index < 4} />)}
          </div>
          {/* An identical second strip makes the loop continuous at the seam. */}
          <div className="valuation-film-group" role="list" aria-hidden="true">
            {players.map((player) => <ValuationSlide key={player.id} player={player} eager={false} />)}
          </div>
        </div>
      </div>
      <div className="valuation-film-caption">
        <p>20 players. Observed values and Random Forest estimates from the historical study.<span> Model gap = estimate − observed; these are comparisons, not price histories.</span></p>
        <button type="button" onClick={() => setPaused(!paused)} disabled={Boolean(reducedMotion)} aria-label={moving ? 'Pause animation' : 'Resume animation'} title={moving ? 'Pause animation' : 'Resume animation'}>
          {moving ? <Pause size={15} /> : <Play size={15} />}
        </button>
      </div>
    </div>
  )}</Localized>;
}
