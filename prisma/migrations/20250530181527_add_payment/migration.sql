-- AlterTable
ALTER TABLE `Company` ADD COLUMN `paymentMethods` TEXT NULL;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `selectedPaymentMethod` VARCHAR(191) NULL;
