<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Countries and languages

> Each project asks its prompts from one country and in one language, fixed at the first run. The countries and languages offered, and the interface language.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/reference/pays-et-langues.md)

An AI does not answer the same way in Paris and in London, in French and in English. Each project therefore has one country and one language: its prompts are asked from that country, in that language. Nothing is hard-coded for France: the first market tracked is French, but the tool serves other markets, one project per market.

<a id="offered"></a>

## Countries and languages offered

When a project is created, **The market** step offers ten countries and fourteen languages: the countries are those where all five engines can be recorded. Their names are written in the interface language; France and French come first.

|  | List |
| --- | --- |
| Countries | France, Belgium, Switzerland, Canada, Luxembourg, United States, United Kingdom, Germany, Spain, Italy. |
| Languages | French, English, German, Spanish, Italian, Portuguese, Dutch, Swedish, Danish, Norwegian, Finnish, Polish, Arabic, Japanese. |

<a id="readings"></a>

## Countries where interface readings go out

The interface-reading provider is set up for these **ten countries**: ChatGPT, Gemini, Google AI Mode and AI Overviews are asked from the project’s country. Claude, for its part, receives the project’s country as an approximate location. A country only appears in the list once checked with the provider: the tool never offers a market where its readings would fail.

> [!TIP]
> To track a market outside these ten countries, ask for it to be added: it is a setting of the tool, made after checking with the provider.

<a id="fixed"></a>

## Fixed at the first run

Country and language can be changed on the project page, **Project settings** tab, **Country and language** block, as long as no run has been made. After that, the block becomes read-only: the charts must stay comparable from one run to the next. For another market, create another project: for example Facturo for France, and Facturo UK for the United Kingdom, in English.

<a id="interface"></a>

## The interface language is separate

- The tool’s interface exists in **French** and **English**. The choice is made in Settings, account by account, and applies to every screen, dates, amounts and exports.
- It does not change the language of a project’s prompts: a project in French reads perfectly well with an English interface.
- AI answers are never translated or corrected: they are shown as the AI wrote them.
- Before sign-in, the sign-in page follows the browser language.

<a id="second-market"></a>

## Tracking a brand on a second market

1. **Create a project for that market.** New project, same brand, with the market’s country and language: Facturo UK, United Kingdom, English.

2. **Write the prompts in the market’s language.** As a local customer would ask them, not as a word-for-word translation of the French prompts.

3. **Declare what belongs to the brand.** The same site if it serves both markets, the local channels and profiles, and that market’s competitors.

4. **Start the first run.** Country and language are now fixed. Switch from one market to the other with the project switcher, at the top of the menu.

<a id="limits"></a>

## Limits

> [!WARNING]
> A language offered does not guarantee that the AI answers in that language, nor that it cites sources from that country. Two markets of the same brand are compared project by project: the tool makes no total across projects.

**See also**

- [Create a project](../project/create-a-project.md)
- [Settings](../steer/settings.md)
- [AI engines tracked](./ai-engines.md)

---

Updated: 2026-11-18 · [Read this page on the website](https://geotrends.io/en/docs/reference/countries-and-languages)
