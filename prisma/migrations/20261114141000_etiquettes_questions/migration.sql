-- Étiquettes des questions : thème et intention, posés par le petit modèle ou à la main.

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "theme" TEXT,
ADD COLUMN "intention" TEXT,
ADD COLUMN "etiqueteLe" TIMESTAMP(3),
ADD COLUMN "etiquetteMain" BOOLEAN NOT NULL DEFAULT false;
