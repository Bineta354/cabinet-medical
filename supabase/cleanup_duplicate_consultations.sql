-- D'abord supprimer les références dans lignes_facture
DELETE FROM lignes_facture
WHERE acte_consultation_id IN (
  SELECT id FROM actes_consultation
  WHERE type_acte_id IN (356, 357, 358, 359, 360, 361, 362, 363, 364, 365)
);

-- Ensuite supprimer les références dans actes_consultation
DELETE FROM actes_consultation
WHERE type_acte_id IN (356, 357, 358, 359, 360, 361, 362, 363, 364, 365);

-- Enfin supprimer les doublons de CONSULTATION (IDs 356-365)
DELETE FROM types_actes
WHERE id IN (356, 357, 358, 359, 360, 361, 362, 363, 364, 365);

-- Garder seulement la Consultation originale (ID 266) et Consultation médicale (IDs 364-365)
-- Mettre à jour l'ordre d'affichage pour les actes dentaires
UPDATE types_actes
SET ordre_affichage = 1
WHERE id = 266; -- Consultation standard

UPDATE types_actes
SET ordre_affichage = 2
WHERE id = 295; -- Urgence dentaire

UPDATE types_actes
SET ordre_affichage = 3
WHERE id = 269; -- Détartrage complet

UPDATE types_actes
SET ordre_affichage = 4
WHERE id = 270; -- Obturation Composite (1 face)

UPDATE types_actes
SET ordre_affichage = 5
WHERE id = 271; -- Obturation Composite (2 faces)

UPDATE types_actes
SET ordre_affichage = 6
WHERE id = 272; -- Obturation Composite (3 faces+)

UPDATE types_actes
SET ordre_affichage = 7
WHERE id = 273; -- Traitement Canalaire (Mono)

UPDATE types_actes
SET ordre_affichage = 8
WHERE id = 274; -- Traitement Canalaire (Bi)

UPDATE types_actes
SET ordre_affichage = 9
WHERE id = 275; -- Traitement Canalaire (Multi)

UPDATE types_actes
SET ordre_affichage = 10
WHERE id = 283; -- Radio rétro-alvéolaire

UPDATE types_actes
SET ordre_affichage = 11
WHERE id = 284; -- Panoramique dentaire

-- Vérifier après nettoyage
SELECT 
    id,
    nom,
    tarif_defaut,
    ordre_affichage,
    actif
FROM types_actes
WHERE nom ILIKE '%consultation%' OR nom ILIKE '%CONSULTATION%'
ORDER BY ordre_affichage, nom;
