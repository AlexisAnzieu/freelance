/*
  Warnings:

  - You are about to alter the column `quantity` on the `InvoiceItem` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `InvoiceItem` MODIFY `quantity` DOUBLE NOT NULL;
