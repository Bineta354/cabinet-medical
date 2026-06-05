-- Script simplifié pour nettoyer les données orphelines
-- Date: 2026-06-02
-- Instructions: Copiez ce contenu et collez-le dans le SQL Editor de Supabase Dashboard

-- ÉTAPE 1: Identifier les données orphelines (lecture seule)
SELECT '=== IDENTIFICATION DES DONNÉES ORPHELINES ===' as info;

-- Rendez-vous orphelins
SELECT 
    'Rendez-vous orphelins' as type,
    COUNT(*) as count
FROM public.appointments a
LEFT JOIN public.users u ON a.medecin_id = u.id
WHERE u.id IS NULL;

-- Consultations orphelines
SELECT 
    'Consultations orphelines' as type,
    COUNT(*) as count
FROM public.consultations c
LEFT JOIN public.users u ON c.medecin_id = u.id
WHERE u.id IS NULL;

-- Prescriptions orphelines
SELECT 
    'Prescriptions orphelines' as type,
    COUNT(*) as count
FROM public.prescriptions p
LEFT JOIN public.users u ON p.medecin_id = u.id
WHERE u.id IS NULL;

-- File d'attente orpheline
SELECT 
    'File d attente orpheline' as type,
    COUNT(*) as count
FROM public.waiting_queue w
LEFT JOIN public.users u ON w.medecin_id = u.id
WHERE u.id IS NULL;

-- ÉTAPE 2: Supprimer les données orphelines
SELECT '=== SUPPRESSION DES DONNÉES ORPHELINES ===' as info;

-- Supprimer les prescriptions orphelines
DELETE FROM public.prescriptions
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer les rendez-vous orphelins
DELETE FROM public.appointments
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer les consultations orphelines
DELETE FROM public.consultations
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

-- Supprimer la file d'attente orpheline
DELETE FROM public.waiting_queue
WHERE medecin_id NOT IN (SELECT id FROM public.users WHERE role = 'doctor');

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

-- ÉTAPE 3: Vérification
SELECT '=== VÉRIFICATION FINALE ===' as info;

-- Vérifier qu'il n'y a plus de données orphelines
SELECT 
    'Rendez-vous orphelins restants' as type,
    COUNT(*) as count
FROM public.appointments a
LEFT JOIN public.users u ON a.medecin_id = u.id
WHERE u.id IS NULL;

SELECT 
    'Consultations orphelines restantes' as type,
    COUNT(*) as count
FROM public.consultations c
LEFT JOIN public.users u ON c.medecin_id = u.id
WHERE u.id IS NULL;

SELECT 
    'Prescriptions orphelines restantes' as type,
    COUNT(*) as count
FROM public.prescriptions p
LEFT JOIN public.users u ON p.medecin_id = u.id
WHERE u.id IS NULL;

SELECT 
    'File d attente orpheline restante' as type,
    COUNT(*) as count
FROM public.waiting_queue w
LEFT JOIN public.users u ON w.medecin_id = u.id
WHERE u.id IS NULL;

SELECT '=== NETTOYAGE TERMINÉ ===' as info;
