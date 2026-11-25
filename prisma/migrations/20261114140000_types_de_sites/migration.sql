-- Type de chaque site cité, classé une fois par le petit modèle et gardé.

-- CreateTable
CREATE TABLE "Domaine" (
    "domaine" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "marque" TEXT,
    "origine" TEXT NOT NULL DEFAULT 'modele',
    "modele" TEXT,
    "classeLe" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Domaine_pkey" PRIMARY KEY ("domaine")
);
