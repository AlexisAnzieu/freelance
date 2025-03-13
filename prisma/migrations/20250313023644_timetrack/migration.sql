-- CreateTable
CREATE TABLE `TimeTracking` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `contractorId` VARCHAR(191) NOT NULL,
    `teamId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `month` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeTrackingItem` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `hours` DOUBLE NOT NULL,
    `hourlyRate` DOUBLE NOT NULL,
    `timeTrackingId` VARCHAR(191) NOT NULL,
    `invoiceItemId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TimeTrackingItem_invoiceItemId_key`(`invoiceItemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TimeTracking` ADD CONSTRAINT `TimeTracking_contractorId_fkey` FOREIGN KEY (`contractorId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTracking` ADD CONSTRAINT `TimeTracking_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTrackingItem` ADD CONSTRAINT `TimeTrackingItem_timeTrackingId_fkey` FOREIGN KEY (`timeTrackingId`) REFERENCES `TimeTracking`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeTrackingItem` ADD CONSTRAINT `TimeTrackingItem_invoiceItemId_fkey` FOREIGN KEY (`invoiceItemId`) REFERENCES `InvoiceItem`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
