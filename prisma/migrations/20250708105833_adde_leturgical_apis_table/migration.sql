/*
  Warnings:

  - You are about to drop the column `media_url` on the `daily_reading_entries` table. All the data in the column will be lost.
  - Changed the type of `type` on the `daily_reading_entries` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('scripture', 'text');

-- AlterTable
ALTER TABLE "daily_reading_entries" DROP COLUMN "media_url",
DROP COLUMN "type",
ADD COLUMN     "type" "ContentType" NOT NULL;

-- CreateTable
CREATE TABLE "liturgical_reading_apis" (
    "id" UUID NOT NULL,
    "reading_plan_id" UUID NOT NULL,
    "api_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "liturgical_reading_apis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "liturgical_reading_apis_reading_plan_id_key" ON "liturgical_reading_apis"("reading_plan_id");

-- AddForeignKey
ALTER TABLE "liturgical_reading_apis" ADD CONSTRAINT "liturgical_reading_apis_reading_plan_id_fkey" FOREIGN KEY ("reading_plan_id") REFERENCES "daily_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
