-- Analyse des différents systèmes de statut de patients

-- 1. Statut dans la table patients (actif/inactif)
SELECT 
    'patients table' as table_name,
    'actif' as column_name,
    CASE WHEN actif THEN 'Actif' ELSE 'Inactif' END as status_value,
    COUNT(*) as count
FROM patients 
GROUP BY actif
ORDER BY actif;

-- 2. Statut dans la table waiting_queue (status)
SELECT 
    'waiting_queue table' as table_name,
    'status' as column_name,
    status as status_value,
    COUNT(*) as count
FROM waiting_queue 
GROUP BY status
ORDER BY status;

-- 3. Statut dans la table appointments (statut)
SELECT 
    'appointments table' as table_name,
    'statut' as column_name,
    statut as status_value,
    COUNT(*) as count
FROM appointments 
GROUP BY statut
ORDER BY statut;

-- 4. Vérifier les patients inactifs avec des rendez-vous
SELECT 
    p.id as patient_id,
    p.nom,
    p.prenom,
    p.actif as patient_actif,
    a.id as appointment_id,
    a.date_heure,
    a.statut as appointment_statut,
    wq.status as waiting_queue_status
FROM patients p
LEFT JOIN appointments a ON p.id = a.patient_id
LEFT JOIN waiting_queue wq ON p.id = wq.patient_id
WHERE p.actif = false 
AND (a.id IS NOT NULL OR wq.id IS NOT NULL)
ORDER BY p.nom, p.prenom;

-- 5. Types de statuts disponibles dans chaque table
SELECT 
    'waiting_queue' as table_name,
    unnest(ARRAY['waiting', 'called', 'present', 'in_consultation', 'finished', 'cancelled']) as possible_status
UNION ALL
SELECT 
    'appointments' as table_name,
    unnest(ARRAY['confirme', 'en_attente', 'annule', 'termine']) as possible_status
UNION ALL
SELECT 
    'patients' as table_name,
    unnest(ARRAY['true', 'false']) as possible_status;
