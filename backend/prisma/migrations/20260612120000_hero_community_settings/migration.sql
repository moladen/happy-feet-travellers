-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroCommunityQuote" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroCommunityBannerUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "heroCommunityAvatars" TEXT;
