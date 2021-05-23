/*
  Warnings:

  - The primary key for the `PendingUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pendingUserId` on the `PendingUser` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `PendingUser` table. All the data in the column will be lost.
  - You are about to drop the column `confirmationCode` on the `PendingUser` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.
  - The primary key for the `Video` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `videoId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Video` table. All the data in the column will be lost.
  - You are about to drop the column `bucketFilePath` on the `Video` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `PendingUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `PendingUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confirmation_code` to the `PendingUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Video` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bucket_file_path` to the `Video` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PendingUser" DROP CONSTRAINT "PendingUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_userId_fkey";

-- DropIndex
DROP INDEX "PendingUser_userId_unique";

-- AlterTable
ALTER TABLE "PendingUser" DROP CONSTRAINT "PendingUser_pkey",
DROP COLUMN "pendingUserId",
DROP COLUMN "userId",
DROP COLUMN "confirmationCode",
ADD COLUMN     "pending_user_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "confirmation_code" TEXT NOT NULL,
ADD PRIMARY KEY ("pending_user_id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "userId",
ADD COLUMN     "user_id" SERIAL NOT NULL,
ADD PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "Video" DROP CONSTRAINT "Video_pkey",
DROP COLUMN "videoId",
DROP COLUMN "userId",
DROP COLUMN "bucketFilePath",
ADD COLUMN     "video_id" SERIAL NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD COLUMN     "bucket_file_path" TEXT NOT NULL,
ADD PRIMARY KEY ("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_user_id_unique" ON "PendingUser"("user_id");

-- AddForeignKey
ALTER TABLE "PendingUser" ADD FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
