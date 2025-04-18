-- CreateTable
CREATE TABLE `Customer` (
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

    UNIQUE INDEX `Customer_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
