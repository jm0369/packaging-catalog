-- AlterTable
ALTER TABLE "public"."ArticleGroupMirror" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "public"."ArticleMirror" ADD COLUMN     "isVisible" BOOLEAN NOT NULL DEFAULT true;
