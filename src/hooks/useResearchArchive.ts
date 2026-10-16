import { useEffect, useState } from 'react';
import type { ResearchTopic } from '../types/research';

let archivePromise: Promise<ResearchTopic[]> | undefined;
export function loadResearchArchive() {
  if (!archivePromise) archivePromise = import('../data/reportArchive.json').then((module) => module.default as ResearchTopic[]);
  return archivePromise;
}

export function useResearchArchive() {
  const [topics, setTopics] = useState<ResearchTopic[]>([]);
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    loadResearchArchive().then((data) => { if (active) setTopics(data); }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, []);
  return { topics, error, loading: !topics.length && !error };
}
