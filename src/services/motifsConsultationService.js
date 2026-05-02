import { supabase } from '../lib/supabase';

/**
 * Service pour gérer les motifs de consultation
 */
export const motifsConsultationService = {
  /**
   * Récupérer tous les motifs de consultation actifs
   * @param {string} specialiteId - Optionnel: filtrer par spécialité
   * @returns {Promise<Array>} Liste des motifs
   */
  async getMotifs(specialiteId = null) {
    try {
      let query = supabase
        .from('motifs_consultation')
        .select('*')
        .eq('actif', true)
        .order('ordre', { ascending: true })
        .order('nom', { ascending: true });

      if (specialiteId) {
        query = query.eq('specialite_id', specialiteId);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des motifs:', error);
      throw error;
    }
  },

  /**
   * Récupérer les motifs par spécialité
   * @param {string} specialiteNom - Nom de la spécialité (ex: 'Dentiste')
   * @returns {Promise<Array>} Liste des motifs pour la spécialité
   */
  async getMotifsBySpecialiteName(specialiteNom) {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .select(`
          *,
          specialites:specialites(id, nom)
        `)
        .eq('actif', true)
        .eq('specialites.nom', specialiteNom)
        .order('ordre', { ascending: true })
        .order('nom', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération des motifs par spécialité:', error);
      throw error;
    }
  },

  /**
   * Créer un nouveau motif de consultation
   * @param {Object} motif - Données du motif
   * @returns {Promise<Object>} Motif créé
   */
  async createMotif(motif) {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .insert([motif])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du motif:', error);
      throw error;
    }
  },

  /**
   * Mettre à jour un motif de consultation
   * @param {string} id - ID du motif
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>} Motif mis à jour
   */
  async updateMotif(id, updates) {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du motif:', error);
      throw error;
    }
  },

  /**
   * Désactiver un motif (suppression douce)
   * @param {string} id - ID du motif
   * @returns {Promise<Object>} Motif désactivé
   */
  async desactiverMotif(id) {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .update({ actif: false })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur lors de la désactivation du motif:', error);
      throw error;
    }
  },

  /**
   * Réorganiser l'ordre des motifs
   * @param {Array} motifsOrder - Tableau des motifs avec leur nouvel ordre
   * @returns {Promise<void>}
   */
  async reorderMotifs(motifsOrder) {
    try {
      const updates = motifsOrder.map(({ id, ordre }) => 
        supabase
          .from('motifs_consultation')
          .update({ ordre })
          .eq('id', id)
      );

      await Promise.all(updates);
    } catch (error) {
      console.error('Erreur lors de la réorganisation des motifs:', error);
      throw error;
    }
  },

  /**
   * Obtenir les motifs au format pour les listes déroulantes
   * @param {string} specialiteNom - Optionnel: nom de la spécialité
   * @returns {Promise<Array>} Liste au format {value, label}
   */
  async getMotifsForSelect(specialiteNom = null) {
    try {
      const motifs = specialiteNom 
        ? await this.getMotifsBySpecialiteName(specialiteNom)
        : await this.getMotifs();

      return motifs.map(motif => ({
        value: motif.nom,
        label: motif.nom,
        description: motif.description,
        id: motif.id
      }));
    } catch (error) {
      console.error('Erreur lors de la préparation des motifs pour select:', error);
      // Retourner une liste par défaut en cas d'erreur
      return this.getDefaultMotifsForSelect();
    }
  },

  /**
   * Obtenir les motifs par défaut pour les listes déroulantes (fallback)
   * @returns {Array} Liste par défaut
   */
  getDefaultMotifsForSelect() {
    return [
      { value: 'Examen dentaire', label: 'Examen dentaire', description: 'Consultation dentaire générale' },
      { value: 'Nettoyage dentaire', label: 'Nettoyage dentaire', description: 'Détartrage et nettoyage' },
      { value: 'Extraction dentaire', label: 'Extraction dentaire', description: 'Extraction de dent' },
      { value: 'Soins dentaires', label: 'Soins dentaires', description: 'Soins dentaires divers' },
      { value: 'Orthodontie', label: 'Orthodontie', description: 'Consultation orthodontique' },
      { value: 'Implant dentaire', label: 'Implant dentaire', description: 'Consultation pour implant' },
      { value: 'Prothèse dentaire', label: 'Prothèse dentaire', description: 'Consultation pour prothèse' },
      { value: 'Blanchiment dentaire', label: 'Blanchiment dentaire', description: 'Blanchiment des dents' },
      { value: 'Urgence dentaire', label: 'Urgence dentaire', description: 'Urgence dentaire (douleur, traumatisme)' },
      { value: 'Contrôle post-traitement', label: 'Contrôle post-traitement', description: 'Suivi après traitement' },
      { value: 'Panoramique dentaire', label: 'Panoramique dentaire', description: 'Radiographie panoramique' },
      { value: 'Détartrage', label: 'Détartrage', description: 'Détartrage simple' },
      { value: 'Autre', label: 'Autre', description: 'Autre motif de consultation' }
    ];
  }
};

export default motifsConsultationService;
