-- Upcoming departures: destination, tags, group size, status, featured, recurring series
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "destination" TEXT;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "groupSize" TEXT;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active';
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "featured" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "seriesSlug" TEXT;

CREATE INDEX IF NOT EXISTS "Tour_status_idx" ON "Tour"("status");
CREATE INDEX IF NOT EXISTS "Tour_featured_idx" ON "Tour"("featured");
CREATE INDEX IF NOT EXISTS "Tour_destination_idx" ON "Tour"("destination");
CREATE INDEX IF NOT EXISTS "Tour_seriesSlug_idx" ON "Tour"("seriesSlug");

-- Existing upcoming tours default to active
UPDATE "Tour" SET "status" = 'active' WHERE "category" = 'upcoming' AND ("status" IS NULL OR "status" = '');
