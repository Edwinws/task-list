/*
  Warnings:

  - You are about to drop the column `Description` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `DueDate` on the `tasks` table. All the data in the column will be lost.
  - You are about to drop the column `Name` on the `tasks` table. All the data in the column will be lost.
  - Added the required column `description` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `due_date` to the `tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasks`
    DROP COLUMN `Name`,
    DROP COLUMN `Description`,
    DROP COLUMN `DueDate`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL AFTER `id`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL AFTER `name`,
    ADD COLUMN `due_date` DATETIME(3) NOT NULL AFTER `description`;
