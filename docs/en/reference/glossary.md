<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Glossary

> The words of GeoTrends in one line each: prompt, run, reading, method, visibility, share of voice, verdict, margin of error, source, work list and the rest.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/reference/glossaire.md)

The words used in the tool and in these docs, with their French equivalent in the tool’s French interface. They are grouped by theme. The definitions are the ones the tool applies in its calculations.

<a id="measurement"></a>

## Measurement

| Term | Definition |
| --- | --- |
| **GEO** | Generative Engine Optimization: the work of appearing in AI answers, as search optimisation does for search engines. |
| **Prompt** (question) | What a customer would ask an AI, in their own words. See [Write the prompts to track](../project/prompts.md). |
| **Run** and **reading** (relevé) | A run sends a project’s prompts to the chosen AIs; a reading is, for each prompt and each AI, the answer recorded with its sources. |
| **Answer** (réponse) | The text an AI gives to a prompt on a given day, as it wrote it. |
| **Method** (méthode) | “Interface” or “API”. The two are never added together. |
| **Interface** | Reading of the AI’s real page: what a person sees. ChatGPT, Gemini, Google AI Mode and AI Overviews. |
| **API** | The answer of the bare model, through its programming interface. This is the case for Claude. |
| **Visibility** (visibilité) | Share of received answers where the brand is cited or mentioned, counted as “k out of n”. |
| **Share of voice** (part de voix) | Mentions of the brand relative to those of the brand and its tracked competitors. |
| **Avg. position** (rang moyen) | Average position of the brand among the brands mentioned, when it has one. |
| **Verdict** | For a prompt: solid (6 answers out of 10 or more), occasional, absent, or too early to tell (fewer than 3 answers). |
| **Margin of error** (marge d’erreur) | The range where the true value most likely lies (95% confidence interval). See [Measurement method](./method.md). |
| **Change** (écart) | Difference in points from the previous period, coloured only when it exceeds the margin of error. |
| **Comparable answer** (réponse comparable) | A prompt and AI pair with an answer on both dates compared by the report. |
| **Deep measurement** (mesure approfondie) | A prompt asked 5, 10 or 25 times in a row to settle its verdict. See [Deep measurement](../measure/deep-measurement.md). |
| **No overview** (pas d’aperçu) | Google showed no AI Overview on the prompt: it is not an absence of the brand. |

<a id="brand"></a>

## The brand and its competitors

| Term | Definition |
| --- | --- |
| **Project** (projet) | A brand tracked on one market: its country, its language, what it owns, its competitors and its prompts. |
| **Property** (propriété) | What belongs to the brand: a site, a YouTube channel, a social profile, another spelling of its name. |
| **Cited** (citée) | A page or a video of the brand is among the answer’s sources. |
| **Mentioned** (nommée) | The brand’s name is in the text of the answer. |
| **Read** (lue) | A page of the brand was opened by the AI without being cited. It does not count as presence. |
| **Absent** (absente) | The AI answered without the brand. |
| **Tracked competitor** (concurrent suivi) | A brand compared with yours in the ranking, share of voice and head-to-head. |
| **Brand spotted** (marque repérée) | A brand mentioned by the AIs on your prompts, not tracked yet. **Track** makes it a competitor, for free. |
| **Named first** (premier nommé) | The brand mentioned first in an answer. |
| **Tone** (ton) | Positive (the brand is recommended), neutral (simply mentioned) or negative (advised against), read by the small model. |
| **Verified fact** (fait vérifié) | A sentence you hold to be true about the brand. The tool flags the answers that say otherwise. See [Fact checks](../understand/fact-checks.md). |

<a id="sources"></a>

## Sources

| Term | Definition |
| --- | --- |
| **Source** | A page cited or read by the AI to answer. |
| **Cited source** (source citée) | A page shown as a source with the answer. Only sources cited by interface AIs count in the numbers. |
| **Read, not cited** (lue sans être citée) | A page opened by the AI and not kept. Known for ChatGPT and Claude. |
| **Site type** (type de site) | Comparison site, media, directory, blog, forum or community, video, social network, official site, shop, brand site, other, or “unclassified”. |
| **Owner** (à qui) | Who a citation benefits: ours, a tracked competitor, another brand, or a third party. |
| **Discussion** | A forum thread or social post cited as a source: a place where you can reply. |
| **AI Overview** (Aperçu IA) | The generated answer Google shows above its results. |
| **AI Mode** (Mode IA) | Google’s conversational mode, recorded as a separate AI. |
| **Top 10** (dix premiers résultats) | Google’s classic results, recorded with the AI Overviews. |
| **People also ask** (autres questions posées) | The questions Google shows under its results: ideas of prompts to track. |
| **Searches run by the AI** (recherches lancées par l’IA) | What the AI itself types into a search engine before answering. Known for ChatGPT and Claude. |

<a id="tool"></a>

## The tool

| Term | Definition |
| --- | --- |
| **Topic** (thème) | A few words saying what a prompt is about, set by the small model or by hand. |
| **Intent** (intention) | learn, compare or buy. |
| **Topic map** (carte des thèmes) | For each topic: held, contested, to win back, blind spot or too early to tell. See [Topics and the topic map](../understand/topic-map.md). |
| **Work list** (liste de travail) | The actions drawn from the runs, each with its evidence. See [The work list](../act/work-list.md). |
| **Outreach** (prise de contact) | A message sent to a site, logged in an action’s journal. |
| **Report** (rapport) | The comparison of the last two run days. See [Report and alerts](../steer/report-and-alerts.md). |
| **Alert** (alerte) | A change between the last two runs that exceeds the margin of error. |
| **Marker** (repère) | A line on a chart: an AI’s model change, an action done, a deep measurement. |
| **Automatic reading** (lecture automatique) | Reading of the answers by a small language model: brands mentioned, position, tone. |
| **Small model** (petit modèle) | The low-cost language model that reads answers, classifies sites, tags prompts and checks facts. |
| **Cost journal** (journal des coûts) | The list of every paid call, with its price. |
| **Cap** (plafond) | The maximum spend of the month, all projects. Once reached, no paid call goes out. |
| **Confirmation threshold** (seuil de confirmation) | Above this amount, a request started by hand asks for confirmation. |
| **Automatic runs** (relevés automatiques) | Every week for the interface AIs, every two weeks for Claude, once turned on. |

**See also**

- [Key concepts](../get-started/key-concepts.md)
- [Measurement method](./method.md)
- [AI engines tracked](./ai-engines.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/reference/glossary)
