<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Key concepts

> Prompt, run, reading, method, presence, visibility, share of voice, verdict, margin of error: the words of the tool and exactly what they count, before reading a screen.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/demarrer/notions-cles.md)

GeoTrends uses few words, always with the same meaning. Knowing them avoids the two most common mistakes: adding up things that do not add up, and reading a change that is only chance.

<a id="project-and-brand"></a>

## Project and brand

A **project** tracks one brand in one market: a country and a language. It brings together the brand’s name, what belongs to it, its competitors and its prompts. The same brand in two markets makes two projects. The project shown is picked at the top of the tool’s menu.

A brand is more than its site. Its **properties** are its sites, its YouTube channels, its social profiles and the other spellings of its name. A page of one of these sites, a video of one of these channels or a post of one of these profiles, cited by an AI, counts for the brand.

<a id="prompt-and-run"></a>

## Prompt, run, reading, answer

| Word | What it refers to |
| --- | --- |
| **Prompt** | What a potential customer asks an AI, in their own words: “Which invoicing software should a sole trader choose?”. A prompt “without the brand name” does not contain the tracked brand’s name. (The rest of this site calls it a “question”.) |
| **Run** and **reading** | A reading is one prompt asked to one AI at a given moment. A run is the sending of a project’s prompts to several AIs on the same day. |
| **Answer** | What the AI replied, kept as is: its text, the cited sources, the pages read, the searches it ran, the brands mentioned in order. The text is never translated or corrected. |
| **Source** | A page cited by the AI to answer. A page **read** was opened by the AI without being cited: this is only known for ChatGPT and Claude. |

<a id="method"></a>

## Method: interface or API

An **interface reading** opens the AI’s real page, asks the prompt from the project’s country and keeps what is displayed: what a person sees. ChatGPT, Gemini, Google AI Mode and AI Overviews are recorded this way. An **API answer** comes from the bare model, without the application around it: that is the case for Claude, queried through the Anthropic API with web search.

> [!NOTE]
> **Never added together**
>
> The two methods do not give the same answers. No number in the tool mixes them: Claude always has its own tile, its own column, its own line. Every number carries an “interface” or “API” stamp.

<a id="presence"></a>

## Presence: cited, mentioned, read, absent

For each answer received, the tool says how the brand appears in it. The brand is **present** when it is cited or mentioned.

| Status | Definition | Counts as present |
| --- | --- | --- |
| **Cited** | A page or a video of the brand is among the sources. | yes |
| **Mentioned** | The brand’s name (or one of its other spellings, or its domain) is in the text, without a page of the brand being cited. | yes |
| **Read** | A page of the brand was read by the AI, without being cited. | no |
| **Absent** | The AI answered without the brand. | no |
| **No overview** | Google showed no AI Overview (or the AI displayed nothing). It is not an absence: the answer is left out of the count. | left out |
| **Pending** | The answer has not come back yet. It is collected later, for free. | left out |
| **Failed** | The reading did not succeed, or the answer did not arrive within 6 hours. | left out |

<a id="numbers"></a>

## The numbers

| Number | How it is calculated |
| --- | --- |
| **Visibility** | Share of the answers received where the brand is present (cited or mentioned), for one method. It is shown from 5 answers. |
| **Share of voice** | Mentions of the brand relative to those of the brand and its tracked competitors, in the answers whose brands have been read. Without a tracked competitor, it is not calculated. |
| **Avg. position** | Average place of the brand in the list of brands mentioned, when it is in it. 1st is the best placed. |
| **Verdict** | For a single prompt, a word rather than a percentage: “solid” if the brand is in 6 interface answers out of 10 or more, “occasional” below that, “absent” at zero, “too early to tell” with fewer than 3 answers. |

<a id="margin"></a>

## Sample and margin of error

An AI answer is a draw: the same prompt asked twice does not get the same answer. So every number says how many answers it rests on, and visibility carries its **margin of error** (a 95% confidence interval). A **change** from the previous period is only coloured when it exceeds that margin: otherwise it is noise.

To settle a single prompt, the **deep measurement** asks it 5, 10 or 25 times in a row. Those readings count for the prompt’s verdict, not in the project’s overall numbers: otherwise a prompt asked 25 times would weigh 25 times more than the others.

<a id="competitors"></a>

## Tracked competitors and spotted brands

A **tracked competitor** is a brand you chose to compare with yours: it enters the ranking, share of voice and head-to-head. A **spotted brand** is one the AIs mention on your prompts, not tracked yet. Tracking a spotted brand is free and starts no run.

<a id="reading"></a>

## Reading the answers

ChatGPT returns the brands it mentions itself. For the other AIs, a small language model reads each answer and extracts the brands mentioned, their order and the tone used (positive, neutral, negative). It is a paid call, about $0.0008 per answer, logged in the cost journal. The same small model classifies cited sites by type, gives each prompt a topic and an intent, and compares answers with the fact checks.

> [!WARNING]
> What the small model reads can be wrong on an ambiguous answer. Every sheet links back to the original text of the answer, so you can check.

**See also**

- [Glossary](../reference/glossary.md): Every word of the tool, in French and English.
- [Measurement method](../reference/method.md)
- [Reading your first results](./first-results.md)
- [Is my brand cited, mentioned or absent?](../use-cases/cited-mentioned-or-absent.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/get-started/key-concepts)
