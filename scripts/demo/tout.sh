#!/usr/bin/env bash
# Captures d'écran de la documentation, de bout en bout, en une commande :
#   npm run captures        (ou : bash scripts/demo/tout.sh)
#   npm run captures -- --seulement reglages,invitation   (quelques captures seulement)
#
# 1. copie le projet dans un dossier de travail HORS de Google Drive
#    (/private/tmp/geotrends-demo par défaut, réglable par GEOTRENDS_DEMO_DIR) ;
# 2. y installe les dépendances si besoin, crée et met à jour la base locale
#    « geotrends_demo », puis la remplit de données fictives (semer.ts) ;
# 3. construit l'application et photographie chaque écran en français et en
#    anglais (captures.ts) ;
# 4. écrit les images et le manifeste dans public/docs/captures/ du projet.
#
# Aucune clé d'API n'est copiée ni lue : la démonstration ne peut rien payer.
set -euo pipefail

DEPOT="$(cd "$(dirname "$0")/../.." && pwd)"
TRAVAIL="${GEOTRENDS_DEMO_DIR:-/private/tmp/geotrends-demo}"
DEMO_URL="${DEMO_DATABASE_URL:-postgresql://$(whoami)@localhost:5432/geotrends_demo}"
debut=$(date +%s)

case "$TRAVAIL" in
  *CloudStorage*|*"Google Drive"*|*"Mon Drive"*)
    echo "Refus : le dossier de travail ($TRAVAIL) ne doit pas être dans Google Drive." >&2
    exit 1 ;;
esac
case "$DEMO_URL" in
  */geotrends_demo) ;;
  *) echo "Refus : la base de démonstration doit s'appeler geotrends_demo ($DEMO_URL)." >&2; exit 1 ;;
esac

# Aucune clé dans l'environnement : même par erreur, aucun appel payant ne peut partir.
unset DATAFORSEO_AUTH ANTHROPIC_API_KEY DEEPSEEK_API_KEY YOUTUBE_API_KEY RESEND_API_KEY || true

echo "→ Copie du projet vers $TRAVAIL"
if [ "$DEPOT" != "$TRAVAIL" ]; then
  mkdir -p "$TRAVAIL"
  rsync -a --delete \
    --exclude .git --exclude node_modules --exclude .next --exclude .gstack \
    --exclude .env --exclude '.env.*' --exclude '*.key.txt' --exclude '*-token.txt' --exclude '*-api-key.txt' \
    --exclude src/generated --exclude '.captures-*' \
    "$DEPOT/" "$TRAVAIL/"
  # Base de démonstration seulement, adresse locale, secret jetable.
  printf 'DATABASE_URL="%s"\nBETTER_AUTH_SECRET=%s\nBETTER_AUTH_URL="http://localhost:3020"\n' "$DEMO_URL" "$(openssl rand -hex 32)" > "$TRAVAIL/.env"
  chmod 600 "$TRAVAIL/.env"
fi
cd "$TRAVAIL"
if ls ./*.key.txt >/dev/null 2>&1; then echo "Refus : fichier de clé présent dans $TRAVAIL." >&2; exit 1; fi

echo "→ Dépendances"
empreinte=$(shasum package-lock.json | cut -c1-40)
if [ ! -d node_modules ] || [ "$(cat node_modules/.empreinte-demo 2>/dev/null || true)" != "$empreinte" ]; then
  npm ci --no-audit --no-fund --loglevel=error
  echo "$empreinte" > node_modules/.empreinte-demo
fi
npx prisma generate >/dev/null

echo "→ Base geotrends_demo"
serveur="${DEMO_URL%/*}/postgres"
if ! psql "$serveur" -tAc "SELECT 1 FROM pg_database WHERE datname = 'geotrends_demo'" | grep -q 1; then
  psql "$serveur" -qc 'CREATE DATABASE geotrends_demo'
fi
npx prisma migrate deploy >/dev/null
npx tsx scripts/demo/semer.ts

echo "→ Construction de l'application"
# La documentation lit le manifeste des captures à la construction : il doit exister, même vide.
if [ ! -f public/docs/captures/manifeste.json ]; then
  mkdir -p public/docs/captures
  echo '{ "genere": null, "captures": { "fr": {}, "en": {} } }' > public/docs/captures/manifeste.json
fi
npx next build >.build-demo.log 2>&1 || { tail -40 .build-demo.log; exit 1; }

echo "→ Captures"
npx tsx scripts/demo/captures.ts --sortie "$DEPOT/public/docs/captures" "$@"

echo "Terminé en $(( $(date +%s) - debut )) s. Images et manifeste : $DEPOT/public/docs/captures/"
