-- Faits vérifiés sur la marque, et réponses des IA qui les contredisent.

-- AlterTable
ALTER TABLE "Releve" ADD COLUMN "faitsLe" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Fait" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projetId" TEXT NOT NULL,
    "texte" TEXT NOT NULL,

    CONSTRAINT "Fait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contradiction" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "releveId" TEXT NOT NULL,
    "faitId" TEXT NOT NULL,
    "phrase" TEXT NOT NULL,
    "explication" TEXT,
    "sourceUrl" TEXT,
    "ecartee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contradiction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Fait_projetId_idx" ON "Fait"("projetId");

-- CreateIndex
CREATE INDEX "Contradiction_releveId_idx" ON "Contradiction"("releveId");

-- CreateIndex
CREATE INDEX "Contradiction_faitId_idx" ON "Contradiction"("faitId");

-- AddForeignKey
ALTER TABLE "Fait" ADD CONSTRAINT "Fait_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contradiction" ADD CONSTRAINT "Contradiction_releveId_fkey" FOREIGN KEY ("releveId") REFERENCES "Releve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contradiction" ADD CONSTRAINT "Contradiction_faitId_fkey" FOREIGN KEY ("faitId") REFERENCES "Fait"("id") ON DELETE CASCADE ON UPDATE CASCADE;
