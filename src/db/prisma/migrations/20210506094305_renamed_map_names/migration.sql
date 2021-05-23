/*
  Warnings:

  - You are about to drop the `pendingUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "pendingUser" DROP CONSTRAINT "pendingUser_user_id_fkey";

-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_user_id_fkey";

-- DropTable
DROP TABLE "pendingUser";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "video";

-- CreateTable
CREATE TABLE "videos" (
    "video_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "bucket_file_path" TEXT NOT NULL,

    PRIMARY KEY ("video_id")
);

-- CreateTable
CREATE TABLE "users" (
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
CREATE TABLE "pending_users" (
    "pending_user_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "confirmation_code" TEXT NOT NULL,

    PRIMARY KEY ("pending_user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users.username_unique" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users.email_unique" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pending_users_user_id_unique" ON "pending_users"("user_id");

-- AddForeignKey
ALTER TABLE "videos" ADD FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pending_users" ADD FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
