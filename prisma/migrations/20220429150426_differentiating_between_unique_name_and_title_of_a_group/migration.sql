/*
  Warnings:

  - Added the required column `title` to the `Group` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "title" VARCHAR(100) NOT NULL;
