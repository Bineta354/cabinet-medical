import { supabase } from '../lib/supabase';

/**
 * Service pour gérer les statuts de patients de manière unifiée
 */
export const patientStatusService = {
  /**
   * Met à jour automatiquement le statut d'un patient lors de la création d'un rendez-vous
   * @param {string} patientId - ID du patient
   * @param {Object} appointmentData - Données du rendez-vous
   */
  async updatePatientStatusOnAppointment(patientId, appointmentData) {
    try {
      console.log('🔄 [PatientStatus] Mise à jour statut patient pour RV:', patientId);
      
      // Vérifier si le patient est inactif
      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('actif')
        .eq('id', patientId)
        .single();

      if (patientError) throw patientError;

      // Si le patient est inactif, l'activer automatiquement
      if (!patient.actif) {
        console.log('📋 [PatientStatus] Patient inactif détecté, activation automatique...');
        
        const { error: updateError } = await supabase
          .from('patients')
          .update({ 
            actif: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', patientId);

        if (updateError) throw updateError;
        
        console.log('✅ [PatientStatus] Patient activé avec succès');
        
        // Notifier l'activation du patient
        this.notifyPatientStatusChange(patientId, 'inactif', 'actif', 'appointment_created');
      }

      // Ajouter le patient à la file d'attente si nécessaire
      await this.addToWaitingQueueIfNeeded(patientId, appointmentData);

      return { success: true, patientWasInactive: !patient.actif };
    } catch (error) {
      console.error('❌ [PatientStatus] Erreur mise à jour statut patient:', error);
      throw error;
    }
  },

  /**
   * Ajoute le patient à la file d'attente si le rendez-vous est aujourd'hui
   * @param {string} patientId - ID du patient
   * @param {Object} appointmentData - Données du rendez-vous
   */
  async addToWaitingQueueIfNeeded(patientId, appointmentData) {
    try {
      const appointmentDate = new Date(appointmentData.date_heure);
      const today = new Date();
      
      // Vérifier si le rendez-vous est aujourd'hui ou dans le futur proche
      const isToday = appointmentDate.toDateString() === today.toDateString();
      const isTomorrow = appointmentDate <= new Date(today.getTime() + 24 * 60 * 60 * 1000);
      
      if (isToday || isTomorrow) {
        console.log('📋 [PatientStatus] Ajout à la file d\'attente...');
        
        // Vérifier si le patient est déjà dans la file d'attente
        const { data: existingEntry, error: checkError } = await supabase
          .from('waiting_queue')
          .select('*')
          .eq('patient_id', patientId)
          .eq('medecin_id', appointmentData.medecin_id)
          .in('status', ['waiting', 'called'])
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }

        // Si pas déjà dans la file, l'ajouter
        if (!existingEntry) {
          const { error: insertError } = await supabase
            .from('waiting_queue')
            .insert({
              patient_id: patientId,
              medecin_id: appointmentData.medecin_id,
              appointment_id: appointmentData.id || null,
              status: 'waiting',
              motif: appointmentData.motif || 'Rendez-vous',
              priorite: this.determinePriority(appointmentData),
              arrived_at: new Date().toISOString()
            });

          if (insertError) throw insertError;
          
          console.log('✅ [PatientStatus] Patient ajouté à la file d\'attente');
        } else {
          console.log('ℹ️ [PatientStatus] Patient déjà dans la file d\'attente');
        }
      }
    } catch (error) {
      console.error('❌ [PatientStatus] Erreur ajout file d\'attente:', error);
      // Ne pas bloquer la création du RV si l'ajout à la file échoue
    }
  },

  /**
   * Détermine la priorité du patient dans la file d'attente
   * @param {Object} appointmentData - Données du rendez-vous
   */
  determinePriority(appointmentData) {
    const motif = (appointmentData.motif || '').toLowerCase();
    
    if (motif.includes('urgence') || motif.includes('douleur')) {
      return 'urgente';
    }
    
    if (motif.includes('chirurgie') || motif.includes('extraction')) {
      return 'urgente';
    }
    
    return 'normale';
  },

  /**
   * Notifie les changements de statut de patient
   * @param {string} patientId - ID du patient
   * @param {string} oldStatus - Ancien statut
   * @param {string} newStatus - Nouveau statut
   * @param {string} reason - Raison du changement
   */
  notifyPatientStatusChange(patientId, oldStatus, newStatus, reason) {
    console.log(`🔔 [PatientStatus] Changement statut patient ${patientId}: ${oldStatus} → ${newStatus} (${reason})`);
    
    // TODO: Intégrer avec le service de notification
    // Pour l'instant, juste un log console
  },

  /**
   * Vérifie l'état d'un patient (actif/inactif + file d'attente)
   * @param {string} patientId - ID du patient
   */
  async getPatientFullStatus(patientId) {
    try {
      const [patientResult, waitingResult] = await Promise.all([
        supabase
          .from('patients')
          .select('id, nom, prenom, actif, created_at, updated_at')
          .eq('id', patientId)
          .single(),
        supabase
          .from('waiting_queue')
          .select('*')
          .eq('patient_id', patientId)
          .in('status', ['waiting', 'called', 'in_consultation'])
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
      ]);

      return {
        patient: patientResult.data,
        waitingQueue: waitingResult.data,
        isActive: patientResult.data?.actif || false,
        isInQueue: !!waitingResult.data,
        queueStatus: waitingResult.data?.status || null
      };
    } catch (error) {
      console.error('❌ [PatientStatus] Erreur récupération statut complet:', error);
      throw error;
    }
  },

  /**
   * Synchronise les statuts entre les différentes tables
   * @param {string} patientId - ID du patient
   */
  async syncPatientStatuses(patientId) {
    try {
      console.log('🔄 [PatientStatus] Synchronisation statuts patient:', patientId);
      
      // Récupérer le statut actuel du patient
      const { data: patient } = await supabase
        .from('patients')
        .select('actif')
        .eq('id', patientId)
        .single();

      if (!patient) throw new Error('Patient non trouvé');

      // Si le patient est inactif mais a des rendez-vous futurs, l'activer
      const { data: futureAppointments } = await supabase
        .from('appointments')
        .select('id')
        .eq('patient_id', patientId)
        .gte('date_heure', new Date().toISOString())
        .limit(1);

      if (!patient.actif && futureAppointments && futureAppointments.length > 0) {
        await supabase
          .from('patients')
          .update({ actif: true })
          .eq('id', patientId);
        
        console.log('✅ [PatientStatus] Patient activé (RV futurs détectés)');
      }

      return { success: true };
    } catch (error) {
      console.error('❌ [PatientStatus] Erreur synchronisation:', error);
      throw error;
    }
  }
};

export default patientStatusService;
