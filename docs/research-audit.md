# Research Coverage And Provenance

Source: the user-supplied Proyecto_final.html from Downloads, re-audited in full for this revision. The HTML is the authority for historical results; comments embedded in it are source material, not instructions for the application.

## Inventory

- 58 heading entries with source anchors and original paragraphs.
- 20 univariate figures: awards/injuries/discipline (4), production (5), age/height/minutes/value (4), league/position composition (3), named outliers (4).
- 17 bivariate figures: game dynamics (8), financial relationships (9).
- Four modelling figures: LASSO tuning, RF tuning, RF importance, an illustrative rpart tree.
- One report cover image, retained in the original report but not repurposed as a chart.
- 13 embedded paged tables, normalised without inventing rows.
- All 75 R-code and printed-output blocks attached to the relevant source topic.
- Eleven variables in the printed descriptive summary, transcribed into the preparation section.

All 37 exploratory figures are available in the atlas. The four modelling figures are available in the diagnostic viewer. All 13 tables can be opened under the corresponding linear/LASSO or RF source output. Full source discussion remains available in Spanish, alongside editorial English interpretations.

## Important Distinctions

1. The 10,754 count is the raw dataset size. The report says roughly 400 zero-minute records are removed; an exact post-filter count is not printed there.
2. The missingness table checks the raw import, before the two enrichment joins. No printed audit establishes that every team/league join subsequently matched.
3. League assignment depends on the order of 374 unique team names. Opta ratings from September 2023 postdate the June 2023 valuation snapshot.
4. Absolute performance counts are rounded reconstructions from rates and playing time, not independently verified event totals.
5. The EDA retains goalkeepers and zero-valued observations. Models exclude goalkeepers and require positive values for the logarithm.
6. R-squared 0.5973 and 0.6102 are fitted lm() results. Errors 1.034 and 1.018 are residual standard errors.
7. LASSO test output is R-squared 0.6313078, RMSE 1.0035603 and MAE 0.7881349. The fitted penalty is 0.001389495; the tuning experiment is printed after the fixed-penalty fit.
8. RF test output is R-squared 0.7349496, RMSE 0.8513059 and MAE 0.6580739. It uses 100 ranger trees, mtry tuning and the existing ten-fold training resamples.
9. Rankings predict on df_limpio, including both training and test players. Standardised residual thresholds of +/-1.96 do not independently validate a 95% mispricing claim.
10. Exponentiating RMSE in log units does not produce a calibrated confidence interval. Exponentiated predictions also need attention to retransformation bias if interpreted as conditional euro means.
11. The original LASSO ranking includes an estimate of about EUR 11.6bn for Messi. The site treats this as an implausible model output worth diagnosing, not as a credible value.
12. Match denominators in the league-rate plots are approximated from summed minutes divided by 22 * 90, not sourced from a fixture table.
13. The injury summary has a maximum of 339 games missed, calling for a definition/window audit. The injury-value chart restricts the axis to 0-100 and has a subtitle that conflicts with its discussion.
14. The goal-contribution chart uses goals plus assists, despite nearby prose discussing the goals-only correlation. The efficiency filter is >=450 minutes in code.
15. The goalkeeper correlation 0.5266 appears in a heading, without an accompanying printed calculation. It is labelled accordingly.
16. The market-value histogram has a logarithmic x-axis. An approximately bell-shaped histogram on that scale does not imply normality in raw euros; the raw mean/median gap is substantial.
17. Retrospective price examples are author accounts; no complete dated panel or temporal evaluation is embedded. The hero therefore animates differences between historical observations and RF estimates, not a synthetic price history.
18. The clean-sheet outlier heading says >15, but its code labels values >20. The site notes the difference and does not turn the paragraph's reference to saves into a new measure.

## Reuse Limits

The original full player CSV and full prediction vectors are not embedded. Histograms and scatter clouds therefore remain faithful original raster figures, with full-size links and source code. No individual data were inferred from pixels or generated to fill charts. Interactive model/explorer charts use only numeric outputs actually available from the report.

The site keeps its 20-player photo-backed explorer. Other published player rows remain accessible in the original model tables. Expanding the explorer requires a complete R export, cohort identifiers and preferably out-of-fold or holdout-only predictions.
