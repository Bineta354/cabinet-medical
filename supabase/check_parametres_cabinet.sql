-- Vérifier les paramètres du cabinet pour identifier le mapping
SELECT 
    id,
    nom_cabinet,
    tenant_id,
    ville,
    adresse
FROM parametres_cabinet
ORDER BY ville;
