-- CreateEnum
CREATE TYPE "Role" AS ENUM ('editor', 'admin');

-- CreateTable
CREATE TABLE "Video" (
    "videoId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bucketFilePath" TEXT NOT NULL,

    PRIMARY KEY ("videoId")
);

-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "role" "Role" NOT NULL DEFAULT E'editor',

    PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "PendingUser" (
    "pendingUserId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "confirmationCode" TEXT NOT NULL,

    PRIMARY KEY ("pendingUserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User.username_unique" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PendingUser_userId_unique" ON "PendingUser"("userId");

-- AddForeignKey
ALTER TABLE "Video" ADD FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingUser" ADD FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
