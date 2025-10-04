-- CreateTable
CREATE TABLE "public"."ArticleGroupMirror" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentExternalId" TEXT,
    "sortOrder" INTEGER,

    CONSTRAINT "ArticleGroupMirror_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleMirror" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "articleGroupId" TEXT NOT NULL,
    "sku" TEXT,
    "ean" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "uom" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "attributes" JSONB,

    CONSTRAINT "ArticleMirror_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MediaAsset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER,
    "checksum" TEXT,
    "variants" JSONB,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupMediaLink" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GroupMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleMediaLink" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleGroupMirror_externalId_key" ON "public"."ArticleGroupMirror"("externalId");

-- CreateIndex
CREATE INDEX "ArticleGroupMirror_externalId_idx" ON "public"."ArticleGroupMirror"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleMirror_externalId_key" ON "public"."ArticleMirror"("externalId");

-- CreateIndex
CREATE INDEX "ArticleMirror_articleGroupId_idx" ON "public"."ArticleMirror"("articleGroupId");

-- CreateIndex
CREATE INDEX "GroupMediaLink_groupId_idx" ON "public"."GroupMediaLink"("groupId");

-- CreateIndex
CREATE INDEX "GroupMediaLink_mediaId_idx" ON "public"."GroupMediaLink"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupMediaLink_groupId_sortOrder_key" ON "public"."GroupMediaLink"("groupId", "sortOrder");

-- CreateIndex
CREATE INDEX "ArticleMediaLink_articleId_idx" ON "public"."ArticleMediaLink"("articleId");

-- CreateIndex
CREATE INDEX "ArticleMediaLink_mediaId_idx" ON "public"."ArticleMediaLink"("mediaId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleMediaLink_articleId_sortOrder_key" ON "public"."ArticleMediaLink"("articleId", "sortOrder");

-- AddForeignKey
ALTER TABLE "public"."ArticleMirror" ADD CONSTRAINT "ArticleMirror_articleGroupId_fkey" FOREIGN KEY ("articleGroupId") REFERENCES "public"."ArticleGroupMirror"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMediaLink" ADD CONSTRAINT "GroupMediaLink_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ArticleGroupMirror"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMediaLink" ADD CONSTRAINT "GroupMediaLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleMediaLink" ADD CONSTRAINT "ArticleMediaLink_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."ArticleMirror"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleMediaLink" ADD CONSTRAINT "ArticleMediaLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."MediaAsset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
