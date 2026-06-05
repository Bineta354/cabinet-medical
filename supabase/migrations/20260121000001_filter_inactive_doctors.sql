-- Migration pour masquer les données des médecins inactifs
-- Cette migration crée des vues pour filtrer automatiquement les données des médecins inactifs

-- Vue pour les rendez-vous avec médecins actifs uniquement
CREATE OR REPLACE VIEW public.appointments_active_doctors AS
SELECT a.*
FROM public.appointments a
INNER JOIN public.users u ON a.medecin_id = u.id
WHERE u.actif = true;

-- Vue pour les consultations avec médecins actifs uniquement
CREATE OR REPLACE VIEW public.consultations_active_doctors AS
SELECT c.*
FROM public.consultations c
INNER JOIN public.users u ON c.medecin_id = u.id
WHERE u.actif = true;

-- Vue pour les prescriptions avec médecins actifs uniquement
CREATE OR REPLACE VIEW public.prescriptions_active_doctors AS
SELECT p.*
FROM public.prescriptions p
INNER JOIN public.users u ON p.medecin_id = u.id
WHERE u.actif = true;

-- Vue pour la file d'attente avec médecins actifs uniquement
CREATE OR REPLACE VIEW public.waiting_queue_active_doctors AS
SELECT wq.*
FROM public.waiting_queue wq
INNER JOIN public.users u ON wq.medecin_id = u.id
WHERE u.actif = true;

-- Vue pour les rappels SMS avec médecins actifs uniquement
CREATE OR REPLACE VIEW public.rappels_sms_active_doctors AS
SELECT rs.*
FROM public.rappels_sms rs
INNER JOIN public.appointments a ON rs.appointment_id = a.id
INNER JOIN public.users u ON a.medecin_id = u.id
WHERE u.actif = true;

-- Commentaires sur les vues
COMMENT ON VIEW public.appointments_active_doctors IS 'Vue filtrant les rendez-vous pour ne montrer que ceux avec des médecins actifs';
COMMENT ON VIEW public.consultations_active_doctors IS 'Vue filtrant les consultations pour ne montrer que celles avec des médecins actifs';
COMMENT ON VIEW public.prescriptions_active_doctors IS 'Vue filtrant les prescriptions pour ne montrer que celles avec des médecins actifs';
COMMENT ON VIEW public.waiting_queue_active_doctors IS 'Vue filtrant la file d''attente pour ne montrer que les entrées avec des médecins actifs';
COMMENT ON VIEW public.rappels_sms_active_doctors IS 'Vue filtrant les rappels SMS pour ne montrer que ceux avec des médecins actifs';
