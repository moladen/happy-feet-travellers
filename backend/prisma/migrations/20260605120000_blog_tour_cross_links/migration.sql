-- Cross-link blogs and tours for SEO (topic keys, manual slugs, landing pages)
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "topicKeys" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "relatedBlogSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "landingPageSlug" TEXT;

ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "topicKeys" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "relatedTourSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Blog" ADD COLUMN IF NOT EXISTS "landingPageSlug" TEXT;
