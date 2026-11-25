#!/usr/bin/env bash
# Installe GeoTrends sur cette machine, en posant quelques questions.
#
#   ./installer.sh
#
# Le script écrit le fichier .env (vos clés et deux secrets générés pour vous),
# puis lance l'outil avec Docker. Il ne supprime rien : si un fichier .env
# existe déjà, il le garde tel quel et se contente de (re)lancer l'outil.
# Rien n'est envoyé ailleurs que chez les fournisseurs dont vous donnez les clés.
#
# Sans clavier (script, serveur) : les réponses se lisent dans l'environnement,
# par exemple  DOMAINE=geo.exemple.fr DATAFORSEO_LOGIN=… DATAFORSEO_PASSWORD=… ./installer.sh
set -euo pipefail
cd "$(dirname "$0")"

# ── Langue des messages ─────────────────────────────────────────────────────
LANGUE="${GEOTRENDS_LANGUE:-}"
if [ -z "$LANGUE" ]; then
  case "${LANG:-}" in fr*) LANGUE=fr ;; *) LANGUE=en ;; esac
fi
dire() { if [ "$LANGUE" = fr ]; then printf '%s\n' "$1"; else printf '%s\n' "$2"; fi; }
titre() { printf '\n── %s\n' "$(dire "$1" "$2")"; }

# Pose une question, sauf si la réponse est déjà dans l'environnement ou s'il n'y a pas de clavier.
#   demander NOM "question en français" "question in English" [secret]
demander() {
  local nom="$1" valeur="${!1:-}"
  if [ -z "$valeur" ] && [ -t 0 ]; then
    if [ "${4:-}" = secret ]; then
      read -r -s -p "$(dire "$2" "$3") " valeur || true
      printf '\n'
    else
      read -r -p "$(dire "$2" "$3") " valeur || true
    fi
  fi
  # Ni espaces autour, ni retour à la ligne collé avec la clé.
  valeur="$(printf '%s' "$valeur" | tr -d '\r\n' | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
  printf -v "$nom" '%s' "$valeur"
}

# Écrit CLE='valeur' dans .env, à la place de la ligne du modèle.
regler() {
  local guillemet="'"
  case "$2" in *"'"*) guillemet='"' ;; esac
  CLE="$1" VALEUR="$2" G="$guillemet" awk '
    BEGIN { c = ENVIRON["CLE"]; v = ENVIRON["VALEUR"]; g = ENVIRON["G"]; fait = 0 }
    index($0, c "=") == 1 { print c "=" g v g; fait = 1; next }
    { print }
    END { if (!fait) print c "=" g v g }
  ' .env > .env.tmp
  mv .env.tmp .env
  chmod 600 .env
}

secret() {
  if command -v openssl >/dev/null 2>&1; then openssl rand -hex "$1"
  else LC_ALL=C tr -dc 'a-f0-9' < /dev/urandom | head -c "$(( $1 * 2 ))"; fi
}

# ── 1. Docker ───────────────────────────────────────────────────────────────
titre 'GeoTrends : installation' 'GeoTrends: installation'
if ! command -v docker >/dev/null 2>&1 || ! docker compose version >/dev/null 2>&1; then
  dire 'Docker est introuvable. Installez Docker Desktop (Mac, Windows) ou Docker Engine (Linux), puis relancez ce script :' \
       'Docker was not found. Install Docker Desktop (Mac, Windows) or Docker Engine (Linux), then run this script again:'
  echo '  https://docs.docker.com/get-docker/'
  exit 1
fi
if ! docker info >/dev/null 2>&1; then
  dire 'Docker est installé mais ne répond pas : ouvrez Docker Desktop (ou démarrez le service), puis relancez ce script.' \
       'Docker is installed but not responding: open Docker Desktop (or start the service), then run this script again.'
  exit 1
fi

# ── 2. Le fichier .env ──────────────────────────────────────────────────────
if [ -f .env ]; then
  dire 'Un fichier .env existe déjà : je le garde tel quel.' 'A .env file already exists: keeping it as it is.'
else
  titre 'Où installez-vous GeoTrends ?' 'Where are you installing GeoTrends?'
  dire 'Sur cet ordinateur : laissez vide. Sur un serveur : donnez le nom de domaine qui pointe déjà vers lui (exemple : geo.exemple.fr).' \
       'On this computer: leave empty. On a server: give the domain name that already points to it (example: geo.example.com).'
  demander DOMAINE 'Nom de domaine (vide = cet ordinateur) :' 'Domain name (empty = this computer):'
  DOMAINE="$(printf '%s' "$DOMAINE" | sed -E 's#^https?://##; s#/.*$##')"

  titre 'DataForSEO (indispensable)' 'DataForSEO (required)'
  dire 'C’est lui qui relève ChatGPT, Gemini et Google : environ 0,0012 $ par réponse. Identifiant et mot de passe d’API sur https://app.dataforseo.com/api-access' \
       'It records ChatGPT, Gemini and Google: about $0.0012 per answer. API login and password at https://app.dataforseo.com/api-access'
  dire '(Entrée pour passer : vous les ajouterez plus tard dans le fichier .env.)' '(Press Enter to skip: you can add them later in the .env file.)'
  demander DATAFORSEO_LOGIN 'Identifiant d’API DataForSEO :' 'DataForSEO API login:'
  demander DATAFORSEO_PASSWORD 'Mot de passe d’API DataForSEO :' 'DataForSEO API password:' secret

  titre 'Le petit modèle qui lit les réponses (conseillé)' 'The small model that reads the answers (recommended)'
  dire 'Il repère les marques nommées, leur rang et le ton : moins d’un millième de dollar par réponse. Une seule des deux clés suffit.' \
       'It finds the brands named, their rank and the tone: under a tenth of a cent per answer. One of the two keys is enough.'
  demander DEEPSEEK_API_KEY 'Clé DeepSeek (https://platform.deepseek.com/api_keys) :' 'DeepSeek key (https://platform.deepseek.com/api_keys):' secret
  demander ANTHROPIC_API_KEY 'Clé Anthropic, qui sert aussi à relever Claude (https://console.anthropic.com/settings/keys) :' 'Anthropic key, also used to record Claude (https://console.anthropic.com/settings/keys):' secret

  titre 'YouTube (facultatif, gratuit)' 'YouTube (optional, free)'
  demander YOUTUBE_API_KEY 'Clé YouTube Data API v3 :' 'YouTube Data API v3 key:' secret

  cp .env.example .env
  chmod 600 .env
  regler BETTER_AUTH_SECRET "$(secret 32)"
  regler POSTGRES_PASSWORD "$(secret 24)"
  if [ -n "$DOMAINE" ]; then
    regler BETTER_AUTH_URL "https://$DOMAINE"
    regler DOMAINE "$DOMAINE"
    regler COMPOSE_PROFILES https
  else
    regler BETTER_AUTH_URL "http://localhost:${GEOTRENDS_PORT:-3010}"
    if [ -n "${GEOTRENDS_PORT:-}" ]; then regler GEOTRENDS_PORT "$GEOTRENDS_PORT"; fi
  fi
  regler DATAFORSEO_LOGIN "$DATAFORSEO_LOGIN"
  regler DATAFORSEO_PASSWORD "$DATAFORSEO_PASSWORD"
  regler DEEPSEEK_API_KEY "$DEEPSEEK_API_KEY"
  regler ANTHROPIC_API_KEY "$ANTHROPIC_API_KEY"
  regler YOUTUBE_API_KEY "$YOUTUBE_API_KEY"
  dire 'Fichier .env écrit (lisible par vous seul).' '.env file written (readable by you only).'
fi

# L'adresse de l'outil et le nom de domaine, tels qu'ils sont dans .env.
lire_env() { sed -n "s/^$1=//p" .env | head -1 | sed -e "s/^['\"]//" -e "s/['\"]$//"; }
ADRESSE="$(lire_env BETTER_AUTH_URL)"
DOMAINE="$(lire_env DOMAINE)"
PORT="$(lire_env GEOTRENDS_PORT)"; PORT="${PORT:-3010}"

# ── 3. Lancer ───────────────────────────────────────────────────────────────
titre 'Construction et démarrage (quelques minutes la première fois)' 'Building and starting (a few minutes the first time)'
# Avec un nom de domaine, COMPOSE_PROFILES=https (dans .env) démarre aussi le service HTTPS.
docker compose up -d --build

dire 'Attente du démarrage de l’outil…' 'Waiting for the tool to start…'
pret=0
for _ in $(seq 1 90); do
  if docker compose exec -T app wget -q -O /dev/null http://127.0.0.1:3010/connexion 2>/dev/null; then pret=1; break; fi
  sleep 2
done

titre 'Terminé' 'Done'
if [ "$pret" = 1 ]; then
  dire "GeoTrends est prêt : ouvrez ${ADRESSE:-http://localhost:$PORT} et créez votre compte administrateur." \
       "GeoTrends is ready: open ${ADRESSE:-http://localhost:$PORT} and create your admin account."
else
  dire 'L’outil ne répond pas encore. Regardez ce qu’il dit avec : docker compose logs app' \
       'The tool is not responding yet. See what it says with: docker compose logs app'
  exit 1
fi
if [ -z "$(lire_env DATAFORSEO_LOGIN)" ] && [ -z "$(lire_env DATAFORSEO_AUTH)" ]; then
  dire 'Il manque encore les identifiants DataForSEO : ajoutez-les dans le fichier .env, puis lancez « docker compose up -d ». Sans eux, aucun relevé ne peut partir.' \
       'The DataForSEO credentials are still missing: add them to the .env file, then run "docker compose up -d". Without them, no reading can be sent.'
fi
dire 'Mettre à jour plus tard : git pull && docker compose up -d --build' 'To update later: git pull && docker compose up -d --build'
