import { supabase } from '../lib/supabase';
import motifsConsultationService from '../services/motifsConsultationService';

/**
 * Script de test pour vérifier l'implémentation des motifs
 */
export const testMotifsImplementation = async () => {
  console.log('=== TEST D\'IMPLÉMENTATION DES MOTIFS ===');
  
  try {
    // 1. Vérifier si la table existe
    console.log('\n1. Vérification de la table motifs_consultation...');
    try {
      const { data, error } = await supabase
        .from('motifs_consultation')
        .select('count')
        .limit(1);
      
      if (error) {
        if (error.code === '42P01') {
          console.log('❌ Table n\'existe pas encore');
          console.log('   Code d\'erreur:', error.code);
          console.log('   Message:', error.message);
          return { success: false, error: 'Table does not exist' };
        }
        throw error;
      }
      
      console.log('✅ Table existe');
    } catch (err) {
      console.log('❌ Erreur lors de la vérification:', err.message);
      return { success: false, error: err.message };
    }

    // 2. Tester le service de motifs
    console.log('\n2. Test du service motifsConsultationService...');
    try {
      const motifs = await motifsConsultationService.getMotifsForSelect('Dentiste');
      console.log(`✅ Service fonctionne - ${motifs.length} motifs chargés`);
      
      motifs.forEach((motif, index) => {
        console.log(`   ${index + 1}. ${motif.label}: ${motif.description}`);
      });
      
      return { success: true, motifs };
    } catch (err) {
      console.log('❌ Erreur du service:', err.message);
      
      // Tester le fallback
      console.log('\n3. Test du fallback...');
      const defaultMotifs = motifsConsultationService.getDefaultMotifsForSelect();
      console.log(`✅ Fallback fonctionne - ${defaultMotifs.length} motifs par défaut`);
      
      return { success: true, fallback: true, motifs: defaultMotifs };
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Fonction pour exécuter le test dans la console du navigateur
 */
export const runTestInConsole = () => {
  console.log('Pour tester les motifs, exécutez dans la console:');
  console.log('import { testMotifsImplementation } from "./src/utils/testMotifs.js";');
  console.log('testMotifsImplementation();');
};

export default testMotifsImplementation;
