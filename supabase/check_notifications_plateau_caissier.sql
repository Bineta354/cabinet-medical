-- Vérifier les notifications du cabinet Plateau
SELECT 
    id,
    type_notification,
    titre,
    message,
    medecin_id,
    secretaire_id,
    caissier_id,
    tenant_id,
    lu,
    created_at
FROM notifications_medecin_secretaire
WHERE tenant_id = 'a9b69401-8d44-4921-9154-81b4135254f4'
ORDER BY created_at DESC
LIMIT 20;

-- Vérifier les notifications qui ont un caissier_id mais ne sont pas des notifications caissier
SELECT 
    id,
    type_notification,
    titre,
    message,
    medecin_id,
    secretaire_id,
    caissier_id,
    tenant_id,
    created_at
FROM notifications_medecin_secretaire
WHERE caissier_id IS NOT NULL
  AND type_notification NOT LIKE '%CASHIER%'
  AND type_notification NOT LIKE '%PAIEMENT%'
ORDER BY created_at DESC
LIMIT 20;

-- Vérifier le caissier du cabinet Plateau
SELECT 
    id,
    email,
    role,
    tenant_id,
    actif,
    nom,
    prenom
FROM users
WHERE role IN ('caissier', 'cashier')
  AND tenant_id = 'a9b69401-8d44-4921-9154-81b4135254f4';
