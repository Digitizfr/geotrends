<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# What a run costs

> The price of each paid call, what is free, the monthly cap and the confirmation threshold, with budget examples for 10 and 50 prompts tracked each month.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/demarrer/couts.md)

GeoTrends only costs what it calls: each reading and each pass of a small model is billed in dollars by the provider, and each is logged in the cost journal with its price. The price of a run is always written on its button, before you click. No spending goes out without your consent, except what you turned on (automatic runs, classification of new sites, tagging of new prompts).

<a id="prices"></a>

## What is paid

| Call | Price | When |
| --- | --- | --- |
| Interface reading (ChatGPT, Gemini, AI Mode, AI Overviews) | $0.0012 per prompt and per AI, price returned by the provider | At every run, manual or automatic |
| Claude reading, through its API | The average price actually paid over the last 30 successful calls ($0.06 per prompt until one has been measured) | When Claude is ticked, or every two weeks if automatic |
| Reading an answer (brands, position, tone) | About $0.0008 per answer | Automatically for new answers; on click for the others |
| Comparison with the fact checks | About $0.0006 per answer reread | On click; then during reading, at no extra call |
| Tagging a prompt (topic, intent) | About $0.00008 per prompt | On click, then for each prompt added |
| Typing a cited site | About $0.00005 per site, once per site | On click, then for each new site |

<a id="free"></a>

## What is free

- Creating a project, adding prompts, competitors and fact checks.
- Collecting a run’s answers: only sending is charged.
- Opening any screen: everything is read from the database.
- The details of cited YouTube videos, detecting social profiles from the site, the page audit, CSV exports.

<a id="examples"></a>

## Budget examples

| Situation | Calculation | Order of magnitude |
| --- | --- | --- |
| One run of 10 prompts on 4 interface AIs | 40 readings × $0.0012, plus 40 reads × $0.0008 | about $0.08 |
| A deep measurement: one prompt 10 times on 4 AIs | 40 readings × $0.0012, plus reading | about $0.08 |
| 50 prompts every week, interface only | 50 × 4 AIs × ($0.0012 + $0.0008) × 4.33 weeks | about $1.75 a month |
| The same 50 prompts to Claude, every two weeks | 50 × ($0.06 + $0.0008) × 2.17 runs | about $6.60 a month |

These estimates are the ones the tool shows: in a project’s Runs tab, next to each automatic run, and on the Settings screen, project by project. Claude costs about fifty times more than an interface reading: that is why it is unticked by default and recorded half as often.

<a id="safeguards"></a>

## The two safeguards

| Setting | Default | What it does |
| --- | --- | --- |
| **Monthly cap** | $20 | When the month’s spending reaches it, no paid call goes out: automatic runs are suspended and a manual run is refused, until next month or until the cap is raised. It is set in **Admin › Costs**. |
| **Confirmation threshold** | $1 | Above this amount, a window asks you to confirm the run, on top of the price written on the button. It is set in **Settings**. |

> [!WARNING]
> The cap is checked before sending, not against the price of the run: a run started just under the cap goes out and can exceed it. The Runs tab flags this in red before you click (“This would exceed the monthly cap.”). Prices of the small models and of Claude are calculated from the rate card when the provider does not return them; the journal marks them with an asterisk.

**See also**

- [The cost dashboard](../steer/costs.md)
- [Automatic runs](../project/scheduled-runs.md)
- [How do I track a brand without going over budget?](../use-cases/tracking-on-a-budget.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/get-started/costs)
