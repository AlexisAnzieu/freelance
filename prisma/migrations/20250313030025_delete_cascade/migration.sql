-- DropForeignKey
ALTER TABLE `TimeTrackingItem` DROP FOREIGN KEY `TimeTrackingItem_timeTrackingId_fkey`;

-- DropIndex
DROP INDEX `TimeTrackingItem_timeTrackingId_fkey` ON `TimeTrackingItem`;

-- AddForeignKey
ALTER TABLE `TimeTrackingItem` ADD CONSTRAINT `TimeTrackingItem_timeTrackingId_fkey` FOREIGN KEY (`timeTrackingId`) REFERENCES `TimeTracking`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
