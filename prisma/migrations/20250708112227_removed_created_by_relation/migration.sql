-- DropForeignKey
ALTER TABLE "daily_readings" DROP CONSTRAINT "daily_readings_created_by_church_id_fkey";

-- AlterTable
ALTER TABLE "daily_readings" ALTER COLUMN "created_by_church_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "daily_readings" ADD CONSTRAINT "daily_readings_created_by_church_id_fkey" FOREIGN KEY ("created_by_church_id") REFERENCES "churches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
