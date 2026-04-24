-- Mettre à jour les cabinets dentaires pour utiliser la spécialité Dentiste (ID 12)
UPDATE parametres_cabinet
SET mode_specialite_id = 12
WHERE nom_cabinet IN ('Cabinet Dentaire Dakar Centre', 'Cabinet Dentaire Plateau');

-- Associer les types d'actes dentaires à la spécialité Dentiste (ID 12)
-- D'abord supprimer les associations existantes pour ces actes
DELETE FROM types_actes_specialites
WHERE type_acte_id IN (
  266, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280,
  281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295
);

-- Ensuite créer les nouvelles associations
INSERT INTO types_actes_specialites (type_acte_id, specialite_id)
VALUES
  (266, 12), -- Consultation
  (269, 12), -- Détartrage complet
  (270, 12), -- Obturation Composite (1 face)
  (271, 12), -- Obturation Composite (2 faces)
  (272, 12), -- Obturation Composite (3 faces+)
  (273, 12), -- Traitement Canalaire (Mono)
  (274, 12), -- Traitement Canalaire (Bi)
  (275, 12), -- Traitement Canalaire (Multi)
  (276, 12), -- Couronne Métallique
  (277, 12), -- Couronne Céramo-métallique
  (278, 12), -- Couronne Zircone
  (279, 12), -- Prothèse Amovible (par dent)
  (280, 12), -- Prothèse Complète (1 arcade)
  (281, 12), -- Blanchiment dentaire
  (282, 12), -- Scellement de sillons
  (283, 12), -- Radio rétro-alvéolaire
  (284, 12), -- Panoramique dentaire
  (285, 12), -- Incision abcès
  (286, 12), -- Alvéolectomie
  (287, 12), -- Gingivectomie (secteur)
  (288, 12), -- Pose Implant
  (289, 12), -- Bridge (par élément)
  (290, 12), -- Inlay-Core
  (291, 12), -- Pulpotomie
  (292, 12), -- Curetage parodontal (quadrant)
  (293, 12), -- Attelle de contention
  (294, 12), -- Fluoruration
  (295, 12); -- Urgence dentaire

-- Vérifier la configuration
SELECT 
    pc.nom_cabinet,
    pc.mode_specialite_id,
    s.nom as specialite_nom
FROM parametres_cabinet pc
LEFT JOIN specialites s ON pc.mode_specialite_id = s.id
WHERE pc.nom_cabinet IN ('Cabinet Dentaire Dakar Centre', 'Cabinet Dentaire Plateau');

-- Vérifier les associations
SELECT 
    ta.nom as acte_nom,
    s.nom as specialite_nom
FROM types_actes ta
JOIN types_actes_specialites tas ON ta.id = tas.type_acte_id
JOIN specialites s ON tas.specialite_id = s.id
WHERE s.id = 12
ORDER BY ta.ordre_affichage, ta.nom;
