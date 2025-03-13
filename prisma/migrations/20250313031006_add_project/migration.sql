/*
  Warnings:

  - You are about to drop the column `contractorId` on the `TimeTracking` table. All the data in the column will be lost.
  - You are about to drop the column `teamId` on the `TimeTracking` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `TimeTracking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `InvoiceItem` DROP FOREIGN KEY `InvoiceItem_invoiceId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeTracking` DROP FOREIGN KEY `TimeTracking_contractorId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeTracking` DROP FOREIGN KEY `TimeTracking_teamId_fkey`;

-- DropIndex
DROP INDEX `InvoiceItem_invoiceId_fkey` ON `InvoiceItem`;

-- DropIndex
DROP INDEX `TimeTracking_contractorId_fkey` ON `TimeTracking`;

-- DropIndex
DROP INDEX `TimeTracking_teamId_fkey` ON `TimeTracking`;

-- AlterTable
ALTER TABLE `TimeTracking` DROP COLUMN `contractorId`,
    DROP COLUMN `teamId`,
    ADD COLUMN `projectId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Project` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `teamId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CompanyToProject` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CompanyToProject_AB_unique`(`A`, `B`),
    INDEX `_CompanyToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `InvoiceItem` ADD CONSTRAINT `InvoiceItem_invoiceId_fkey` FOREIGN KEY (`invoiceId`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTracking` ADD CONSTRAINT `TimeTracking_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToProject` ADD CONSTRAINT `_CompanyToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToProject` ADD CONSTRAINT `_CompanyToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
