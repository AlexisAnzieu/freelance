/*
  Warnings:

  - You are about to drop the column `companyId` on the `Invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_companyId_fkey`;

-- DropIndex
DROP INDEX `Invoice_companyId_fkey` ON `Invoice`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `companyId`;

-- CreateTable
CREATE TABLE `_CompanyToInvoice` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CompanyToInvoice_AB_unique`(`A`, `B`),
    INDEX `_CompanyToInvoice_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CompanyToInvoice` ADD CONSTRAINT `_CompanyToInvoice_A_fkey` FOREIGN KEY (`A`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToInvoice` ADD CONSTRAINT `_CompanyToInvoice_B_fkey` FOREIGN KEY (`B`) REFERENCES `Invoice`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
