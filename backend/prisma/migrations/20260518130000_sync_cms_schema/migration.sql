-- Align database with current Prisma schema (columns added in code but never migrated).

-- AlterTable
ALTER TABLE "Blog"
ADD COLUMN "authorInstagram" TEXT,
ADD COLUMN "category" TEXT,
ADD COLUMN "excerpt" TEXT,
ADD COLUMN "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Blog" ALTER COLUMN "content" TYPE JSONB USING (
  CASE
    WHEN "content" IS NULL OR btrim("content") = '' THEN '{"type":"doc","content":[]}'::jsonb
    WHEN btrim("content") ~ '^[\[{]' THEN "content"::jsonb
    ELSE jsonb_build_object(
      'type',
      'doc',
      'content',
      jsonb_build_array(
        jsonb_build_object(
          'type',
          'paragraph',
          'content',
          jsonb_build_array(jsonb_build_object('type', 'text', 'text', "content"))
        )
      )
    )
  END
);

ALTER TABLE "Blog" ALTER COLUMN "content" SET NOT NULL;

-- AlterTable
ALTER TABLE "Enquiry"
ADD COLUMN "source" TEXT,
ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new',
ADD COLUMN "subject" TEXT;

-- AlterTable
ALTER TABLE "Testimonial" ADD COLUMN "city" TEXT;

-- AlterTable
ALTER TABLE "Tour"
ADD COLUMN "bankDetails" TEXT,
ADD COLUMN "coverImage" TEXT,
ADD COLUMN "dateLabel" TEXT,
ADD COLUMN "durationLabel" TEXT,
ADD COLUMN "meals" TEXT,
ADD COLUMN "offers" TEXT,
ADD COLUMN "pickupPoints" JSONB,
ADD COLUMN "rating" DOUBLE PRECISION,
ADD COLUMN "reviewsCount" INTEGER,
ADD COLUMN "stayType" TEXT,
ADD COLUMN "suitableFor" TEXT,
ADD COLUMN "supplements" JSONB,
ADD COLUMN "transport" TEXT,
ADD COLUMN "urgency" TEXT;

ALTER TABLE "Tour" ALTER COLUMN "terms" TYPE JSONB USING (
  CASE
    WHEN "terms" IS NULL OR btrim("terms") = '' THEN NULL
    WHEN btrim("terms") ~ '^[\[{]' THEN "terms"::jsonb
    ELSE NULL
  END
);

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");

-- CreateIndex
CREATE INDEX "Enquiry_status_idx" ON "Enquiry"("status");

-- CreateIndex
CREATE INDEX "Tour_subCategory_idx" ON "Tour"("subCategory");

-- CreateIndex
CREATE INDEX "Tour_startDate_idx" ON "Tour"("startDate");
