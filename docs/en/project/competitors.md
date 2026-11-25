<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Choose your competitors

> Track three to six brands against yours: that is what makes share of voice computable, and what attributes cited pages to them. Tracking a brand is free.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/projet/concurrents.md)

A tracked competitor is a brand the tool compares with yours, screen by screen. Without a tracked competitor, **Share of voice** cannot be computed (it would always be 100%), the head-to-head stays empty and the **Versus** filter of the top bar has nothing to offer. Tracking a brand costs nothing and starts no run: the numbers are computed from the answers already recorded.

To get there: the **Competitors** tab of the project page, or the **Manage tracked competitors** button of the Competitors screen. A brand can also be tracked with one click on **Track**, wherever the tool lists brands mentioned: on the overview (**Mentioned instead of us**), on the Competitors screen (**Brands spotted, not tracked yet**) and in the report (**Brands mentioned for the first time**).

<a id="tracked"></a>

## Tracked competitors

One row per competitor. Its name opens the answers that mention it; below, the number of interface answers it is mentioned in, or “not mentioned yet”. The **Its site** field declares the competitor’s domain, with **Save**. **Stop tracking** removes it from the comparison, without deleting anything from the answers.

The block at the bottom, **Add competitors**, takes one brand name per line. A name already tracked is not added twice.

<a id="site"></a>

## Why declare a competitor’s site

- Its cited pages are attributed to it: on the Sources screen, the **Owner** column files them as “tracked competitor”, and the **Who gets the citations** block counts them separately.
- Its pages are never suggested in the work list as pages “to appear on”: you do not ask a rival for a spot on its own site.
- Without a declared site, the tool still recognises a domain named after the competitor (comptalis.exemple for Comptalis), or a site classified as a brand site owned by Comptalis. Declaring the domain removes the doubt, subdomains included.

<a id="spotted"></a>

## Brands spotted in the answers

On the right, **Brands spotted in the answers** lists the twelve brands the interface AIs mention most on your prompts, among those neither tracked nor dismissed. For each: the number of answers and prompts it appears in, and a **Track** button. The count covers the whole history, and only the answers whose brands are known. **All spotted brands** opens the Competitors screen, where an irrelevant brand is set aside with one click on **Dismiss**.

> [!NOTE]
> **One brand, several spellings**
>
> AIs do not always write a brand the same way. The tool compares names without case, accents or punctuation, and attaches to the competitor any brand mentioned that contains its name: “Devizo Invoicing” counts for Devizo. At least three letters are needed for this match.

<a id="step-by-step"></a>

## Choosing Facturo’s competitors

1. **Start from what the AIs say.** After the first run, open the **Competitors** tab and read **Brands spotted in the answers**. These are the brands taking Facturo’s place, not the ones you imagine.

2. **Track three to six brands.** For example Comptalis, Devizo and Tikette, mentioned on many prompts. A brand mentioned only once tells you little.

3. **Declare their sites.** Enter comptalis.exemple in **Its site**, then **Save**. Do the same for each one.

4. **Set the noise aside.** On the Competitors screen, **Dismiss** removes unrelated names (a generic tool, a media outlet) from the list of spotted brands. They are still counted in the answers.

5. **Read the comparison.** Share of voice, the ranking and the head-to-head fill in at once. See [Competitors and share of voice](../understand/competitors.md).

<a id="limits"></a>

## Limits

> [!WARNING]
> Brands mentioned are read from the text by a small model, except for ChatGPT, which returns them itself: until the answers are read, no brand is spotted. A competitor with a very short or very common name may be matched to another brand by mistake. Share of voice only counts tracked competitors: a brand that is often mentioned but not tracked does not enter it.

**See also**

- [Competitors and share of voice](../understand/competitors.md)
- [Who is cited instead of me?](../use-cases/who-is-cited-instead-of-me.md)
- [Which competitor is moving in on my topics?](../use-cases/competitor-moving-in.md)
- [Write the prompts to track](./prompts.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/project/competitors)
