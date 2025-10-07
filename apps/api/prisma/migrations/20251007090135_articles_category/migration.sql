-- AlterTable
ALTER TABLE "public"."Category" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'Group';

-- CreateTable
CREATE TABLE "public"."ArticleCategoryLink" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ArticleCategoryLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArticleCategoryLink_articleId_idx" ON "public"."ArticleCategoryLink"("articleId");

-- CreateIndex
CREATE INDEX "ArticleCategoryLink_categoryId_idx" ON "public"."ArticleCategoryLink"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleCategoryLink_articleId_categoryId_key" ON "public"."ArticleCategoryLink"("articleId", "categoryId");

-- AddForeignKey
ALTER TABLE "public"."ArticleCategoryLink" ADD CONSTRAINT "ArticleCategoryLink_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."ArticleMirror"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleCategoryLink" ADD CONSTRAINT "ArticleCategoryLink_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
