-- Vérifier les médecins des cabinets dentaires
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    u.specialite_id,
    u.tenant_id,
    s.nom as specialite_nom,
    pc.nom_cabinet
FROM users u
LEFT JOIN specialites s ON u.specialite_id = s.id
LEFT JOIN parametres_cabinet pc ON u.tenant_id = pc.tenant_id
WHERE u.role = 'medecin' OR u.role = 'doctor'
  AND pc.nom_cabinet IN ('Cabinet Dentaire Dakar Centre', 'Cabinet Dentaire Plateau')
ORDER BY pc.nom_cabinet, u.nom;

-- Mettre à jour les médecins des cabinets dentaires pour utiliser la spécialité Dentiste (ID 12)
UPDATE users
SET specialite_id = 12
WHERE role IN ('medecin', 'doctor')
  AND tenant_id IN (
    SELECT tenant_id 
    FROM parametres_cabinet 
    WHERE nom_cabinet IN ('Cabinet Dentaire Dakar Centre', 'Cabinet Dentaire Plateau')
  );

-- Vérifier après mise à jour
SELECT 
    u.id,
    u.email,
    u.nom,
    u.prenom,
    u.specialite_id,
    u.tenant_id,
    s.nom as specialite_nom,
    pc.nom_cabinet
FROM users u
LEFT JOIN specialites s ON u.specialite_id = s.id
LEFT JOIN parametres_cabinet pc ON u.tenant_id = pc.tenant_id
WHERE u.role = 'medecin' OR u.role = 'doctor'
  AND pc.nom_cabinet IN ('Cabinet Dentaire Dakar Centre', 'Cabinet Dentaire Plateau')
ORDER BY pc.nom_cabinet, u.nom;
