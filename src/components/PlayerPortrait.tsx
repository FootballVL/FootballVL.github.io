import { useState } from 'react';
import photoData from '../data/photos.json';

export interface PlayerPhoto {
  src: string;
  sourceUrl: string;
  author: string;
  license: string;
  licenseUrl: string;
  date: string;
  description: string;
}

export const playerPhotos: Record<string, PlayerPhoto> = photoData;

export function PlayerPortrait({ id, name, credit = true, eager = false }: {
  id: string;
  name: string;
  credit?: boolean;
  eager?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const photo = playerPhotos[id];

  return (
    <figure className="player-portrait">
      {photo && !failed ? (
        <img
          src={`${import.meta.env.BASE_URL}${photo.src}`}
          alt={name}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          width={720}
          height={900}
          onError={() => setFailed(true)}
        />
      ) : <div className="photo-unavailable">Photograph unavailable</div>}
      {credit && photo && (
        <figcaption>
          <a href={photo.sourceUrl} target="_blank" rel="noreferrer">Photo: {photo.author}</a>
          {' / '}<a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>
        </figcaption>
      )}
    </figure>
  );
}

export function PhotoCredits() {
  return (
    <details className="photo-credits">
      <summary>Photography & type credits</summary>
      <p>Real photographs from Wikimedia Commons, stored locally. Photographs may come from a different season or national team; club and age labels in the explorer refer to the historical research. Images are cropped for display, without altering the original files.</p>
      <ul>
        {Object.entries(playerPhotos).map(([id, photo]) => (
          <li key={id}>
            <a href={photo.sourceUrl} target="_blank" rel="noreferrer">{id.split('-').join(' ')}</a>
            <span>{photo.author} / <a href={photo.licenseUrl} target="_blank" rel="noreferrer">{photo.license}</a>{photo.date ? ` / ${photo.date}` : ''}</span>
          </li>
        ))}
      </ul>
      <p>Barlow Condensed, IBM Plex Sans and IBM Plex Mono are self-hosted under the SIL Open Font License. License texts are included with the font files.</p>
    </details>
  );
}
