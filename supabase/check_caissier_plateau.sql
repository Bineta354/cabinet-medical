-- Vérifier les caissiers du cabinet plateau
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE (role = 'caissier' OR role = 'cashier')
  AND (email LIKE '%plateau%' OR email LIKE '%cabinet-plateau%')
ORDER BY email;

-- Vérifier tous les caissiers avec leurs tenant_id
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE role = 'caissier' OR role = 'cashier'
ORDER BY tenant_id, email;
