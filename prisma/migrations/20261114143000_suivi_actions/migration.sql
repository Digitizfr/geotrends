-- Suivi des actions : note libre, date du « fait », copie de la ligne, journal des prises de contact.

-- AlterTable
ALTER TABLE "EtatAction" ADD COLUMN "note" TEXT,
ADD COLUMN "faitLe" TIMESTAMP(3),
ADD COLUMN "titre" TEXT,
ADD COLUMN "famille" TEXT,
ADD COLUMN "lien" TEXT,
ADD COLUMN "questionIds" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Les lignes déjà « faites » gardent leur date : celle de leur dernier changement.
UPDATE "EtatAction" SET "faitLe" = "majLe" WHERE "etat" = 'fait' AND "faitLe" IS NULL;

-- CreateTable
CREATE TABLE "Demarche" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projetId" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "faiteLe" TIMESTAMP(3) NOT NULL,
    "contact" TEXT,
    "reponse" TEXT NOT NULL DEFAULT 'attente',
    "note" TEXT,

    CONSTRAINT "Demarche_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Demarche_projetId_cle_idx" ON "Demarche"("projetId", "cle");

-- AddForeignKey
ALTER TABLE "Demarche" ADD CONSTRAINT "Demarche_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
