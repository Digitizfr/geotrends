-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "texte" TEXT NOT NULL,
    "langue" TEXT NOT NULL,
    "pays" TEXT NOT NULL,
    "projet" TEXT NOT NULL,
    "ordre" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Releve" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "questionId" TEXT NOT NULL,
    "moteur" TEXT NOT NULL,
    "methode" TEXT NOT NULL,
    "fournisseur" TEXT NOT NULL,
    "tacheId" TEXT,
    "statut" TEXT NOT NULL,
    "releveLe" TIMESTAMP(3),
    "recuLe" TIMESTAMP(3),
    "modele" TEXT,
    "texte" TEXT,
    "urlControle" TEXT,
    "erreur" TEXT,
    "brut" JSONB,
    "coutUsd" DECIMAL(12,6) NOT NULL DEFAULT 0,

    CONSTRAINT "Releve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "releveId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "titre" TEXT,
    "extrait" TEXT,
    "role" TEXT NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Question_projet_texte_langue_pays_key" ON "Question"("projet", "texte", "langue", "pays");

-- CreateIndex
CREATE INDEX "Releve_questionId_moteur_createdAt_idx" ON "Releve"("questionId", "moteur", "createdAt");

-- CreateIndex
CREATE INDEX "Releve_statut_idx" ON "Releve"("statut");

-- CreateIndex
CREATE UNIQUE INDEX "Releve_fournisseur_tacheId_key" ON "Releve"("fournisseur", "tacheId");

-- CreateIndex
CREATE INDEX "Source_releveId_idx" ON "Source"("releveId");

-- CreateIndex
CREATE INDEX "Source_domaine_idx" ON "Source"("domaine");

-- AddForeignKey
ALTER TABLE "Releve" ADD CONSTRAINT "Releve_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_releveId_fkey" FOREIGN KEY ("releveId") REFERENCES "Releve"("id") ON DELETE CASCADE ON UPDATE CASCADE;
