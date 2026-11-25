-- Mesure approfondie : relevés d'une même question posée plusieurs fois de suite.

-- AlterTable
ALTER TABLE "Releve" ADD COLUMN "approfondi" BOOLEAN NOT NULL DEFAULT false;
