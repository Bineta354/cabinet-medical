-- Créer la table motifs_consultation si elle n'existe pas
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

-- Insérer les motifs dentaires par défaut (si la table vient d'être créée)
INSERT INTO public.motifs_consultation (nom, description, ordre) VALUES
    ('Examen dentaire', 'Consultation dentaire générale', 1),
    ('Nettoyage dentaire', 'Détartrage et nettoyage', 2),
    ('Extraction dentaire', 'Extraction de dent', 3),
    ('Soins dentaires', 'Soins dentaires divers', 4),
    ('Orthodontie', 'Consultation orthodontique', 5),
    ('Implant dentaire', 'Consultation pour implant', 6),
    ('Prothèse dentaire', 'Consultation pour prothèse', 7),
    ('Blanchiment dentaire', 'Blanchiment des dents', 8),
    ('Urgence dentaire', 'Urgence dentaire (douleur, traumatisme)', 9),
    ('Contrôle post-traitement', 'Suivi après traitement', 10),
    ('Panoramique dentaire', 'Radiographie panoramique', 11),
    ('Détartrage', 'Détartrage simple', 12),
    ('Soins caries', 'Soins des caries dentaires', 13),
    ('Pose de couronne', 'Pose de couronne dentaire', 14),
    ('Traitement de canal', 'Traitement de canal (endodontie)', 15),
    ('Première consultation', 'Première consultation dentaire', 16),
    ('Radiographie dentaire', 'Radiographie dentaire', 17),
    ('Consultation de contrôle', 'Consultation de contrôle dentaire', 18),
    ('Autre', 'Autre motif de consultation', 99)
ON CONFLICT DO NOTHING;

-- Afficher les motifs de consultation
SELECT 
    'MOTIF' as type,
    nom,
    description,
    ordre
FROM motifs_consultation 
WHERE actif = true
ORDER BY ordre, nom;

-- Afficher les types d'actes
SELECT 
    'ACTE' as type,
    nom,
    NULL as description,
    ordre_affichage as ordre
FROM types_actes 
WHERE actif = true
ORDER BY ordre_affichage, nom;

-- Comparaison directe pour trouver les similitudes
SELECT 
    m.nom as motif_nom,
    m.description as motif_description,
    a.nom as acte_nom,
    a.prix_base as acte_prix,
    CASE 
        WHEN LOWER(m.nom) = LOWER(a.nom) THEN 'Identique'
        WHEN LOWER(m.nom) LIKE CONCAT('%', LOWER(a.nom), '%') OR LOWER(a.nom) LIKE CONCAT('%', LOWER(m.nom), '%') THEN 'Similaire'
        ELSE 'Différent'
    END as similarite
FROM motifs_consultation m
FULL OUTER JOIN types_actes a ON (
    LOWER(m.nom) = LOWER(a.nom) OR
    LOWER(m.nom) LIKE CONCAT('%', LOWER(a.nom), '%') OR
    LOWER(a.nom) LIKE CONCAT('%', LOWER(m.nom), '%')
)
WHERE m.actif = true AND a.actif = true
ORDER BY similarite, motif_nom, acte_nom;
