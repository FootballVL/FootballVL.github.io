# Football Value Lab

**Beyond the Price Tag** is a React + TypeScript portfolio case study based on the academic report `Proyecto_final.html`: *Ciencia de Datos aplicada al futbol: Analisis y modelizacion del valor de mercado*.

The site is designed for GitHub Pages and presents the project as a historical data science study, not as current transfer-market advice.

## What Is Included

- Six-section editorial data story with a continuously moving 20-player photo strip. Observed values, RF estimates and their differences appear directly over each photograph. Hovering or focusing does not stop the strip; an explicit pause control and a reduced-motion scrollable view preserve accessibility.
- Seven preparation stages, all 11 descriptive-summary variables, and a searchable atlas covering all 20 univariate and 17 bivariate analyses.
- Four original model diagnostic figures, all 13 embedded tables, original Spanish discussion and R code/output.
- Interactive Apache ECharts visualizations.
- Distinct fitted-sample linear metrics and held-out LASSO / Random Forest metrics verified from the original output.
- Player explorer using the individual prediction records recoverable from the embedded Quarto tables.
- Centralized external-link configuration in `src/content/site.ts`.
- GitHub Actions workflow for Pages deployment.

## Data Scope

The original report references `final_data.csv` with 10,754 players from 20 leagues. The HTML does not embed the full CSV or complete player-level prediction dataset. This first web version therefore uses only records that are actually recoverable from the rendered Quarto tables.

To expand the explorer to all players, export the model output from R with a schema like:

```r
write.csv(
  predicciones_rf %>%
    transmute(
      name,
      team,
      league,
      age,
      rol_funcional,
      minutes_played = minutes.played,
      observed_value = precio_real,
      estimated_value = precio_teorico,
      difference = precio_teorico - precio_real,
      ratio = precio_teorico / precio_real,
      z_score
    ),
  "src/data/player_predictions.csv",
  row.names = FALSE
)
```

## Development

```bash
npm install
npm run dev
npm run build
npm run preview
```

## GitHub Pages

The Vite base path is controlled by `GITHUB_PAGES_BASE`. The workflow uses `/` for the account site repository (`FootballVL.github.io`) and `/<repository-name>/` for other project repositories.

The deployment workflow uses pnpm 11.25.0 and the committed pnpm lockfile for reproducible installs. npm remains available for the development commands above. Repository: https://github.com/FootballVL/FootballVL.github.io. Published site: https://footballvl.github.io/.

To publish:

1. Push the project to a GitHub repository.
2. In GitHub, open **Settings -> Pages**.
3. Set **Build and deployment** to **GitHub Actions**.
4. Push to `main` or run the workflow manually.

For a custom repository base, set `GITHUB_PAGES_BASE=/repo-name/ npm run build` locally.

## Photography And Typography

All 20 player photographs are real Wikimedia Commons images, served from `public/photos/` with no runtime API dependency. `src/data/photos.json` records the original file page, author, license and date. Individual credit links appear below each player portrait, with the full list in the research section. Photographs may show another season or national team; historical player values, clubs and ages remain those in the study. Preserve attribution and license links when republishing.

The visual system uses cool paper white, charcoal, vermilion and forest green. Barlow Condensed headlines and IBM Plex Sans/Mono are self-hosted in `public/fonts/`; their SIL Open Font License files are included there. Font and photograph paths respect Vite's configured deployment base.

`scripts/fetch-editorial-assets.mjs` documents how the original images and font files were retrieved. Run it with Node 22+ from the repository root to regenerate source assets. It requires network access only when regenerating assets; ordinary builds and visits do not. Regeneration restores the source JPEG/PNG files in the photo manifest; existing WebP assets can be retained by leaving the manifest unchanged.

The displayed copies are resized and encoded as WebP. Original downloaded photographs are retained alongside them; cropping is done only through CSS. To replace a portrait, add a local image to `public/photos/` and update its source path and attribution in `src/data/photos.json`.

## Methodological Notes

- Metrics are historical and tied to the report's modeling setup.
- Random Forest metrics are reported in log-price scale: RMSE `0.8513059`, R² `0.7349496`, MAE `0.6580739`.
- Linear baseline fitted-sample R² is `0.5973`; interaction-rich linear fitted-sample R² is `0.6102`. Their error statistics are residual standard errors, not test RMSE.
- The separate glmnet LASSO test output reports R² `0.6313078`, RMSE `1.0035603`, MAE `0.7881349`. The earlier 61% description must not be used in place of this table.
- Model differences are presented as estimated-vs-observed gaps, not confirmed underpricing, causal effects or investment signals.
- Rankings are calculated on the full modelling population and mix training/test records; they are not uniformly out-of-sample predictions.
- The carousel animates a historical observed-versus-model comparison. It does not fabricate a dated price series. Retrospective player-price comments are labelled as the author's narrative, not a temporal backtest.

## Research Archive

The supplied HTML was parsed as an inert document: its scripts were not executed. The extraction yields 58 heading entries, 42 embedded images (one report cover, 37 EDA figures, four model figures) and 13 tables. Original PNGs remain unmodified. Their 41 analytical figures are displayed with translated SVG annotation layers; editorial summaries and reading notes are in `src/content/research.ts`.

`src/data/reportArchive.json` contains the extracted paragraphs, R code, printed output, table data and source anchors. It loads as a separate JavaScript chunk. Figures are lazy-loaded from `public/research/figures/`. The complete original report is downloadable from `public/research/original-report.html`.

To regenerate the archive, optionally install Playwright in the development environment, ensure Edge is available, then run from the repository root:

```bash
node scripts/extract-research.mjs path/to/Proyecto_final.html
```

Playwright is only an extraction/test tool; it is not required for the published application. The curated atlas uses source-heading indices, so review those mappings if the report structure changes. See `docs/research-audit.md` for provenance and methodological qualifications.

## Languages

The upper-right language picker offers 16 local editions, including Spanish,
English, Japanese, French, German, Dutch, Simplified Chinese, Korean and Arabic.
Resources sits to its left. Selection persists across visits; Arabic uses RTL.
Narrative, source discussion, table headings, filters and chart annotations
translate without changing the data or requiring an external translation API.
Language dictionaries are separate chunks loaded only when selected.

R syntax, verbatim console output, proper names and the downloadable Spanish
source remain unchanged. Localised explanations and a variable glossary explain
the technical identifiers. Translations were initially machine-prepared with
permission, with curated domain terminology; native-speaker editorial review
is still recommended. See `docs/localization.md` for scope, preservation of
numeric evidence, maintenance, regeneration and optional browser QA.

Spanish is now the default and editorial source. Edit `src/content/es.json`,
`src/content/author.es.json` and `src/content/interface.es.json`; all other
editions are generated from the reviewed Spanish text, never the reverse.
`node scripts/build-translations.mjs --language=es` synchronises Spanish without
network access. Existing saved language choices remain respected.

## Authored Research Edition

The cover prominently labels the 2021/22 and 2022/23 seasons. Narrative and
conclusions use the researcher's own first-person voice. The 95% reference is
described as the standardised-residual threshold `|z| > 1.96`, not as a validated
individual confidence interval. Dallinga's retrospective 7-to-18 million increase
is approximately 157%; it is described as movement towards the estimate, not
an independent validation or proof of exact convergence.

`src/data/playerSelection.json` holds the twenty selected profiles, including
the eleven replacements requested for this edition. Regenerate them directly
from the published Random Forest tables with
`node scripts/select-player-records.mjs`. Missing leagues and playing-time
fields remain absent, with explicit UI states and an unpublished-league filter.
The original report and archive remain unchanged.

The default discrepancy ranking focuses on the eleven newly selected profiles;
the secondary scope shows all twenty. Both scopes respect the active filters
and sort actual absolute model-minus-market differences, without changing data.
Optional browser QA: `node scripts/qa-authored.mjs [url]` covers the authored
edition, player replacements, ranking scopes and the original-report CTA.

`scripts/fetch-selected-photos.mjs` retrieves the eleven replacement portraits
from Wikimedia Commons with licence/author metadata, and retains the other
nine local photographs. It requires optional Sharp for WebP preparation;
`SHARP_MODULE` can point to an existing installation. The older
`fetch-editorial-assets.mjs` documents the initial edition's asset acquisition,
not the current player selection. Do not use it to overwrite the new manifest.
`npm run lint` also verifies the Spanish source and all player values/photos.
