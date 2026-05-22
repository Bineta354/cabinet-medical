import { normalizeQueueStatus } from './waitingQueueStatus';

const WORKFLOW_ORDER = [
  'waiting',
  'en_attente',
  'present',
  'arrive',
  'authorized',
  'appele',
  'called',
  'medecin_pret',
  'en_route',
  'entre',
  'in_consultation',
  'en_consultation',
];

const STEP_LABELS = {
  waiting: 'Enregistrement en file',
  en_attente: 'En attente',
  present: 'Patient présent',
  arrive: 'Patient arrivé',
  authorized: 'Autorisation',
  appele: 'Patient appelé',
  called: 'Patient appelé',
  medecin_pret: 'Médecin prêt',
  en_route: 'Envoi vers le médecin',
  entre: 'Entrée au cabinet',
  in_consultation: 'Consultation',
  en_consultation: 'Consultation',
};

const indexOfStatus = (status) => {
  const n = normalizeQueueStatus(status);
  const idx = WORKFLOW_ORDER.indexOf(n);
  return idx === -1 ? -1 : idx;
};

/**
 * Détecte les étapes sautées entre le statut actuel et la cible.
 */
export const getSkippedWorkflowSteps = (fromStatus, toStatus) => {
  const fromIdx = indexOfStatus(fromStatus);
  const toIdx = indexOfStatus(toStatus);
  if (fromIdx < 0 || toIdx < 0 || toIdx <= fromIdx + 1) {
    return [];
  }
  return WORKFLOW_ORDER.slice(fromIdx + 1, toIdx).map(
    (key) => STEP_LABELS[key] || key,
  );
};

export const confirmSkippedWorkflowSteps = (
  skippedSteps,
  actionLabel = 'continuer',
) => {
  if (!skippedSteps?.length) return true;
  const list = skippedSteps.join(', ');
  return window.confirm(
    `Certaines étapes n'ont pas été effectuées (${list}).\n\nVoulez-vous quand même ${actionLabel} ?`,
  );
};

export const validateQueueTransition = (fromStatus, toStatus) => {
  const skippedSteps = getSkippedWorkflowSteps(fromStatus, toStatus);
  return {
    allowed: true,
    skippedSteps,
    needsConfirmation: skippedSteps.length > 0,
  };
};
