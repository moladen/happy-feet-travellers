-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "termsContent" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "privacyContent" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "cancellationPolicyContent" TEXT;
ALTER TABLE "SiteSettings" ADD COLUMN IF NOT EXISTS "policiesLastUpdated" TEXT;
