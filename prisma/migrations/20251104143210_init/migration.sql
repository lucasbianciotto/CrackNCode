-- CreateTable
CREATE TABLE `USER` (
    `id_google` VARCHAR(191) NOT NULL,
    `nom` VARCHAR(191) NOT NULL,
    `prenom` VARCHAR(191) NOT NULL,
    `xp_global` INTEGER NOT NULL,

    PRIMARY KEY (`id_google`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PERSONALISATION` (
    `id_user` VARCHAR(191) NOT NULL,
    `accessories` VARCHAR(191) NULL,
    `hat_colors` VARCHAR(191) NULL,
    `hair_colors` VARCHAR(191) NULL,
    `facial_hair_types` VARCHAR(191) NULL,
    `facial_hair_colors` VARCHAR(191) NULL,
    `clothes` VARCHAR(191) NULL,
    `clothes_colors` VARCHAR(191) NULL,
    `graphics` VARCHAR(191) NULL,
    `eyes` VARCHAR(191) NULL,
    `eyebrows` VARCHAR(191) NULL,
    `skin_colors` VARCHAR(191) NULL,

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `POSITION` (
    `id_user` VARCHAR(191) NOT NULL,
    `id_dernier_lvl` INTEGER NOT NULL,

    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PERSONALISATION` ADD CONSTRAINT `PERSONALISATION_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `USER`(`id_google`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `POSITION` ADD CONSTRAINT `POSITION_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `USER`(`id_google`) ON DELETE CASCADE ON UPDATE CASCADE;
