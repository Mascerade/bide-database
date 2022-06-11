-- CreateTable
CREATE TABLE "JoinGroupRequest" (
    "id" SERIAL NOT NULL,
    "requestDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userRequestingId" INTEGER NOT NULL,
    "groupId" INTEGER NOT NULL,

    CONSTRAINT "JoinGroupRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JoinGroupRequest_userRequestingId_groupId_key" ON "JoinGroupRequest"("userRequestingId", "groupId");

-- AddForeignKey
ALTER TABLE "JoinGroupRequest" ADD CONSTRAINT "JoinGroupRequest_userRequestingId_fkey" FOREIGN KEY ("userRequestingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JoinGroupRequest" ADD CONSTRAINT "JoinGroupRequest_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
