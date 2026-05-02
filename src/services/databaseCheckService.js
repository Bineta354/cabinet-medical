import { supabase } from '../lib/supabase';

/**
 * Service pour vérifier l'état de la base de données
 */
export const databaseCheckService = {
  /**
   * Vérifier si la table motifs_consultation existe
   */
  async checkMotifsTable() {
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .select('count')
        .limit(1);

      if (error) {
        if (error.code === '42P01') {
          console.log('❌ Table motifs_consultation n\'existe pas');
          return { exists: false, error: error.message };
        }
        throw error;
      }

      console.log('✅ Table motifs_consultation existe');
      return { exists: true, data };
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return { exists: false, error: error.message };
    }
  },

  /**
   * Créer la table motifs_consultation si elle n'existe pas
   */
  async createMotifsTableIfNotExists() {
    try {
      // D'abord vérifier si elle existe
      const check = await this.checkMotifsTable();
      if (check.exists) {
        return { success: true, message: 'Table existe déjà' };
      }

      // Créer la table via RPC
      const { data, error } = await supabase.rpc('create_motifs_consultation_table');
      
      if (error) {
        console.error('Erreur lors de la création:', error);
        return { success: false, error: error.message };
      }

      console.log('✅ Table créée avec succès');
      return { success: true, data };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Comparer les motifs avec les types d'actes
   */
  async compareMotifsAndActes() {
    try {
      // Récupérer les motifs
      const { data: motifs, error: motifsError } = await supabase
        .from('motifs_consultation')
        .select('nom, description, ordre')
        .eq('actif', true)
        .order('ordre, nom');

      if (motifsError) throw motifsError;

      // Récupérer les actes
      const { data: actes, error: actesError } = await supabase
        .from('types_actes')
        .select('nom, prix_base, ordre_affichage')
        .eq('actif', true)
        .order('ordre_affichage, nom');

      if (actesError) throw actesError;

      // Analyser les similitudes
      const comparison = [];
      
      motifs?.forEach(motif => {
        actes?.forEach(acte => {
          const motifLower = motif.nom.toLowerCase();
          const acteLower = acte.nom.toLowerCase();
          
          let similarite = 'Différent';
          if (motifLower === acteLower) {
            similarite = 'Identique';
          } else if (motifLower.includes(acteLower) || acteLower.includes(motifLower)) {
            similarite = 'Similaire';
          }

          if (similarite !== 'Différent') {
            comparison.push({
              motif_nom: motif.nom,
              motif_description: motif.description,
              acte_nom: acte.nom,
              acte_prix: acte.prix_base,
              similarite
            });
          }
        });
      });

      return {
        motifs: motifs || [],
        actes: actes || [],
        comparison
      };
    } catch (error) {
      console.error('Erreur lors de la comparaison:', error);
      return { error: error.message };
    }
  },

  /**
   * Afficher un rapport complet
   */
  async generateReport() {
    const tableCheck = await this.checkMotifsTable();
    const comparison = await this.compareMotifsAndActes();

    console.log('=== RAPPORT DE BASE DE DONNÉES ===');
    console.log('Table motifs_consultation:', tableCheck.exists ? '✅ Existe' : '❌ N\'existe pas');
    
    if (comparison.motifs) {
      console.log('\n=== MOTIFS DE CONSULTATION ===');
      comparison.motifs.forEach(m => {
        console.log(`- ${m.nom}: ${m.description}`);
      });
    }

    if (comparison.actes) {
      console.log('\n=== TYPES D\'ACTES ===');
      comparison.actes.forEach(a => {
        console.log(`- ${a.nom}: ${a.prix_base}€`);
      });
    }

    if (comparison.comparison && comparison.comparison.length > 0) {
      console.log('\n=== SIMILITUDES TROUVÉES ===');
      comparison.comparison.forEach(c => {
        console.log(`- ${c.similarite}: "${c.motif_nom}" ↔ "${c.acte_nom}"`);
      });
    } else {
      console.log('\n=== AUCUNE SIMILITUDE TROUVÉE ===');
    }

    return { tableCheck, comparison };
  }
};

export default databaseCheckService;
