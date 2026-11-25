<!-- Page generated from the site documentation (src/site/docs) by scripts/exporter-docs.ts: do not edit it here. -->

# Install GeoTrends

> Install GeoTrends on your own machine with Docker: download the code, plug in your API keys (DataForSEO, DeepSeek or Anthropic), create the admin account.

[← Documentation contents](../README.md) · [Lire cette page en français](../../fr/demarrer/installer.md)

GeoTrends is free, open-source software: you install it on your computer or on a server, with your own API keys. Nothing goes through us: your prompts, the recorded answers and your numbers stay in your own database. Allow fifteen minutes. The code is on [GitHub](https://github.com/Digitizfr/geotrends).

<a id="what-you-need"></a>

## What you need

- **Docker**, which is free: Docker Desktop on Mac or Windows, Docker Engine on Linux. It runs the tool, its database and its background task.
- **A DataForSEO account**, to record ChatGPT, Gemini and Google. It is the only key you cannot do without.
- **A DeepSeek or Anthropic key**, recommended: it lets a small model read the answers.
- **A computer or a small server.** Automatic runs go out while the tool is running: on a computer switched off at night, they go out when it wakes up. A server at a few euros a month is enough (2 GB of memory).

<a id="install"></a>

## Install, in three steps

1. **Download the code.** In a terminal: `git clone https://github.com/Digitizfr/geotrends.git`, then `cd geotrends`. Without git, the **Code › Download ZIP** button on the [GitHub page](https://github.com/Digitizfr/geotrends) gives you the same folder.

2. **Run the install script.** Type `./installer.sh`. It asks, in order: the domain name (leave empty on your computer), the DataForSEO API login and password, then the optional keys. Pressing Enter skips a question. It writes the `.env` file, generates two secrets unique to your installation, builds the tool and starts it. The first build takes a few minutes.

3. **Create the admin account.** Open the address shown at the end (`http://localhost:3010` on your computer). On first launch, the screen asks for your name, your e-mail address and a password: that is the admin account. The tool then takes you to creating your first project.

   ![Create the admin account](../../../public/docs/captures/en/premier-compte.webp)

> [!TIP]
> **Without the script**
>
> Copy `.env.example` to `.env`, fill it in (every line is explained), then run `docker compose up -d --build`. The result is the same.

<a id="keys"></a>

## API keys

An API key is a password that lets the tool call a provider on your behalf. You open an account with the provider, create the key there, and paste it into the `.env` file. It only leaves your machine to call that provider, and the tool never displays it.

| Provider | What it enables | Price | In the .env file |
| --- | --- | --- | --- |
| **DataForSEO** (required) | Readings of ChatGPT, Gemini, Google AI Mode and AI Overviews, in their real interface. API login and password at [app.dataforseo.com](https://app.dataforseo.com/api-access). | $0.0012 per answer. Minimum top-up of $50. | `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` |
| **DeepSeek** (recommended) | The small model: it reads every answer (brands named, rank, tone), tags the prompts, classifies the sites, suggests the prompts of a page. Key at [platform.deepseek.com](https://platform.deepseek.com/api_keys). | About $0.0008 per answer read. | `DEEPSEEK_API_KEY` |
| **Anthropic** (optional) | Claude readings, through its API. Also acts as the small model if you have no DeepSeek key. Key at [console.anthropic.com](https://console.anthropic.com/settings/keys). | About $0.06 per prompt asked to Claude. | `ANTHROPIC_API_KEY` |
| **YouTube** (optional) | The channel name of every cited video, to count the videos from your channels. “YouTube Data API v3” key in the [Google Cloud console](https://console.cloud.google.com/apis/credentials). | Free. | `YOUTUBE_API_KEY` |
| **Resend** (optional) | Sending the Monday report by e-mail. You also need a sender address on a domain verified with Resend. Key at [resend.com](https://resend.com/api-keys). | Free up to 3,000 e-mails a month. | `RESEND_API_KEY` and `RAPPORT_EXPEDITEUR` |

Without a DeepSeek or Anthropic key, runs still work and your brand’s presence is measured. What is missing: the competing brands named, their rank and the tone (except for ChatGPT), prompt tags and site classification.

<a id="change-a-key"></a>

## Adding or changing a key

1. **Open the .env file.** It is in the installation folder. Paste the key between the quotes, on the line that bears its name.

2. **Restart the tool.** Type `docker compose up -d`: the tool restarts with the new value. Your data does not move.

3. **Check in Settings.** The **Provider keys** block says “Key in place” or “Key missing” for each one. After a first paid call, it also gives the date of the last successful call: that is what proves the key works. See [Settings](../steer/settings.md).

<a id="server"></a>

## On a server, with a domain name

Point the domain name to the server (an A record), then give it to the install script when it asks. The tool starts with one more service, Caddy, which obtains the HTTPS certificate on its own. Ports 80 and 443 of the server must be free.

By hand, this comes down to three lines of the `.env` file: `DOMAINE="geo.example.com"`, `COMPOSE_PROFILES="https"` and `BETTER_AUTH_URL="https://geo.example.com"`. The value of `BETTER_AUTH_URL` must always be the exact address you type in the browser: otherwise sign-in is refused.

<a id="team"></a>

## Inviting your team

Nobody signs up on their own. In **Settings › Accounts**, the admin enters a name and an e-mail address: the tool creates the account and shows a personal link, valid for seven days, which you send from your own mail app. The person chooses a password there. There is no e-mail service to configure. See [Accounts and sign-in](../steer/accounts.md).

<a id="update"></a>

## Updating, backing up, stopping

- **Update**: in the installation folder, `git pull` then `docker compose up -d --build`. The database is upgraded on its own at start-up and your data is kept. Changes are listed in [What’s new](../reference/changelog.md).
- **Back up**: all your data is in the PostgreSQL database. The command `docker compose exec -T db pg_dump -U geotrends geotrends > backup.sql` makes a copy. Keep the `.env` file too.
- **Stop**: `docker compose down` stops the tool without deleting anything, `docker compose up -d` starts it again.
- **See what is going on**: `docker compose logs app` for the tool, `docker compose logs taches` for automatic runs.

> [!WARNING]
> GeoTrends is provided as is, with no support and no warranty (AGPL-3.0 licence). The monthly cap, $20 to start with, is the spending safeguard: it pauses sending once reached. An installation open to the Internet must use HTTPS, and the admin account must be created right after installing: until it exists, the first person who opens the page can create it.

**Next**

- [Quick start](./quick-start.md): From the first project to the first run, in six steps.
- [What a run costs](./costs.md): What a run costs, and how spend is kept in check.
- [Settings](../steer/settings.md): Keys in place, run schedule, accounts.
- [Accounts and sign-in](../steer/accounts.md): Inviting someone, the two roles, finding your way in the tool.

---

Updated: 2026-11-25 · [Read this page on the website](https://geotrends.io/en/docs/get-started/install)
