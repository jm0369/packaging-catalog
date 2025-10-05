-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "applications" JSONB,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "formatsAndSpecifications" TEXT,
ADD COLUMN     "keyFigures" JSONB,
ADD COLUMN     "ordering" JSONB,
ADD COLUMN     "orderingNotes" JSONB,
ADD COLUMN     "properties" JSONB;

-- CreateTable
CREATE TABLE "public"."CategoryMediaLink" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CategoryMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryMediaLink_categoryId_idx" ON "public"."CategoryMediaLink"("categoryId");

-- CreateIndex
CREATE INDEX "CategoryMediaLink_mediaId_idx" ON "public"."CategoryMediaLink"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryMediaLink_categoryId_sortOrder_key" ON "public"."CategoryMediaLink"("categoryId", "sortOrder");

-- AddForeignKey
ALTER TABLE "public"."CategoryMediaLink" ADD CONSTRAINT "CategoryMediaLink_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CategoryMediaLink" ADD CONSTRAINT "CategoryMediaLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
