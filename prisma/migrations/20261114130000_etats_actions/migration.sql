-- CreateTable
CREATE TABLE "EtatAction" (
    "projetId" TEXT NOT NULL,
    "cle" TEXT NOT NULL,
    "etat" TEXT NOT NULL,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EtatAction_pkey" PRIMARY KEY ("projetId","cle")
);

-- AddForeignKey
ALTER TABLE "EtatAction" ADD CONSTRAINT "EtatAction_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "Projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
