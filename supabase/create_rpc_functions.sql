-- Fonctions RPC pour identifier et supprimer les données orphelines
-- Date: 2026-06-02

-- Fonction pour identifier les rendez-vous orphelins
CREATE OR REPLACE FUNCTION get_orphaned_appointments()
RETURNS TABLE (
    patient_id bigint,
    patient_nom varchar,
    patient_prenom varchar,
    medecin_orphelin_id bigint,
    date_heure timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as patient_id,
        p.nom as patient_nom,
        p.prenom as patient_prenom,
        a.medecin_id as medecin_orphelin_id,
        a.date_heure
    FROM public.patients p
    INNER JOIN public.appointments a ON p.id = a.patient_id
    LEFT JOIN public.users u ON a.medecin_id = u.id
    WHERE u.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour identifier les consultations orphelines
CREATE OR REPLACE FUNCTION get_orphaned_consultations()
RETURNS TABLE (
    patient_id bigint,
    patient_nom varchar,
    patient_prenom varchar,
    medecin_orphelin_id bigint,
    date_consultation timestamp with time zone
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as patient_id,
        p.nom as patient_nom,
        p.prenom as patient_prenom,
        c.medecin_id as medecin_orphelin_id,
        c.date_consultation
    FROM public.patients p
    INNER JOIN public.consultations c ON p.id = c.patient_id
    LEFT JOIN public.users u ON c.medecin_id = u.id
    WHERE u.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour identifier la file d'attente orpheline
CREATE OR REPLACE FUNCTION get_orphaned_waiting_queue()
RETURNS TABLE (
    patient_id bigint,
    patient_nom varchar,
    patient_prenom varchar,
    medecin_orphelin_id bigint,
    status varchar
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id as patient_id,
        p.nom as patient_nom,
        p.prenom as patient_prenom,
        wq.medecin_id as medecin_orphelin_id,
        wq.status
    FROM public.patients p
    INNER JOIN public.waiting_queue wq ON p.id = wq.patient_id
    LEFT JOIN public.users u ON wq.medecin_id = u.id
    WHERE u.id IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Fonction pour supprimer toutes les données liées à un médecin
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

-- Fonction RPC pour créer le trigger (appelée depuis Node.js)
CREATE OR REPLACE FUNCTION create_delete_doctor_data_function()
RETURNS void AS $$
BEGIN
    -- Le trigger est déjà créé ci-dessus
    -- Cette fonction existe juste pour être appelée depuis le script Node.js
    RETURN;
END;
$$ LANGUAGE plpgsql;
