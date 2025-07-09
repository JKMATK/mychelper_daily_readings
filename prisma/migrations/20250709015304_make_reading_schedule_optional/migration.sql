-- DropForeignKey
ALTER TABLE "churches" DROP CONSTRAINT "churches_reading_schedule_id_fkey";

-- AlterTable
ALTER TABLE "churches" ALTER COLUMN "reading_schedule_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "churches" ADD CONSTRAINT "churches_reading_schedule_id_fkey" FOREIGN KEY ("reading_schedule_id") REFERENCES "daily_readings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
