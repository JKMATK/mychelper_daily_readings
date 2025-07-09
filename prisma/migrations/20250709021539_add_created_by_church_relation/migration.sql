-- AddForeignKey
ALTER TABLE "daily_readings" ADD CONSTRAINT "daily_readings_created_by_church_id_fkey" FOREIGN KEY ("created_by_church_id") REFERENCES "churches"("id") ON DELETE SET NULL ON UPDATE CASCADE;
