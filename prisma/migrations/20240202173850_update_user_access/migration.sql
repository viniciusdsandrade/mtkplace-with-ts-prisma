/*
  Warnings:

  - You are about to drop the column `accessId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_accessId_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `accessId`;

-- CreateTable
CREATE TABLE `UserAccess` (
    `id` VARCHAR(191) NOT NULL,
    `accessId` VARCHAR(191) NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserAccess` ADD CONSTRAINT `UserAccess_accessId_fkey` FOREIGN KEY (`accessId`) REFERENCES `Access`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserAccess` ADD CONSTRAINT `UserAccess_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
