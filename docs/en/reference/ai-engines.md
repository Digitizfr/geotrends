<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# AI engines tracked

> ChatGPT, Gemini, Google AI Mode and AI Overviews are read from their interface, Claude through its API. What each reading holds, and the engines not tracked.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/reference/ia-suivies.md)

GeoTrends tracks five AI engines, with two methods. Four are recorded from their **interface**: a service opens the AI’s real page, asks the prompt from the project’s country, in its language, and returns what is displayed. The fifth, Claude, has no interface reading: it is queried through its **API**, the answer of the bare model. The two methods are never added together.

| AI | Method | How it is recorded | What the reading holds |
| --- | --- | --- | --- |
| **ChatGPT** | interface | Through DataForSEO, from the project’s country, without forcing web search: we want what a person gets. | The text, the cited sources, the pages read but not cited, the brands mentioned, the searches run by the AI, the model. |
| **Gemini** | interface | Through DataForSEO, from the project’s country. | The text, the cited sources, the model. Brands are read by automatic analysis. |
| **Google AI Mode** | interface | Through DataForSEO, on Google’s AI Mode page. | The text and its sources. No model name. |
| **Google AI Overviews** | interface | Through DataForSEO, on Google’s classic results page, on desktop, including Overviews displayed with a delay. | The Overview’s text and its sources, Google’s top ten results, the “People also ask” questions. “No overview” when Google shows none. |
| **Claude** | API | Through the Anthropic API, with web search on (five searches at most per prompt), using the project’s country as an approximate location. | The text, the cited sources, the pages found but not cited, the searches run, the model. |

<a id="interface-or-api"></a>

## Interface or API

What a person sees is not what the API returns. A study published by Surfer in 2026 found about a quarter of overlap on the brands mentioned, and a few percent on the sources. That is why the tool reads the interface wherever a service allows it. For Claude, no service reads the app: its number is a reference point on the model, not a reading of the app.

Throughout the tool, Claude has its own column, set apart by a double rule, its own dotted chart and its own row in the report. Its stamp says **API**; the others say **interface**.

<a id="what-each-ai-gives"></a>

## What each AI gives, and what it does not

- **Brands mentioned**: ChatGPT returns its own list. For the others, a small model reads them from the text, with their position and the tone used.
- **Pages read but not cited** and **searches run by the AI**: known for ChatGPT and Claude. Gemini and Google do not provide them.
- **Google’s top ten results** and **People also ask**: recorded with the AI Overviews. They make the diagnosis of the AI Overviews & Google screen possible.
- **The check link**: when the provider gives it, a prompt’s page offers **Ask the prompt again in the interface**, to see the current answer.

<a id="models"></a>

## Models

When the AI provides it, the model that answered is written under each answer, and under the AI’s name in the **Presence, AI by AI** table. When the model changes from one run day to the next, a marker is placed on the charts: a rise or drop that day may come from it. Google AI Mode and AI Overviews give no model name.

<a id="timing"></a>

## Timing and price

|  | Interface reading | Claude through its API |
| --- | --- | --- |
| Answer comes back | Within minutes, 45 at most. Reading the result is free. With no answer after six hours, the reading is marked failed. | Right after sending, in one to two minutes per batch. |
| Price | $0.0012 per answer, returned by the provider. For AI Overviews, an extra $0.0006 for Overviews displayed with a delay, refunded when there is none. | Computed from the rate card (tokens and web searches). The tool shows the average of its last thirty readings, $0.06 until one has been measured. |

<a id="not-tracked"></a>

## Engines that are not tracked

**Perplexity and Copilot are not tracked.** They require a second interface-reading provider, which is not connected. The Claude app is not recorded either, as no service does it: only its API is. No other AI engine is recorded.

<a id="choosing"></a>

## Choosing the AIs of a run

1. **Start from the four interface AIs.** They are ticked by default in the Runs tab of the project page, and they make up the visibility shown on the overview.

2. **Add Claude if the reference point helps you.** It costs far more per prompt. It is unticked by default, and the recommended pace is every two weeks.

3. **Hide an AI when reading.** The pills in the top bar hide an AI from the numbers and charts, without deleting anything.

<a id="limits"></a>

## Limits

> [!WARNING]
> Readings start from a neutral session, with no history and no account: a signed-in person, with their own habits, may get a different answer. Reading services depend on the AI interfaces: when an interface changes, a reading can fail for a while, and the tool logs it as failed, without counting it.

**See also**

- [Measurement method](./method.md)
- [Start a run](../project/start-a-run.md)
- [AI Overviews and Google results](../understand/google.md)
- [Which AI engines should I look at first, and why is Claude kept apart?](../use-cases/which-ai-engines-first.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/reference/ai-engines)
