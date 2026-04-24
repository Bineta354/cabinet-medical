-- Vérifier la structure de la table users
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Vérifier les utilisateurs avec leurs tenant_id
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif
FROM users
ORDER BY tenant_id, role
LIMIT 20;
