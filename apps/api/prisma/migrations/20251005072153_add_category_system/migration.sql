-- CreateTable
CREATE TABLE "public"."Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GroupCategoryLink" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "GroupCategoryLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "public"."Category"("name");

-- CreateIndex
CREATE INDEX "GroupCategoryLink_groupId_idx" ON "public"."GroupCategoryLink"("groupId");

-- CreateIndex
CREATE INDEX "GroupCategoryLink_categoryId_idx" ON "public"."GroupCategoryLink"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "GroupCategoryLink_groupId_categoryId_key" ON "public"."GroupCategoryLink"("groupId", "categoryId");

-- AddForeignKey
ALTER TABLE "public"."GroupCategoryLink" ADD CONSTRAINT "GroupCategoryLink_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."ArticleGroupMirror"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupCategoryLink" ADD CONSTRAINT "GroupCategoryLink_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
