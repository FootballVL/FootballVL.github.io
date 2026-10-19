# Language Editions

## Scope

Spanish is the default and authoritative editorial edition. The header offers
Spanish, English, Japanese, French, German, Dutch, Chinese
(Simplified), Korean, Portuguese, Italian, Arabic, Hindi, Russian, Turkish,
Indonesian and Bengali. Resources remains immediately to the left of the picker.
The choice is saved in localStorage, and Arabic sets the document to RTL.
Native browser selection supports keyboard interaction and mobile pickers.

The interface, narrative, filters, accessible labels, 83 extracted source
paragraphs, published table headings, variable glossary, ECharts annotations
and the annotations of all 41 analytical source figures use local catalogues.
Names of players, clubs, the project, authors and software are retained as names.
Numbers and filter identifiers are not translated or mutated.

Executable R, original variable identifiers inside code, printed console output
and the downloadable Spanish report remain canonical source material. Translated
explanations and a variable glossary accompany the code. This is intentional:
translating programming syntax would break reproducibility. Links labelled
Spanish original open the unmodified source, not another translated edition.

## Translation Provenance

`src/content/es.json` is the Spanish master catalogue. The research voice is
authored in `src/content/author.es.json` and interface revisions in
`src/content/interface.es.json`. They use first-person copy and are applied to
stable message identifiers before any translation. Some identifiers remain
English for backwards compatibility; their English wording is not the source
of the translated editions. New interface copy is written in Spanish.

The preparation script copies the Spanish edition directly from that source,
without sending it through machine translation. The other fifteen editions
are generated with `sl=es` using Google Translate, with the owner's permission,
then committed locally. The deployed site never calls a translation service.
Curated terminology and label overrides retain established football meanings.

These editions have not all received professional native-speaker review.
Technical implementation and catalogue coverage are tested, but that does not
certify every linguistic nuance. Review scientific terminology and long-form
translations with native speakers before treating an edition as authoritative.
The original report and authored Spanish edition remain the reference.

## Source Figure Strategy

The HTML contains PNGs, not the underlying player-level arrays or plotting
objects. Inventing coordinates or histogram bins to rebuild them would change
the evidence. `LocalizedResearchFigure` instead renders the original PNG as
an SVG image layer, covers only its annotation margins and adds translated
SVG text. Category-label areas, legend text and decision-tree split labels
have individually reviewed coordinates in `src/i18n/figureLabels.ts`.

The plotted marks, numeric axis ticks, correlation cells, tree node means,
sample counts and percentages are retained from the source. Tree split
thresholds are literal transcriptions; they are not inferred by OCR. The LASSO
curve has no overlaid title inside its plotting region, preserving its topmost
observation. The modal enlarges the translated composition and closes with
Escape; the unmodified Spanish image is linked alongside it.

This approach localises the evidence faithfully but does not make the original
raster observations individually selectable. Fully interactive reconstructions
still require the original R plotting data. Existing ECharts plots use actual
recovered arrays and localise their labels independently of those numeric arrays.

## Maintenance

- `src/i18n/languages.ts`: offered languages and native labels.
- `src/content/es.json`: Spanish master source, never machine-generated anew.
- `src/content/author.es.json`: personally authored research interpretations.
- `src/content/interface.es.json`: authored interface and narrative revisions.
- `src/i18n/locales/*.json`: complete local dictionaries, loaded on demand.
- `src/i18n/glossary.ts`: source identifier to semantic label mapping.
- `src/i18n/terminology.json`: curated terminology by language.
- `src/i18n/overrides.json`: editorial corrections for ambiguous domain labels.
- `Localized`: presentation-tree translation, preserving code and option values.
- `chartTranslation.ts`: nonmutating ECharts annotation/tooltip translation.
- `figureLabels.ts`: source-coordinate annotation metadata.

Run `npm run lint` to check TypeScript and all catalogue keys/source paragraphs.
Ordinary builds need no translation credentials or network requests. To
regenerate catalogues, explicitly approve sending the source text to Google,
then run `node scripts/build-translations.mjs`. The script caches preparation
results by Spanish source text under ignored `work/translations-from-spanish/`;
`--language=es` synchronises only Spanish, locally and without network access.
Changing Spanish source text invalidates the relevant cached translation. Review generated changes
before committing. Do not use the regeneration script with confidential source
material without authorisation.

With optional Playwright installed, `node scripts/qa-languages.mjs [url]` tests
all languages at desktop, tablet and mobile widths, invariant metric values,
filters, all 41 figures, persistence and the figure modal. `PLAYWRIGHT_MODULE`
can point to an existing Playwright installation, and `PLAYWRIGHT_CHANNEL`
selects the installed browser. The same script can check a subpath deployment.
