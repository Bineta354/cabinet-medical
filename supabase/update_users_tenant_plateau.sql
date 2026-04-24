-- Vérifier les utilisateurs du cabinet plateau (email contenant plateau)
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif
FROM users
WHERE email LIKE '%plateau%'
   OR email LIKE '%cabinet-plateau%'
ORDER BY email;

-- Mettre à jour les utilisateurs du cabinet plateau avec le bon tenant_id
UPDATE users
SET tenant_id = 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
WHERE email LIKE '%plateau%'
   OR email LIKE '%cabinet-plateau%';

-- Vérifier après mise à jour
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif
FROM users
WHERE email LIKE '%plateau%'
   OR email LIKE '%cabinet-plateau%'
ORDER BY email;
