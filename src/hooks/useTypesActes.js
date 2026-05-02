import { useState, useEffect, useCallback } from 'react';
import { typesActesService } from '../services/parametrage/typesActesService';
import { supabase } from '../lib/supabase'; // Gardé pour fetchSpecialites si besoin, ou déplacer dans un service de référence
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook pour gérer la logique des types d'actes.
 * Sépare la logique de données de la vue.
 */
export const useTypesActes = () => {
  const [actes, setActes] = useState([]);
  const [specialites, setSpecialites] = useState([]); // Liste de référence pour les sélecteurs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { userProfile } = useAuth();

  // --- Chargement des données ---

  const fetchActes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await typesActesService.getAll();
      
      // Filtrer selon la spécialité de l'utilisateur connecté
      let filteredData = data;
      if (userProfile?.specialite) {
        const userSpec = userProfile.specialite.toLowerCase();
        filteredData = data.filter(acte => 
          // Garder les actes sans spécialité (génériques) ou liés à la spécialité de l'utilisateur
          acte.specialites_data.length === 0 || 
          acte.specialites_data.some(s => s.nom.toLowerCase() === userSpec)
        );
      }
      
      // Si la liste est vide, utiliser des actes par défaut
      if (!filteredData || filteredData.length === 0) {
        const defaultActes = [
          { id: 1, nom: 'Examen général', description: 'Examen clinique complet', tarif_defaut: 5000, specialites_data: [] },
          { id: 2, nom: 'Consultation dentaire', description: 'Consultation dentaire de base', tarif_defaut: 10000, specialites_data: [] },
          { id: 3, nom: 'Détartrage', description: 'Nettoyage dentaire professionnel', tarif_defaut: 15000, specialites_data: [] },
          { id: 4, nom: 'Extraction dentaire', description: 'Extraction de dent simple', tarif_defaut: 20000, specialites_data: [] },
          { id: 5, nom: 'Obturation', description: 'Plombage dentaire', tarif_defaut: 25000, specialites_data: [] },
          { id: 6, nom: 'Radiographie dentaire', description: 'Radio dentaire panoramique', tarif_defaut: 8000, specialites_data: [] },
          { id: 7, nom: 'Soins canalaires', description: 'Traitement endodontique', tarif_defaut: 50000, specialites_data: [] },
          { id: 8, nom: 'Couronne dentaire', description: 'Pose de couronne', tarif_defaut: 80000, specialites_data: [] },
          { id: 9, nom: 'Prothèse amovible', description: 'Dentier', tarif_defaut: 120000, specialites_data: [] },
          { id: 10, nom: 'Implant dentaire', description: 'Pose d\'implant', tarif_defaut: 200000, specialites_data: [] }
        ];
        setActes(defaultActes);
      } else {
        // S'assurer que "Examen général" est en premier
        const examenGeneral = filteredData.find(a => a.nom === 'Examen général');
        const otherActes = filteredData.filter(a => a.nom !== 'Examen général');
        if (examenGeneral) {
          setActes([examenGeneral, ...otherActes]);
        } else {
          // Si "Examen général" n'existe pas, l'ajouter en premier
          const newActe = { id: 999, nom: 'Examen général', description: 'Examen clinique complet', tarif_defaut: 5000, specialites_data: [] };
          setActes([newActe, ...filteredData]);
        }
      }
    } catch (err) {
      console.error('Erreur chargement actes:', err);
      setError(err);
      // En cas d'erreur, utiliser des actes par défaut
      const defaultActes = [
        { id: 1, nom: 'Examen général', description: 'Examen clinique complet', tarif_defaut: 5000, specialites_data: [] },
        { id: 2, nom: 'Consultation dentaire', description: 'Consultation dentaire de base', tarif_defaut: 10000, specialites_data: [] }
      ];
      setActes(defaultActes);
    } finally {
      setLoading(false);
    }
  }, [userProfile?.specialite]);

  const fetchSpecialites = useCallback(async () => {
    try {
      // Idéalement, ceci devrait être dans un specialitesService
      const { data, error } = await supabase
        .from('specialites')
        .select('id, nom')
        .order('nom', { ascending: true });
      
      if (error) throw error;
      setSpecialites(data || []);
    } catch (err) {
      console.error('Erreur chargement spécialités:', err);
    }
  }, []);

  useEffect(() => {
    fetchActes();
    fetchSpecialites();
  }, [fetchActes, fetchSpecialites, userProfile]);

  // --- Actions ---

  const createTypeActe = async (data) => {
    try {
      setLoading(true);
      await typesActesService.create(data);
      await fetchActes(); // Recharger la liste
      return { success: true };
    } catch (err) {
      console.error('Erreur création acte:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const updateTypeActe = async (id, data) => {
    try {
      setLoading(true);
      await typesActesService.update(id, data);
      await fetchActes();
      return { success: true };
    } catch (err) {
      console.error('Erreur modification acte:', err);
      setError(err);
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  const deleteTypeActe = async (id) => {
    try {
      setLoading(true);
      await typesActesService.delete(id);
      setActes(prev => prev.filter(a => a.id !== id)); // Optimistic UI update
      return { success: true };
    } catch (err) {
      console.error('Erreur suppression acte:', err);
      setError(err);
      // En cas d'erreur, on recharge pour être sûr de l'état
      await fetchActes(); 
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return {
    // Noms actuels
    actes,
    specialites,
    loading,
    error,
    refresh: fetchActes,
    createTypeActe,
    updateTypeActe,
    deleteTypeActe
    ,
    // Aliases pour compatibilité avec l'ancien code (ex: ActesModal, FacturationActes)
    typesActes: actes,
    refetch: fetchActes
  };
};
