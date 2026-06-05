import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Erreur: VITE_SUPABASE_URL ou VITE_SUPABASE_SERVICE_KEY non défini dans .env');
  process.exit(1);
}

// Créer un client admin avec la clé de service
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

console.log('🔧 Début du nettoyage des données orphelines...\n');

async function cleanupOrphanedData() {
  try {
    // ÉTAPE 1: Identifier les données orphelines
    console.log('📊 ÉTAPE 1: Identification des données orphelines...\n');

    // Identifier les rendez-vous orphelins directement via SQL
    const { data: orphanedAppointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('id, patient_id, medecin_id, date_heure, patients!inner(nom, prenom)')
      .not('medecin_id', 'in', '(SELECT id FROM users WHERE role = \'doctor\')');

    if (appointmentsError) {
      console.error('❌ Erreur lors de l\'identification des rendez-vous orphelins:', appointmentsError);
    } else {
      console.log(`📋 Rendez-vous orphelins trouvés: ${orphanedAppointments?.length || 0}`);
      if (orphanedAppointments && orphanedAppointments.length > 0) {
        console.log('Détails:', orphanedAppointments.slice(0, 5));
      }
    }

    // Identifier les consultations orphelines
    const { data: orphanedConsultations, error: consultationsError } = await supabase
      .from('consultations')
      .select('id, patient_id, medecin_id, date_consultation, patients!inner(nom, prenom)')
      .not('medecin_id', 'in', '(SELECT id FROM users WHERE role = \'doctor\')');

    if (consultationsError) {
      console.error('❌ Erreur lors de l\'identification des consultations orphelines:', consultationsError);
    } else {
      console.log(`📋 Consultations orphelines trouvées: ${orphanedConsultations?.length || 0}`);
      if (orphanedConsultations && orphanedConsultations.length > 0) {
        console.log('Détails:', orphanedConsultations.slice(0, 5));
      }
    }

    // Identifier la file d'attente orpheline
    const { data: orphanedWaitingQueue, error: waitingQueueError } = await supabase
      .from('waiting_queue')
      .select('id, patient_id, medecin_id, status, patients!inner(nom, prenom)')
      .not('medecin_id', 'in', '(SELECT id FROM users WHERE role = \'doctor\')');

    if (waitingQueueError) {
      console.error('❌ Erreur lors de l\'identification de la file d\'attente orpheline:', waitingQueueError);
    } else {
      console.log(`📋 File d'attente orpheline trouvée: ${orphanedWaitingQueue?.length || 0}`);
      if (orphanedWaitingQueue && orphanedWaitingQueue.length > 0) {
        console.log('Détails:', orphanedWaitingQueue.slice(0, 5));
      }
    }

    // ÉTAPE 2: Supprimer les données orphelines
    console.log('\n🗑️  ÉTAPE 2: Suppression des données orphelines...\n');

    // Récupérer d'abord les IDs des médecins actifs
    const { data: activeDoctors, error: doctorsError } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'doctor');

    if (doctorsError) {
      console.error('❌ Erreur lors de la récupération des médecins actifs:', doctorsError);
      return;
    }

    const activeDoctorIds = activeDoctors?.map(d => d.id) || [];
    console.log(`👨‍⚕️ Médecins actifs: ${activeDoctorIds.length}`);

    if (activeDoctorIds.length === 0) {
      console.log('⚠️  Aucun médecin actif trouvé, suppression de toutes les données...');
    }

    // Supprimer les prescriptions orphelines
    console.log('Suppression des prescriptions orphelines...');
    let prescriptionsDeleted = 0;
    if (activeDoctorIds.length > 0) {
      const { error: prescriptionsError } = await supabase
        .from('prescriptions')
        .delete()
        .not('medecin_id', 'in', `(${activeDoctorIds.join(',')})`);

      if (prescriptionsError) {
        console.error('❌ Erreur lors de la suppression des prescriptions:', prescriptionsError);
      } else {
        console.log('✅ Prescriptions orphelines supprimées');
        prescriptionsDeleted = 1;
      }
    } else {
      const { error: prescriptionsError } = await supabase
        .from('prescriptions')
        .delete()
        .neq('medecin_id', 0);

      if (prescriptionsError) {
        console.error('❌ Erreur lors de la suppression des prescriptions:', prescriptionsError);
      } else {
        console.log('✅ Toutes les prescriptions supprimées');
        prescriptionsDeleted = 1;
      }
    }

    // Supprimer les rendez-vous orphelins
    console.log('Suppression des rendez-vous orphelins...');
    if (activeDoctorIds.length > 0) {
      const { error: appointmentsDeleteError } = await supabase
        .from('appointments')
        .delete()
        .not('medecin_id', 'in', `(${activeDoctorIds.join(',')})`);

      if (appointmentsDeleteError) {
        console.error('❌ Erreur lors de la suppression des rendez-vous:', appointmentsDeleteError);
      } else {
        console.log('✅ Rendez-vous orphelins supprimés');
      }
    } else {
      const { error: appointmentsDeleteError } = await supabase
        .from('appointments')
        .delete()
        .neq('medecin_id', 0);

      if (appointmentsDeleteError) {
        console.error('❌ Erreur lors de la suppression des rendez-vous:', appointmentsDeleteError);
      } else {
        console.log('✅ Tous les rendez-vous supprimés');
      }
    }

    // Supprimer les consultations orphelines
    console.log('Suppression des consultations orphelines...');
    if (activeDoctorIds.length > 0) {
      const { error: consultationsDeleteError } = await supabase
        .from('consultations')
        .delete()
        .not('medecin_id', 'in', `(${activeDoctorIds.join(',')})`);

      if (consultationsDeleteError) {
        console.error('❌ Erreur lors de la suppression des consultations:', consultationsDeleteError);
      } else {
        console.log('✅ Consultations orphelines supprimées');
      }
    } else {
      const { error: consultationsDeleteError } = await supabase
        .from('consultations')
        .delete()
        .neq('medecin_id', 0);

      if (consultationsDeleteError) {
        console.error('❌ Erreur lors de la suppression des consultations:', consultationsDeleteError);
      } else {
        console.log('✅ Toutes les consultations supprimées');
      }
    }

    // Supprimer la file d'attente orpheline
    console.log('Suppression de la file d\'attente orpheline...');
    if (activeDoctorIds.length > 0) {
      const { error: waitingQueueDeleteError } = await supabase
        .from('waiting_queue')
        .delete()
        .not('medecin_id', 'in', `(${activeDoctorIds.join(',')})`);

      if (waitingQueueDeleteError) {
        console.error('❌ Erreur lors de la suppression de la file d\'attente:', waitingQueueDeleteError);
      } else {
        console.log('✅ File d\'attente orpheline supprimée');
      }
    } else {
      const { error: waitingQueueDeleteError } = await supabase
        .from('waiting_queue')
        .delete()
        .neq('medecin_id', 0);

      if (waitingQueueDeleteError) {
        console.error('❌ Erreur lors de la suppression de la file d\'attente:', waitingQueueDeleteError);
      } else {
        console.log('✅ Toute la file d\'attente supprimée');
      }
    }

    // Supprimer les patients qui n'ont plus de données liées
    console.log('Suppression des patients sans données liées...');
    const { error: patientsDeleteError } = await supabase
      .from('patients')
      .delete()
      .not('id', 'in', '(SELECT DISTINCT patient_id FROM appointments WHERE patient_id IS NOT NULL)');

    if (patientsDeleteError) {
      console.error('❌ Erreur lors de la suppression des patients:', patientsDeleteError);
    } else {
      console.log('✅ Patients sans données liées supprimés');
    }

    // ÉTAPE 3: Créer le trigger pour suppression automatique
    console.log('\n⚙️  ÉTAPE 3: Création du trigger pour suppression automatique...\n');
    console.log('⚠️  Note: Le trigger doit être créé manuellement via le SQL Dashboard Supabase');
    console.log('📄 Voir le fichier: supabase/create_rpc_functions.sql');

    // ÉTAPE 4: Vérification
    console.log('\n✅ ÉTAPE 4: Vérification finale...\n');

    // Vérifier les prescriptions orphelines
    const { count: prescriptionsCount, error: prescriptionsCheckError } = await supabase
      .from('prescriptions')
      .select('*', { count: 'exact', head: true });

    if (prescriptionsCheckError) {
      console.error('❌ Erreur lors de la vérification des prescriptions:', prescriptionsCheckError);
    } else {
      console.log(`📊 Prescriptions restantes: ${prescriptionsCount || 0}`);
    }

    // Vérifier les rendez-vous orphelins
    const { count: appointmentsCount, error: appointmentsCheckError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    if (appointmentsCheckError) {
      console.error('❌ Erreur lors de la vérification des rendez-vous:', appointmentsCheckError);
    } else {
      console.log(`📊 Rendez-vous restants: ${appointmentsCount || 0}`);
    }

    // Vérifier les consultations orphelines
    const { count: consultationsCount, error: consultationsCheckError } = await supabase
      .from('consultations')
      .select('*', { count: 'exact', head: true });

    if (consultationsCheckError) {
      console.error('❌ Erreur lors de la vérification des consultations:', consultationsCheckError);
    } else {
      console.log(`📊 Consultations restantes: ${consultationsCount || 0}`);
    }

    // Vérifier la file d'attente orpheline
    const { count: waitingQueueCount, error: waitingQueueCheckError } = await supabase
      .from('waiting_queue')
      .select('*', { count: 'exact', head: true });

    if (waitingQueueCheckError) {
      console.error('❌ Erreur lors de la vérification de la file d\'attente:', waitingQueueCheckError);
    } else {
      console.log(`📊 File d'attente restante: ${waitingQueueCount || 0}`);
    }

    console.log('\n🎉 Nettoyage terminé avec succès!');
    console.log('\n📝 Prochaine étape: Exécuter le fichier SQL supabase/create_rpc_functions.sql dans le SQL Dashboard Supabase pour créer le trigger automatique.');

  } catch (error) {
    console.error('💥 Erreur inattendue:', error);
    process.exit(1);
  }
}

// Exécuter le nettoyage
cleanupOrphanedData();
