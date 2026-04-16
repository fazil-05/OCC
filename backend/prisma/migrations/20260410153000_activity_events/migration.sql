-- CreateTable
CREATE TABLE "activity_events" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT,
    "actorName" TEXT NOT NULL,
    "actorRole" TEXT,
    "eventType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "summary" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_events_createdAt_idx" ON "activity_events"("createdAt");

-- CreateIndex
CREATE INDEX "activity_events_category_createdAt_idx" ON "activity_events"("category", "createdAt");

-- CreateIndex
CREATE INDEX "activity_events_actorUserId_createdAt_idx" ON "activity_events"("actorUserId", "createdAt");

