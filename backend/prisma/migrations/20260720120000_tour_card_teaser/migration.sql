-- Optional homepage / listing card teaser (overrides auto personality copy).
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "cardTeaser" TEXT;
