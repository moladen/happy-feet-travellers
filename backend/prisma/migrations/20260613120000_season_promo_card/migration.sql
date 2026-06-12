-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoActive" BOOLEAN DEFAULT true;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoBadge" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoEyebrow" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoTitle" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoSubtitle" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoDescription" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoImageUrl" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoTags" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoPrimaryCtaLabel" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoPrimaryCtaHref" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoSecondaryCtaLabel" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "seasonPromoSecondaryCtaHref" TEXT;
