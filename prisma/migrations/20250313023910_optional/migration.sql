-- DropForeignKey
ALTER TABLE `TimeTrackingItem` DROP FOREIGN KEY `TimeTrackingItem_invoiceItemId_fkey`;

-- AlterTable
ALTER TABLE `TimeTrackingItem` MODIFY `invoiceItemId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TimeTrackingItem` ADD CONSTRAINT `TimeTrackingItem_invoiceItemId_fkey` FOREIGN KEY (`invoiceItemId`) REFERENCES `InvoiceItem`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
