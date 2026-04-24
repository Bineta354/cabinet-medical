-- Corriger le tenant_id des utilisateurs du cabinet plateau créés récemment
UPDATE users
SET tenant_id = 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
WHERE id IN (
  370, -- aicha@gmail.com (secretary)
  369, -- billy@gmail.com (secretary)
  368, -- fallou@gmail.com (doctor)
  367, -- jimmy@gmail.com (doctor)
  366, -- eva@gmail.com (doctor)
  365, -- jules@gmail.com (doctor)
  364, -- alain@gmail.com (doctor)
  363, -- mamibadiane27@gmail.com (secretary)
  362  -- binetadabo2@gmail.com (secretary)
);

-- Vérifier après correction
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE id IN (370, 369, 368, 367, 366, 365, 364, 363, 362)
ORDER BY email;

-- Vérifier le nombre total d'utilisateurs par tenant_id après correction
SELECT 
    tenant_id,
    role,
    COUNT(*) as nombre_utilisateurs
FROM users
WHERE tenant_id IN ('d1d62ea1-ca84-4693-ba4d-3d6c67719873', 'a9b69401-8d44-4921-9154-81b4135254f4')
GROUP BY tenant_id, role
ORDER BY tenant_id, role;
