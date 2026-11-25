-- Relevés automatiques par projet, et lecture automatique des réponses.

-- AlterTable
ALTER TABLE "Projet" ADD COLUMN "releveAuto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "claudeAuto" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "dernierAutoInterface" TIMESTAMP(3),
ADD COLUMN "dernierAutoClaude" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Releve" ADD COLUMN "analyseLe" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Mention" ADD COLUMN "ton" TEXT;
