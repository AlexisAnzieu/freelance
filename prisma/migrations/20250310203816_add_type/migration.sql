/*
  Warnings:

  - You are about to drop the column `customerId` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Customer` DROP FOREIGN KEY `Customer_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_customerId_fkey`;

-- DropIndex
DROP INDEX `Invoice_customerId_fkey` ON `Invoice`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `customerId`,
    ADD COLUMN `companyId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `Customer`;

-- CreateTable
CREATE TABLE `Company` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `contactName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `postalCode` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `taxId` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `teamId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Company_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CompanyType` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CompanyToCompanyType` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CompanyToCompanyType_AB_unique`(`A`, `B`),
    INDEX `_CompanyToCompanyType_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToCompanyType` ADD CONSTRAINT `_CompanyToCompanyType_A_fkey` FOREIGN KEY (`A`) REFERENCES `Company`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CompanyToCompanyType` ADD CONSTRAINT `_CompanyToCompanyType_B_fkey` FOREIGN KEY (`B`) REFERENCES `CompanyType`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
