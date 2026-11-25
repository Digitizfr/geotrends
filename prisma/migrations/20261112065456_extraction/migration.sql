-- CreateTable
CREATE TABLE "Mention" (
    "id" TEXT NOT NULL,
    "releveId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "categorie" TEXT,
    "rang" INTEGER NOT NULL,
    "origine" TEXT NOT NULL,

    CONSTRAINT "Mention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recherche" (
    "id" TEXT NOT NULL,
    "releveId" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "Recherche_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultatGoogle" (
    "id" TEXT NOT NULL,
    "releveId" TEXT NOT NULL,
    "rang" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "titre" TEXT,

    CONSTRAINT "ResultatGoogle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAssociee" (
    "id" TEXT NOT NULL,
    "releveId" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "position" INTEGER NOT NULL,

    CONSTRAINT "QuestionAssociee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Mention_releveId_idx" ON "Mention"("releveId");

-- CreateIndex
CREATE INDEX "Mention_nom_idx" ON "Mention"("nom");

-- CreateIndex
CREATE INDEX "Recherche_releveId_idx" ON "Recherche"("releveId");

-- CreateIndex
CREATE INDEX "ResultatGoogle_releveId_idx" ON "ResultatGoogle"("releveId");

-- CreateIndex
CREATE INDEX "ResultatGoogle_domaine_idx" ON "ResultatGoogle"("domaine");

-- CreateIndex
CREATE INDEX "QuestionAssociee_releveId_idx" ON "QuestionAssociee"("releveId");

-- AddForeignKey
ALTER TABLE "Mention" ADD CONSTRAINT "Mention_releveId_fkey" FOREIGN KEY ("releveId") REFERENCES "Releve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recherche" ADD CONSTRAINT "Recherche_releveId_fkey" FOREIGN KEY ("releveId") REFERENCES "Releve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultatGoogle" ADD CONSTRAINT "ResultatGoogle_releveId_fkey" FOREIGN KEY ("releveId") REFERENCES "Releve"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAssociee" ADD CONSTRAINT "QuestionAssociee_releveId_fkey" FOREIGN KEY ("releveId") REFERENCES "Releve"("id") ON DELETE CASCADE ON UPDATE CASCADE;
