/*
  Warnings:

  - You are about to drop the `task_lists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `task_lists`;

-- CreateTable
CREATE TABLE `tasks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `DueDate` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `tasks_created_at_idx`(`created_at` DESC),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
