-- Pages suivies : une page de la marque et les questions auxquelles elle devrait répondre.
CREATE TABLE "PageSuivie" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projetId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "titre" TEXT,
    "questions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "luLe" TIMESTAMP(3),
    "auteur" TEXT,

    CONSTRAINT "PageSuivie_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PageSuivie_projetId_cle_key" ON "PageSuivie"("projetId", "cle");

ALTER TABLE "PageSuivie" ADD CONSTRAINT "PageSuivie_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
