-- Vérifier les utilisateurs avec email contenant "plateau" mais avec un mauvais tenant_id
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE (email LIKE '%plateau%' OR email LIKE '%cabinet-plateau%')
  AND tenant_id != 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
ORDER BY email;

-- Vérifier tous les utilisateurs sans tenant_id
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE tenant_id IS NULL
ORDER BY role, email;

-- Vérifier les utilisateurs créés récemment (pour voir s'il y a eu des modifications)
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
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
