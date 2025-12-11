/*
  Warnings:

  - Made the column `shadowHours` on table `TimeTrackingItem` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `TimeTrackingItem` MODIFY `shadowHours` DOUBLE NOT NULL;
