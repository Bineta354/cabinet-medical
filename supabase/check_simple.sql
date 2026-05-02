-- Vérification simple des tables existantes
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND (table_name = 'motifs_consultation' OR table_name = 'types_actes')
ORDER BY table_name;
