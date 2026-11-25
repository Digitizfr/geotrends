# syntax=docker/dockerfile:1
# Image complète (pas de standalone) : le conteneur porte aussi le CLI Prisma
# (migrations au démarrage) et tsx (tâches de fond et commandes d'entretien). Prisma 7 est sans moteur natif
# (driver adapter pg) : alpine suffit.

FROM node:22-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Le build ne touche jamais la base (pages dynamiques), mais les gardes de
# prisma.ts et auth.ts exigent que les variables existent : valeurs factices.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build" \
    BETTER_AUTH_SECRET="secret-factice-build-uniquement" \
    BETTER_AUTH_URL="http://localhost:3010" \
    NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate && npm run build

FROM base AS run
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=build /app ./
EXPOSE 3010
# Migrations idempotentes avant de servir : un redéploiement avec changement
# de schéma n'exige aucune étape manuelle.
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
