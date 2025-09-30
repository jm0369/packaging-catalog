-- CreateTable
CREATE TABLE "ArticleGroupMirror" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleGroupMirror_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleMirror" (
    "id" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "articleGroupId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "ean" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "attributes" JSONB,
    "uom" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleMirror_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "sizeBytes" INTEGER,
    "checksum" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "variants" JSONB,

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArticleGroupMediaLink" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "mediaId" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ArticleGroupMediaLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "success" BOOLEAN,
    "itemsRead" INTEGER NOT NULL DEFAULT 0,
    "itemsUpserted" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,

    CONSTRAINT "SyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArticleGroupMirror_externalId_key" ON "ArticleGroupMirror"("externalId");

-- CreateIndex
CREATE INDEX "ArticleGroupMirror_externalId_idx" ON "ArticleGroupMirror"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleMirror_externalId_key" ON "ArticleMirror"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleMirror_sku_key" ON "ArticleMirror"("sku");

-- CreateIndex
CREATE INDEX "ArticleMirror_articleGroupId_idx" ON "ArticleMirror"("articleGroupId");

-- CreateIndex
CREATE INDEX "ArticleMirror_externalId_idx" ON "ArticleMirror"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "MediaAsset_key_key" ON "MediaAsset"("key");

-- CreateIndex
CREATE UNIQUE INDEX "ArticleGroupMediaLink_groupId_mediaId_key" ON "ArticleGroupMediaLink"("groupId", "mediaId");

-- AddForeignKey
ALTER TABLE "ArticleMirror" ADD CONSTRAINT "ArticleMirror_articleGroupId_fkey" FOREIGN KEY ("articleGroupId") REFERENCES "ArticleGroupMirror"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleGroupMediaLink" ADD CONSTRAINT "ArticleGroupMediaLink_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ArticleGroupMirror"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleGroupMediaLink" ADD CONSTRAINT "ArticleGroupMediaLink_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "MediaAsset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
