<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Deep measurement

> Ask one prompt 5, 10 or 25 times in a row to settle its verdict and narrow the margin of error, without skewing the overall numbers of the project.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/mesurer/mesure-approfondie.md)

An AI answer is a draw: asked ten times, the same prompt does not give the same brands ten times. At one run a week, it takes months for a prompt to gather enough answers for a reliable verdict. A deep measurement asks the prompt several times in a row, on the same day, to settle it at once: is the brand really absent from this prompt, before you spend time on it?

To get there: the **Deep measurement** block, on the prompt’s page, below the trend. It does not exist for an archived prompt. At the top of the block, the “interface” stamp and the number of readings already done this way, or “never run”. When a prompt has between 3 and 19 answers, the sentence in its header points out that the margin is still wide and that a deep measurement narrows it.

<a id="settings"></a>

## What you choose

- **Number of times**: 5 times, 10 times (the default) or 25 times.
- **AIs read through the interface**: ChatGPT, Gemini, AI Mode and AI Overviews, all ticked at first, each with the number of answers already received on this prompt (“3 so far”). Claude is not offered: deep measurement only goes through the interface.

Below, the calculation is written out and updates with every choice: “10 times × 4 AIs = 40 requests, at $0.0012 per request: $0.0480”. The next line gives the month’s spend after sending against the cap, and what the automatic reading of the answers will add (about $0.0008 per answer). The button carries the price: **Start the deep measurement: $0.0480**.

> [!NOTE]
> **Confirmation and cap**
>
> Above the confirmation threshold ($1 by default, set in Settings), a window sums up the AIs and the number of requests before sending: **Confirm sending**. If the monthly cap has already been reached, the block says so and the button stays greyed out. If the run would only exceed it, a warning shows in red.

<a id="margin"></a>

## What the margin of error gains

The margin of error narrows with the number of answers. For a brand present in half of the answers, the tool gives, at 95% confidence:

| Interface answers on the prompt | The true share lies between |
| --- | --- |
| 4 | 15% and 85% |
| 10 | 24% and 76% |
| 20 | 30% and 70% |
| 40 | 35% and 65% |
| 100 | 40% and 60% |

A measurement of 10 times on 4 AIs adds 40 answers at once: enough for an “absent” or “solid” verdict to be read without hesitation.

<a id="counting"></a>

## How these readings count

- **For the prompt, yes**: its verdict, margin of error, presence AI by AI and trend are recalculated with all the answers of the period, deep measurements included.
- **In the overall numbers, no**: the overview, competitors, sources, the “Present in” line of the Prompts screen, the topic map, the report and the answer list leave them out. Otherwise a prompt asked twenty-five times would weigh twenty-five times more than the others.
- **A marker on the chart**: the overview’s main chart marks the day of the measurement, without counting it in the line.
- **A label on the answer**: each answer recorded this way carries the “deep measurement” label, and the prompt’s page lets you browse them one by one (“Answer 2 of 10 that day”).

<a id="step-by-step"></a>

## Settling a prompt

1. **Choose the right prompt.** A prompt that matters for Facturo and whose verdict is “occasional” or “too early to tell”. Pointless on a prompt that is already solid.

2. **Set the measurement.** 10 times on all four AIs, or 25 times on a single AI if that is the one you care about.

3. **Read the price and start.** The price is on the button. Confirm if the window opens.

4. **Wait for the answers.** They come back within minutes through the usual collection; the page refreshes by itself and the verdict is recalculated.

5. **Decide.** Absent on 40 answers: the prompt is lost, and the work list says why. Solid: move on to another one.

<a id="limits"></a>

## Limits

> [!WARNING]
> Asking on the same day measures that day’s answer: if the AI changes model or sources the following week, the verdict may change. Answers from the same series are more alike than answers spread over several weeks. Claude cannot be measured this way. Every request is paid: 25 times on 4 AIs costs $0.1200 per prompt, plus reading.

**See also**

- [A prompt’s page](./prompt-page.md)
- [Measurement method](../reference/method.md)
- [A number moved: real change or noise?](../use-cases/real-change-or-noise.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/measure/deep-measurement)
