-- Vérifier l'état actuel de tous les utilisateurs par tenant_id
SELECT 
    tenant_id,
    role,
    COUNT(*) as nombre_utilisateurs,
    COUNT(*) FILTER (WHERE actif = true) as utilisateurs_actifs
FROM users
GROUP BY tenant_id, role
ORDER BY tenant_id, role;

-- Vérifier les utilisateurs avec email contenant "plateau"
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom,
    created_at
FROM users
WHERE email LIKE '%plateau%'
ORDER BY created_at DESC;

-- Vérifier les utilisateurs avec email contenant "dakar"
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom,
    created_at
FROM users
WHERE email LIKE '%dakar%'
ORDER BY created_at DESC;
