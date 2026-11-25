-- Pages de partage : un lien privé, sans compte, sur une série de questions d'un projet.
CREATE TABLE "Partage" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "jeton" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "destinataire" TEXT,
    "questions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "moteurs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "langue" TEXT NOT NULL DEFAULT 'fr',
    "reponses" BOOLEAN NOT NULL DEFAULT true,
    "concurrents" BOOLEAN NOT NULL DEFAULT true,
    "expireLe" TIMESTAMP(3),
    "coupeLe" TIMESTAMP(3),
    "auteur" TEXT,
    "vues" INTEGER NOT NULL DEFAULT 0,
    "derniereVue" TIMESTAMP(3),

    CONSTRAINT "Partage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Partage_jeton_key" ON "Partage"("jeton");
CREATE INDEX "Partage_projetId_idx" ON "Partage"("projetId");

ALTER TABLE "Partage" ADD CONSTRAINT "Partage_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
