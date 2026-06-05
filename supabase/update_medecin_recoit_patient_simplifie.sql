-- MISE À JOUR DE LA FONCTION RPC 'medecin_recoit_patient_simplifie'
-- Supprime toutes les versions existantes et crée une seule version corrigée
-- Accepte le statut 'authorized' et passe directement en 'in_consultation'
-- CORRECTION: medecin_id est BIGINT dans la base, pas UUID

-- ÉTAPE 1: Supprimer toutes les versions existantes de la fonction
DROP FUNCTION IF EXISTS medecin_recoit_patient_simplifie(BIGINT, BIGINT) CASCADE;

-- ÉTAPE 2: Créer la version corrigée avec BIGINT pour p_medecin_id
CREATE FUNCTION medecin_recoit_patient_simplifie(
    p_waiting_queue_id BIGINT,
    p_medecin_id BIGINT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    patient_info RECORD;
BEGIN
    SELECT wq.id, wq.status, wq.patient_id, p.nom, p.prenom
    INTO patient_info
    FROM waiting_queue wq
    JOIN patients p ON wq.patient_id = p.id
    WHERE wq.id = p_waiting_queue_id 
    AND wq.medecin_id = p_medecin_id
    AND wq.status IN ('present', 'arrive', 'waiting', 'authorized', 'en_route');
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Patient non trouvé ou déjà en cours de traitement'
        );
    END IF;
    
    UPDATE waiting_queue 
    SET status = 'in_consultation', updated_at = NOW()
    WHERE id = p_waiting_queue_id;
    
    RETURN json_build_object(
        'success', true,
        'message', format('Consultation démarrée pour %s %s.', patient_info.prenom, patient_info.nom),
        'patient_name', format('%s %s', patient_info.prenom, patient_info.nom),
        'status', 'in_consultation'
    );
    
EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', format('Erreur: %s', SQLERRM));
END;
$$;

-- ÉTAPE 3: Vérifier qu'il n'y a plus qu'une seule version
SELECT proname, proargtypes 
FROM pg_proc 
WHERE proname = 'medecin_recoit_patient_simplifie';
