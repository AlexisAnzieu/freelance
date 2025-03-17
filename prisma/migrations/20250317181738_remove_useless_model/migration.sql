/*
  Warnings:

  - You are about to drop the column `timeTrackingId` on the `TimeTrackingItem` table. All the data in the column will be lost.
  - You are about to drop the `TimeTracking` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `TimeTrackingItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `TimeTrackingItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `TimeTracking` DROP FOREIGN KEY `TimeTracking_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeTrackingItem` DROP FOREIGN KEY `TimeTrackingItem_timeTrackingId_fkey`;

-- DropIndex
DROP INDEX `TimeTrackingItem_timeTrackingId_fkey` ON `TimeTrackingItem`;

-- AlterTable
ALTER TABLE `TimeTrackingItem` DROP COLUMN `timeTrackingId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `TimeTracking`;

-- AddForeignKey
ALTER TABLE `TimeTrackingItem` ADD CONSTRAINT `TimeTrackingItem_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
