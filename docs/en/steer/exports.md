<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# CSV exports

> Four free CSV exports: the recorded answers, the cited sources, the work list and the cost journal, plus the data behind each chart, in the interface language.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/piloter/exports.md)

An export takes the data into a spreadsheet: build a pivot table, send a list to a writer, keep a record. Everything comes from the database: an export is free and makes no call. It covers the project currently shown, except the cost journal, which covers every project.

<a id="where-to-find-them"></a>

## Where to find them

| Screen | Button | What is exported |
| --- | --- | --- |
| Overview, Prompts | **Export** | The project’s recorded answers, one line per reading. |
| Sources | **Export** | The sources of every answer, one line per source. |
| Actions | **Export** | The work list, one line per action. |
| Admin › Costs | **Export** | The whole cost journal, all projects. Admins only. |
| Charts on the overview, competitors and prompt pages | **CSV** | The chart’s data, as the chart displays it. |

> [!NOTE]
> **Filters do not apply**
>
> The four exports take the project’s whole history, every AI, archived prompts and deep measurements included, regardless of the period and AIs chosen in the top bar. Only a chart’s **CSV** button follows what the chart shows.

<a id="answers"></a>

## Recorded answers

| Column | Content |
| --- | --- |
| Prompt, Topic, Intent | The prompt’s text and its tags (intent written as a short code: informer, comparer, acheter). |
| AI, Method | The AI as a short code (chatgpt, gemini, google_ai_mode, google_ai_overview, claude) and the method (interface or api). |
| Sent, Captured | The sending date and the reading date, in universal time (UTC). |
| Status | recu, vide (no answer or no overview), en_attente or echec. |
| Deep measurement | yes for a deep-measurement reading. |
| Model | The model that answered, when the AI provides it. |
| Site cited, Video cited, Name in the text | yes or no, for a received answer: a page of the site (or of a declared social profile), a video from one of the brand’s channels, the brand’s name in the text. |
| Cited sources | The number of cited sources. |
| Brands mentioned (in order) | The brands found by automatic reading, in their order of appearance. |
| Price ($) | The price of that reading. |

<a id="sources"></a>

## Sources

| Column | Content |
| --- | --- |
| Prompt, AI, Method, Captured | The answer the source comes from. |
| Role | cited, or read, not cited. |
| Rank | The source’s position in the answer’s list. |
| Domain, Address, Title | The site, the page’s full address and its title. |
| YouTube channel | For a video, the channel that published it. |
| Site type, Owning brand | The type stored in the database (comparison site, media, blog…), “unclassified” if not classified yet, and the brand behind a brand site. |
| Owner | ours, tracked competitor, other brand or third party. |

<a id="actions"></a>

## The work list

| Column | Content |
| --- | --- |
| Family | As a short code: reformuler, apparaitre, video, referencement, fait. |
| Action, Detail | The line’s title and its explanation. |
| Target page, Site type | The page to open, and the site type for a page to appear on. |
| Weight (1 to 5) | The line’s weight, drawn from the number of answers and AIs concerned. |
| Status, Done on, Note | The status as a short code (a_faire, en_cours, fait, ecarte), the date the action was marked done, and your note. |
| Supporting prompts | The prompts used as evidence, separated by “\|”. |

<a id="calls"></a>

## The cost journal

One line per paid call, most recent first: **Date (UTC)**, **Provider**, **Call type**, **AI**, **Project**, **Volume** and **Unit** (`appel` for a call, or `jeton` for a call counted in tokens), **Price ($)** to six decimals, **Price source** (returned by the provider, or computed from the rate card), **Success**, **Duration (ms)**, **Model** and **Error**. The export is for admins only.

<a id="charts"></a>

## A chart’s data

A chart’s **CSV** button downloads one line per point: **Run date** (or **Week of**, when the chart is set per week), then, for each line displayed, the value, the count behind it (answers with the brand, or sum of positions) and the sample size. A line hidden in the legend is not exported.

<a id="format"></a>

## File format

- Files follow the interface language. In English: comma between columns and a decimal point. In French: semicolon and a decimal comma, so that they open as they are in a French spreadsheet.
- Headers and fixed values (yes or no, site types, ownership) are translated. The text of prompts and answers never is.
- Files are UTF-8, with the marker that makes spreadsheets read accents correctly. Their name gives the project, the export and the date: `geotrends-facturo-uk-questions-2026-11-18.csv`.

<a id="step-by-step"></a>

## Opening an export in a spreadsheet

1. **Pick the interface language.** If your spreadsheet is in French, switch the interface to French in Settings before exporting: the separator will follow.

2. **Export.** Click **Export** in the top bar of the screen you want. The file downloads at once.

3. **Keep the methods apart.** Filter the **Method** column first: a total that mixes interface and api no longer measures anything.

<a id="limits"></a>

## Limits

> [!WARNING]
> Short codes (AI, status, family, state) are not translated, and export dates are in universal time, one or two hours behind Paris time. An export does not recompute visibility or the margin of error: it gives the raw readings, and a percentage computed in a spreadsheet on a few answers remains fragile.

**See also**

- [The cost dashboard](./costs.md)
- [The Prompts screen](../measure/prompts.md)
- [Cited sources](../understand/sources.md)
- [The work list](../act/work-list.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/steer/exports)
