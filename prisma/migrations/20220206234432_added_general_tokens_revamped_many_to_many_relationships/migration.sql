/*
  Warnings:

  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "GeneralToken" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "GeneralToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GroupUser" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneralTokenGroupUser" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" INTEGER NOT NULL,
    "generalTokenId" TEXT NOT NULL,
    "dateAssigned" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralTokenGroupUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralToken_title_key" ON "GeneralToken"("title");

-- CreateIndex
CREATE UNIQUE INDEX "GroupUser_userId_groupId_key" ON "GroupUser"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralTokenGroupUser_userId_groupId_generalTokenId_key" ON "GeneralTokenGroupUser"("userId", "groupId", "generalTokenId");

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GroupUser" ADD CONSTRAINT "GroupUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralTokenGroupUser" ADD CONSTRAINT "GeneralTokenGroupUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralTokenGroupUser" ADD CONSTRAINT "GeneralTokenGroupUser_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneralTokenGroupUser" ADD CONSTRAINT "GeneralTokenGroupUser_generalTokenId_fkey" FOREIGN KEY ("generalTokenId") REFERENCES "GeneralToken"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
