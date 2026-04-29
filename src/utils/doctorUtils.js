/**
 * Utilitaires pour l'affichage des médecins et leurs spécialités
 */

/**
 * Formate l'affichage d'un médecin avec ses spécialités
 * @param {Object} doctor - Données du médecin
 * @param {boolean} includeName - Inclure le nom du médecin (défaut: false pour cabinet dentaire)
 * @returns {string} - Texte formaté
 */
export const formatDoctorDisplay = (doctor, includeName = false) => {
  if (!doctor) return 'Médecin inconnu';
  
  // Récupérer les spécialités
  let specialties = [];
  
  // Spécialité principale
  if (doctor.specialite) {
    specialties.push(doctor.specialite);
  }
  
  // Spécialités additionnelles (si disponibles)
  if (doctor.specialite_ids && doctor.specialites && Array.isArray(doctor.specialites)) {
    const additionalSpecialties = doctor.specialites
      .filter(s => s.id !== doctor.specialite_id)
      .map(s => s.nom);
    specialties.push(...additionalSpecialties);
  }
  
  // Si aucune spécialité, utiliser "Généraliste"
  if (specialties.length === 0) {
    specialties.push('Généraliste');
  }
  
  // Formatage selon le contexte
  if (includeName) {
    // Afficher nom + spécialités
    return `Dr. ${doctor.prenom} ${doctor.nom} - ${specialties.join(', ')}`;
  } else {
    // Afficher seulement les spécialités (pour cabinet dentaire)
    return specialties.join(', ');
  }
};

/**
 * Formate l'affichage des spécialités d'un médecin
 * @param {Object} doctor - Données du médecin
 * @returns {string} - Spécialités formatées
 */
export const formatDoctorSpecialties = (doctor) => {
  if (!doctor) return 'Généraliste';
  
  let specialties = [];
  
  // Spécialité principale
  if (doctor.specialite) {
    specialties.push(doctor.specialite);
  }
  
  // Spécialités additionnelles
  if (doctor.specialite_ids && doctor.specialites && Array.isArray(doctor.specialites)) {
    const additionalSpecialties = doctor.specialites
      .filter(s => s.id !== doctor.specialite_id)
      .map(s => s.nom);
    specialties.push(...additionalSpecialties);
  }
  
  return specialties.length > 0 ? specialties.join(', ') : 'Généraliste';
};

/**
 * Génère les initiales d'un médecin
 * @param {Object} doctor - Données du médecin
 * @returns {string} - Initiales
 */
export const getDoctorInitials = (doctor) => {
  if (!doctor || !doctor.prenom || !doctor.nom) return 'DR';
  return `${doctor.prenom[0].toUpperCase()}${doctor.nom[0].toUpperCase()}`;
};
