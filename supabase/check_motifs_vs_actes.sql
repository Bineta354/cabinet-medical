-- Comparaison entre les motifs de consultation et les types d'actes
-- Pour identifier les redondances et similitudes

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
