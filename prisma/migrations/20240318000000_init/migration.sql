-- CreateTable
CREATE TABLE "Banner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "backgroundImage" TEXT NOT NULL DEFAULT '',
    "primaryCtaLabel" TEXT NOT NULL DEFAULT '立即找課程',
    "primaryCtaHref" TEXT NOT NULL DEFAULT '/courses',
    "secondaryCtaLabel" TEXT NOT NULL DEFAULT '',
    "secondaryCtaHref" TEXT NOT NULL DEFAULT '',
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Banner_active_order_idx" ON "Banner"("active", "order");

-- CreateIndex
CREATE INDEX "Banner_isDefault_idx" ON "Banner"("isDefault");
