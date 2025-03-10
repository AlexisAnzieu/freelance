/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CompanyType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CompanyType_name_key` ON `CompanyType`(`name`);
