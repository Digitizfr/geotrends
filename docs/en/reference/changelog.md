<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# What’s new

> What has changed in GeoTrends, day by day, newest first: open-source software you install yourself, tracked pages, client sharing, invitations, documentation.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/reference/nouveautes.md)

This page is updated with every release. It says what changes for you, not the technical detail. The features described here are live; what is not built is said so on the pages concerned.

<a id="2026-11-25"></a>

## 25 November 2026

- **GeoTrends becomes open-source software**, under the AGPL-3.0 licence. The code is on [GitHub](https://github.com/Digitizfr/geotrends): anyone can install it themselves, with their own API keys. See [Install GeoTrends](../get-started/install.md).
- **Three-step installation**: a script asks the questions, writes the settings file and starts the tool with Docker. The background task for automatic runs comes with it, and on a server the HTTPS certificate takes care of itself.
- **First account**: on first launch, the sign-in page has you create the admin account, then opens the creation of the first project.
- **Provider keys**: the DataForSEO login and password are entered as they are; the small model uses the DeepSeek key or, failing that, the Anthropic one. Settings tells you, for each missing key, the name to write in the `.env` file.
- All the documentation is also on GitHub, in Markdown, copied from the site with every update.

<a id="2026-11-20"></a>

## 20 November 2026

- **Tracked pages**: paste the address of a page of the brand; the tool reads it, suggests the prompts it answers (keep, edit, remove, or add your own by hand), then tells you, AI by AI, whether the answers to those prompts cite it and what they cite instead.
- **Quick search** (⌘ K) also finds pages, by part of their address or title.
- **Start from a page** on the Prompts screen, and **Track** on the brand’s pages in Sources.

<a id="2026-11-19"></a>

## 19 November 2026

- **Share with a client**: a private page, with no account, on a set of prompts, showing the brand AI by AI, the trend and the detail of each answer. It updates with every run, counts its openings and turns off in one click (**Shares** screen, or **Share** on the ticked prompts).
- **Invite a person** from **Settings › Accounts**: they get a personal link, valid for seven days, to choose a password. No password ever travels by e-mail. The same button makes a new link when someone forgets theirs.
- **My password**, in Settings: everyone can change their own.
- **Remove access** in one confirmed click, in Settings › Accounts.

<a id="2026-11-18"></a>

## 18 November 2026

- **Documentation and use cases** on the public site, in French and English: every screen of the tool described, with screenshots showing sample data.
- An automatic check flags any tool screen that no documentation page describes: the docs follow the tool.

<a id="2026-11-15"></a>

## 15 November 2026

- **The brand’s social profiles**: a LinkedIn, Instagram, Facebook, X, TikTok, Pinterest, Threads, Bluesky or GitHub profile can be declared as a property. A page cited under that profile counts for the brand.
- **Detect from the site**: when creating a project and on its page, this button reads the site’s home page for free and suggests the profiles and YouTube channels found. Nothing is added without review, and what is already declared is not suggested again.
- **Videos & channels** rebuilt in three blocks: your channels, one card per declared channel; prompt by prompt, with thumbnails and the channel of the cited video; the other channels cited. A single counting unit: the recorded answer.
- Claude can be recorded through its API again.

<a id="2026-11-14"></a>

## 14 November 2026

- **Projects**: create a brand from the tool, with its sites, channels, competitors and prompts; pick it at the top of the menu; start a run in one click, with the price of each AI shown before sending.
- **Automatic runs**: every week for ChatGPT, Gemini and Google, every two weeks for Claude, once turned on from the project page.
- **Automatic reading of answers** by a small model: brands mentioned, position and tone, for every AI.
- **Actions**: a work list drawn from the runs, with a status per line, a note, an outreach log and the before-and-after comparison of a completed action.
- **Page audit** (free reading: crawler access, text without JavaScript, headings, structured data, date, author) and **CSV exports**.
- **New screens** in the site’s visual identity: overview, prompts and a prompt’s page, answers, competitors, sources, videos, AI Overviews & Google, actions, fact checks, report, settings, costs.
- **Sources**: each site’s type and owning brand (Classify the sites button), sources going up and down.
- **Prompts**: tags (topic and intent), topic map, selection of several prompts, deep measurement of a prompt.
- **Fact checks** and the **report** with its alerts; markers and the margin-of-error band on charts; a “Versus” competitor filter in the top bar.
- **Interface**: foldable menu that collapses to icons, top bar with the period and the AIs, quick search (⌘ K or Ctrl K), sortable tables, phone layout, interface in French or English, redesigned sign-in page.
- **Public site** complete, in French and English, with screens showing sample data.

<a id="2026-11-12"></a>

## 12 November 2026

- **First runs**: ChatGPT, Gemini, Google AI Mode and AI Overviews, recorded from their interface, from the project’s country.
- **Claude** queried through its API, with web search on, and counted separately.
- **YouTube channels**: a cited video is attached to its channel; if the channel belongs to the brand, the citation counts for it.
- **Accounts** with closed sign-up, a **cost journal** with a monthly cap, and an **Admin** section for costs.
- Run schedule set: every week, and every two weeks for Claude. Live on geotrends.io.

**See also**

- [What is GeoTrends?](../README.md)
- [AI engines tracked](./ai-engines.md)

---

Updated: 2026-11-25 · [Read this page on the website](https://geotrends.io/en/docs/reference/changelog)
