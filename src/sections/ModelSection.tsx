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
      <p className="model-introduction">The research moves from a transparent linear baseline to interactions, regularisation and a forest of non-linear rules. Four specifications appear in the report; their evaluation contexts must remain distinct.</p>
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
        <li><strong>Define the target</strong><p>Positive-valued outfield players; log(current_value). Goalkeepers remain in EDA but are excluded from both model workflows.</p></li>
        <li><strong>Hold back 20%</strong><p>initial_split(prop = 0.80), seed 123. The training population supplies ten cross-validation folds.</p></li>
        <li><strong>Engineer within the recipe</strong><p>LASSO uses polynomial age, role dummies, interactions and zero-variance filtering. RF uses nominal dummies and zero-variance filtering.</p></li>
        <li><strong>Tune, fit, evaluate</strong><p>LASSO explores 51 penalties; RF explores ten mtry values with 100 trees. The metric tables evaluate predictions against log_precio on datos_prueba.</p></li>
      </ol></div></div>
      <div className="method-boundaries"><h3>What the evaluation does not establish</h3><p>A random holdout is not a temporal backtest. Both models see the same historical environment, and September league ratings postdate the June source snapshot. Additional checks are needed for time availability, team dependence and performance on future seasons.</p><p>Residual standard error in the two lm() summaries is not held-out RMSE. Exponentiating a log-scale error does not produce a calibrated confidence interval or a guaranteed “reasonable price range”.</p><p>The player-ranking code predicts on the full df_limpio, mixing training and test records. Its ±1.96 standardised-residual threshold is an outlier rule; it does not by itself prove mispricing or establish a valid p-value.</p></div>
      <ModelDiagnostics />
    </Section>
  )}</Localized>;
}
