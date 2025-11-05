-- CreateTable
CREATE TABLE `activity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_user` VARCHAR(191) NOT NULL,
    `language_id` VARCHAR(191) NOT NULL,
    `level_title` VARCHAR(255) NOT NULL,
    `xp_earned` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `activity_id_user_idx`(`id_user`),
    INDEX `activity_created_at_idx`(`created_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `activity` ADD CONSTRAINT `activity_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `user`(`id_google`) ON DELETE CASCADE ON UPDATE CASCADE;

