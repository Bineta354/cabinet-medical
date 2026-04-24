-- Vérifier les types d'actes existants
SELECT 
    id,
    nom,
    code,
    prix_base,
    ordre_affichage,
    actif
FROM types_actes
ORDER BY ordre_affichage, nom;

-- Vérifier les spécialités associées aux types d'actes
SELECT 
    ta.id,
    ta.nom as acte_nom,
    s.nom as specialite_nom
FROM types_actes ta
LEFT JOIN types_actes_specialites tas ON ta.id = tas.type_acte_id
LEFT JOIN specialites s ON tas.specialite_id = s.id
ORDER BY ta.ordre_affichage, ta.nom;
