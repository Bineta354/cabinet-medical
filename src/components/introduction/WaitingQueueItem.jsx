import React from 'react';
import { Clock, CheckCircle, UserCheck, Activity, Phone, CheckSquare } from 'lucide-react';

const WaitingQueueItem = ({ item, index, onAuthorize, onMarkInConsultation, isLoading }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'waiting':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' };
      case 'present':
        return { color: 'bg-blue-100 text-blue-800', label: 'Présent' };
      case 'called':
        return { color: 'bg-orange-100 text-orange-800', label: 'Appelé' };
      case 'medecin_pret':
        return { color: 'bg-cyan-100 text-cyan-800', label: 'Médecin prêt' };
      case 'en_route':
        return { color: 'bg-purple-100 text-purple-800', label: 'Patient appelé' };
      case 'in_consultation':
        return { color: 'bg-purple-100 text-purple-800', label: 'En consultation' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: status };
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'arrive':
        return { color: 'bg-orange-100 text-orange-800', icon: Clock, label: 'En attente du médecin' };
      case 'medecin_pret':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Médecin prêt' };
      case 'en_route':
        return { color: 'bg-blue-100 text-blue-800', icon: UserCheck, label: 'Patient appelé' };
      case 'in_consultation':
        return { color: 'bg-purple-100 text-purple-800', icon: Activity, label: 'En consultation' };
      case 'appele':
        return { color: 'bg-yellow-100 text-yellow-800', icon: Phone, label: 'Patient appelé' };
      case 'authorized':
        return { color: 'bg-indigo-100 text-indigo-800', icon: CheckCircle, label: 'Médecin va recevoir' };
      default:
        return { color: 'bg-gray-100 text-gray-600', icon: Clock, label: status };
    }
  };

  const statusConfig = getStatusConfig(item.status);
  const statusIndicator = getStatusIndicator(item.status);
  const StatusIcon = statusIndicator.icon;
  const isDisabled = ['in_consultation'].includes(item.status);
  const isReady = ['medecin_pret', 'authorized'].includes(item.status);
  const isEnRoute = item.status === 'en_route';

  return (
    <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-medical-primary text-white rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <p className="font-medium text-gray-900 text-sm truncate">
                {item.patient?.prenom} {item.patient?.nom}
              </p>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate">
              Dr. {item.medecin?.prenom} {item.medecin?.nom}
            </p>
          </div>
        </div>
        {item.created_at && (
          <p className="text-xs text-gray-400 flex-shrink-0">
            {new Date(item.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className={`px-2 py-1 rounded text-xs flex items-center gap-1.5 ${statusIndicator.color}`}>
          <StatusIcon className="w-3 h-3" />
          {statusIndicator.label}
        </div>
        
        {/* Affichage conditionnel des boutons selon le statut */}
        {/* Bouton d'introduction manuelle pour la secrétaire (statut: waiting) */}
        {item.status === 'waiting' && (
          <button
            onClick={() => onAuthorize(item.id)}
            disabled={isLoading.actions}
            className="px-3 py-1.5 rounded text-white text-xs transition-colors flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600"
            title="Introduire le patient manuellement"
          >
            <CheckSquare className="w-3 h-3" />
            Introduire
          </button>
        )}
        
        {/* Bouton pour confirmer que le patient a été appelé (statut: en_attente) */}
        {item.status === 'en_attente' && (
          <button
            onClick={() => onAuthorize(item.id)}
            disabled={isLoading.actions}
            className="px-3 py-1.5 rounded text-white text-xs transition-colors flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600"
            title="Confirmer que le patient a été appelé"
          >
            <CheckSquare className="w-3 h-3" />
            Patient appelé
          </button>
        )}
        
        {/* Bouton pour marquer le patient comme entré en consultation (statut: called) */}
        {item.status === 'called' && onMarkInConsultation && (
          <button
            onClick={() => onMarkInConsultation(item.id)}
            disabled={isLoading.actions}
            className="px-3 py-1.5 rounded text-white text-xs transition-colors flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700"
            title="Confirmer que le patient est physiquement dans le bureau"
          >
            <Activity className="w-3 h-3" />
            Entré en consultation
          </button>
        )}
        
        {/* Bouton pour appeler le patient quand le médecin est prêt (statut: medecin_pret) */}
        {item.status === 'medecin_pret' && (
          <button
            onClick={() => onAuthorize(item.id)}
            disabled={isLoading.actions}
            className="px-3 py-1.5 rounded text-white text-xs transition-colors flex items-center gap-1.5 bg-green-600 hover:bg-green-700"
            title="Appeler patient"
          >
            <CheckSquare className="w-3 h-3" />
            Appeler
          </button>
        )}
        
        {/* Bouton pour autoriser le patient (statut: authorized) */}
        {item.status === 'authorized' && (
          <button
            onClick={() => onAuthorize(item.id)}
            disabled={isLoading.actions}
            className="px-3 py-1.5 rounded text-white text-xs transition-colors flex items-center gap-1.5 bg-green-600 hover:bg-green-700"
            title="Médecin va recevoir - Autoriser maintenant"
          >
            <CheckSquare className="w-3 h-3" />
            Autoriser
          </button>
        )}
      </div>
    </div>
  );
};

export default WaitingQueueItem;
