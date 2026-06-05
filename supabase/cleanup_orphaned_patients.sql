-- Script pour identifier et supprimer les patients orphelins (rattachés à des médecins supprimés)
-- Date: 2026-06-02

-- ============================================
-- ÉTAPE 1: Identifier les patients orphelins
-- ============================================

-- Identifier les patients qui ont des rendez-vous avec des médecins inexistants
SELECT 
    p.id as patient_id,
    p.nom as patient_nom,
    p.prenom as patient_prenom,
    a.medecin_id as medecin_orphelin_id,
    a.date_heure
FROM public.patients p
INNER JOIN public.appointments a ON p.id = a.patient_id
LEFT JOIN public.users u ON a.medecin_id = u.id
WHERE u.id IS NULL
AND u.role = 'doctor';

-- Identifier les patients qui ont des consultations avec des médecins inexistants
SELECT 
    p.id as patient_id,
    p.nom as patient_nom,
    p.prenom as patient_prenom,
    c.medecin_id as medecin_orphelin_id,
    c.date_consultation
FROM public.patients p
INNER JOIN public.consultations c ON p.id = c.patient_id
LEFT JOIN public.users u ON c.medecin_id = u.id
WHERE u.id IS NULL
AND u.role = 'doctor';

-- Identifier les patients qui sont dans la file d'attente avec des médecins inexistants
SELECT 
    p.id as patient_id,
    p.nom as patient_nom,
    p.prenom as patient_prenom,
    wq.medecin_id as medecin_orphelin_id,
    wq.status
FROM public.patients p
INNER JOIN public.waiting_queue wq ON p.id = wq.patient_id
LEFT JOIN public.users u ON wq.medecin_id = u.id
WHERE u.id IS NULL
AND u.role = 'doctor';

-- ============================================
-- ÉTAPE 2: Supprimer les données orphelines
-- ============================================

-- Supprimer les prescriptions avec des médecins orphelins
DELETE FROM public.prescriptions
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer les rendez-vous avec des médecins orphelins
DELETE FROM public.appointments
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer les consultations avec des médecins orphelins
DELETE FROM public.consultations
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer les entrées de la file d'attente avec des médecins orphelins
DELETE FROM public.waiting_queue
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer les patients qui n'ont plus de rendez-vous, consultations, ou données liées
-- (Optionnel - selon la logique métier, on peut vouloir garder les patients même sans médecin)
DELETE FROM public.patients p
WHERE NOT EXISTS (
    SELECT 1 FROM public.appointments a WHERE a.patient_id = p.id
)
AND NOT EXISTS (
    SELECT 1 FROM public.consultations c WHERE c.patient_id = p.id
)
AND NOT EXISTS (
    SELECT 1 FROM public.invoices i WHERE i.patient_id = p.id
);

-- ============================================
-- ÉTAPE 3: Créer une fonction pour supprimer automatiquement lors de la suppression d'un médecin
-- ============================================

-- Fonction pour supprimer toutes les données liées à un médecin lors de sa suppression
CREATE OR REPLACE FUNCTION delete_doctor_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Supprimer les prescriptions du médecin
    DELETE FROM public.prescriptions WHERE medecin_id = OLD.id;
    
    -- Supprimer les rendez-vous du médecin
    DELETE FROM public.appointments WHERE medecin_id = OLD.id;
    
    -- Supprimer les consultations du médecin
    DELETE FROM public.consultations WHERE medecin_id = OLD.id;
    
    -- Supprimer les entrées de la file d'attente du médecin
    DELETE FROM public.waiting_queue WHERE medecin_id = OLD.id;
    
    -- Supprimer les patients qui n'ont plus de données liées
    DELETE FROM public.patients p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.appointments a WHERE a.patient_id = p.id
    )
    AND NOT EXISTS (
        SELECT 1 FROM public.consultations c WHERE c.patient_id = p.id
    )
    AND NOT EXISTS (
        SELECT 1 FROM public.invoices i WHERE i.patient_id = p.id
    );
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour exécuter la fonction lors de la suppression d'un médecin
DROP TRIGGER IF EXISTS trigger_delete_doctor_data ON public.users;
CREATE TRIGGER trigger_delete_doctor_data
    BEFORE DELETE ON public.users
    FOR EACH ROW
    WHEN (OLD.role = 'doctor')
    EXECUTE FUNCTION delete_doctor_data();

-- ============================================
-- ÉTAPE 4: Vérification
-- ============================================

-- Vérifier qu'il n'y a plus de données orphelines
SELECT 'Vérification des prescriptions orphelines' as check;
SELECT COUNT(*) as count FROM public.prescriptions 
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

SELECT 'Vérification des rendez-vous orphelins' as check;
SELECT COUNT(*) as count FROM public.appointments 
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

SELECT 'Vérification des consultations orphelines' as check;
SELECT COUNT(*) as count FROM public.consultations 
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

SELECT 'Vérification de la file d\'attente orpheline' as check;
SELECT COUNT(*) as count FROM public.waiting_queue 
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');
