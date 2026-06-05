-- VÉRIFIER SI LA FONCTION A ÉTÉ MIS À JOUR
-- Exécuter cette requête dans Supabase SQL Editor

SELECT prosrc 
FROM pg_proc 
WHERE proname = 'medecin_recoit_patient_simplifie';

-- RÉSULTAT ATTENDU :
-- Le code doit contenir cette ligne :
-- AND wq.status IN ('present', 'arrive', 'waiting', 'authorized')

-- SI 'authorized' N'EST PAS PRÉSENT :
-- 1. Ouvrir Supabase > Database > Functions > medecin_recoit_patient_simplifie
-- 2. Chercher : AND wq.status IN ('present', 'arrive', 'waiting')
-- 3. Remplacer par : AND wq.status IN ('present', 'arrive', 'waiting', 'authorized')
-- 4. Sauvegarder la fonction
-- 5. OU exécuter le fichier update_medecin_recoit_patient_simplifie.sql
