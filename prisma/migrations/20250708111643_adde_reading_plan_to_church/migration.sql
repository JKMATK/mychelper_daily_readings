/*
  Warnings:

  - Added the required column `reading_schedule_id` to the `churches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "churches" ADD COLUMN     "reading_schedule_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "churches" ADD CONSTRAINT "churches_reading_schedule_id_fkey" FOREIGN KEY ("reading_schedule_id") REFERENCES "daily_readings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
