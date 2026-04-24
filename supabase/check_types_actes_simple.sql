-- Vérifier tous les types d'actes existants
SELECT 
    *
FROM types_actes
ORDER BY ordre_affichage, nom
LIMIT 50;
