export type PlayerRole = 'Striker' | 'Game_Creator' | 'Full_Backs_Wingers' | 'Defensive_Players';

export interface PlayerValuation {
  id: string;
  name: string;
  team: string;
  league?: string;
  age: number;
  role: PlayerRole;
  minutesPlayed?: number;
  observedValue: number;
  estimatedValue: number;
  difference: number;
  ratio: number;
  zScore?: number;
  sourceTable: string;
  signal: 'estimated_above_market' | 'estimated_below_market';
}

export interface ModelMetric {
  model: string;
  r2: number;
  rmse: number;
  errorLabel: 'Residual SE (log)' | 'RMSE (log)';
  validation: 'Fitted sample' | '20% holdout';
  mae?: number;
  scope: string;
  evaluation: string;
}

export interface Insight {
  title: string;
  question: string;
  interpretation: string;
  method: string;
}
