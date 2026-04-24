-- Vérifier tous les utilisateurs du cabinet plateau
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE tenant_id = 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
ORDER BY role, email;

-- Compter les utilisateurs par rôle pour le cabinet plateau
SELECT 
    role,
    COUNT(*) as nombre_utilisateurs,
    COUNT(*) FILTER (WHERE actif = true) as utilisateurs_actifs
FROM users
WHERE tenant_id = 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
GROUP BY role
ORDER BY role;

-- Comparer avec le cabinet dakar
SELECT 
    role,
    COUNT(*) as nombre_utilisateurs,
    COUNT(*) FILTER (WHERE actif = true) as utilisateurs_actifs
FROM users
WHERE tenant_id = 'a9b69401-8d44-4921-9154-81b4135254f4'
GROUP BY role
ORDER BY role;
