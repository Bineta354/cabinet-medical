-- Ajouter un admin pour le cabinet plateau
INSERT INTO users (email, password_hash, role, nom, prenom, tenant_id, actif, created_at)
VALUES (
  'admin@cabinet-plateau.com',
  '$2a$10$placeholder_hash', -- À remplacer par un vrai hash de mot de passe
  'admin',
  'Admin',
  'Plateau',
  'd1d62ea1-ca84-4693-ba4d-3d6c67719873',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Ajouter un comptable pour le cabinet plateau
INSERT INTO users (email, password_hash, role, nom, prenom, tenant_id, actif, created_at)
VALUES (
  'comptabilite@cabinet-plateau.com',
  '$2a$10$placeholder_hash', -- À remplacer par un vrai hash de mot de passe
  'accounting',
  'Comptable',
  'Plateau',
  'd1d62ea1-ca84-4693-ba4d-3d6c67719873',
  true,
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Vérifier les utilisateurs après insertion
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
