-- Vérifier les spécialités disponibles
SELECT 
    id,
    nom,
    description,
    color,
    actif
FROM specialites
ORDER BY nom;

-- Vérifier la configuration actuelle des cabinets
SELECT 
    id,
    nom_cabinet,
    mode_specialite_id,
    ville
FROM parametres_cabinet
ORDER BY ville;
