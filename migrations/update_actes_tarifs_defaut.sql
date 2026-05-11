-- Mise à jour des tarifs par défaut pour les types d'actes dentaires
-- Exécuter cette migration dans Supabase SQL Editor

-- Couronne dentaire
UPDATE types_actes 
SET tarif_defaut = 50000 
WHERE nom ILIKE '%couronne%' AND tarif_defaut IS NULL;

-- Implant dentaire
UPDATE types_actes 
SET tarif_defaut = 150000 
WHERE nom ILIKE '%implant%' AND tarif_defaut IS NULL;

-- Extraction dentaire
UPDATE types_actes 
SET tarif_defaut = 10000 
WHERE nom ILIKE '%extraction%' AND tarif_defaut IS NULL;

-- Consultation dentaire
UPDATE types_actes 
SET tarif_defaut = 5000 
WHERE nom ILIKE '%consultation%' AND tarif_defaut IS NULL;

-- Détartrage
UPDATE types_actes 
SET tarif_defaut = 8000 
WHERE nom ILIKE '%détartrage%' AND tarif_defaut IS NULL;

-- Radiographie dentaire
UPDATE types_actes 
SET tarif_defaut = 3000 
WHERE nom ILIKE '%radiographie%' AND tarif_defaut IS NULL;

-- Soins canalaires
UPDATE types_actes 
SET tarif_defaut = 25000 
WHERE nom ILIKE '%canal%' AND tarif_defaut IS NULL;

-- Prothèse amovible
UPDATE types_actes 
SET tarif_defaut = 75000 
WHERE nom ILIKE '%prothèse%' AND tarif_defaut IS NULL;

-- Obturation
UPDATE types_actes 
SET tarif_defaut = 12000 
WHERE nom ILIKE '%obturation%' AND tarif_defaut IS NULL;

-- Examen général
UPDATE types_actes 
SET tarif_defaut = 5000 
WHERE nom ILIKE '%examen%' AND tarif_defaut IS NULL;
