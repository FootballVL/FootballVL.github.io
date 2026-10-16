import { useState } from 'react';
import { useResearchArchive } from '../hooks/useResearchArchive';
import { ResearchEvidence } from './ResearchEvidence';

const diagnostics = [
  { title: 'LASSO penalty search', topic: 54, figure: 0, description: 'A 51-value penalty grid is evaluated on ten training folds. The code fits the reported LASSO with a fixed penalty of 0.001389495 before displaying the tuning experiment; no printed select_best() step links that fixed value to this search.' },
  { title: 'Random Forest tuning', topic: 56, figure: 0, description: 'The search varies mtry from 1 to 10 with 100 trees. select_best(metric = "rmse") finalises the workflow using training-fold results before the held-out test evaluation.' },
  { title: 'Feature importance', topic: 56, figure: 1, description: 'The ranger model uses impurity-based importance; league rating is prominent in the source plot. Importance is predictive, not causal, and can be distorted by correlated predictors or differing feature characteristics.' },
  { title: 'An illustrative decision tree', topic: 56, figure: 2, description: 'The depth-four rpart tree is a teaching example fitted separately. It explains binary splits, but is not one of the actual 100 ranger trees and does not exactly reproduce the forest’s decisions.' },
];

export function ModelDiagnostics() {
  const [selected, setSelected] = useState(0);
  const { topics } = useResearchArchive();
  const diagnostic = diagnostics[selected];
  const topic = topics[diagnostic.topic];
  const figure = topic?.figures[diagnostic.figure];
  return <div className="model-diagnostics">
    <div className="atlas-intro"><div><p className="dossier-kicker">OPEN THE ENGINE ROOM</p><h3>How the models were built.</h3></div><p>The original tuning curves, feature-importance plot and teaching tree make the modelling process inspectable.</p></div>
    <div className="diagnostic-tabs" role="group" aria-label="Model diagnostic">{diagnostics.map((item, index) => <button type="button" key={item.title} aria-pressed={index === selected} onClick={() => setSelected(index)}>{item.title}</button>)}</div>
    <p className="diagnostic-description">{diagnostic.description}</p>
    {figure && <figure className="original-figure"><a href={`${import.meta.env.BASE_URL}${figure.src}`} target="_blank" rel="noreferrer"><img src={`${import.meta.env.BASE_URL}${figure.src}`} alt={`${diagnostic.title}. ${diagnostic.description}`} loading="lazy" decoding="async" /></a><figcaption>Original R output / open image for full resolution</figcaption></figure>}
    {topic && <ResearchEvidence topic={topic} />}
  </div>;
}
