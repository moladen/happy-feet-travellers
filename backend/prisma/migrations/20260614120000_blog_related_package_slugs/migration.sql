-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "relatedPackageSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[];
