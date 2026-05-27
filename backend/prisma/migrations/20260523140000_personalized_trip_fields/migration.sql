-- Personalized trip packages: state, experience category, CTA, SEO
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "state" TEXT;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "packageCategory" TEXT;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "ctaData" JSONB;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "seoTitle" TEXT;
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "seoDescription" TEXT;

CREATE INDEX IF NOT EXISTS "Tour_state_idx" ON "Tour"("state");
CREATE INDEX IF NOT EXISTS "Tour_packageCategory_idx" ON "Tour"("packageCategory");

UPDATE "Tour" SET "status" = 'active' WHERE "category" = 'customized' AND ("status" IS NULL OR "status" = '');
