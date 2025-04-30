/*
  Warnings:

  - A unique constraint covering the columns `[ip]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_ip_key" ON "Session"("ip");
