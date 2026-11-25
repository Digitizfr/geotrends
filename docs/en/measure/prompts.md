<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# The Prompts screen

> One row per prompt: the latest status for each AI, a verdict over the period rather than a percentage, and who is named first. The starting point for action.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/mesurer/questions.md)

An average hides everything: the brand may be solid on three prompts and absent from the other seven. The Prompts screen shows the brand prompt by prompt, to tell where it holds, where it is missing, and who takes the spot. Each prompt gets a verdict, because with a few answers per prompt a percentage would be misleading.

To get there: clicking a prompt anywhere in the tool opens its page; that page’s breadcrumb brings you back here. The **Add prompts** button leads to the Prompts tab of the project page. The top-bar filters (period, AIs, versus a competitor) apply, as on the [overview](./overview.md#top-bar).

![The Prompts screen of the Facturo UK project: one row per prompt, the status for each AI, the verdict and who is named first.](../../../public/docs/captures/en/questions.webp)

*The Prompts screen of the Facturo UK project: one row per prompt, the status for each AI, the verdict and who is named first.*

<a id="headline"></a>

## The headline sentence and banners

The sentence counts the verdicts: the brand is solid on so many prompts, occasional on so many, absent on so many, with the number of interface answers in the period. Banners are added when needed: answers pending (with **Collect the answers**, free), prompts never run (with **Prepare a run**), prompts without tags (with **Tag the prompts**, paid, its price on the button).

<a id="verdict"></a>

## A prompt’s verdict

| Verdict | Rule |
| --- | --- |
| **Solid** | The brand is mentioned or cited in 6 interface answers out of 10 or more. |
| **Occasional** | It is present, but in fewer than 6 answers out of 10. |
| **Absent** | It appears in no answer. |
| **Too early to tell** | Fewer than 3 interface answers in the period. |
| **Not captured yet** | No answer so far. |

The verdict counts all the interface answers of the period, deep measurements included. Claude, measured through its API, is left out. Under the verdict: the count (“4 out of 6”) and the number of interface AIs where the brand appears, out of those that answered.

<a id="table"></a>

## The “By prompt and by AI” table

| Column | What it shows |
| --- | --- |
| **Prompt** | The text (a click opens the prompt’s page), then its tags: the topic (a click filters on it), the intent, and “with the brand name” when the prompt contains it. |
| **One column per AI** | The status of the latest reading: Cited, Mentioned (with the position when known), Read, Absent, No overview, Pending or Failed. With several readings, the count “2 out of 3” and one mark per reading, highlighted when the brand is there. “outside period”: the prompt was run, but not in the chosen period. A click opens the answer. Claude, measured through its API, has its own column. |
| **Verdict** | See above. |
| **Named first** | The brand most often named first in the answers to this prompt, with how many times. A click opens those answers. “brands not read yet” until reading is done. |
| **Trend** | The small line of the brand’s presence on this prompt, run day after run day. |
| **Last run** | The date of the latest reading and the number of readings in the period. |

Columns sort with a click on their header. Beyond five prompts, a field searches prompts, topics and brands. Under the table, the **Present in** line gives, AI by AI, the count of answers with the brand, Claude apart; it does not count deep measurements. The legend of the statuses follows.

<a id="filter"></a>

## Filter and group

The **Filter and group** panel, above the table, offers:

- **Verdict**: All, Solid, Occasional, Absent, Too early to tell, each with its number of prompts.
- **Topic** and **Intent** (learn, compare, buy), once the prompts are tagged.
- **Group by**: None, Topic or Intent. The table is then split into groups, each with its title.
- **Brand name**: All, Without, With. Prompts without the name tell whether the AI thinks of the brand on its own.

**Show all** clears the filters. When a filter is on, the panel says so.

<a id="selection"></a>

## Acting on several prompts

Each row has a checkbox, and **Select all** ticks them all. On the ticked prompts:

- **Archive**: they are no longer run and no longer count in the numbers; their history stays. A prompt never run is simply removed. A window asks you to confirm.
- **Change topic**: the topic you type replaces the topic of the ticked prompts. Free; a tag set by hand is no longer changed by the model.
- **Start from a page** (top of the screen): the tool reads a page of the brand and suggests the prompts it answers. See [Tracked pages](./tracked-pages.md).
- **Share**: opens the Shares screen with these prompts already ticked, to turn them into a private page for a client. See [Share with a client](../steer/share-with-a-client.md).
- **Start a run for the selection**: these prompts only, to the four interface AIs, at the price written on the button (prompts × 4 × $0.0012). Claude is not included. Above the confirmation threshold, a window asks you to confirm.

Archived prompts are shown with the **Show the 2 archived prompts** link (the number varies) under the table; their page lets you resume tracking.

> [!NOTE]
> **Tags and the topic map**
>
> The **Tag the prompts** button gives each prompt a topic and an intent, through a small model, for less than a cent per project. After that first click, added prompts are tagged on their own; this can be turned off on the same screen. Once topics exist, the **Topic map** appears under the table: see [Topics and the topic map](../understand/topic-map.md).

<a id="step-by-step"></a>

## Finding the prompts to work on

1. **Pick a long enough period.** In the top bar, 8 weeks or more: a verdict on a single answer per AI is often “too early to tell”.

2. **Filter the absent ones.** **Verdict › Absent**, then **Brand name › Without**: these are the prompts where the AI does not think of Facturo.

3. **Read who is named first.** Comptalis comes first on several prompts? That is the competitor to study. A click opens the answers that name it.

4. **Open a prompt.** Its page says who wins, thanks to which pages, and what to do. See [A prompt’s page](./prompt-page.md).

5. **Settle the doubtful cases.** An “occasional” or “too early to tell” prompt that matters to you is settled with a [deep measurement](./deep-measurement.md).

<a id="limits"></a>

## Limits

> [!WARNING]
> With one answer per prompt, per AI and per week, a verdict rests on few answers: “solid” on five answers does not carry the weight of “solid” on forty. The 6-out-of-10 threshold is a reading rule, not a measure of the margin of error, which the prompt’s page gives. Who is named first and the position come from a small model reading the answers, except for ChatGPT. “With the brand name” is deduced from the prompt’s text.

**See also**

- [A prompt’s page](./prompt-page.md)
- [Topics and the topic map](../understand/topic-map.md)
- [On which topics am I absent while a competitor holds the ground?](../use-cases/topics-where-i-am-absent.md)
- [Branded or unbranded: how should I split my prompts?](../use-cases/branded-or-unbranded-prompts.md)

---

Updated: 2026-11-20 · [Read this page on the website](https://geotrends.io/en/docs/measure/prompts)
