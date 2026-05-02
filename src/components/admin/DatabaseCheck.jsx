import React, { useState, useEffect } from 'react';
import databaseCheckService from '../services/databaseCheckService';
import { Database, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const DatabaseCheck = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    generateReport();
  }, []);

  const generateReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await databaseCheckService.generateReport();
      setReport(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-600 mr-2" />
        <span>Analyse de la base de données...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <XCircle className="w-5 h-5 text-red-600 mr-2" />
          <span className="text-red-800">Erreur: {error}</span>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Database className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold">Analyse de la Base de Données</h2>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-1" />
          Actualiser
        </button>
      </div>

      {/* Table Status */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">État des Tables</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            {report.tableCheck.exists ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 mr-2" />
            )}
            <span>Table motifs_consultation: {report.tableCheck.exists ? 'Existe' : 'N\'existe pas'}</span>
          </div>
        </div>
      </div>

      {/* Motifs */}
      {report.comparison.motifs && report.comparison.motifs.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Motifs de Consultation ({report.comparison.motifs.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.comparison.motifs.map((motif, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <div className="font-medium text-gray-900">{motif.nom}</div>
                <div className="text-sm text-gray-600">{motif.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actes */}
      {report.comparison.actes && report.comparison.actes.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Types d'Actes ({report.comparison.actes.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {report.comparison.actes.map((acte, index) => (
              <div key={index} className="border border-gray-200 rounded p-3">
                <div className="font-medium text-gray-900">{acte.nom}</div>
                <div className="text-sm text-gray-600">Prix: {acte.prix_base}€</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparaison */}
      {report.comparison.comparison && report.comparison.comparison.length > 0 && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
            Similitudes Trouvées ({report.comparison.comparison.length})
          </h3>
          <div className="space-y-3">
            {report.comparison.comparison.map((item, index) => (
              <div key={index} className={`border rounded p-3 ${
                item.similarite === 'Identique' ? 'border-red-200 bg-red-50' :
                item.similarite === 'Similaire' ? 'border-yellow-200 bg-yellow-50' :
                'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.similarite === 'Identique' ? 'bg-red-600 text-white' :
                      item.similarite === 'Similaire' ? 'bg-yellow-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {item.similarite}
                    </span>
                    <span className="ml-2 font-medium">{item.motif_nom}</span>
                    <span className="mx-2">↔</span>
                    <span className="font-medium">{item.acte_nom}</span>
                  </div>
                  {item.acte_prix && (
                    <span className="text-sm text-gray-600">{item.acte_prix}€</span>
                  )}
                </div>
                {item.motif_description && (
                  <div className="text-sm text-gray-600 mt-1">{item.motif_description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {!report.comparison.comparison || report.comparison.comparison.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800">Aucune similitude trouvée entre motifs et actes</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseCheck;
