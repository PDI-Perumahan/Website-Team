/*
  Warnings:

  - You are about to drop the column `fileUrl` on the `Assets` table. All the data in the column will be lost.
  - Added the required column `jsonUrl` to the `Assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelUrl` to the `Assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assets" DROP COLUMN "fileUrl",
ADD COLUMN     "jsonUrl" TEXT NOT NULL,
ADD COLUMN     "modelUrl" TEXT NOT NULL;
