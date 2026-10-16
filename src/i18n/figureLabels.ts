export interface FigureLabel { text: string; x: number; y: number; width: number; size?: number; rotate?: number; anchor?: 'start' | 'middle' | 'end'; }
export interface FigureMask { x: number; y: number; width: number; height: number; }
export interface FigureLabels { labels: FigureLabel[]; masks: FigureMask[]; }

// Coordinates refer to the untouched 1344 × 960 source figures. Masks cover
// annotation margins only, never observations, numeric ticks or plotted marks.
const specs: Record<number, [string, string?, string?, string?]> = {
  2: ['Awards distribution', 'Number of players', 'Award intervals'],
  3: ['Injury distribution', 'Number of players', 'Games missed through injury'],
  4: ['Yellow cards', 'Number of players', 'Yellow-card intervals'],
  5: ['Red cards', 'Number of players', 'Total'],
  6: ['Distribution: goals', 'Frequency (log scale)'],
  7: ['Distribution: assists', 'Frequency (log scale)'],
  8: ['Distribution: clean sheets', 'Frequency (log scale)'],
  9: ['Distribution: goals conceded', 'Frequency (log scale)'],
  10: ['Distribution: goals plus assists', 'Frequency (log scale)'],
  11: ['Age', 'Frequency', 'Years'],
  12: ['Height', 'Frequency', 'cm'],
  13: ['Minutes played', 'Frequency', 'Minutes'],
  14: ['Market value', 'Frequency', 'Euros (log scale)'],
  15: ['Players by league', 'Number of players'],
  16: ['Specific positions', 'Number of players', undefined, 'Excluding generic position labels'],
  17: ['Distribution by position', 'Number of players'],
  18: ['Boxplot: goals (leading scorers)', 'Goals'],
  19: ['Boxplot: assists (leading creators)', 'Assists'],
  20: ['Boxplot: clean sheets (leading goalkeepers)', 'Clean sheets'],
  21: ['Boxplot: market value in 2023', 'Euros'],
  22: ['Physique and tactics: height by role', 'Height (cm)', 'Tactical role'],
  23: ['Physical wear: age and games missed through injury', 'Games missed through injury', 'Age', 'Injury trends across the career'],
  24: ['Discipline: yellow cards by tactical role', 'Accumulated yellow cards', 'Tactical role'],
  25: ['Experience and youth: age by tactical role', 'Age (years)', 'Tactical role', 'The author contrasts younger wingers with more experienced goalkeepers and centre-backs'],
  26: ['Offensive role: goals and assists', 'Total assists', 'Total goals', 'Above the line: creators. Below the line: finishers.'],
  27: ['Yellow cards by league', 'Yellow cards', 'League'],
  28: ['The normalised rate: yellow cards per match', 'Mean yellow cards per match', 'League'],
  29: ['The spectacle: goals per match by league', 'Mean goals per match', 'League', 'Normalised using recorded playing time'],
  30: ['Correlations with market value, including league rating'],
  31: ['Performance and value: the price of a goal', 'Market value (log scale)', 'Total goals plus assists', 'Greater goal involvement is associated with higher market value'],
  32: ['Age and market value', 'Market value (log scale)', 'Age', 'The author places the financial prime around ages 25–27'],
  33: ['The Premier League premium: value by league', undefined, 'Market value (log scale)', 'Value distributions in the five major leagues (log scale)'],
  34: ['The offensive premium: value by position', 'Market value (log scale)', 'Tactical role', 'Attackers have the highest upper-tail values in the source comparison'],
  35: ['Availability and value: minutes played', 'Market value (log scale)', 'Recorded minutes played', 'The author highlights the region above 1,500 minutes'],
  36: ['Injury and market value', 'Market value (log scale)', 'Total games missed through injury', 'The source discusses injury risk; this comparison does not establish causation'],
  37: ['Offensive efficiency: goals per 90 minutes and value', 'Market value (log scale)', 'Goals per 90 minutes', 'Excluding players with fewer than 450 recorded minutes'],
  38: ['Goalkeepers: clean sheets and market value', 'Market value (log scale)', 'Number of clean sheets', 'Goalkeeper-only analysis'],
  39: ['LASSO penalty search', 'Root mean squared error', 'Amount of regularisation'],
  40: ['Random Forest tuning', undefined, 'Number of randomly selected predictors', 'RMSE and R² across the mtry search'],
  41: ['Variable importance in the Random Forest', undefined, 'Importance'],
  42: ['Critical factors in player valuation'],
};

const roles = ['1. Goalkeeper', '2. Centre-back', '3. Full-backs', '4. Midfield', '5. Wingers and second strikers', '6. Centre-forward'];
const fields = ['Market value', 'Age', 'Age squared', 'Height', 'Minutes played', 'Goals plus assists', 'League rating', 'Appearances', 'Games missed through injury', 'Days injured', 'Awards', 'Goals', 'Assists', 'Yellow cards'];

export function figureLabels(number: number): FigureLabels | undefined {
  const spec = specs[number];
  if (!spec) return undefined;
  const [title, yAxis, xAxis, subtitle] = spec;
  const labels: FigureLabel[] = [{ text: title, x: 672, y: number === 42 ? 82 : 30, width: 1260, size: 30 }];
  const masks: FigureMask[] = [{ x: 0, y: number === 42 ? 55 : 0, width: 1344, height: number === 42 ? 55 : (subtitle ? (number === 29 ? 94 : 102) : 60) }];
  if (subtitle) labels.push({ text: subtitle, x: 672, y: 78, width: 1260, size: 23 });
  if (yAxis) { masks.push({ x: 8, y: 100, width: 37, height: 760 }); labels.push({ text: yAxis, x: 28, y: 440, width: 680, size: 25, rotate: -90 }); }
  if (xAxis) { masks.push({ x: 0, y: 915, width: 1344, height: 45 }); labels.push({ text: xAxis, x: 715, y: 933, width: 1200, size: 25 }); }
  const categories = (values: string[], start: number, step: number, top: number, size = 21) => {
    masks.push({ x: 0, y: top, width: 1344, height: 915 - top });
    values.forEach((text, index) => labels.push({ text, x: start + index * step, y: top + 25, width: (915 - top - 30) * 1.35, size, rotate: -45, anchor: 'end' }));
  };
  const leagueOrders: Record<number, string[]> = {
    15: ['MLS', 'Argentine Primera Division', 'Championship', 'Brasileirao', 'J1 League', 'Serie A', 'Ligue 1', 'Premier League', 'Turkish Super Lig', 'Bundesliga', 'South African Premier Division', 'Primeira Liga', 'La Liga', 'Eredivisie', 'Liga MX', 'Saudi Pro League', 'K League 1', 'Russian Premier League', 'Bundesliga Austria', 'A-League'],
    27: ['Championship', 'La Liga', 'Serie A', 'Primeira Liga', 'Premier League', 'Bundesliga', 'Turkish Super Lig', 'Liga MX', 'Ligue 1', 'Russian Premier League', 'Eredivisie', 'Bundesliga Austria', 'Saudi Pro League', 'MLS', 'South African Premier Division', 'A-League', 'Argentine Primera Division', 'Brasileirao', 'K League 1', 'J1 League'],
    28: ['Primeira Liga', 'Brasileirao', 'Argentine Primera Division', 'La Liga', 'Russian Premier League', 'Liga MX', 'Serie A', 'Turkish Super Lig', 'MLS', 'A-League', 'Bundesliga Austria', 'Saudi Pro League', 'Bundesliga', 'Championship', 'K League 1', 'Premier League', 'Ligue 1', 'South African Premier Division', 'Eredivisie', 'J1 League'],
    29: ['Bundesliga', 'Bundesliga Austria', 'Russian Premier League', 'Premier League', 'Turkish Super Lig', 'J1 League', 'Eredivisie', 'Brasileirao', 'K League 1', 'Serie A', 'Ligue 1', 'A-League', 'Saudi Pro League', 'MLS', 'La Liga', 'Primeira Liga', 'Liga MX', 'Championship', 'South African Premier Division', 'Argentine Primera Division'],
  };
  if (leagueOrders[number]) categories(leagueOrders[number], number === 15 ? 138 : number === 27 ? 151 : 113, number === 15 ? 60.7 : number === 27 ? 60.1 : 62.1, number === 15 ? 700 : 664, 20);
  if (number === 16) categories(['Centre-back', 'Centre-forward', 'Central midfield', 'Goalkeeper', 'Defensive midfield', 'Right-back', 'Left-back', 'Attacking midfield', 'Left winger', 'Right winger', 'Left midfield', 'Right midfield', 'Second striker'], 170, 92, 748, 20);
  if (number === 17) categories(['Defender', 'Midfielder', 'Forward', 'Goalkeeper'], 288, 289, 830, 22);
  if ([22, 24, 25].includes(number)) categories(roles, number === 22 ? 220 : 209, number === 22 ? 198 : 200, 660);
  if (number === 34) categories([...roles.slice(0, 4), '5. Attackers / wingers', roles[5]], 266, 190, 733);
  if (number === 26) {
    masks.push({ x: 1125, y: 367, width: 218, height: 45 }, { x: 1187, y: 425, width: 156, height: 179 });
    labels.push({ text: 'Position', x: 1230, y: 390, width: 205, size: 23 });
    ['Defender', 'Forward', 'Goalkeeper', 'Midfielder'].forEach((text, i) => labels.push({ text, x: 1260, y: 442 + i * 46, width: 156, size: 21 }));
  }
  if (number === 30) {
    masks.push({ x: 0, y: 60, width: 365, height: 700 }, { x: 0, y: 750, width: 1075, height: 210 }, { x: 1090, y: 265, width: 100, height: 39 });
    fields.slice(0, 13).reverse().forEach((text, i) => labels.push({ text, x: 354, y: 95 + i * 51.7, width: 300, size: 22, anchor: 'end' }));
    fields.slice(1).forEach((text, i) => labels.push({ text, x: 399 + i * 52, y: 769, width: 205, size: 19, rotate: -48, anchor: 'end' }));
    labels.push({ text: 'Correlation', x: 1140, y: 285, width: 115, size: 23 });
  }
  if (number === 33) {
    masks.push({ x: 0, y: 110, width: 184, height: 700 });
    ['Premier League', 'Serie A', 'La Liga', 'Bundesliga', 'Ligue 1'].forEach((text, i) => labels.push({ text, x: 176, y: 189 + i * 138.5, width: 170, size: 22, anchor: 'end' }));
  }
  if (number === 40) {
    for (const [text, y] of [['RMSE', 132], ['R²', 525]] as const) { masks.push({ x: 670, y: y - 13, width: 100, height: 26 }); labels.push({ text, x: 718, y, width: 100, size: 19 }); }
  }
  if (number === 39) { masks.shift(); labels.shift(); }
  if (number === 41) {
    masks.push({ x: 0, y: 65, width: 410, height: 805 }, { x: 1210, y: 422, width: 130, height: 38 }, { x: 1276, y: 476, width: 65, height: 35 });
    ['League rating', 'Minutes played', 'Age', 'Assists', 'Games missed through injury', 'Awards', 'Goals', 'Role: full-backs / wingers', 'Role: game creator', 'Role: striker'].forEach((text, i) => labels.push({ text, x: 398, y: 110 + i * 79.6, width: 380, size: 23, anchor: 'end' }));
    labels.push({ text: 'Fill', x: 1245, y: 442, width: 120, size: 23 }, { text: 'Red', x: 1300, y: 493, width: 65, size: 21 });
  }
  // The split thresholds below are literal transcriptions, not OCR estimates.
  // Node means, sample counts and percentages remain in the original bitmap.
  if (number === 42) {
    const splits: [string, number, number, number][] = [
      ['League rating < 80', 412, 379, 120], ['League rating < 73', 270, 465, 120],
      ['Minutes played < 4315', 842, 465, 135], ['Games missed through injury < 0.5', 198, 551, 150],
      ['Minutes played < 4498', 483, 551, 135], ['League rating < 86', 770, 551, 120],
      ['Age polynomial 1 ≥ 0.014', 1056, 551, 110],
      ['Age polynomial 2 × minutes played ≥ -4.2', 162, 636, 198], ['Goals < 7.5', 305, 636, 80],
      ['Awards < 0.5', 449, 636, 85], ['Age polynomial 1 ≥ 0.012', 592, 636, 110],
      ['Age polynomial 2 × minutes played ≥ -8.9', 735, 636, 180], ['Age polynomial 1 ≥ 0.012', 878, 636, 102],
      ['Awards < 2.5', 1021, 636, 85], ['League rating < 86', 1164, 636, 120],
    ];
    splits.forEach(([text, x, y, width]) => { masks.push({ x: x - width / 2, y: y - 6, width, height: 12 }); labels.push({ text, x, y, width, size: 9 }); });
  }
  return { labels, masks };
}
