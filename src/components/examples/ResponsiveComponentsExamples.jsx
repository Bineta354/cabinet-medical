/**
 * Exemples de Composants Optimisés pour Responsivité
 * Utilisez ces exemples comme base pour créer vos propres composants
 */

import React from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { CSS_CLASSES, SPACING, GRID, TYPOGRAPHY } from '../config/layoutConfig';

/**
 * EXEMPLE 1: Carte de Statistique Responsive
 */
export const StatisticCard = ({ title, value, icon: Icon, trend, color = 'medical' }) => {
  return (
    <div className={`card-stats p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6 rounded-2xl md:rounded-3xl`}>
      <div className="flex items-start justify-between gap-2 xs:gap-3">
        <div className="flex-1">
          <p className="text-xs xs:text-xs sm:text-sm md:text-sm text-gray-500 font-medium">
            {title}
          </p>
          <h3 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 xs:mt-1.5 sm:mt-2">
            {value}
          </h3>
          {trend && (
            <p className={`text-xs xs:text-xs sm:text-xs mt-1 xs:mt-1.5 sm:mt-2 font-semibold ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 xs:p-2 sm:p-3 md:p-3 rounded-lg xs:rounded-lg sm:rounded-xl md:rounded-xl bg-${color}-100`}>
            <Icon className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-medical-primary" />
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * EXEMPLE 2: Formulaire Responsive
 */
export const ResponsiveForm = ({ fields, onSubmit, buttonLabel = 'Envoyer' }) => {
  const { isMobile } = useResponsive();

  return (
    <form onSubmit={onSubmit} className="space-y-3 xs:space-y-4 sm:space-y-4 md:space-y-6">
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col md:flex-row md:items-center gap-2 xs:gap-2 sm:gap-3 md:gap-4">
          <label className={`font-medium text-xs xs:text-xs sm:text-sm md:text-base ${
            isMobile ? 'block' : 'md:w-48 flex-shrink-0'
          }`}>
            {field.label}
          </label>
          <input
            type={field.type || 'text'}
            name={field.name}
            placeholder={field.placeholder}
            required={field.required}
            className="input px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2.5 md:px-4 md:py-3 text-xs xs:text-sm sm:text-sm md:text-base flex-1"
          />
        </div>
      ))}
      <button
        type="submit"
        className="btn btn-primary px-4 py-2 xs:px-4 xs:py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 w-full md:w-auto"
      >
        {buttonLabel}
      </button>
    </form>
  );
};

/**
 * EXEMPLE 3: Tableau Responsive
 */
export const ResponsiveTable = ({ columns, rows }) => {
  const { isMobile } = useResponsive();

  if (isMobile && rows.length > 0) {
    // Vue carte sur mobile
    return (
      <div className="space-y-2 xs:space-y-2 sm:space-y-3 md:space-y-4">
        {rows.map((row, idx) => (
          <div key={idx} className="card p-3 xs:p-3 sm:p-4 md:p-5">
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start mb-2 xs:mb-2 sm:mb-3 last:mb-0">
                <span className="text-xs xs:text-xs sm:text-sm font-semibold text-gray-600">{col.label}</span>
                <span className="text-xs xs:text-sm sm:text-sm md:text-base text-gray-900">{row[col.key]}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Vue tableau sur desktop
  return (
    <div className="overflow-x-auto rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-2xl">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left px-2 py-1.5 xs:px-2 xs:py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs xs:text-xs sm:text-sm md:text-sm font-semibold text-gray-700"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-2 py-1.5 xs:px-2 xs:py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-xs xs:text-xs sm:text-sm md:text-base text-gray-700"
                >
                  {row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * EXEMPLE 4: Grille de Cartes Responsive
 */
export const ResponsiveGrid = ({ items, renderItem, columns = { xs: 1, sm: 2, md: 3, lg: 4 } }) => {
  const getGridClass = () => {
    const classMap = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
    };

    const classes = ['grid', classMap[columns.xs]];
    if (columns.sm) classes.push(`sm:${classMap[columns.sm]}`);
    if (columns.md) classes.push(`md:${classMap[columns.md]}`);
    if (columns.lg) classes.push(`lg:${classMap[columns.lg]}`);

    return classes.join(' ');
  };

  return (
    <div className={`${getGridClass()} gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6`}>
      {items.map((item, idx) => (
        <div key={item.id || idx} className="card p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6">
          {renderItem(item)}
        </div>
      ))}
    </div>
  );
};

/**
 * EXEMPLE 5: Modal Responsive
 */
export const ResponsiveModal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 xs:p-3 sm:p-4 md:p-8 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg p-4 xs:p-5 sm:p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-3 xs:mb-4 sm:mb-5 md:mb-6">
          <h2 className="text-lg xs:text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="text-gray-700">
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * EXEMPLE 6: Navigation Responsive avec Collapse
 */
export const ResponsiveNavigation = ({ items, onSelect }) => {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = React.useState(!isMobile);

  return (
    <div className="bg-white rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-2xl shadow-md overflow-hidden">
      {/* En-tête avec bouton toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden w-full p-3 xs:p-3 sm:p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-semibold text-xs xs:text-sm sm:text-base">Menu</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>

      {/* Navigation */}
      <nav className={`${isOpen ? 'block' : 'hidden'} md:block`}>
        <ul className="divide-y divide-gray-100">
          {items.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onSelect(item)}
                className="w-full text-left px-3 py-2 xs:px-3 xs:py-2 sm:px-4 sm:py-3 md:px-5 md:py-3 hover:bg-blue-50 transition-colors text-xs xs:text-xs sm:text-sm md:text-sm font-medium text-gray-700 hover:text-medical-primary"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

/**
 * EXEMPLE 7: Page Complète Responsive
 */
export const ResponsiveDashboardPage = ({ title, stats, content }) => {
  const { isMobile, isTablet } = useResponsive();

  return (
    <div className={`${SPACING.pageXClass} ${SPACING.pageYClass} space-y-4 xs:space-y-5 sm:space-y-6 md:space-y-8`}>
      {/* En-tête */}
      <div>
        <h1 className={`${TYPOGRAPHY.h1} text-gray-900`}>
          {title}
        </h1>
      </div>

      {/* Grille de Statistiques */}
      <div className={`${GRID.stats} ${SPACING.gapNormalClass}`}>
        {stats.map((stat) => (
          <StatisticCard key={stat.id} {...stat} />
        ))}
      </div>

      {/* Contenu Principal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Section principale (2/3) */}
        <div className="md:col-span-2 card p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6">
          <h2 className={`${TYPOGRAPHY.h2} text-gray-900 mb-3 xs:mb-4 sm:mb-5`}>
            Détails
          </h2>
          {content.main}
        </div>

        {/* Sidebar (1/3) */}
        <div className="card p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6">
          <h3 className={`${TYPOGRAPHY.h3} text-gray-900 mb-3 xs:mb-3 sm:mb-4`}>
            Informations
          </h3>
          {content.sidebar}
        </div>
      </div>
    </div>
  );
};

export default {
  StatisticCard,
  ResponsiveForm,
  ResponsiveTable,
  ResponsiveGrid,
  ResponsiveModal,
  ResponsiveNavigation,
  ResponsiveDashboardPage,
};
