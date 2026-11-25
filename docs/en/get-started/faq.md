<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Frequently asked questions

> GEO, interface or API, repeated readings, no score out of 100, YouTube videos, missing AI Overviews, costs, Claude counted apart: short answers to common questions.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/demarrer/questions-frequentes.md)

<a id="the-idea"></a>

## The idea

<a id="geo"></a>

### What is GEO?

GEO (Generative Engine Optimization) is the work of getting a brand into AI answers: ChatGPT, Gemini, Claude, Google AI Mode and AI Overviews. It resembles search optimisation, with one difference: the AI does not return a list of links, it writes an answer that names a few brands and cites a few pages. GeoTrends measures that presence, shows who is cited instead and what to fix.

<a id="guarantee"></a>

### Does the tool guarantee a citation?

No. Nobody knows how to get cited for certain, and the tool does not promise it. It measures, suggests actions drawn from the runs, then measures again and tells whether the change exceeds the noise. See [Measuring after an action](../act/measure-after-action.md).

<a id="free"></a>

### Is GeoTrends free? How do I get it?

Yes. It is open-source software under the AGPL-3.0 licence: there is no subscription and no sign-up with us. You install it on your computer or your server, paste in your own API keys, and you only pay for your readings, straight to the providers. See [Install GeoTrends](./install.md).

<a id="the-measurement"></a>

## The measurement

<a id="interface-api"></a>

### What is the difference between an interface reading and an API answer?

An interface reading opens the AI’s real page, asks the prompt from the project’s country and keeps what is displayed, sources included: what a person sees. An API answer comes from the bare model, without the application around it. The two do not give the same brands or the same sources. See [AI engines tracked](../reference/ai-engines.md).

<a id="claude"></a>

### Why is Claude counted separately?

Because no service records Claude’s interface: it is queried through the Anthropic API, with web search. Its answer is the model’s, not the app’s. Adding its answers to interface ones would mix two different measurements: Claude therefore has its own tile, column and line, never added to the others.

<a id="repetition"></a>

### Why ask the same prompt several times?

Because an AI answer is a draw: the same prompt asked twice does not mention the same brands. A single reading proves neither presence nor absence. Regular runs build a series, and the [deep measurement](../measure/deep-measurement.md) asks a prompt 5, 10 or 25 times in a row to settle it.

<a id="score"></a>

### Why no score out of 100?

Because a score mixes things that cannot be compared (AIs, methods, prompts) and hides how many answers it rests on. The tool gives a visibility per method, with its number of answers and its margin of error, and for a single prompt a verdict: solid, occasional, absent, or too early to tell.

<a id="percentage"></a>

### Why is a percentage sometimes missing?

Below 5 answers, a percentage would mean nothing: the screen says “From 5 readings” instead, or shows the count only (“2 out of 4”). For a prompt, the verdict needs at least 3 answers.

<a id="no-overview"></a>

### What does “No overview” mean?

That Google showed no AI Overview for this prompt that day. It is not an absence of the brand: that reading is left out of the visibility calculation, which only counts the answers received. The AI Overviews & Google screen classes it “No Overview: not worth working on for Google”.

<a id="youtube"></a>

### Does a YouTube video count for my brand?

Yes, if its channel is declared in the project. Every video cited by an AI is attached to the channel that published it; if that channel belongs to the brand, the citation counts for the brand, not for youtube.com. The same goes for a post under a declared social profile (LinkedIn, Instagram…). See [Sites, YouTube channels and social profiles](../project/sites-channels-profiles.md).

<a id="translation"></a>

### Are answers translated?

No. Prompts are asked in the project’s language, and the text of the answers is kept as the AI wrote it, without translation or correction. The interface language (French or English) is chosen in Settings and changes nothing about the prompts. See [Countries and languages](../reference/countries-and-languages.md).

<a id="costs"></a>

## Costs

<a id="price"></a>

### How much does a run cost?

$0.0012 per prompt and per AI recorded from the interface, about $0.06 per prompt for Claude, and about $0.0008 per answer for reading. Ten prompts on four interface AIs cost about $0.08, reading included. The price is written on the button before sending. See [What a run costs](./costs.md).

<a id="cap"></a>

### What happens when the monthly cap is reached?

No paid call goes out any more: automatic runs suspend themselves, and a manual run is refused. Screens stay available, for free. The cap, $20 by default, is changed in Admin, Costs.

<a id="scope"></a>

## Scope

<a id="perplexity"></a>

### Can Perplexity or Copilot be tracked?

Not today. The AIs tracked are ChatGPT, Gemini, Google AI Mode and AI Overviews through the interface, and Claude through its API. Perplexity and Copilot are not recorded.

<a id="visits"></a>

### Can I see the visits coming from AI engines?

No. Google Analytics and Search Console are not connected to the tool: it measures presence in answers, not the traffic it brings.

**See also**

- [Key concepts](./key-concepts.md)
- [Measurement method](../reference/method.md)
- [Which AI engines should I look at first, and why is Claude kept apart?](../use-cases/which-ai-engines-first.md)

---

Updated: 2026-11-25 · [Read this page on the website](https://geotrends.io/en/docs/get-started/faq)
