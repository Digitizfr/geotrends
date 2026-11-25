-- AlterTable
ALTER TABLE "Source" ADD COLUMN     "videoYoutubeId" TEXT;

-- CreateTable
CREATE TABLE "VideoYoutube" (
    "id" TEXT NOT NULL,
    "chaineId" TEXT NOT NULL,
    "chaineNom" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "publieLe" TIMESTAMP(3),
    "vues" INTEGER,
    "majLe" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VideoYoutube_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VideoYoutube_chaineId_idx" ON "VideoYoutube"("chaineId");

-- CreateIndex
CREATE INDEX "Source_videoYoutubeId_idx" ON "Source"("videoYoutubeId");

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_videoYoutubeId_fkey" FOREIGN KEY ("videoYoutubeId") REFERENCES "VideoYoutube"("id") ON DELETE SET NULL ON UPDATE CASCADE;
