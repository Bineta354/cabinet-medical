import { supabase } from '../lib/supabase';

const motifsConsultationService = {
  /**
   * Récupère les motifs de consultation pour une spécialité donnée
   */
  getMotifsForSelect: async (specialite = 'Généraliste') => {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .select('*')
        .eq('specialite', specialite)
        .or('specialite.is.null,specialite.eq.Généraliste');

      if (error) throw error;

      return (data || []).map(motif => ({
        id: motif.id,
        label: motif.nom,
        description: motif.description
      }));
    } catch (error) {
      console.error('Erreur lors du chargement des motifs:', error);
      return [];
    }
  },

  /**
   * Retourne les motifs par défaut pour le select
   */
  getDefaultMotifsForSelect: () => {
    return [
      { id: 1, label: 'Consultation générale', description: 'Examen médical général' },
      { id: 2, label: 'Suivi post-consultation', description: 'Suivi après une consultation précédente' },
      { id: 3, label: 'Urgence', description: 'Consultation urgente' },
      { id: 4, label: 'Contrôle', description: 'Contrôle de routine' },
      { id: 5, label: 'Vaccination', description: 'Administration de vaccins' },
      { id: 6, label: 'Ordonnance', description: 'Renouvellement d\'ordonnance' },
      { id: 7, label: 'Certificat', description: 'Délivrance de certificat médical' },
      { id: 8, label: 'Autre', description: 'Autre motif de consultation' }
    ];
  },

  /**
   * Crée un nouveau motif de consultation
   */
  createMotif: async (motifData) => {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .insert([motifData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du motif:', error);
      throw error;
    }
  }
};

export default motifsConsultationService;
