/*
  Warnings:

  - You are about to drop the column `token` on the `access` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `access` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Access` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Access` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Access_token_key` ON `access`;

-- AlterTable
ALTER TABLE `access` DROP COLUMN `token`,
    DROP COLUMN `userId`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Access_name_key` ON `Access`(`name`);
