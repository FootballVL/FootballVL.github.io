import { Localized } from '../i18n/I18nProvider';
import { Section } from '../components/Section';
import { EChart } from '../charts/EChart';
import { metricOption } from '../charts/chartOptions';
import { modelMetrics } from '../data/research';
import { percent } from '../utils/format';
import { ModelDiagnostics } from '../components/ModelDiagnostics';

export function ModelSection() {
  const holdoutMetrics = modelMetrics.filter((metric) => metric.validation === '20% holdout');
  return <Localized>{(
    <Section id="model" eyebrow="From patterns to estimates" title="Explain the patterns. Test the predictions.">
      <p className="model-introduction">Busco identificar jugadores potencialmente sobrevalorados o infravalorados a partir de su rendimiento. Para explorar las diferencias más extremas utilizo una referencia estadística del 95 %.</p>
      <p className="model-criterion">Mi criterio de selección es |z| &gt; 1,96 en los residuos estandarizados. Lo utilizo como señal para investigar perfiles, no como un intervalo de confianza individual validado.</p>
      <div className="model-rationale"><div><h3>Why these methods?</h3><p>The target is a continuous price, so the report sets aside logistic classification. K-nearest neighbours is also set aside because the project prioritises an interpretable account of the variables associated with value.</p></div><div><h3>Two complementary approaches</h3><p>LASSO penalises coefficient size and can shrink redundant terms to zero; this is feature selection, not a significance test. Random Forest averages 100 trees trained with bootstrap samples and random feature choices, allowing effects to change across parts of the population.</p></div></div>
      <div className="model-results-grid">{modelMetrics.map((metric) => <article key={metric.model}>
        <p className="model-validation-label">{metric.validation}</p><h3>{metric.model}</h3>
        <div className="model-stat-pair"><div><strong>{percent(metric.r2)}</strong><span>R²</span></div><div><strong>{metric.rmse.toFixed(3)}</strong><span>{metric.errorLabel}</span></div></div>
        {metric.mae != null && <p className="model-mae">MAE (log): {metric.mae.toFixed(7)}</p>}
        <p>{metric.scope}</p><small>{metric.evaluation}</small>
      </article>)}</div>
      <div className="model-evaluation-layout"><div>
        <h3>The comparison on held-out players</h3>
        <EChart ariaLabel="Held-out LASSO versus Random Forest: R squared and log-price RMSE" option={metricOption(holdoutMetrics)} height={360} />
        <p className="summary-source">Exact test outputs: LASSO R² 0.6313078, RMSE 1.0035603; Random Forest R² 0.7349496, RMSE 0.8513059. The 0.6102 result belongs to the fitted interaction regression, not this LASSO test.</p>
      </div><div className="validation-protocol"><h3>A reproducible validation path</h3><ol>
        <li><strong>Define the target</strong><p>Trabajo con jugadores de campo de valor positivo y transformo el valor mediante el logaritmo natural. Mantengo a los porteros en el análisis exploratorio, pero los excluyo de ambos modelos por la imposibilidad de valorarlos con el mismo criterio de rendimiento que al resto de jugadores.</p></li>
        <li><strong>Hold back 20%</strong><p>initial_split(prop = 0.80), seed 123. The training population supplies ten cross-validation folds.</p></li>
        <li><strong>Engineer within the recipe</strong><p>LASSO uses polynomial age, role dummies, interactions and zero-variance filtering. RF uses nominal dummies and zero-variance filtering.</p></li>
        <li><strong>Tune, fit, evaluate</strong><p>LASSO explores 51 penalties; RF explores ten mtry values with 100 trees. The metric tables evaluate predictions against log_precio on datos_prueba.</p></li>
      </ol></div></div>
      <ModelDiagnostics />
    </Section>
  )}</Localized>;
}
