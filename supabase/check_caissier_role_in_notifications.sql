-- Vérifier si les caissiers apparaissent comme medecin_id ou secretaire_id dans les notifications
-- Pour le cabinet Plateau
SELECT 
    n.id,
    n.type_notification,
    n.titre,
    n.message,
    n.medecin_id,
    n.secretaire_id,
    n.caissier_id,
    n.tenant_id,
    u_caissier.email as caissier_email,
    u_caissier.role as caissier_role,
    n.created_at
FROM notifications_medecin_secretaire n
LEFT JOIN users u_caissier ON n.medecin_id = u_caissier.id OR n.secretaire_id = u_caissier.id
WHERE n.tenant_id = 'a9b69401-8d44-4921-9154-81b4135254f4'
  AND u_caissier.role IN ('caissier', 'cashier')
ORDER BY n.created_at DESC
LIMIT 20;

-- Pour le cabinet Dakar Centre
SELECT 
    n.id,
    n.type_notification,
    n.titre,
    n.message,
    n.medecin_id,
    n.secretaire_id,
    n.caissier_id,
    n.tenant_id,
    u_caissier.email as caissier_email,
    u_caissier.role as caissier_role,
    n.created_at
FROM notifications_medecin_secretaire n
LEFT JOIN users u_caissier ON n.medecin_id = u_caissier.id OR n.secretaire_id = u_caissier.id
WHERE n.tenant_id = 'd1d62ea1-ca84-4693-ba4d-3d6c67719873'
  AND u_caissier.role IN ('caissier', 'cashier')
ORDER BY n.created_at DESC
LIMIT 20;
