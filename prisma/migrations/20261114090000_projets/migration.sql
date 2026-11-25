-- Projets : une marque suivie, ses propriétés, ses concurrents, ses questions.
-- Écrite à la main : les questions existantes portaient le nom du projet en
-- texte libre, il faut créer les projets avant de poser la clé étrangère.

-- CreateTable
CREATE TABLE "Projet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nom" TEXT NOT NULL,
    "marque" TEXT NOT NULL,
    "langue" TEXT NOT NULL,
    "pays" TEXT NOT NULL,
    "archive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Propriete" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "libelle" TEXT,

    CONSTRAINT "Propriete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Concurrent" (
    "id" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "domaine" TEXT,

    CONSTRAINT "Concurrent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projet_nom_key" ON "Projet"("nom");

-- CreateIndex
CREATE UNIQUE INDEX "Propriete_projetId_type_valeur_key" ON "Propriete"("projetId", "type", "valeur");

-- CreateIndex
CREATE UNIQUE INDEX "Concurrent_projetId_nom_key" ON "Concurrent"("projetId", "nom");

-- Un projet par nom déjà utilisé dans les questions.
INSERT INTO "Projet" ("id", "nom", "marque", "langue", "pays")
SELECT 'p' || md5("projet"), "projet", "projet", min("langue"), min("pays") FROM "Question" GROUP BY "projet";

-- AlterTable
ALTER TABLE "Question" ADD COLUMN "projetId" TEXT, ADD COLUMN "archive" BOOLEAN NOT NULL DEFAULT false;
UPDATE "Question" SET "projetId" = 'p' || md5("projet");
ALTER TABLE "Question" ALTER COLUMN "projetId" SET NOT NULL;

-- DropIndex
DROP INDEX "Question_projet_texte_langue_pays_key";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "projet";

-- CreateIndex
CREATE UNIQUE INDEX "Question_projetId_texte_langue_pays_key" ON "Question"("projetId", "texte", "langue", "pays");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Propriete" ADD CONSTRAINT "Propriete_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Concurrent" ADD CONSTRAINT "Concurrent_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
