/*
  Warnings:

  - You are about to drop the `PendingUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PendingUser" DROP CONSTRAINT "PendingUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_user_id_fkey";

-- DropTable
DROP TABLE "PendingUser";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Video";

-- CreateTable
CREATE TABLE "video" (
    "video_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bucket_file_path" TEXT NOT NULL,

    PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'editor',

    PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "pendingUser" (
    "pending_user_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "confirmation_code" TEXT NOT NULL,

    PRIMARY KEY ("pending_user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user.username_unique" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pendingUser_user_id_unique" ON "pendingUser"("user_id");

-- AddForeignKey
ALTER TABLE "video" ADD FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pendingUser" ADD FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
