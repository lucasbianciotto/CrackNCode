-- AlterTable
-- Supprime d'abord les doublons éventuels (garde le plus grand completed_level pour chaque paire id_user/id_level)
DELETE p1 FROM `position` p1
INNER JOIN `position` p2 
WHERE p1.id < p2.id 
  AND p1.id_user = p2.id_user 
  AND p1.id_level = p2.id_level;

-- AddUniqueConstraint
ALTER TABLE `position` ADD UNIQUE INDEX `position_id_user_id_level_key`(`id_user`, `id_level`);

