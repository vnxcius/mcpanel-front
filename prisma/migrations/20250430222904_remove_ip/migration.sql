/*
  Warnings:

  - You are about to drop the column `ip` on the `Session` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Session_ip_key";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "ip";
