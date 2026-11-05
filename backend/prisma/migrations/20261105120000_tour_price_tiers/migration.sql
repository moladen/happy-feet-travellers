-- Group-size pricing tiers, e.g. [{ "label": "2 People", "price": "10000" }]
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "priceTiers" JSONB;
