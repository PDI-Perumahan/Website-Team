/*
  Warnings:

  - The primary key for the `Assets` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Assets" DROP CONSTRAINT "Assets_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Assets_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Assets_id_seq";
