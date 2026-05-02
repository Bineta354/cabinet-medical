-- Création de la table des motifs de consultation
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
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_motifs_consultation_updated_at 
    BEFORE UPDATE ON public.motifs_consultation 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

-- Commentaires sur la table
COMMENT ON TABLE public.motifs_consultation IS 'Liste des motifs de consultation disponibles';
COMMENT ON COLUMN public.motifs_consultation.nom IS 'Nom du motif de consultation';
COMMENT ON COLUMN public.motifs_consultation.description IS 'Description détaillée du motif';
COMMENT ON COLUMN public.motifs_consultation.specialite_id IS 'Spécialité concernée (optionnel)';
COMMENT ON COLUMN public.motifs_consultation.actif IS 'Indique si le motif est actuellement utilisé';
COMMENT ON COLUMN public.motifs_consultation.ordre IS 'Ordre d''affichage dans les listes déroulantes';
