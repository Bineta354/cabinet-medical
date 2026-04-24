-- Vérifier les notifications par tenant_id
SELECT 
    tenant_id,
    COUNT(*) as nombre_notifications,
    COUNT(DISTINCT caissier_id) as nombre_caissiers,
    COUNT(DISTINCT medecin_id) as nombre_medecins,
    COUNT(DISTINCT secretaire_id) as nombre_secretaires
FROM notifications_medecin_secretaire
GROUP BY tenant_id
ORDER BY tenant_id;

-- Vérifier les notifications sans tenant_id
SELECT COUNT(*) as notifications_sans_tenant
FROM notifications_medecin_secretaire
WHERE tenant_id IS NULL;

-- Vérifier les notifications récentes avec leurs tenant_id
SELECT 
    id,
    type_notification,
    titre,
    tenant_id,
    caissier_id,
    medecin_id,
    secretaire_id,
    created_at
FROM notifications_medecin_secretaire
ORDER BY created_at DESC
LIMIT 20;
