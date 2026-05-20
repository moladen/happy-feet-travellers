-- Reserve-seat deposit amount (INR) for group departures
ALTER TABLE "Tour" ADD COLUMN IF NOT EXISTS "bookingDeposit" INTEGER;
