import type { Insight, ModelMetric, PlayerValuation } from '../types';
import playerSelection from './playerSelection.json';

export const projectStats = [
  { label: 'Historical players', value: '10,754', note: 'Original final_data.csv records' },
  { label: 'Leagues covered', value: '20', note: 'Transfermarkt-derived dataset' },
  { label: 'Best verified R²', value: '0.735', note: 'Random Forest on log market value' },
];

export const leagueRatings = [
  { league: 'Premier League', rating: 87.66 },
  { league: 'Bundesliga', rating: 84.04 },
  { league: 'Serie A', rating: 83.46 },
  { league: 'La Liga', rating: 83.43 },
  { league: 'Ligue 1', rating: 81.41 },
  { league: 'Championship', rating: 78.58 },
  { league: 'Eredivisie', rating: 77.24 },
  { league: 'Primeira Liga', rating: 77.2 },
  { league: 'Brasileirao', rating: 76.43 },
  { league: 'Turkish Super Lig', rating: 75.65 },
  { league: 'Russian Premier League', rating: 75.08 },
  { league: 'MLS', rating: 74.77 },
  { league: 'Bundesliga Austria', rating: 74.76 },
  { league: 'Argentine Primera Division', rating: 73.66 },
  { league: 'Liga MX', rating: 73.2 },
  { league: 'J1 League', rating: 72.16 },
  { league: 'K League 1', rating: 72.09 },
  { league: 'Saudi Pro League', rating: 71.94 },
  { league: 'South African Premier Division', rating: 70.2 },
  { league: 'A-League', rating: 68.8 },
];

export const modelMetrics: ModelMetric[] = [
  {
    model: 'Linear baseline',
    r2: 0.5973,
    rmse: 1.034,
    errorLabel: 'Residual SE (log)',
    validation: 'Fitted sample',
    scope: 'Field players only; target = log(current_value).',
    evaluation: 'Reported from the fitted linear model summary in the Quarto output.',
  },
  {
    model: 'Linear + interactions',
    r2: 0.6102,
    rmse: 1.018,
    errorLabel: 'Residual SE (log)',
    validation: 'Fitted sample',
    scope: 'Field players only; interaction-rich log-price specification.',
    evaluation: 'lm() summary, not the separate glmnet LASSO test result.',
  },
  {
    model: 'LASSO',
    r2: 0.6313078,
    rmse: 1.0035603,
    mae: 0.7881349,
    errorLabel: 'RMSE (log)',
    validation: '20% holdout',
    scope: 'glmnet, mixture = 1; penalty = 0.001389495; polynomial age and interactions.',
    evaluation: 'Printed metricas_finales on datos_prueba; separate from the interaction lm() fit.',
  },
  {
    model: 'Random Forest',
    r2: 0.7349496,
    rmse: 0.8513059,
    errorLabel: 'RMSE (log)',
    validation: '20% holdout',
    mae: 0.6580739,
    scope: 'Train/test workflow with 100 ranger trees and tuned mtry.',
    evaluation: 'Metrics table generated on datos_prueba, target = log_precio.',
  },
];

export const correlations = [
  { variable: 'Goals + assists', value: 0.45 },
  { variable: 'League rating', value: 0.45 },
  { variable: 'Assists', value: 0.44 },
  { variable: 'Minutes played', value: 0.42 },
  { variable: 'Games played', value: 0.42 },
  { variable: 'Goals', value: 0.4 },
  { variable: 'Awards', value: 0.3 },
  { variable: 'Yellow cards', value: 0.29 },
  { variable: 'Age', value: -0.06 },
];

export const lassoCoefficients = [
  { term: 'league_rating', estimate: 0.1458505888 },
  { term: 'award', estimate: 0.0885618076 },
  { term: 'assists_abs', estimate: 0.0507647684 },
  { term: 'goals_abs', estimate: 0.0164869238 },
  { term: 'games_injured', estimate: 0.002717859 },
  { term: 'minutes.played', estimate: 0.000170267 },
  { term: 'rol_funcional_Full_Backs_Wingers', estimate: -0.0861845886 },
  { term: 'age_poly_2', estimate: -35.4083724344 },
];

export const insights: Insight[] = [
  {
    title: 'Market value is concentrated, not evenly distributed',
    question: 'How unequal are historical valuations across players?',
    interpretation:
      'The report finds a median value around EUR 800k, while the highest-value outliers exceed EUR 100m. That gap makes log-scale modeling necessary and keeps raw-euro errors hard to interpret.',
    method: 'Univariate market-value distribution and outlier review.',
  },
  {
    title: 'Age behaves like a curve, not a straight line',
    question: 'When does value begin to bend downward?',
    interpretation:
      'The bivariate analysis describes an inflection around age 27. The models therefore include age and age squared, allowing value to rise into prime years and decline afterwards.',
    method: 'Age/value scatter with quadratic relationship; linear model with I(age^2).',
  },
  {
    title: 'Continuity matters, but context matters too',
    question: 'Do minutes and output explain price on their own?',
    interpretation:
      'Minutes played correlates with value around 0.42, while goals plus assists and league rating are both around 0.45. The report treats competitive level as a core feature, not a cosmetic label.',
    method: 'Correlation matrix against current_value plus Opta league rating enrichment.',
  },
  {
    title: 'Roles shape what statistics mean',
    question: 'Are goals, assists and physical profile valued equally across roles?',
    interpretation:
      'The analysis separates goalkeepers, defensive players, creators, wide players and strikers. Height, age profile and attacking output differ by role, so a single coefficient can hide tactical meaning.',
    method: 'Role recoding, box plots by position, and model interactions.',
  },
];

// Generated from published Random Forest tables; unreported fields stay absent.
export const players: PlayerValuation[] = playerSelection as PlayerValuation[];
