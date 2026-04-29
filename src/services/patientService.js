import { supabase } from '../lib/supabase';

export const fetchPatients = async () => {
  const { data, error } = await supabase
    .from('patients')
    .select('id, nom, prenom, date_naissance, numero_dossier')
    .eq('actif', true)
    .order('nom');

  if (error) {
    console.error('Erreur lors du chargement des patients:', error);
    throw error;
  }
  
  return data || [];
};

/**
 * Génère automatiquement un numéro de dossier au format séquentiel XXXXXX
 * Passe automatiquement à 7 chiffres si le maximum est atteint
 * Vérifie l'unicité du numéro généré
 * @returns {Promise<string>} Le numéro de dossier généré
 */
export const generateNumeroDossier = async () => {
  try {
    let nextNumber = 1;
    let maxAttempts = 100;
    let attempts = 0;
    let paddedNumber = '';

    while (attempts < maxAttempts) {
      // Récupérer le dernier numéro de dossier
      const { data, error } = await supabase
        .from('patients')
        .select('numero_dossier')
        .not('numero_dossier', 'is', null)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data && data.numero_dossier) {
        // Essayer d'extraire le numéro séquentiel
        const lastNumber = parseInt(data.numero_dossier, 10);
        if (!isNaN(lastNumber)) {
          nextNumber = lastNumber + 1;
        }
      }

      // Déterminer le nombre de chiffres nécessaires
      // Si on dépasse 999999, passer à 7 chiffres
      let padding = 6;
      if (nextNumber > 999999) {
        padding = 7;
      } else if (nextNumber > 9999999) {
        padding = 8;
      }

      // Formater avec padding dynamique
      paddedNumber = String(nextNumber).padStart(padding, '0');

      // Vérifier si ce numéro existe déjà
      const { data: existingData, error: checkError } = await supabase
        .from('patients')
        .select('id')
        .eq('numero_dossier', paddedNumber)
        .maybeSingle();

      if (checkError) throw checkError;

      // Si le numéro n'existe pas, on peut l'utiliser
      if (!existingData) {
        return paddedNumber;
      }

      // Si le numéro existe déjà, essayer le suivant
      nextNumber++;
      attempts++;
    }

    // Si on a atteint le nombre maximum de tentatives, utiliser un timestamp
    console.warn('Impossible de générer un numéro unique après %d tentatives, utilisation du timestamp', maxAttempts);
    const timestamp = Date.now().toString().slice(-6);
    return timestamp.padStart(6, '0');
  } catch (error) {
    console.error('Erreur lors de la génération du numéro de dossier:', error);
    // En cas d'erreur, retourner un format basé sur le timestamp
    const timestamp = Date.now().toString().slice(-6);
    return timestamp.padStart(6, '0');
  }
};
