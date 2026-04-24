-- Vérifier si le caissier du cabinet Plateau apparaît dans les notifications médecin-secrétaire
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
WHERE (medecin_id = 359 OR secretaire_id = 359 OR medecin_id = 349 OR secretaire_id = 349)
ORDER BY created_at DESC
LIMIT 20;

-- Vérifier toutes les notifications du cabinet Plateau (pas seulement celles avec caissier_id)
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
WHERE tenant_id = 'a9b69401-8d44-4921-9154-81b4135254f4'
ORDER BY created_at DESC
LIMIT 50;
