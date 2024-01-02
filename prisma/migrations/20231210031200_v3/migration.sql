/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Assets` table. All the data in the column will be lost.
  - You are about to drop the column `jsonUrl` on the `Assets` table. All the data in the column will be lost.
  - Added the required column `thumbnailUrl` to the `Assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xSize` to the `Assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ySize` to the `Assets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zSize` to the `Assets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Assets" DROP COLUMN "imageUrl",
DROP COLUMN "jsonUrl",
ADD COLUMN     "thumbnailUrl" TEXT NOT NULL,
ADD COLUMN     "xSize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ySize" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "zSize" DOUBLE PRECISION NOT NULL;
