-- Vérifier la structure de la table types_actes
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'types_actes'
ORDER BY ordinal_position;

-- Vérifier les types d'actes existants (sans la colonne code)
SELECT 
    id,
    nom,
    prix_base,
    ordre_affichage,
    actif
FROM types_actes
ORDER BY ordre_affichage, nom;
