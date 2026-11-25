<p align="center">
  <img src="public/logo-geotrends.png" alt="GeoTrends" width="96" height="96">
</p>

<h1 align="center">GeoTrends</h1>

<p align="center">
  <strong>Free, open-source GEO software.</strong><br>
  Measure whether ChatGPT, Gemini, Google and Claude cite your brand, with your own API keys.
</p>

<p align="center">
  <a href="README.fr.md">🇫🇷 Version française</a> ·
  <a href="https://geotrends.io/en">Website</a> ·
  <a href="docs/en/get-started/install.md">Install guide</a> ·
  <a href="docs/en/README.md">Documentation</a>
</p>

![GeoTrends project overview, with sample data](public/docs/captures/en/vue.webp)

## Stop overpaying for your GEO tool

A GEO tool (Generative Engine Optimization) asks AI engines your customers' questions and files the answers. It does so through reading services and model APIs that are open to anyone, at public prices: **$0.0012 for one answer** from ChatGPT, Gemini or Google.

A subscription sells that back to you as a flat fee. GeoTrends is software you install yourself: you plug in your own API keys and pay each reading at its price, with nobody in between.

| To track 50 prompts | A GEO subscription | GeoTrends, with your keys |
| --- | --- | --- |
| Per month | $95 | about $7.50 |
| Per year | $1,140 | about $90 |
| AI engines tracked | depends on the plan | 5, Claude included |
| Your answers and your numbers | on the vendor's servers | on yours |
| The code | closed | open, AGPL-3.0 |

<sub>Subscription: $95 a month for 50 prompts, the entry price shown by three GEO tools on their pricing pages (read on 12 November 2026). GeoTrends: provider prices observed in November 2026, weekly readings, Claude every two weeks; without Claude, about $1 a month. What you do not get here: a support desk, turnkey hosting, Perplexity and Copilot.</sub>

## What it does

- **Measure.** Your prompts go to five AI engines (ChatGPT, Gemini, Google AI Mode and AI Overviews through their real interface, Claude through its API), from the country and in the language you choose. Every answer is kept word for word, with its sources.
- **Understand.** Brands named instead of you, their rank and tone, the sites and pages used as sources, YouTube channels, Google's top ten under each AI Overview, wrong facts about your brand.
- **Act.** One work list drawn from the readings: pages to get mentioned on, your pages read but not cited, topics to cover. After a fix, the tool tells you whether the change is larger than the margin of error.
- **Stay in control.** Every paid call is logged with its price, under a monthly cap that pauses sending. Every number shows its method and how many answers it rests on.

The interface is available in French and English. [All features](https://geotrends.io/en/features) · [The method](https://geotrends.io/en/method)

## Install in three steps

You need [Docker](https://docs.docker.com/get-docker/) and a [DataForSEO](https://app.dataforseo.com/api-access) account. Allow fifteen minutes.

```bash
git clone https://github.com/Digitizfr/geotrends.git
cd geotrends
./installer.sh
```

The script asks for your keys, writes the `.env` file, then builds and starts the tool. Open the address it prints (`http://localhost:3010` on your computer): the first screen creates the admin account, the next one your first project.

On a server, give the script a domain name that already points to it: HTTPS is set up automatically. Without the script: copy `.env.example` to `.env`, fill it in, then run `docker compose up -d --build`.

Full guide: [Install GeoTrends](docs/en/get-started/install.md).

## API keys

Only the first one is required. Keys go in the `.env` file, stay on your machine, and are never displayed by the tool.

| Key | What it is for | What it costs | |
| --- | --- | --- | --- |
| **DataForSEO** | Recording ChatGPT, Gemini, Google AI Mode and AI Overviews, in their real interface | $0.0012 per answer, minimum top-up of $50 | Required |
| **DeepSeek** or **Anthropic** | Having every answer read by a small model: brands named, rank, tone, topics | Under $0.001 per answer | Recommended |
| **Anthropic** | Asking Claude your prompts as well | About $0.06 per prompt | Optional |
| **YouTube** | Matching every cited video to its channel | Free | Optional |
| **Resend** | Getting the Monday report by e-mail | Free | Optional |

## Updating and backing up

```bash
git pull && docker compose up -d --build                                  # update: the database upgrades itself, your data is kept
docker compose exec -T db pg_dump -U geotrends geotrends > backup.sql      # back up
```

## Documentation

- [Documentation in English](docs/en/README.md) and [use cases](docs/en/README.md#use-cases)
- [Documentation en français](docs/fr/README.md)
- On the website, with the same content: [geotrends.io/en/docs](https://geotrends.io/en/docs)

The Markdown files under `docs/` are generated from the website's documentation (`src/site/docs`): edit the source, then run `npm run verifier-docs`.

## Development

Next.js (App Router, TypeScript), Prisma with PostgreSQL, Better Auth, Tailwind CSS. The code, its comments and its commit messages are written in French.

```bash
npm ci
cp .env.example .env        # set DATABASE_URL (local PostgreSQL), BETTER_AUTH_SECRET and BETTER_AUTH_URL="http://localhost:3010"
npx prisma migrate deploy && npx prisma generate
npm run dev                 # http://localhost:3010
```

Before sending a change: `npm run lint`, `npx tsc --noEmit` and `npm run verifier-docs`. The screenshots in the documentation are real screens of the tool on a fictional dataset; `npm run captures` retakes them (see `scripts/demo/LISEZMOI.md`). Issues and pull requests are welcome, in French or English.

## Licence

[GNU Affero General Public License v3.0](LICENSE). You may use, modify and redistribute GeoTrends; if you run a modified version as an online service, you must publish your changes under the same licence.

Copyright © 2026 [Digitiz](https://digitiz.fr). GeoTrends is not affiliated with OpenAI, Google, Anthropic, DataForSEO or DeepSeek.
