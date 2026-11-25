<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Topics and the topic map

> A topic and an intent for each prompt, set by a small model or by hand, then the topic map: the topics the brand holds, and those another brand takes from it.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/comprendre/themes.md)

With a few dozen prompts, one row per prompt is no longer enough to know where to put the effort. Tags group the prompts by topic and by intent, and the **Topic map** says, for each topic, whether the brand holds it, contests it, or leaves it to another brand.

Everything happens on the Prompts screen: the tagging banner, the **Filter and group** block and the map, at the bottom of the screen. A prompt’s tags are corrected on its page, through **Edit tags**.

![The Prompts screen of the Facturo UK project: each prompt carries its topic and intent; the topic map is at the bottom of the screen.](../../../public/docs/captures/en/questions.webp)

*The Prompts screen of the Facturo UK project: each prompt carries its topic and intent; the topic map is at the bottom of the screen.*

<a id="tags"></a>

## The two tags

| Tag | What it says |
| --- | --- |
| **Topic** | The prompt’s family of subjects, in one to three words, without a brand name: “invoicing”, “business management”. A topic groups several prompts; the model keeps few of them, eight at most. |
| **Intent**: learn | Understand a subject, learn how to do something. |
| **Intent**: compare | Choose between several offers: the best one, a comparison, a review, “which tool to choose”. |
| **Intent**: buy | Ready to act: price, quote, free trial, sign-up, where to buy. |

A third indication is not a tag: “with the brand name” or “without the brand name” is deduced from the prompt’s text, without a model. Prompts without the brand name are the ones that bring new customers.

<a id="setting"></a>

## Setting the tags

While some prompts have no tag, a banner offers **Tag the prompts**, with its price: less than a tenth of a cent per prompt. The small model files the prompts in batches of sixty and reuses the topics already set, so the list stays short and stable. It is a paid call, logged in the cost journal, sent only on your click.

After that first click, prompts added later are tagged automatically: those written on the project page, as well as those added from an idea. **Turn off automatic tagging** stops it, on the same screen; **Turn on automatic tagging** brings it back.

> [!TIP]
> **A manual correction takes precedence**
>
> On a prompt’s page, **Edit tags** lets you choose the topic (40 characters at most) and the intent, then **Save**. On the Prompts screen, select several prompts, type a topic, then **Change topic**. It is free, and the model never touches a tag set by hand again.

<a id="filtering"></a>

## Filtering and grouping the prompts

The **Filter and group** block of the prompts table keeps the prompts of a **Topic** or an **Intent**, or those **With** or **Without** the **Brand name**. **Group by** splits the table into sections, by topic or by intent. Clicking a prompt’s topic tag also filters the table on that topic.

<a id="map"></a>

## The topic map

One row per topic, with its **Prompts**, your brand’s presence (interface answers where it appears, out of the answers received for the topic), the **Most mentioned brand** and the **Status**. Clicking a topic filters the prompts table.

| Status | Rule |
| --- | --- |
| **Held** | The brand is in 6 answers out of 10 or more, and no other brand is mentioned more often. |
| **Contested** | The brand is present, but in fewer than 6 answers out of 10, or another brand is mentioned more often. |
| **To win back** | The brand is absent while another brand is mentioned in 3 answers out of 10 or more. |
| **Blind spot** | The brand is absent and no brand reaches 3 answers out of 10: nobody holds the topic. |
| **Too early to tell** | Fewer than 5 answers read on the topic. |

Your brand’s share is counted on all interface answers received for the topic; other brands’ share, on the answers whose brands have been read. Deep measurements are left out, and the brands you dismissed do not count as “most mentioned”.

<a id="step-by-step"></a>

## Choosing the topics to work on

1. **Tag the prompts.** Click **Tag the prompts** once. The price is written on the button.

2. **Review the topics.** Two topics that are too close can be merged: select their prompts and give them the same topic with **Change topic**.

3. **Read the map.** Start with the “To win back” topics: a competitor has settled there, and you need to go where it is cited. A “Blind spot” is a free spot to take.

4. **Go down to the prompts.** Clicking the topic filters the table; each prompt’s page says who wins and thanks to which pages.

<a id="limits"></a>

## Limits

> [!WARNING]
> The small model can misfile a prompt: review the topics once, then correct by hand. With one or two runs per prompt, a topic’s status is a snapshot, not a trend. A topic with two or three prompts rests on few answers: it stays “Too early to tell” until it has 5 answers read.

**See also**

- [The Prompts screen](../measure/prompts.md)
- [A prompt’s page](../measure/prompt-page.md)
- [On which topics am I absent while a competitor holds the ground?](../use-cases/topics-where-i-am-absent.md)
- [Branded or unbranded: how should I split my prompts?](../use-cases/branded-or-unbranded-prompts.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/understand/topic-map)
