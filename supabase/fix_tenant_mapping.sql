-- Corriger le tenant_id en fonction de l'email
-- Cabinet Plateau : a9b69401-8d44-4921-9154-81b4135254f4
-- Cabinet Dakar Centre : d1d62ea1-ca84-4693-ba4d-3d6c67719873

-- Mettre à jour les utilisateurs du cabinet Plateau (email contenant plateau)
UPDATE users
SET tenant_id = 'a9b69401-8d44-4921-9154-81b4135254f4'
WHERE email LIKE '%plateau%' OR email LIKE '%cabinet-plateau%';

-- Mettre à jour les utilisateurs du cabinet Dakar Centre (email contenant dakar-centre)
UPDATE users
SET tenant_id = 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
WHERE email LIKE '%dakar-centre%' OR email LIKE '%cabinet-dakar.com%';

-- Vérifier après correction
SELECT 
    tenant_id,
    role,
    COUNT(*) as nombre_utilisateurs
FROM users
GROUP BY tenant_id, role
ORDER BY tenant_id, role;

-- Vérifier les utilisateurs plateau
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE email LIKE '%plateau%'
ORDER BY email;

-- Vérifier les utilisateurs dakar
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE email LIKE '%dakar%'
ORDER BY email;
