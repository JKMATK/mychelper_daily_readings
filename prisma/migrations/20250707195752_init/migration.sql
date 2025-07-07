-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('liturgical', 'custom');

-- CreateTable
CREATE TABLE "churches" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "churches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_readings" (
    "id" UUID NOT NULL,
    "created_by_church_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "plan_type" "PlanType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_readings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_reading_entries" (
    "id" UUID NOT NULL,
    "reading_plan_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "date" DATE NOT NULL,
    "type" TEXT NOT NULL,
    "references" TEXT[],
    "content" TEXT,
    "media_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_reading_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_reading_entries_reading_plan_id_date_sort_order_key" ON "daily_reading_entries"("reading_plan_id", "date", "sort_order");

-- AddForeignKey
ALTER TABLE "daily_readings" ADD CONSTRAINT "daily_readings_created_by_church_id_fkey" FOREIGN KEY ("created_by_church_id") REFERENCES "churches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_reading_entries" ADD CONSTRAINT "daily_reading_entries_reading_plan_id_fkey" FOREIGN KEY ("reading_plan_id") REFERENCES "daily_readings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
