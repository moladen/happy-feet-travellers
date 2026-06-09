-- Seasonal landing pages CMS

CREATE TABLE "LandingPage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "heroHeading" TEXT,
    "heroSubheading" TEXT,
    "heroBannerImage" TEXT,
    "seasonDates" TEXT,
    "ctaButtonText" TEXT,
    "ctaButtonLink" TEXT,
    "whatsappCtaLink" TEXT,
    "whatsappGroupLink" TEXT,
    "whatsappGroupEnabled" BOOLEAN NOT NULL DEFAULT true,
    "introContent" JSONB,
    "whyVisit" JSONB,
    "bestTimeToVisit" JSONB,
    "destinationHighlights" JSONB,
    "fullMoonCalendar" JSONB,
    "customBlocks" JSONB,
    "formConfig" JSONB,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "ogImage" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LandingPage_slug_key" ON "LandingPage"("slug");
CREATE INDEX "LandingPage_slug_idx" ON "LandingPage"("slug");
CREATE INDEX "LandingPage_status_idx" ON "LandingPage"("status");

CREATE TABLE "LandingPackage" (
    "id" TEXT NOT NULL,
    "landingPageId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "emoji" TEXT,
    "featuredImage" TEXT,
    "shortDescription" TEXT,
    "startingPrice" TEXT,
    "duration" TEXT,
    "highlights" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "viewDetailsUrl" TEXT,
    "detailContent" JSONB,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPackage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "LandingPackage_landingPageId_slug_key" ON "LandingPackage"("landingPageId", "slug");
CREATE INDEX "LandingPackage_landingPageId_sortOrder_idx" ON "LandingPackage"("landingPageId", "sortOrder");

CREATE TABLE "LandingFaq" (
    "id" TEXT NOT NULL,
    "landingPageId" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'travel',
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingFaq_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LandingFaq_landingPageId_sortOrder_idx" ON "LandingFaq"("landingPageId", "sortOrder");

CREATE TABLE "LandingTestimonial" (
    "id" TEXT NOT NULL,
    "landingPageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT,
    "image" TEXT,
    "review" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingTestimonial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "LandingTestimonial_landingPageId_sortOrder_idx" ON "LandingTestimonial"("landingPageId", "sortOrder");

ALTER TABLE "Enquiry" ADD COLUMN "landingPageId" TEXT;

CREATE INDEX "Enquiry_landingPageId_idx" ON "Enquiry"("landingPageId");

ALTER TABLE "LandingPackage" ADD CONSTRAINT "LandingPackage_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LandingFaq" ADD CONSTRAINT "LandingFaq_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LandingTestimonial" ADD CONSTRAINT "LandingTestimonial_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
