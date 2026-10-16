export interface AnalysisEntry {
  sourceIndex: number;
  title: string;
  summary: string;
  note: string;
}
export interface AnalysisGroup {
  id: string;
  family: 'univariate' | 'bivariate';
  title: string;
  question: string;
  entries: AnalysisEntry[];
}

export const analysisGroups: AnalysisGroup[] = [
  {
    id: 'availability', family: 'univariate', title: 'Awards, injuries & discipline',
    question: 'What does the ordinary player record look like?',
    entries: [
      { sourceIndex: 8, title: 'Awards are concentrated among a small elite', summary: 'Most records sit in the low-award range. The report describes a sharp fall in frequency beyond six awards, followed by a much smaller elite tail.', note: 'The field combines individual and collective awards; it is not a pure measure of individual ability.' },
      { sourceIndex: 9, title: 'Availability has a long tail', summary: 'The summary gives a median of six games missed and a mean of 16.28. The difference matters: a small number of large records pull the average upward.', note: 'The recorded maximum is 339 games. This should trigger a source-definition check before interpreting every injury record as a two-season count.' },
      { sourceIndex: 10, title: 'Yellow cards are common, extreme totals are not', summary: 'The median is four reconstructed yellow cards and the upper quartile is eight. The distribution motivates the later comparison by tactical role.', note: 'Totals are reconstructed from per-90 rates and playing time, then rounded. They are not verified match-by-match disciplinary records.' },
      { sourceIndex: 11, title: 'Red cards are mostly zeros', summary: 'The median and upper quartile are both zero; the maximum in the descriptive output is four. The report describes almost 90% of records as having no red cards.', note: 'A zero-heavy event count needs a different interpretation from a continuous performance measure.' },
    ],
  },
  {
    id: 'production', family: 'univariate', title: 'On-pitch production', question: 'How far is an exceptional season from the typical record?',
    entries: [
      { sourceIndex: 13, title: 'The goal distribution is dominated by the low end', summary: 'The median reconstructed goal total is one, the upper quartile is five and the maximum is 83. The named tail includes Lewandowski, Haaland and Mbappé.', note: 'The dataset combines the 2021/22 and 2022/23 context. Do not read these totals as a single-season league leaderboard.' },
      { sourceIndex: 14, title: 'The creative elite forms another long tail', summary: 'The median assist total is one and the upper quartile is four. The maximum of 45 is far removed from an ordinary record.', note: 'The report highlights De Bruyne, Tadić and Vinicius among the largest assist records.' },
      { sourceIndex: 15, title: 'Clean sheets introduce a goalkeeper-specific outcome', summary: 'The original distribution examines clean-sheet totals and motivates a separate treatment of goalkeepers in the financial analysis.', note: 'A clean sheet belongs to a defensive unit as well as a goalkeeper. Team context remains essential.' },
      { sourceIndex: 16, title: 'Few goals conceded can also mean few minutes played', summary: 'The report checks the apparently exceptional zero-concession records and notes that these goalkeepers had very limited appearances.', note: 'This is an exposure problem: a low count is not automatically evidence of superior performance.' },
      { sourceIndex: 17, title: 'Goals plus assists capture two kinds of contribution', summary: 'The combined field has a median of three, an upper quartile of eight and a maximum of 116. It makes creative contributions visible alongside finishing.', note: 'The metric still omits pressing, ball progression, defensive work and much of a midfielder’s influence.' },
    ],
  },
  {
    id: 'profiles', family: 'univariate', title: 'Age, height, minutes & value', question: 'Who is represented, and on what economic scale?',
    entries: [
      { sourceIndex: 19, title: 'The middle of the age distribution is 26', summary: 'The descriptive output spans ages 15 to 43, with a median of 26 and an interquartile range of 22–30.', note: 'This describes the composition of the historical sample, not the probability that a player retires at a particular age.' },
      { sourceIndex: 20, title: 'Height varies around 181.2 cm', summary: 'The median and mean are both about 181.2 cm. The central half of the sample lies between 176 and 186 cm, with extremes of 156 and 206 cm.', note: 'The later position-based analysis explains why a pooled distribution hides different physical profiles.' },
      { sourceIndex: 21, title: 'Playing time is unevenly distributed', summary: 'The median is 2,238 minutes and the interquartile range is 795–4,051. Even after removing zero-minute players, exposure varies substantially.', note: 'These are the minutes recorded in the combined study dataset; they should not be casually relabelled as minutes per season.' },
      { sourceIndex: 22, title: 'The median market value is €800,000', summary: 'The mean is about €3.75m and the maximum is €180m. This mean–median gap exposes the influence of the upper tail.', note: 'The histogram filters positive values and uses a logarithmic x-axis. Its roughly bell-shaped appearance on that scale should not be mistaken for normality in raw euros; the descriptive summary also includes zero values.' },
    ],
  },
  {
    id: 'composition', family: 'univariate', title: 'Leagues & positions', question: 'How balanced is the sample?',
    entries: [
      { sourceIndex: 24, title: 'League representation is not uniform', summary: 'The original count plot shows differences in the number of player records across leagues. League size and squad coverage help explain those differences.', note: 'Record counts are not league quality scores, and the sample is not balanced across competitions.' },
      { sourceIndex: 25, title: 'Centre-backs are the most populated specific position', summary: 'The detailed position counts show centre-backs at the top. Less common labels such as second striker or left midfielder form smaller categories.', note: 'Differences in naming conventions can affect position counts as well as tactical squad needs.' },
      { sourceIndex: 26, title: 'Broad positions clarify the population', summary: 'Grouping into goalkeeper, defender, midfielder and forward reveals defenders as the largest group and goalkeepers as the smallest.', note: 'These broad groups are separate from the five functional roles constructed for modelling.' },
    ],
  },
  {
    id: 'outliers', family: 'univariate', title: 'Named outlier investigations', question: 'Which individuals stretch the distribution?',
    entries: [
      { sourceIndex: 28, title: 'Goal outliers, with names attached', summary: 'The box plot labels players above 30 reconstructed goals, connecting the statistical tail to recognisable football profiles.', note: 'Thirty goals is the chosen annotation threshold, not a formal test of statistical significance.' },
      { sourceIndex: 29, title: 'Assist outliers beyond the central range', summary: 'Players above 12 assists are named in the original plot. This gives context to a central box concentrated around zero to four assists.', note: 'An annotation threshold is a communication choice, not proof that a player is an exceptional prospect.' },
      { sourceIndex: 30, title: 'Clean-sheet outliers within the goalkeeper subset', summary: 'The goalkeeper-only box plot labels high clean-sheet records, avoiding a comparison with outfield players whose field is not comparable.', note: 'The source heading says >15, but the annotation code uses clean_sheets_abs >20. Its paragraph also refers to saves; the actual measure is clean sheets.' },
      { sourceIndex: 31, title: 'The €100m tail compresses the rest of the market', summary: 'The raw-euro box plot labels valuations of at least €100m. The central box looks tiny next to those exceptional prices.', note: 'This visual scale problem is one reason the modelling target is log market value.' },
    ],
  },
  {
    id: 'game-dynamics', family: 'bivariate', title: 'Game dynamics', question: 'How do physical profile, role and competition interact?',
    entries: [
      { sourceIndex: 34, title: 'Height depends on tactical role', summary: 'The position box plots place goalkeepers and centre-backs among the taller groups, while wide attacking players have a lower central height.', note: 'The interpretation is descriptive. It does not establish a height requirement or a causal effect on performance.' },
      { sourceIndex: 35, title: 'Age and injury exposure move together imperfectly', summary: 'A jitter plot and LOESS smoother show a slight increase in missed games after the early twenties. The author explicitly raises playing-time exposure as a competing explanation.', note: 'A player who competes more often has more opportunities to be injured. Age alone cannot isolate that mechanism.' },
      { sourceIndex: 36, title: 'Disciplinary counts reflect different jobs on the pitch', summary: 'Centre-backs and midfielders show higher yellow-card counts than goalkeepers in the role box plots.', note: 'Minutes, defensive exposure and tactical responsibilities can confound a simple role comparison.' },
      { sourceIndex: 37, title: 'Age profiles differ across roles', summary: 'The goalkeeper distribution extends further into older ages. Wide players and full-backs have more compact age profiles in the report.', note: 'Cross-sectional age distributions cannot establish individual career lengths.' },
      { sourceIndex: 38, title: 'Creators and finishers occupy different parts of the plot', summary: 'The goals–assists scatter separates typical finishing and creative profiles, while several elite attackers contribute strongly to both.', note: 'Role and team strength matter when comparing the same pair of totals across players.' },
      { sourceIndex: 39, title: 'Raw yellow-card totals favour larger competitions', summary: 'The Championship leads the raw league totals in the report. That result prompts a second analysis with an exposure-based denominator.', note: 'A larger count can result from more teams or more football being played, rather than stricter refereeing.' },
      { sourceIndex: 40, title: 'Normalising disciplinary totals changes the order', summary: 'The normalised chart puts Portugal, Brazil and Argentina high in the comparison, illustrating how the denominator changes the story.', note: 'Matches are estimated as summed player minutes ÷ (22 × 90). This is a proxy, not an independently verified fixture count.' },
      { sourceIndex: 41, title: 'Scoring environments vary by league', summary: 'The report’s normalised goal chart places the Bundesliga and Austrian league near the high end of the comparison.', note: 'The same minutes-based match proxy is used here. Squad coverage and the rounding of reconstructed goals affect the estimate.' },
    ],
  },
  {
    id: 'financial', family: 'bivariate', title: 'Market-value relationships', question: 'Which measured signals move with historical valuations?',
    entries: [
      { sourceIndex: 44, title: 'The correlation matrix is a map of dependencies', summary: 'Goals plus assists and league rating correlate with value at about 0.45; minutes at 0.42. Yellow cards correlate with minutes at 0.72, explaining why a positive cards–value association needs caution.', note: 'Correlation does not identify causes. The near-zero linear age correlation of −0.06 also misses a curved relationship.' },
      { sourceIndex: 45, title: 'Attacking contribution and market value rise together', summary: 'The actual scatter uses goals plus assists on the x-axis and a logarithmic value axis. A positive trend appears across a very broad value range.', note: 'The source prose quotes 0.40 for goals alone; the combined goals-plus-assists correlation in the matrix is about 0.45.' },
      { sourceIndex: 46, title: 'A straight age coefficient misses the career curve', summary: 'The LOESS curve bends around the mid-to-late twenties. The report describes an inflection near 27 and introduces quadratic age terms for modelling.', note: 'The curve is cross-sectional and does not track how the same footballer’s value changes over time.' },
      { sourceIndex: 47, title: 'The Premier League sits in a different value context', summary: 'The author reads the top-league box plots as an approximate €20m median in the Premier League, against roughly €5m in the other four major leagues.', note: 'These are approximate readings reported by the author, not a causal estimate of a Premier League premium.' },
      { sourceIndex: 48, title: 'Position changes the distribution of price', summary: 'Goalkeepers sit somewhat lower in the original value box plots, while several of the largest outliers are forwards.', note: 'Role alone does not explain price: age, output, competition and unmeasured qualities also differ.' },
      { sourceIndex: 49, title: 'Continuity is associated with higher valuations', summary: 'The minutes–value plot uses a flexible GAM smoother. More playing time generally accompanies higher historical market value.', note: 'The direction of causation is unresolved: stronger players may be selected more often, as well as benefiting from continuity.' },
      { sourceIndex: 50, title: 'The injury relationship resists an easy headline', summary: 'The plotted relationship is not a clean injury discount. The author discusses elite-player exposure as a possible explanation for the positive pattern.', note: 'The original figure subtitle predicts a negative relationship, but its discussion describes a positive one. The x-axis also restricts injury counts to 0–100.' },
      { sourceIndex: 51, title: 'Goals per 90 need a minimum-exposure filter', summary: 'The efficiency scatter keeps players with at least 450 minutes and relates reconstructed goals per 90 to log-scaled value.', note: 'The code uses ≥450 minutes, despite the section heading saying >450. A minimum threshold reduces, but does not eliminate, small-sample volatility.' },
      { sourceIndex: 52, title: 'Goalkeepers need their own performance lens', summary: 'The goalkeeper-only plot relates clean sheets to market value. The section heading reports a correlation of 0.5266.', note: 'That coefficient is stated in the heading rather than shown as a printed calculation. Clean sheets are strongly affected by team defence.' },
    ],
  },
];

export const preparationSteps = [
  { title: 'Establish the source and inspect missingness', detail: 'Import final_data.csv: 10,754 records and 22 original columns. table(is.na(first_data)) prints 236,588 FALSE entries and no TRUE entries.', reason: 'The raw import does not need missing-value imputation. This check precedes the enrichment joins; it does not establish that every later join matched.', code: 'table(is.na(first_data))\n# FALSE: 236588' },
  { title: 'Remove records without on-pitch exposure', detail: 'Keep minutes.played > 0. The report describes approximately 400 removed records; it does not print an exact post-filter row count.', reason: 'This aligns the sample with the performance-based objective, while excluding inactive players from the population to which results apply.', code: 'filter(minutes.played > 0)' },
  { title: 'Recover competitive context', detail: 'Build a team-to-league dictionary for 374 teams, then left-join league labels and September 2023 Opta ratings for 20 leagues.', reason: 'The mapping relies on the order of unique team names. A reproducible extension should verify that order and audit unmatched joins. The September rating also postdates the June valuation snapshot.', code: 'left_join(league_map, by = "team") |>\nleft_join(tabla_puntuaciones, by = "league")' },
  { title: 'Reconstruct absolute production', detail: 'Convert per-90 goals, assists, yellow cards, red cards, goals conceded and clean sheets into rounded totals using playing time.', reason: 'A short substitute appearance can generate an extreme per-90 rate. Totals bring exposure back into the comparison, but rounding means they remain reconstructed counts.', code: 'goals_abs = round(goals * minutes.played / 90)\nassists_abs = round(assists * minutes.played / 90)' },
  { title: 'Build positions that reflect different jobs', detail: 'Remove winger and position_encoded. Construct four broad position groups for EDA and five functional roles: goalkeepers, defensive players, wide players, creators and strikers.', reason: 'This separates population descriptions from the role distinctions used in modelling.', code: 'select(-winger, -position_encoded)\n# position_group: broad EDA groups\n# rol_funcional: five model roles' },
  { title: 'Combine contributions and control exposure', detail: 'Create goals_assists_abs. For the efficiency analysis, keep at least 450 minutes; for league rates, estimate match exposure from summed player minutes.', reason: 'Different questions need different denominators. The report explicitly moves from raw totals to normalised comparisons.', code: 'goals_assists_abs = goals_abs + assists_abs\n# Efficiency subset\nfilter(minutes.played >= 450)' },
  { title: 'Define the modelling population and target', detail: 'Exclude goalkeepers and non-positive market values. Use log(current_value), split 80% for training and 20% for testing with seed 123, and create 10 cross-validation folds on training data.', reason: 'Log prices reduce the scale imbalance; a random holdout evaluates historical interpolation, not performance on a future season.', code: 'filter(rol_funcional != "Goalkeepers", current_value > 0)\nmutate(log_precio = log(current_value))\nset.seed(123)\ninitial_split(df_limpio, prop = 0.80)\nvfold_cv(datos_entrenamiento, v = 10)' },
];

export const researchTakeaways = [
  { title: 'The market is a mixture of populations', text: 'A pooled dataset combines different roles, league environments and levels of exposure. The grouped EDA is the bridge from raw records to a model that can account for some of that context.' },
  { title: 'Non-linearity improves the held-out comparison', text: 'Random Forest reports test R² 0.7349496 and RMSE 0.8513059 in log-price units. The LASSO test table reports R² 0.6313078 and RMSE 1.0035603. The comparison supports greater flexibility on this random split, without proving a universal market law.' },
  { title: 'The unexplained gap is part of the finding', text: 'The report contrasts established attacking output with the potential of young talents and the less visible influence of creative midfielders. Contract context, future potential and tactical impact are only partly represented by this feature set.' },
  { title: 'Extreme estimates deserve investigation', text: 'The published LASSO tables include an estimate of about €11.6bn for Messi against an observed €45m. That is a model diagnostic, not a credible valuation or a guaranteed opportunity; aggregate scores do not excuse implausible individual outputs.' },
];

export const retrospectiveCases = [
  { player: 'Thijs Dallinga', finding: 'RF estimate €31.18m vs observed €7m.', interpretation: 'The author later describes a valuation peak around €18m and a reported €15m move to Bologna. The narrative does not show convergence to the model estimate.' },
  { player: 'Branco van den Boomen', finding: 'RF estimate €26.23m vs observed €9m.', interpretation: 'The author describes an initial rise toward €12m followed by a less successful Ajax period. The case illustrates why a one-time residual is not a future return forecast.' },
  { player: 'Pedri', finding: 'RF estimate €7.57m vs observed €100m.', interpretation: 'The author discusses injuries and a later €80m valuation. The gap also highlights how goals and assists miss much of a creative midfielder’s tactical contribution.' },
];
