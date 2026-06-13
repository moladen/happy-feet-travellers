-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN "travellerType" TEXT;
ALTER TABLE "Enquiry" ADD COLUMN "travelInsuranceRequested" BOOLEAN NOT NULL DEFAULT false;
