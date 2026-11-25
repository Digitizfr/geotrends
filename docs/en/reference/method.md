<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Measurement method

> How the tool counts: brand presence, thresholds, verdict, margin of error, real changes, periods, methods kept apart, and what the measurement cannot tell.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/reference/methode.md)

An AI answer is a sample: the same prompt, asked twice, does not get the same answer. A number without a method or a number of readings therefore tells nothing. This page describes the rules the tool applies everywhere, as they are written in its code. The public [Method](https://geotrends.io/en/method) page gives the short version.

<a id="states"></a>

## From a request to an answer

Each prompt sent to an AI becomes a reading. It comes back a few minutes later in one of these states. Only received answers count in the numbers.

| State | What it means | In the numbers |
| --- | --- | --- |
| Received | The answer is there, with its sources. | Counted, whether or not the brand is in it. |
| No overview, no answer | The AI displayed nothing. The usual case: Google shows no AI Overview for this prompt. Or Claude declined the prompt. | Left out. It is not an absence of the brand. |
| Pending | The prompt has gone out, the answer has not come back. Collecting it is free and happens on its own. | Not yet. |
| Failed | The reading did not succeed: the provider refused it, or no answer came within six hours. | Left out. The reading has to be redone. |

<a id="presence"></a>

## When is the brand present?

| State | Rule |
| --- | --- |
| **Cited** | A cited source is a page of one of the brand’s sites (subdomains included), a page under one of its declared social profiles, or a video from one of its YouTube channels. |
| **Mentioned** | The brand’s name, or one of its declared other spellings, appears in the text as a whole word, regardless of case. The site’s domain name counts too. Or automatic reading gives it a position among the brands mentioned. |
| **Read** | A page or a video of the brand was opened by the AI without being cited. The brand is then not counted as present. |
| **Absent** | The AI answered without the brand. |

**Visibility** is the share of received answers where the brand is cited or mentioned. It is always counted as “k out of n”: k answers with the brand, out of n answers received.

<a id="metrics"></a>

## Share of voice and position

- **Share of voice**: mentions of the brand, relative to those of the brand and its tracked competitors, in the answers whose brands have been read. Without a tracked competitor it would always be 100%: it is not computed.
- **Position**: the brand’s place among the brands mentioned in an answer, in order of appearance, each brand counted once. The **average position** is the mean of the known positions; the smaller, the better.
- **Named first**: the brand mentioned first in an answer.

<a id="thresholds"></a>

## Thresholds

| Threshold | Value | Effect |
| --- | --- | --- |
| Number shown | 5 answers | Below that, no percentage: the screen says “From 5 readings” and gives the count only. |
| Verdict on a prompt | 3 answers | Below that, “Too early to tell”. |
| Solid | 60% or more | The brand is in at least 6 interface answers out of 10. |
| Occasional | Between 0 and 60% | The brand is present, fewer than 6 times out of 10. |
| Absent | 0 | No answer with the brand, out of 3 answers or more. |
| Change judged | 5 answers on each side | Below that, the change is marked “too few readings”. |

The topic map uses the same thresholds: a topic is **Held** when the brand is in 6 answers out of 10 or more and no other brand is mentioned more often, **To win back** when the brand is absent and another brand is mentioned in 3 answers out of 10 or more, **Blind spot** when nobody reaches that level, **Too early to tell** below 5 answers read. See [Topics and the topic map](../understand/topic-map.md).

<a id="margin"></a>

## Margin of error

Around each visibility, the tool computes a 95% confidence interval (Wilson method): the range where the true value most likely lies. It shows in the help bubbles (“between … and …”) and as a grey band on the charts. Two points whose bands overlap cannot be told apart.

| Answers | Visibility measured | Margin of error |
| --- | --- | --- |
| 20 | 50% | Between 30 and 70%: enough for a verdict, not for a percentage. |
| 1,000 | 50% | Within three points. |

<a id="change"></a>

## When is a change real?

A change compares two shares: before (k₁ out of n₁) and after (k₂ out of n₂). It is written in points. The tool judges it this way:

1. If either side has fewer than 5 answers: “too few readings”.
2. Otherwise, the margin is 1.96 × √( p₁(1 − p₁)/n₁ + p₂(1 − p₂)/n₂ ), where p₁ and p₂ are the two shares.
3. If the change does not exceed that margin: “within margin”, in grey. Otherwise: a rise ▲ or a drop ▼, in colour.

> [!NOTE]
> **An example**
>
> Facturo goes from 2 answers out of 10 to 5 out of 10: the change is 30 points. The margin is about 40 points: the change is “within margin”. With the same move from 20% to 50% over 50 answers on each side, the margin drops to 18 points, and the rise is real.

<a id="periods"></a>

## Periods and comparisons

- **Period**: 7 days, 4 weeks, 8 weeks (default), 3 months (12 weeks). The change compares with the period of the same length just before. With **All time** or **Latest run only**, there is no previous period.
- **Latest run only** keeps, for each prompt, the most recent answer of each AI.
- **Run day**: the readings of one day, Paris time, make one point on the charts.
- **Report and alerts**: the last two run days, on the prompt and AI pairs that have an answer on both dates only, with the last answer of the day.
- **Measuring after an action**: the four weeks before the action, that day included, against every reading of the following days.

<a id="methods"></a>

## Interface and API, never added together

A number that mixes the two methods no longer measures anything. Every counting function only receives readings of a single method. Overall numbers cover the four interface AIs; Claude, queried through its API, has its column, its line and its row in the report. Only the Fact checks screen reads both together, because it measures no share: it looks for wrong sentences, and each line states its method.

<a id="deep"></a>

## Deep measurements

A deep measurement asks a prompt 5, 10 or 25 times in a row. Its readings count for that prompt’s verdict and its line. They stay out of the overall numbers, the main chart and the report: otherwise a prompt asked twenty-five times would weigh twenty-five times more than the others. A marker flags their day on the charts.

<a id="small-model"></a>

## What the small model reads

Some information is not in the raw answer. A small language model (DeepSeek Flash today) reads it from the text. Each reading is a paid call, logged in the cost journal; a manual correction always wins.

| Reading | What it extracts | Average price |
| --- | --- | --- |
| Answer reading | The brands mentioned, in order, and the tone used for each one (positive, neutral, negative), for every AI. For ChatGPT, once done, it replaces the provider’s list. | $0.0008 per answer |
| Site classification | The type of each cited site (comparison site, media, blog…) and, for a brand site, its brand. Once per site, kept for every project. | $0.00005 per site |
| Prompt tags | A topic of a few words and an intent: learn, compare, buy. | $0.00008 per prompt |
| Fact checking | The sentences of an answer that contradict a verified fact about the brand. | $0.0006 per answer |

“With or without the brand name” does not go through the model: it is deduced from the prompt’s text, which is safer.

<a id="does-not-tell"></a>

## What the measurement does not tell you

- **What a signed-in person sees.** Readings start from a neutral session, with no history.
- **How many people ask the prompt.** No AI publishes what it is asked: the tool shows no volume.
- **Why a number moved.** The tool says whether a change exceeds the margin of error, not its cause. The model-change and action-done markers help sort it out.
- **What the Claude app displays.** Claude is queried through its API.
- **The pages read by Gemini and Google.** Only ChatGPT and Claude provide them.
- **An error-free reading.** The small model can be wrong on an ambiguous answer: every sheet links back to the original text.

> [!WARNING]
> And one thing nobody knows: how to get cited for certain. The tool measures, you fix, it measures again. With one answer per prompt and per AI each week, it takes several weeks for a change to become readable.

**See also**

- [Deep measurement](../measure/deep-measurement.md)
- [Report and alerts](../steer/report-and-alerts.md)
- [AI engines tracked](./ai-engines.md)
- [A number moved: real change or noise?](../use-cases/real-change-or-noise.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/reference/method)
