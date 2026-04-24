-- Vérifier les paramètres du cabinet pour identifier les tenant_id
SELECT 
    id,
    nom_cabinet,
    tenant_id,
    ville,
    adresse
FROM parametres_cabinet
ORDER BY ville;

-- Vérifier les utilisateurs par tenant_id pour comprendre la répartition
SELECT 
    tenant_id,
    role,
    COUNT(*) as nombre_utilisateurs
FROM users
GROUP BY tenant_id, role
ORDER BY tenant_id, role;
