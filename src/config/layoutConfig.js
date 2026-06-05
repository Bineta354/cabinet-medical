/**
 * Configuration centralisée pour l'espacement et le layout responsive
 * Utilisé pour assurer la cohérence dans toute l'application
 */

export const SPACING = {
  // Padding global pour les pages
  pageX: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  },
  pageXClass: 'p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6',

  pageY: {
    xs: 'p-2',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  },
  pageYClass: 'p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6',

  // Gap pour les grilles et flexbox
  gapSmall: {
    xs: 'gap-1',
    sm: 'gap-1.5',
    md: 'gap-2',
    lg: 'gap-3',
  },
  gapSmallClass: 'gap-1 xs:gap-1.5 sm:gap-2 md:gap-3',

  gapNormal: {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-5',
  },
  gapNormalClass: 'gap-2 xs:gap-3 sm:gap-4 md:gap-5',

  gapLarge: {
    xs: 'gap-3',
    sm: 'gap-4',
    md: 'gap-5',
    lg: 'gap-6',
  },
  gapLargeClass: 'gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8',

  // Padding des cartes
  cardPadding: {
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-4',
    lg: 'p-5',
    xl: 'p-6',
  },
  cardPaddingClass: 'p-3 xs:p-4 sm:p-4 md:p-5 lg:p-6',

  // Padding des inputs et boutons
  inputPaddingX: {
    xs: 'px-2',
    sm: 'px-3',
    md: 'px-4',
    lg: 'px-4',
  },
  inputPaddingXClass: 'px-2 xs:px-3 sm:px-4 md:px-4',

  inputPaddingY: {
    xs: 'py-1.5',
    sm: 'py-2',
    md: 'py-2.5',
    lg: 'py-3',
  },
  inputPaddingYClass: 'py-1.5 xs:py-2 sm:py-2.5 md:py-3',
};

export const BREAKPOINTS = {
  xs: '360px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const TYPOGRAPHY = {
  // Tailles de fonts
  h1: 'text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl',
  h2: 'text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl',
  h3: 'text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl',
  h4: 'text-xs xs:text-sm sm:text-base md:text-lg',
  body: 'text-xs xs:text-sm sm:text-base md:text-base',
  small: 'text-xs',
  tiny: 'text-xs',
};

export const GRID = {
  // Grille statistiques - 1 col → 2 cols → 3 cols → 4 cols
  stats: 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  
  // Grille contenus - 1 col → 2 cols → 3 cols
  content: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  
  // Grille compact - 1 col → 2 cols
  compact: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3',
};

export const BORDER_RADIUS = {
  card: {
    xs: 'rounded-lg',
    sm: 'rounded-lg',
    md: 'rounded-2xl',
    lg: 'rounded-3xl',
  },
  cardClass: 'rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-2xl lg:rounded-3xl',
  
  button: {
    xs: 'rounded-lg',
    sm: 'rounded-lg',
    md: 'rounded-lg',
    lg: 'rounded-2xl',
  },
  buttonClass: 'rounded-lg xs:rounded-lg sm:rounded-lg md:rounded-lg',
  
  input: {
    xs: 'rounded-lg',
    sm: 'rounded-lg',
    md: 'rounded-lg',
  },
  inputClass: 'rounded-lg',
};

export const SIZING = {
  // Tailles d'icônes
  iconSmall: {
    xs: 'w-4 h-4',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  },
  iconSmallClass: 'w-4 h-4 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6',

  // Hauteur minimum des éléments interactifs (44px sur mobile)
  interactiveMin: 'h-11 xs:h-10 md:h-10',
  
  // Sidebar
  sidebarCollapsed: 'w-16',
  sidebarExpanded: 'w-64',
};

export const LAYOUT = {
  // Hauteur du header
  headerHeight: 'h-16 sm:h-16 md:h-16',
  
  // Max width des modales
  modalSmall: 'max-w-xs xs:max-w-xs sm:max-w-sm md:max-w-md',
  modalMedium: 'max-w-sm xs:max-w-md sm:max-w-lg md:max-w-2xl',
  modalLarge: 'max-w-md xs:max-w-lg sm:max-w-2xl md:max-w-4xl',
};

export const SHADOWS = {
  light: 'shadow-sm',
  medium: 'shadow-md',
  default: 'shadow-lg',
  heavy: 'shadow-xl',
  apple: 'shadow-apple',
  medical: 'shadow-medical',
};

// Classes CSS rapides pour export
export const CSS_CLASSES = {
  // Conteneurs de page
  pageContainer: `${SPACING.pageXClass} ${SPACING.pageYClass}`,
  
  // Cards
  cardBase: `${SPACING.cardPaddingClass} ${BORDER_RADIUS.cardClass} ${SHADOWS.default}`,
  
  // Grilles
  statsGrid: `${GRID.stats} ${SPACING.gapNormalClass}`,
  contentGrid: `${GRID.content} ${SPACING.gapNormalClass}`,
  
  // Typographie
  heading1: `${TYPOGRAPHY.h1} font-bold`,
  heading2: `${TYPOGRAPHY.h2} font-bold`,
  heading3: `${TYPOGRAPHY.h3} font-semibold`,
  bodyText: `${TYPOGRAPHY.body}`,
};

// Fonction utilitaire pour combiner les classes
export const combineClasses = (baseClass, responsiveModifiers = {}) => {
  const classes = [baseClass];
  
  if (responsiveModifiers.xs) classes.push(`xs:${responsiveModifiers.xs}`);
  if (responsiveModifiers.sm) classes.push(`sm:${responsiveModifiers.sm}`);
  if (responsiveModifiers.md) classes.push(`md:${responsiveModifiers.md}`);
  if (responsiveModifiers.lg) classes.push(`lg:${responsiveModifiers.lg}`);
  
  return classes.join(' ');
};

// Fonction pour créer des classes de grille
export const createGridClass = (columns = { xs: 1, sm: 2, md: 3, lg: 4 }) => {
  const classMap = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  };

  const classes = ['grid'];
  
  if (columns.xs) classes.push(classMap[columns.xs]);
  if (columns.sm) classes.push(`sm:${classMap[columns.sm]}`);
  if (columns.md) classes.push(`md:${classMap[columns.md]}`);
  if (columns.lg) classes.push(`lg:${classMap[columns.lg]}`);
  
  return classes.join(' ');
};

// Fonction pour créer des classes d'espacement
export const createSpacingClass = (padding = { xs: 2, sm: 3, md: 4, lg: 6 }, gap = null) => {
  const spacingMap = {
    1: 'p-1',
    2: 'p-2',
    3: 'p-3',
    4: 'p-4',
    5: 'p-5',
    6: 'p-6',
  };

  const gapMap = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
  };

  const classes = [spacingMap[padding.xs] || 'p-2'];
  
  if (padding.sm) classes.push(`sm:${spacingMap[padding.sm]}`);
  if (padding.md) classes.push(`md:${spacingMap[padding.md]}`);
  if (padding.lg) classes.push(`lg:${spacingMap[padding.lg]}`);
  
  if (gap) {
    classes.push(gapMap[gap.xs] || 'gap-2');
    if (gap.sm) classes.push(`sm:${gapMap[gap.sm]}`);
    if (gap.md) classes.push(`md:${gapMap[gap.md]}`);
    if (gap.lg) classes.push(`lg:${gapMap[gap.lg]}`);
  }
  
  return classes.join(' ');
};

export default {
  SPACING,
  BREAKPOINTS,
  TYPOGRAPHY,
  GRID,
  BORDER_RADIUS,
  SIZING,
  LAYOUT,
  SHADOWS,
  CSS_CLASSES,
  combineClasses,
  createGridClass,
  createSpacingClass,
};
