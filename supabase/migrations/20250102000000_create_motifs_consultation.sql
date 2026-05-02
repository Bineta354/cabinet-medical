-- Migration pour créer la table motifs_consultation
-- Date: 2026-05-02
-- Description: Centraliser les motifs de consultation dentaire

-- Création de la table motifs_consultation
CREATE TABLE IF NOT EXISTS public.motifs_consultation (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    nom varchar(255) NOT NULL,
    description text,
    specialite_id uuid REFERENCES public.specialites(id),
    actif boolean DEFAULT true,
    ordre integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Index pour optimiser les recherches
CREATE INDEX IF NOT EXISTS idx_motifs_consultation_specialite ON public.motifs_consultation(specialite_id);
CREATE INDEX IF NOT EXISTS idx_motifs_consultation_actif ON public.motifs_consultation(actif);

-- Trigger pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_motifs_consultation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_motifs_consultation_updated_at ON public.motifs_consultation;
CREATE TRIGGER update_motifs_consultation_updated_at 
    BEFORE UPDATE ON public.motifs_consultation 
    FOR EACH ROW EXECUTE FUNCTION update_motifs_consultation_updated_at();

-- Insertion des motifs dentaires par défaut
INSERT INTO public.motifs_consultation (nom, description, specialite_id, ordre) VALUES
    ('Examen dentaire', 'Consultation dentaire générale', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 1),
    ('Nettoyage dentaire', 'Détartrage et nettoyage', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 2),
    ('Extraction dentaire', 'Extraction de dent', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 3),
    ('Soins dentaires', 'Soins dentaires divers', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 4),
    ('Orthodontie', 'Consultation orthodontique', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 5),
    ('Implant dentaire', 'Consultation pour implant', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 6),
    ('Prothèse dentaire', 'Consultation pour prothèse', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 7),
    ('Blanchiment dentaire', 'Blanchiment des dents', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 8),
    ('Urgence dentaire', 'Urgence dentaire (douleur, traumatisme)', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 9),
    ('Contrôle post-traitement', 'Suivi après traitement', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 10),
    ('Panoramique dentaire', 'Radiographie panoramique', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 11),
    ('Détartrage', 'Détartrage simple', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 12),
    ('Soins caries', 'Soins des caries dentaires', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 13),
    ('Pose de couronne', 'Pose de couronne dentaire', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 14),
    ('Traitement de canal', 'Traitement de canal (endodontie)', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 15),
    ('Première consultation', 'Première consultation dentaire', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 16),
    ('Radiographie dentaire', 'Radiographie dentaire', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 17),
    ('Consultation de contrôle', 'Consultation de contrôle dentaire', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 18),
    ('Autre', 'Autre motif de consultation', (SELECT id FROM public.specialites WHERE nom = 'Dentiste' LIMIT 1), 99)
ON CONFLICT DO NOTHING;

-- RLS (Row Level Security) pour la table motifs_consultation
ALTER TABLE public.motifs_consultation ENABLE ROW LEVEL SECURITY;

-- Politique de lecture pour les utilisateurs authentifiés
CREATE POLICY "Les utilisateurs authentifiés peuvent lire les motifs" ON public.motifs_consultation
    FOR SELECT USING (auth.role() IS NOT NULL);

-- Politique d'insertion pour les médecins et administrateurs
CREATE POLICY "Les médecins et admins peuvent insérer des motifs" ON public.motifs_consultation
    FOR INSERT WITH CHECK (
        auth.role() IN ('doctor', 'admin') OR
        (auth.role() = 'doctor' AND auth.uid() = specialite_id)
    );

-- Politique de mise à jour pour les médecins et administrateurs
CREATE POLICY "Les médecins et admins peuvent modifier des motifs" ON public.motifs_consultation
    FOR UPDATE USING (
        auth.role() IN ('doctor', 'admin') OR
        (auth.role() = 'doctor' AND auth.uid() = specialite_id)
    );

-- Politique de suppression pour les administrateurs uniquement
CREATE POLICY "Seuls les admins peuvent supprimer des motifs" ON public.motifs_consultation
    FOR DELETE USING (auth.role() = 'admin');
